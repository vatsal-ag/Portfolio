#!/bin/bash

# FDMS: Fire Dept. Management System (Bidholi Unit)

ASSET_DATABASE="FDMS_Assets.csv"
STATION_DATABASE="FDMS_Stations.csv"
REPORT_LOG="FDMS_Daily_Report.txt"
INCIDENT_HISTORY="FDMS_Incidents.txt"
ATTENDANCE_LOG="FDMS_Attendance_Records.csv"
ADMIN_CODE="FIRE_ADMIN_011"

# Attendance Log
if [[ ! -f "$ATTENDANCE_LOG" ]]; then
    echo "ID,Action,Timestamp,Note" > "$ATTENDANCE_LOG"
fi

# Distance Calculation
function get_distance_sq 
{
    local x1=$1; local y1=$2; local x2=$3; local y2=$4
    local dx=$((x1 - x2)); local dy=$((y1 - y2))
    echo $((dx*dx + dy*dy))
}

# Time in Minutes
function to_mins {
    echo $((10#${1:0:2} * 60 + 10#${1:3:2}))
}

# Database Updating
function update_asset_status 
{
    local target_id=$1
    local new_status=$2
    
    if ! grep -q "^$target_id," "$ASSET_DATABASE"; then return 1; fi

    old_line=$(grep "^$target_id," "$ASSET_DATABASE")
    new_line=$(echo "$old_line" | awk -F, -v stat="$new_status" -v d="$(date +%Y-%m-%d)" 'BEGIN{OFS=","} {$4=stat; $6=d; print $0}')
    
    sed "s|$old_line|$new_line|" "$ASSET_DATABASE" > temp.csv && mv temp.csv "$ASSET_DATABASE"
    return 0
}

# Recall System
function recall_all_units 
{
    echo "--- SHIFT RESET / RECALL ---"
    read -p "Recall all units to base? (y/n): " conf
    if [[ "$conf" == "y" ]]; then
        sed 's/,Deployed,/,Available,/g' "$ASSET_DATABASE" > temp.csv && mv temp.csv "$ASSET_DATABASE"
        sed 's/,Unavailable,/,Available,/g' "$ASSET_DATABASE" > temp.csv && mv temp.csv "$ASSET_DATABASE"
        echo "System Reset. All units Available."
        echo "================ NEW SHIFT: $(date) ================" >> "$REPORT_LOG"
    fi
}

# Station Viewer
function view_stations 
{
    echo "--- STATION LOCATIONS ---"
    if [[ -f "$STATION_DATABASE" ]]; then
        cat "$STATION_DATABASE" | column -t -s ','
    else
        echo "Error: Station database missing."
    fi
}

# Cascade Dispatch
function dispatch_system 
{
    echo "--- MULTI-STATION DISPATCH CENTER ---"
    
    read -p "Incident X Coordinate: " inc_x
    read -p "Incident Y Coordinate: " inc_y
    read -p "Fire Rating (1-5): " rating
    read -p "Assign Incident ID (e.g. FIRE-101): " incident_id

    case_file="${incident_id}.txt"
    if [[ -f "$case_file" ]]; then echo "Updating existing case."; else
        {
            echo "=== INCIDENT REPORT: $incident_id ==="
            echo "Date: $(date)"
            echo "Location: $inc_x, $inc_y | Severity: $rating"
            echo "Status: ACTIVE"
            echo "---------------------------------------"
            echo "RESPONSE LOG (Station Groups):"
        } > "$case_file"
    fi

    case $rating in
        1) req_ff=3; amb=0 ;;
        2) req_ff=5; amb=0 ;;
        3) req_ff=8; amb=1 ;;
        4) req_ff=12; amb=2 ;;
        5) req_ff=20; amb=3 ;;
        *) echo "Invalid"; return ;;
    esac

    > temp_distances.txt
    while IFS=',' read -r sid sname sx sy; do
        if [[ "$sid" == "ID" ]]; then continue; fi
        dist=$(get_distance_sq $inc_x $inc_y $sx $sy)
        
        if [[ "$dist" -eq 0 ]]; then
            echo "🚨 CRITICAL: FIRE AT $sname! Station Offline."
            echo "CRITICAL: STATION $sname COMPROMISED (OFFLINE)" >> "$case_file"
            continue
        fi
        
        echo "$dist:$sid:$sname" >> temp_distances.txt
    done < "$STATION_DATABASE"
    sort -n -t: -k1 temp_distances.txt > sorted_stations.txt

    total_deployed=0
    STATION_RESERVE=7
    echo "" >> "$case_file"

    while IFS=':' read -r dist sid sname; do
        if [[ "$total_deployed" -ge "$req_ff" ]]; then break; fi

        eta=$(( (dist / 5) + 2 ))
        echo ">> Contacting: $sname (ETA: $eta mins)..."

        avail_ids=$(grep "Firefighter" "$ASSET_DATABASE" | grep "Available" | grep ",$sid," | awk -F, '{print $1}')
        avail_count=$(echo "$avail_ids" | grep -c -v "^$")
        
        if [[ "$avail_count" -gt "$STATION_RESERVE" ]]; then
            deployable=$((avail_count - STATION_RESERVE))
        else
            deployable=0
        fi

        needed=$((req_ff - total_deployed))

        if [[ "$deployable" -gt 0 ]]; then
            if [[ "$deployable" -ge "$needed" ]]; then take=$needed; else take=$deployable; fi
            
            echo "DEPLOYING: $take units from $sname."
            echo ">>> DEPLOYMENT FROM: $sname (ETA: $eta min)" >> "$case_file"
            ids_to_deploy=$(echo "$avail_ids" | head -n "$take")
            for id in $ids_to_deploy; do
                update_asset_status "$id" "Deployed"
                p_name=$(grep "^$id," "$ASSET_DATABASE" | awk -F, '{print $2}')
                echo "    - $id: $p_name" >> "$case_file"
            done
            total_deployed=$((total_deployed + take))
        else
            echo "HOLDING: Reserve limit."
        fi
    done < sorted_stations.txt

    if [[ "$total_deployed" -ge "$req_ff" ]]; then
        echo "SUCCESS: Total Force: $total_deployed."
        echo "RESULT: SUCCESSFUL DEPLOYMENT (Total: $total_deployed)" >> "$case_file"
        echo "[$(date)] DISPATCH $incident_id: Success." >> "$REPORT_LOG"
    else
        missing=$((req_ff - total_deployed))
        echo "CRITICAL: Missing $missing FF."
        echo "RESULT: FAILED - MISSING $missing PERSONNEL" >> "$case_file"
    fi
    echo "Roster saved to: $case_file"
    rm temp_distances.txt sorted_stations.txt
}

