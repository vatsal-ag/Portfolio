import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Utensils, 
  Clock, 
  Bell, 
  CheckCircle2, 
  Volume2, 
  Phone, 
  AlertCircle, 
  Sparkles, 
  Pill,
  Sun,
  Coffee,
  Moon,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { audioAlarm } from '../services/audioAlarm';
import { MealRoutine, MedicationAlarm } from '../types';

interface CaretakerScheduleViewProps {
  seniorMode: boolean;
  onSimulateAlarm: (alarm: MedicationAlarm) => void;
}

export const CaretakerScheduleView: React.FC<CaretakerScheduleViewProps> = ({
  seniorMode,
  onSimulateAlarm
}) => {
  const [routine, setRoutine] = useState<MealRoutine | null>(null);
  const [alarms, setAlarms] = useState<MedicationAlarm[]>([]);
  const [isEditingMeals, setIsEditingMeals] = useState(false);
  const [mealForm, setMealForm] = useState<Partial<MealRoutine>>({});
  const [notificationGranted, setNotificationGranted] = useState(false);

  const loadData = async () => {
    try {
      const [r, a] = await Promise.all([api.getMealRoutine(), api.getAlarms()]);
      setRoutine(r);
      setMealForm(r);
      setAlarms(a);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    if ('Notification' in window) {
      setNotificationGranted(Notification.permission === 'granted');
    }
  }, []);

  const handleSaveRoutine = async () => {
    try {
      const updated = await api.updateMealRoutine(mealForm);
      setRoutine(updated);
      setIsEditingMeals(false);
      // Reload alarms to reflect updated meal hours
      loadData();
    } catch (e: any) {
      alert('Error updating meal habits: ' + e.message);
    }
  };

  const handleAlarmAction = async (alarmId: number, action: 'TAKEN' | 'SNOOZED' | 'MISSED' | 'PENDING') => {
    try {
      await api.setAlarmAction(alarmId, action);
      loadData();
    } catch (e: any) {
      alert('Error updating alarm: ' + e.message);
    }
  };

  const handleTestChime = () => {
    audioAlarm.playMedicationChime();
  };

  const handleEnableNotifications = async () => {
    const ok = await audioAlarm.requestNotificationPermission();
    setNotificationGranted(ok);
    if (ok) {
      audioAlarm.showNotification('RxVision Alarm Enabled', 'Senior medication audio and visual alarms are now active!', 'System');
    }
  };

  const takenCount = alarms.filter(a => a.status === 'TAKEN').length;
  const pendingCount = alarms.filter(a => a.status === 'PENDING').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" /> Elderly Caretaker Feature
            </span>
            <h1 className={`font-black tracking-tight font-['Outfit'] ${
              seniorMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}>
              Meal-Habit Medicine Routine &amp; Smart Alarms
            </h1>
            <p className="text-xs sm:text-sm text-amber-50 max-w-2xl">
              Designed for seniors living independently. The system learns your daily eating routine
              and automatically sets alarms timed around meals (e.g. 30 mins before breakfast for antacids, after meals for painkillers).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestChime}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-800 hover:bg-amber-50 text-xs sm:text-sm font-bold shadow transition-all"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              Test Audio Chime
            </button>

            {!notificationGranted && (
              <button
                onClick={handleEnableNotifications}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs sm:text-sm font-bold shadow transition-all"
              >
                <Bell className="w-4 h-4" />
                Allow Browser Alarms
              </button>
            )}
          </div>
        </div>

        {/* Adherence summary badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-xs text-amber-100 block">Today's Total Doses</span>
            <span className="text-xl sm:text-2xl font-black">{alarms.length} Pills</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-xs text-amber-100 block">Doses Taken</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300">{takenCount} Taken</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-xs text-amber-100 block">Pending Today</span>
            <span className="text-xl sm:text-2xl font-black text-amber-200">{pendingCount} Remaining</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-xs text-amber-100 block">Emergency Contact</span>
            <span className="text-sm sm:text-base font-bold truncate block">Sarah Vance (Daughter)</span>
          </div>
        </div>
      </div>

      {/* Daily Food Habits / Meal Timing Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Daily Eating Habits &amp; Meal Schedule
            </h2>
          </div>

          <button
            onClick={() => setIsEditingMeals(!isEditingMeals)}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            {isEditingMeals ? 'Cancel' : 'Change Meal Timings'}
          </button>
        </div>

        {routine && !isEditingMeals ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-center space-y-1">
              <Sun className="w-5 h-5 text-amber-500 mx-auto" />
              <span className="text-xs font-semibold text-slate-500 block">Wake Up</span>
              <span className="text-lg font-black text-slate-900">{routine.wake_time}</span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 text-center space-y-1">
              <Coffee className="w-5 h-5 text-orange-500 mx-auto" />
              <span className="text-xs font-semibold text-slate-500 block">Breakfast</span>
              <span className="text-lg font-black text-slate-900">{routine.breakfast_time}</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-center space-y-1">
              <Utensils className="w-5 h-5 text-teal-600 mx-auto" />
              <span className="text-xs font-semibold text-slate-500 block">Lunch</span>
              <span className="text-lg font-black text-slate-900">{routine.lunch_time}</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 text-center space-y-1">
              <Utensils className="w-5 h-5 text-indigo-600 mx-auto" />
              <span className="text-xs font-semibold text-slate-500 block">Dinner</span>
              <span className="text-lg font-black text-slate-900">{routine.dinner_time}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <Moon className="w-5 h-5 text-slate-600 mx-auto" />
              <span className="text-xs font-semibold text-slate-500 block">Bedtime</span>
              <span className="text-lg font-black text-slate-900">{routine.bedtime}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Update Grandpa's typical hours so medicine intervals automatically sync to his stomach:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Wake Time</label>
                <input
                  type="time"
                  value={mealForm.wake_time || ''}
                  onChange={(e) => setMealForm({ ...mealForm, wake_time: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Breakfast</label>
                <input
                  type="time"
                  value={mealForm.breakfast_time || ''}
                  onChange={(e) => setMealForm({ ...mealForm, breakfast_time: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Lunch</label>
                <input
                  type="time"
                  value={mealForm.lunch_time || ''}
                  onChange={(e) => setMealForm({ ...mealForm, lunch_time: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Dinner</label>
                <input
                  type="time"
                  value={mealForm.dinner_time || ''}
                  onChange={(e) => setMealForm({ ...mealForm, dinner_time: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Bedtime</label>
                <input
                  type="time"
                  value={mealForm.bedtime || ''}
                  onChange={(e) => setMealForm({ ...mealForm, bedtime: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingMeals(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoutine}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Save &amp; Recalculate Alarms
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TODAY'S ALARM TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Today's Scheduled Medication Alarms ({alarms.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Chronological Routine</span>
        </div>

        {alarms.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
            <Pill className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No alarms active</p>
            <p className="text-xs text-slate-400">Scan a prescription to populate your daily caretaker schedule!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alarms.map((alarm) => {
              const isTaken = alarm.status === 'TAKEN';
              return (
                <div
                  key={alarm.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isTaken 
                      ? 'border-emerald-200 bg-emerald-50/30 opacity-75' 
                      : 'border-slate-200 hover:border-teal-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time badge */}
                    <div className={`px-4 py-3 rounded-2xl text-center shrink-0 ${
                      isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white'
                    }`}>
                      <span className="text-xl sm:text-2xl font-black block font-mono">{alarm.scheduled_time}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alarm</span>
                    </div>

                    {/* Medicine details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-black text-slate-900 font-['Outfit'] ${
                          seniorMode ? 'text-xl' : 'text-base sm:text-lg'
                        }`}>
                          {alarm.medicine_name}
                        </h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {alarm.dosage}
                        </span>
                        {isTaken && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Taken
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-amber-800 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        {alarm.meal_context}
                      </p>

                      <p className="text-xs text-slate-500">
                        {alarm.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Actions for Elderly / Caregiver */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isTaken ? (
                      <>
                        <button
                          onClick={() => handleAlarmAction(alarm.id, 'TAKEN')}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Taken
                        </button>

                        <button
                          onClick={() => onSimulateAlarm(alarm)}
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                          title="Trigger Senior Alert Simulator"
                        >
                          <Bell className="w-3.5 h-3.5 text-amber-600" />
                          Test Alarm Modal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAlarmAction(alarm.id, 'PENDING')}
                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                      >
                        Undo Taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