# Case Manager
function analyzer_module 
{
    echo "--- INCIDENT ANALYSIS ---"
    echo "1. New Investigation (Create Case)"
    echo "2. View Case File"
    echo "3. Update Case / Post-Incident Report"
    echo "4. Pattern Analyzer (Geo & Time)"
    echo "5. Manage Case Status (Reopen/Close)"
    read -p "Select: " opt

    if [[ "$opt" == "1" ]]; then
        read -p "Enter Case ID (e.g. FIRE-101): " cid
        cfile="${cid}.txt"
        if [[ ! -f "$cfile" ]]; then echo "Run Dispatch first."; return; fi

        echo "Items found:"
        read -p "> " raw_input
        
        ev=$(echo "$raw_input" | tr 'A-Z' 'a-z') 
        
        has_device=0
        has_accelerant=0
        
        if [[ "$ev" == *"timer"* || "$ev" == *"clock"* || "$ev" == *"wire"* || "$ev" == *"fuse"* ]]; then
            has_device=1
        fi
        
        if [[ "$ev" == *"gasoline"* || "$ev" == *"petrol"* || "$ev" == *"fuel"* || "$ev" == *"diesel"* ]]; then
            has_accelerant=1
        fi
        
        if [[ "$has_device" -eq 1 && "$has_accelerant" -eq 1 ]]; then
            verdict="CRITICAL - IED DETECTED (Device + Accelerant)"
        elif [[ "$has_accelerant" -eq 1 ]]; then
            verdict="HIGH RISK - CHEMICAL ACCELERANT FOUND"
        elif [[ "$has_device" -eq 1 ]]; then
            verdict="HIGH RISK - DETONATION DEVICE FOUND"
        else
            case "$ev" in
                *"gunpowder"*|*"explosive"*) verdict="HIGH RISK - EXPLOSIVES";;
                *"rags"*|*"paper"*) verdict="MEDIUM RISK - GATHERED KINDLING";;
                *"match"*|*"lighter"*) verdict="MEDIUM RISK - IGNITION SOURCE";;
                *) verdict="LOW RISK - ACCIDENTAL / UNKNOWN";;
            esac
        fi

        echo ""
        echo "---------------------------------------"
        echo "ANALYSIS RESULT: $verdict"
        echo "---------------------------------------"
        
        {
            echo ""
            echo "--- INVESTIGATION UPDATE ---"
            echo "Time: $(date)"
            echo "Evidence: $raw_input"
            echo "Analysis: $verdict"
            echo "Status: CLOSED (Auto-Resolved)"
        } >> "$cfile"
        
        # Auto-Close Case
        sed 's/Status: ACTIVE/Status: CLOSED/g' "$cfile" > temp.txt && mv temp.txt "$cfile"
        sed 's/Status: OPEN/Status: CLOSED/g' "$cfile" > temp.txt && mv temp.txt "$cfile"
        echo "Report Updated & Case Closed."

    elif [[ "$opt" == "2" ]]; then
        read -p "ID: " cid; if [[ -f "${cid}.txt" ]]; then cat "${cid}.txt"; fi

    elif [[ "$opt" == "3" ]]; then
        read -p "Enter Case ID: " cid
        cfile="${cid}.txt"
        if [[ -f "$cfile" ]]; then
            if grep -q "Status: CLOSED" "$cfile"; then
                echo "CASE CLOSED. Please Reopen (Option 5) to edit."
            else
                echo "--- UPDATE MENU ---"
                echo "1. Add New Evidence (Append)"
                echo "2. Edit Specific Evidence Line"
                echo "3. Delete Evidence/Note Line"
                echo "4. Add Note"
                echo "5. Log Extinguish Time"
                read -p "Select: " act
                
                if [[ "$act" == "1" ]]; then
                    read -p "Enter NEW Item: " new_item
                    echo "Evidence: $new_item" >> "$cfile"
                    echo "Added."
                elif [[ "$act" == "2" ]]; then
                    echo "--- CURRENT EVIDENCE ---"
                    grep -n "Evidence" "$cfile"
                    read -p "Line Number to Edit: " ln
                    read -p "Corrected Text: " correct_text
                    sed "${ln}s|.*|Evidence: $correct_text|" "$cfile" > temp.txt && mv temp.txt "$cfile"
                    echo "Updated."
                elif [[ "$act" == "3" ]]; then
                    cat -n "$cfile"
                    read -p "Line Number to DELETE: " ln
                    sed "${ln}d" "$cfile" > temp.txt && mv temp.txt "$cfile"
                    echo "Deleted."
                elif [[ "$act" == "4" ]]; then
                    read -p "Note: " n; echo "[NOTE]: $n" >> "$cfile"; echo "✅ Added."
                elif [[ "$act" == "5" ]]; then
                    read -p "Time taken: " dur; read -p "Outcome: " out
                    { echo "--- CONCLUSION ---"; echo "Duration: $dur"; echo "Outcome: $out"; echo "Logged At: $(date)"; } >> "$cfile"
                    echo "Report Logged."
                fi
            fi
        else
            echo "File not found."
        fi

    elif [[ "$opt" == "4" ]]; then
        if ! ls *.txt 1> /dev/null 2>&1; then
            echo "No case files found."
        else
            echo "[GEOSPATIAL] High-Frequency Locations:"
            grep -h "Location:" *.txt | cut -d: -f2 | cut -d'(' -f1 | sort | uniq -c | sort -rn
            
            echo ""
            echo "[TEMPORAL] Incident Time Distribution:"
            > time_data.tmp
            grep -h "Date:" *.txt | awk '{print $4}' | cut -d: -f1 >> time_data.tmp
            grep -h "^\[" *.txt | cut -d' ' -f2 | cut -d: -f1 >> time_data.tmp
            cat time_data.tmp | sort | uniq -c | sort -rn
            rm time_data.tmp
        fi

    elif [[ "$opt" == "5" ]]; then
        read -p "Enter Case ID: " cid
        cfile="${cid}.txt"
        if [[ -f "$cfile" ]]; then
            curr=$(grep "Status:" "$cfile" | tail -n 1)
            echo "Current $curr"
            echo "1. REOPEN Case | 2. CLOSE Case"
            read -p "Action: " stat_act
            if [[ "$stat_act" == "1" ]]; then
                sed 's/Status: CLOSED/Status: OPEN/g' "$cfile" > temp.txt && mv temp.txt "$cfile"
                echo "🔓 Reopened."
            elif [[ "$stat_act" == "2" ]]; then
                sed 's/Status: OPEN/Status: CLOSED/g' "$cfile" > temp.txt && mv temp.txt "$cfile"
                echo "🔒 Closed."
            fi
        else
            echo "File not found."
        fi
    fi
}

# Attendance
function attendance_module 
{
    echo "--- STAFF ATTENDANCE ---"
    read -p "ID: " p_id
    if ! grep -q "^$p_id," "$ASSET_DATABASE"; then echo "ID not found."; return; fi
    
    p_line=$(grep "^$p_id," "$ASSET_DATABASE")
    p_name=$(echo "$p_line" | awk -F, '{print $2}')
    S_START=$(echo "$p_line" | awk -F, '{print $11}')
    S_END=$(echo "$p_line" | awk -F, '{print $12}')

    echo "User: $p_name | Shift: $S_START - $S_END"
    echo "1. Punch IN | 2. Punch OUT | 3. [ADMIN] Manual Entry"
    read -p "Action: " act
    
    now_time=$(date "+%H:%M")
    timestamp="$(date "+%Y-%m-%d %H:%M")"

    if [[ "$act" == "1" ]]; then
        note="Full Day"
        if [[ $(to_mins $now_time) -gt $(($(to_mins $S_START) + 10)) ]]; then
            note="Half Day (Late Arrival)"
            echo "Late: Marked as Half Day."
        fi
        echo "$p_id,IN,$timestamp,$note" >> "$ATTENDANCE_LOG"
        update_asset_status "$p_id" "Available"
    elif [[ "$act" == "2" ]]; then
        note="Full Day"
        if [[ $(to_mins $now_time) -lt $(($(to_mins $S_END) - 10)) ]]; then
            note="Half Day (Early Departure)"
            echo "Early: Marked as Half Day."
        fi
        echo "$p_id,OUT,$timestamp,$note" >> "$ATTENDANCE_LOG"
        update_asset_status "$p_id" "Unavailable"
    elif [[ "$act" == "3" ]]; then
        read -s -p "Enter Security Code: " code
        if [[ "$code" == "$ADMIN_CODE" ]]; then
            echo ""
            read -p "Correct Date (YYYY-MM-DD): " m_d
            read -p "Correct Time (HH:MM): " m_t
            read -p "Type (IN/OUT): " m_ty
            echo "$p_id,$m_ty,$m_d $m_t,MANUAL_ENTRY" >> "$ATTENDANCE_LOG"
            echo "Manual Log Saved."
        else
            echo "Access Denied."
        fi
    fi
}

# Personnel File
function personnel_file
{
    echo "--- PERSONNEL PROFILE ---"
    read -p "Personnel ID: " p_id
    if ! grep -q "^$p_id," "$ASSET_DATABASE"; then echo "ID not found."; return; fi

    # Fetch columns from CSV
    p_line=$(grep "^$p_id," "$ASSET_DATABASE")
    id=$(echo "$p_line" | cut -d, -f1)
    name=$(echo "$p_line" | cut -d, -f2)
    rank=$(echo "$p_line" | cut -d, -f3)
    blood=$(echo "$p_line" | cut -d, -f7)
    emg=$(echo "$p_line" | cut -d, -f8)
    offs=$(echo "$p_line" | cut -d, -f9)
    att_p=$(echo "$p_line" | cut -d, -f10)
    s_start=$(echo "$p_line" | cut -d, -f11)
    s_end=$(echo "$p_line" | cut -d, -f12)

    # Calculate stats
    half_days=$(grep "$p_id" "$ATTENDANCE_LOG" | grep -c "Half Day")
    responses=$(grep -l "$p_id" *.txt 2>/dev/null | grep -v "Attendance" | wc -l)

    echo "========================================"
    echo "NAME: $name ($id) | RANK: $rank"
    echo "DUTY HOURS: $s_start to $s_end"
    echo "----------------------------------------"
    echo "Blood Group:  $blood"
    echo "Emergency:    $emg"
    echo "Days Off:     $offs"
    echo "Attendance:   $att_p%"
    echo "----------------------------------------"
    echo "Performance: $responses Fires Responded"
    echo "Infractions: $half_days Half-Day Flags"
    echo "----------------------------------------"
    echo "RECENT ACTIVITY (LOGS):"
    grep "^$p_id," "$ATTENDANCE_LOG" | tail -n 5
    echo "========================================"
    read -p "Press Enter to return..." dummy
}

# Summary
function view_summary 
{
    echo "STATION SUMMARY"
    printf "%-25s | %-10s | %-10s | %-10s\n" "Station Name" "Total" "Avail" "Deployed"
    echo "-----------------------------------------------------------------"
    while IFS=',' read -r sid sname sx sy; do
        if [[ "$sid" == "ID" ]]; then continue; fi
        tot=$(grep -c ",$sid," "$ASSET_DATABASE")
        avl=$(grep "Available" "$ASSET_DATABASE" | grep -c ",$sid,")
        dep=$(grep "Deployed" "$ASSET_DATABASE" | grep -c ",$sid,")
        printf "%-25s | %-10s | %-10s | %-10s\n" "$sname" "$tot" "$avl" "$dep"
    done < "$STATION_DATABASE"
}

# Main Menu
while true; do
    echo -e "\n=== FDMS COMMAND ==="
    PS3="Opt: "
    select opt in "Smart Dispatch (Starts Case)" "Case Investigator" "Attendance" "Personnel File Search" "View Station Locations" "View Summary" "Recall All" "Exit"; do
        case $opt in
            "Smart Dispatch (Starts Case)") dispatch_system; break ;;
            "Case Investigator") analyzer_module; break ;;
            "Attendance") attendance_module; break ;;
            "Personnel File Search") personnel_file; break ;;
            "View Station Locations") view_stations; break ;;
            "View Summary") view_summary; break ;;
            "Recall All") recall_all_units; break ;;
            "Exit") exit 0 ;;
        esac
    done
done