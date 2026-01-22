#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int getValidInt()
{
    int number;
    char term;
    while (1)
    {
        if (scanf("%d%c", &number, &term) != 2 || term != '\n')
        {
            while (getchar() != '\n')
                ;
            printf("Invalid input. Please enter a valid number: ");
        }
        else
        {
            return number;
        }
    }
}

void getValidString(char *buffer, int size)
{
    while (1)
    {
        fgets(buffer, size, stdin);
        buffer[strcspn(buffer, "\n")] = 0;
        if (strlen(buffer) == 0)
        {
            printf("Input cannot be empty. Try again: ");
            continue;
        }
        if (strchr(buffer, ',') != NULL)
        {
            printf("Error: Commas ',' are not allowed. Try again: ");
        }
        else
        {
            break;
        }
    }
}

struct Book
{
    int id;
    char title[100];
    char author[100];
    char genre[50];
    int edition;
    int isIssued;
    char issuedTo[50];
    int borrowerRole;
    char issueDate[20];
};

struct User
{
    char username[50];
    char password[50];
    int role; // 1 = Admin, 2 = Faculty, 3 = Student
    int fineDue;
};

struct Book library[100];
struct User users[100];
int bookCount = 0;
int userCount = 0;

void saveBooks()
{
    FILE *fp = fopen("library.csv", "w");
    if (fp == NULL)
        return;

    for (int i = 0; i < bookCount; i++)
    {
        fprintf(fp, "%d,%s,%s,%s,%d,%d,%s,%d,%s\n",
                library[i].id, library[i].title, library[i].author, library[i].genre,
                library[i].edition, library[i].isIssued, library[i].issuedTo,
                library[i].borrowerRole, library[i].issueDate);
    }
    fclose(fp);
}

void loadBooks()
{
    FILE *fp = fopen("library.csv", "r");
    if (fp == NULL)
        return;
    bookCount = 0;
    while (fscanf(fp, "%d,%[^,],%[^,],%[^,],%d,%d,%[^,],%d,%[^\n]\n",
                  &library[bookCount].id, library[bookCount].title, library[bookCount].author,
                  library[bookCount].genre, &library[bookCount].edition, &library[bookCount].isIssued,
                  library[bookCount].issuedTo, &library[bookCount].borrowerRole, library[bookCount].issueDate) != EOF)
    {
        bookCount++;
    }
    fclose(fp);
}

void saveUsers()
{
    FILE *fp = fopen("users.csv", "w");
    if (fp == NULL)
        return;
    for (int i = 0; i < userCount; i++)
    {
        fprintf(fp, "%s,%s,%d,%d\n", users[i].username, users[i].password, users[i].role, users[i].fineDue);
    }
    fclose(fp);
}

void loadUsers()
{
    FILE *fp = fopen("users.csv", "r");
    if (fp == NULL)
    {
        printf("No user database found. Creating default 'admin' account...\n");
        strcpy(users[0].username, "admin");
        strcpy(users[0].password, "admin123");
        users[0].role = 1;
        users[0].fineDue = 0;
        userCount = 1;
        saveUsers();
        return;
    }
    userCount = 0;
    while (fscanf(fp, "%[^,],%[^,],%d,%d\n",
                  users[userCount].username, users[userCount].password,
                  &users[userCount].role, &users[userCount].fineDue) != EOF)
    {
        userCount++;
    }
    fclose(fp);
}

void logHistory(char *username, char *bookTitle, char *issueDate, int daysKept, int fine)
{
    FILE *fp = fopen("history.csv", "a");
    if (fp == NULL)
        return;
    fprintf(fp, "%s,%s,%s,%d,%d\n", username, bookTitle, issueDate, daysKept, fine);
    fclose(fp);
}

void addSuggestion(char *username)
{
    char title[100];
    char author[100];
    printf("\n--- Suggestion Box ---\n");
    printf("Title of book to suggest: ");
    getValidString(title, 100);
    printf("Author: ");
    getValidString(author, 100);
    FILE *fp = fopen("recommendations.txt", "a");
    if (fp == NULL)
    {
        printf("Error opening recommendation file.\n");
        return;
    }
    fprintf(fp, "User: %s | Suggests: %s by %s\n", username, title, author);
    fclose(fp);
    printf("Thank you! Your suggestion has been recorded.\n");
}

int login(int targetRole, char *sessionUser)
{
    char inputUser[50];
    char inputPass[50];

    printf("\n--- %s Login ---\n", (targetRole == 1) ? "Admin" : (targetRole == 2) ? "Faculty"
                                                                                   : "Student");
    if (targetRole == 3)
        printf("Enter Student ID: ");
    else if (targetRole == 2)
        printf("Enter Faculty ID: ");
    else
        printf("Enter Admin ID: ");

    scanf("%s", inputUser);
    printf("Enter Password: ");
    scanf("%s", inputPass);

    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, inputUser) == 0 &&
            strcmp(users[i].password, inputPass) == 0)
        {
            if (users[i].role == targetRole)
            {
                strcpy(sessionUser, users[i].username);
                return 1; // Success
            }
            else
            {
                printf("\nError: Access Denied. You are not registered as a %s.\n",
                       (targetRole == 1) ? "Admin" : (targetRole == 2) ? "Faculty"
                                                                       : "Student");
                return 0; // Fail
            }
        }
    }
    printf("\nInvalid ID or Password! Please try again.\n");
    return 0;
}

void resetPasswordMenu()
{
    char username[50];
    char oldPass[50];
    char newPass[50];

    printf("\n--- Password Reset ---\n");
    printf("Enter Your ID/Username: ");
    scanf("%s", username);
    printf("Enter Old Password: ");
    scanf("%s", oldPass);

    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, username) == 0 &&
            strcmp(users[i].password, oldPass) == 0)
        {

            printf("Enter New Password: ");
            scanf("%s", newPass);
            strcpy(users[i].password, newPass);
            saveUsers();
            printf("Password Reset Successful! Please login with new password.\n");
            return;
        }
    }
    printf("Error: Invalid Username or Old Password.\n");
}

void listBooks(int role)
{
    if (bookCount == 0)
    {
        printf("\nLibrary is empty.\n");
        return;
    }
    printf("\n--- Library Books ---\n");
    printf("%-5s %-25s %-20s %-15s %-8s %-15s\n", "ID", "Title", "Author", "Genre", "Ed.", "Status");
    printf("---------------------------------------------------------------------------------------------------\n");
    for (int i = 0; i < bookCount; i++)
    {
        char status[50];
        if (library[i].isIssued == 1)
        {
            if (role == 1)
                sprintf(status, "Issued: %s", library[i].issuedTo);
            else
                strcpy(status, "Issued");
        }
        else
        {
            strcpy(status, "Available");
        }
        printf("%-5d %-25s %-20s %-15s %-8d %-15s\n",
               library[i].id, library[i].title, library[i].author, library[i].genre, library[i].edition, status);
    }
}

void searchBook(int role, char *username)
{
    int searchId, found = 0;
    printf("\nEnter ID to search: ");
    searchId = getValidInt();

    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == searchId)
        {
            printf("\n--- Book Details ---\n");
            printf("ID:      %d\n", library[i].id);
            printf("Title:   %s\n", library[i].title);
            printf("Author:  %s\n", library[i].author);
            printf("Genre:   %s\n", library[i].genre);
            printf("Edition: %d\n", library[i].edition);

            if (library[i].isIssued)
            {
                if (role == 1)
                    printf("Status:  Issued to %s\n", library[i].issuedTo);
                else
                    printf("Status:  Issued\n");
            }
            else
            {
                printf("Status:  Available\n");
            }
            found = 1;
            break;
        }
    }
    if (!found)
    {
        char choice;
        printf("Book not found.\n");
        printf("Would you like to add a suggestion for this book? (y/n): ");
        scanf(" %c", &choice);
        while (getchar() != '\n')
            ;
        if (choice == 'y' || choice == 'Y')
        {
            addSuggestion(username);
        }
    }
}

void searchAdvanced(int role, char *username)
{
    char keyword[50];
    int found = 0;
    while (getchar() != '\n')
        ;

    printf("\n--- Advanced Search ---\n");
    printf("Enter Keyword (Title, Author, or Genre): ");
    getValidString(keyword, 50);

    printf("\n%-5s %-25s %-20s %-15s %-15s\n", "ID", "Title", "Author", "Genre", "Status");
    printf("--------------------------------------------------------------------------------\n");

    for (int i = 0; i < bookCount; i++)
    {
        if (strstr(library[i].title, keyword) != NULL ||
            strstr(library[i].author, keyword) != NULL ||
            strstr(library[i].genre, keyword) != NULL)
        {

            char status[50];
            if (library[i].isIssued == 1)
            {
                if (role == 1)
                    sprintf(status, "Issued: %s", library[i].issuedTo);
                else
                    strcpy(status, "Issued");
            }
            else
            {
                strcpy(status, "Available");
            }
            printf("%-5d %-25s %-20s %-15s %-15s\n",
                   library[i].id, library[i].title, library[i].author, library[i].genre, status);
            found = 1;
        }
    }
    printf("--------------------------------------------------------------------------------\n");
    if (!found)
    {
        char choice;
        printf("No matching books found.\n");
        printf("Would you like to add a suggestion for this book? (y/n): ");
        scanf(" %c", &choice);
        while (getchar() != '\n')
            ;
        if (choice == 'y' || choice == 'Y')
        {
            addSuggestion(username);
        }
    }
}

void checkMyBooks(char *username)
{
    int found = 0;
    int myFine = 0;
    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, username) == 0)
        {
            myFine = users[i].fineDue;
            break;
        }
    }
    printf("\n--- My Borrowed Books ---\n");
    printf("Current Account Fine Due: $%d\n", myFine);
    printf("------------------------------------------------------------\n");
    printf("%-30s %-15s %-15s\n", "Book Title", "Issue Date", "Return By");
    printf("------------------------------------------------------------\n");
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].isIssued == 1 && strcmp(library[i].issuedTo, username) == 0)
        {
            int limit = (library[i].borrowerRole == 2) ? 30 : 15;
            printf("%-30s %-15s %d Days\n", library[i].title, library[i].issueDate, limit);
            found = 1;
        }
    }
    if (!found)
        printf("You currently have no books borrowed.\n");
    printf("------------------------------------------------------------\n");
}

void countAvailableBooks()
{
    int available = 0;
    int issued = 0;
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].isIssued == 0)
            available++;
        else
            issued++;
    }
    printf("\n--- Library Statistics ---\n");
    printf("Total Books: %d\n", bookCount);
    printf("Available Copies: %d\n", available);
    printf("Issued Copies: %d\n", issued);
}

void changePassword(char *username)
{
    char newPass[50], confirmPass[50];
    printf("\n--- Change Password ---\n");
    printf("Enter New Password: ");
    scanf("%s", newPass);
    printf("Confirm New Password: ");
    scanf("%s", confirmPass);

    if (strcmp(newPass, confirmPass) == 0)
    {
        for (int i = 0; i < userCount; i++)
        {
            if (strcmp(users[i].username, username) == 0)
            {
                strcpy(users[i].password, newPass);
                printf("Password updated successfully!\n");
                saveUsers();
                return;
            }
        }
    }
    else
    {
        printf("Error: Passwords do not match!\n");
    }
}

void displayRules()
{
    printf("\n============================================\n");
    printf("           LIBRARY RULES & POLICIES         \n");
    printf("============================================\n");
    printf("1. Borrowing Limits:\n   - Students: 15 Days\n   - Faculty:  30 Days\n\n");
    printf("2. Fines:\n   - $10 per day late fine.\n\n");
    printf("Press Enter to go back...");
    while (getchar() != '\n')
        ;
    getchar();
}
// ... Admin Functions ...
void addBook()
{
    if (bookCount >= 100)
    {
        printf("\nLibrary is full!\n");
        return;
    }
    while (getchar() != '\n')
        ;
    printf("\n--- Add New Book ---\n");
    printf("Enter Book ID: ");
    if (scanf("%d", &library[bookCount].id) != 1)
    {
        printf("Invalid input. Cancelling.\n");
        while (getchar() != '\n')
            ;
        return;
    }
    while (getchar() != '\n')
        ;
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == library[bookCount].id)
        {
            printf("Error: Book ID already exists!\n");
            return;
        }
    }
    printf("Enter Book Title: ");
    getValidString(library[bookCount].title, 100);
    printf("Enter Author Name: ");
    getValidString(library[bookCount].author, 100);
    printf("Enter Genre/Subject: ");
    getValidString(library[bookCount].genre, 50);
    printf("Enter Edition (Number): ");
    library[bookCount].edition = getValidInt();

    library[bookCount].isIssued = 0;
    strcpy(library[bookCount].issuedTo, "None");
    strcpy(library[bookCount].issueDate, "None");
    library[bookCount].borrowerRole = 0;
    bookCount++;
    printf("Book added successfully!\n");
    saveBooks();
}

void deleteBook()
{
    int id, found = 0;
    printf("\n--- Delete Book ---\n");
    printf("Enter Book ID to delete: ");
    id = getValidInt();
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == id)
        {
            for (int j = i; j < bookCount - 1; j++)
                library[j] = library[j + 1];
            bookCount--;
            found = 1;
            printf("Book deleted successfully.\n");
            saveBooks();
            break;
        }
    }
    if (!found)
        printf("Book ID not found.\n");
}

void editBook()
{
    int id, found = 0, choice;
    printf("\n--- Edit Book Details ---\n");
    printf("Enter Book ID to edit: ");
    id = getValidInt();
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == id)
        {
            found = 1;
            printf("Current: %s by %s\n", library[i].title, library[i].author);
            printf("Change: 1.Title 2.Author 3.Genre 4.Edition\nChoice: ");
            choice = getValidInt();
            while (getchar() != '\n')
                ;
            if (choice == 1)
            {
                printf("New Title: ");
                getValidString(library[i].title, 100);
            }
            else if (choice == 2)
            {
                printf("New Author: ");
                getValidString(library[i].author, 100);
            }
            else if (choice == 3)
            {
                printf("New Genre: ");
                getValidString(library[i].genre, 50);
            }
            else if (choice == 4)
            {
                printf("New Edition: ");
                library[i].edition = getValidInt();
            }
            saveBooks();
            printf("Updated successfully!\n");
            break;
        }
    }
    if (!found)
        printf("Book ID not found.\n");
}

void addUser()
{
    if (userCount >= 100)
    {
        printf("User database full.\n");
        return;
    }
    printf("\n--- Add New User ---\n");
    printf("Enter New Username: ");
    scanf("%s", users[userCount].username);
    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, users[userCount].username) == 0)
        {
            printf("Error: Username exists!\n");
            return;
        }
    }
    printf("Enter New Password: ");
    scanf("%s", users[userCount].password);
    printf("Role: 1.Admin 2.Faculty 3.Student\nChoice: ");
    users[userCount].role = getValidInt();
    users[userCount].fineDue = 0;
    userCount++;
    printf("User registered!\n");
    saveUsers();
}

void removeUser(char *currentUser)
{
    char targetUser[50];
    int found = 0;
    printf("\n--- Remove User ---\n");
    printf("Enter Username: ");
    scanf("%s", targetUser);
    if (strcmp(targetUser, currentUser) == 0)
    {
        printf("Cannot delete yourself!\n");
        return;
    }
    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, targetUser) == 0)
        {
            for (int j = i; j < userCount - 1; j++)
                users[j] = users[j + 1];
            userCount--;
            found = 1;
            printf("User removed.\n");
            saveUsers();
            break;
        }
    }
    if (!found)
        printf("User not found.\n");
}

void issueBook()
{
    int id, found = 0, borrowerType;
    printf("\n--- Issue Book ---\n");
    printf("Enter Book ID: ");
    id = getValidInt();
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == id)
        {
            found = 1;
            if (library[i].isIssued == 1)
                printf("Error: Already issued to %s.\n", library[i].issuedTo);
            else
            {
                printf("Enter Borrower Username: ");
                scanf("%s", library[i].issuedTo);
                printf("Borrower Type: 1.Faculty 2.Student\nChoice: ");
                borrowerType = getValidInt();
                if (borrowerType == 1)
                    library[i].borrowerRole = 2;
                else
                    library[i].borrowerRole = 3;
                printf("Enter Issue Date (DD-MM-YYYY): ");
                scanf("%s", library[i].issueDate);
                library[i].isIssued = 1;
                printf("Book issued!\n");
                saveBooks();
            }
            break;
        }
    }
    if (!found)
        printf("Book ID not found.\n");
}

void returnBook(int currentUserRole)
{
    int id, found = 0, daysKept, fine = 0;
    char waiveChoice;
    printf("\n--- Return Book ---\n");
    printf("Enter Book ID: ");
    id = getValidInt();
    for (int i = 0; i < bookCount; i++)
    {
        if (library[i].id == id)
        {
            found = 1;
            if (library[i].isIssued == 0)
            {
                printf("Error: Book not issued.\n");
                return;
            }

            printf("Days kept: ");
            daysKept = getValidInt();
            int allowedDays = (library[i].borrowerRole == 2) ? 30 : 15;
            if (daysKept > allowedDays)
            {
                fine = (daysKept - allowedDays) * 10;
                printf("\n--- OVERDUE! Fine: $%d ---\n", fine);
                if (currentUserRole == 1)
                {
                    printf("[ADMIN] Waive fine? (y/n): ");
                    scanf(" %c", &waiveChoice);
                    if (waiveChoice == 'y' || waiveChoice == 'Y')
                    {
                        fine = 0;
                        printf("Waived.\n");
                    }
                    else
                    {
                        printf("Added to debt.\n");
                        for (int u = 0; u < userCount; u++)
                        {
                            if (strcmp(users[u].username, library[i].issuedTo) == 0)
                            {
                                users[u].fineDue += fine;
                                saveUsers();
                                break;
                            }
                        }
                    }
                }
                else
                {
                    printf("Fine added to account. Contact Admin to pay.\n");
                    for (int u = 0; u < userCount; u++)
                    {
                        if (strcmp(users[u].username, library[i].issuedTo) == 0)
                        {
                            users[u].fineDue += fine;
                            saveUsers();
                            break;
                        }
                    }
                }
            }
            else
                printf("Returned on time.\n");
            logHistory(library[i].issuedTo, library[i].title, library[i].issueDate, daysKept, fine);
            library[i].isIssued = 0;
            strcpy(library[i].issuedTo, "None");
            library[i].borrowerRole = 0;
            saveBooks();
            printf("Book returned.\n");
            break;
        }
    }
    if (!found)
        printf("Book ID not found.\n");
}

void manageFines()
{
    char targetUser[50];
    int found = 0, choice;
    printf("\n--- Manage Fines ---\n");
    printf("Enter Username: ");
    scanf("%s", targetUser);
    for (int i = 0; i < userCount; i++)
    {
        if (strcmp(users[i].username, targetUser) == 0)
        {
            found = 1;
            printf("Fine Due: $%d\n", users[i].fineDue);
            if (users[i].fineDue > 0)
            {
                printf("1.Paid 2.Unresolved 3.Waive\nChoice: ");
                choice = getValidInt();
                if (choice == 1 || choice == 3)
                {
                    users[i].fineDue = 0;
                    saveUsers();
                    printf("Fine cleared.\n");
                }
                else
                    printf("Fine remains.\n");
            }
            else
                printf("No fines.\n");
            break;
        }
    }
    if (!found)
        printf("User not found.\n");
}

void generateReport()
{
    int reportType, count = 0;
    char targetUser[50], filter[20], filename[100];
    char h_user[50], h_book[100], h_date[20];
    int h_days, h_fine;
    printf("\n--- Generate Report ---\n");
    printf("Enter Username: ");
    scanf("%s", targetUser);
    printf("1.Yearly 2.Monthly 3.Custom\nChoice: ");
    reportType = getValidInt();
    printf("Filter (e.g. 2023): ");
    scanf("%s", filter);
    sprintf(filename, "Report_%s_%s.txt", targetUser, filter);
    FILE *reportFile = fopen(filename, "w");
    FILE *historyFile = fopen("history.csv", "r");

    if (historyFile == NULL)
    {
        printf("No history found.\n");
        if (reportFile)
            fclose(reportFile);
        return;
    }

    fprintf(reportFile, "REPORT FOR: %s\nFILTER: %s\n", targetUser, filter);
    fprintf(reportFile, "------------------------------------------------------------\n");
    fprintf(reportFile, "%-30s %-15s %-10s %-10s\n", "Book", "Date", "Days", "Fine");
    fprintf(reportFile, "------------------------------------------------------------\n");

    while (fscanf(historyFile, "%[^,],%[^,],%[^,],%d,%d\n", h_user, h_book, h_date, &h_days, &h_fine) != EOF)
    {
        if (strcmp(h_user, targetUser) == 0 && strstr(h_date, filter) != NULL)
        {
            fprintf(reportFile, "%-30s %-15s %-10d $%d\n", h_book, h_date, h_days, h_fine);
            count++;
        }
    }
    fprintf(reportFile, "Total Records: %d\n", count);
    fclose(historyFile);
    fclose(reportFile);
    printf("Report saved to %s\n", filename);
}

int main()
{
    int choice, role, loginChoice, isLoggedIn = 0;
    char sessionUser[50];

    loadBooks();
    loadUsers();

    while (1)
    {
        // --- 1. INITIAL LOGIN MENU ---
        if (!isLoggedIn)
        {
            printf("\n==================================\n");
            printf("        LMS LOGIN MENU            \n");
            printf("==================================\n");
            printf("1. Student\n");
            printf("2. Faculty\n");
            printf("3. Admin\n");
            printf("4. Password Reset\n");
            printf("0. Exit Application\n");
            printf("==================================\n");
            printf("Enter Selection: ");
            loginChoice = getValidInt();

            if (loginChoice == 0)
            {
                printf("Exiting... Goodbye!\n");
                exit(0);
            }
            else if (loginChoice == 4)
            {
                resetPasswordMenu();
                continue;
            }
            else if (loginChoice >= 1 && loginChoice <= 3)
            {
                // Determine required role (1=Admin, 2=Faculty, 3=Student)
                // Mapping Menu 1->3(Student), 2->2(Faculty), 3->1(Admin)
                int targetRole = 0;
                if (loginChoice == 1)
                    targetRole = 3;
                else if (loginChoice == 2)
                    targetRole = 2;
                else if (loginChoice == 3)
                    targetRole = 1;

                if (login(targetRole, sessionUser))
                {
                    isLoggedIn = 1;
                    role = targetRole;
                    printf("\nLogin Successful! Welcome, %s.\n", sessionUser);
                }
                else
                {
                    // Login failed, loop back to menu
                    continue;
                }
            }
            else
            {
                printf("Invalid selection.\n");
                continue;
            }
        }

        // --- 2. MAIN LIBRARY SESSION LOOP ---
        if (isLoggedIn)
        {
            printf("\n============================\n");
            printf(" LIBRARY MENU ");
            if (role == 1)
                printf("(ADMIN)");
            else if (role == 2)
                printf("(FACULTY)");
            else
                printf("(STUDENT)");
            printf("\n============================\n");

            // Options visible to everyone
            printf("1. List All Books\n");
            printf("2. Search Book (By ID)\n");
            printf("3. Advanced Search (Title/Author/Genre)\n");
            printf("4. Check My Borrowed Books\n");
            printf("5. Suggestion Box\n");
            printf("6. Change Password\n");
            printf("7. Check Available Copies\n");
            printf("8. View Library Rules\n");

            // Admin Only Options
            if (role == 1)
            {
                printf("9. Add Book\n");
                printf("10. Edit Book Details\n");
                printf("11. Delete Book\n");
                printf("12. Issue Book\n");
                printf("13. Return Book\n");
                printf("14. Add User\n");
                printf("15. Remove User\n");
                printf("16. Generate Report\n");
                printf("17. Manage Fines\n");
            }
            // Faculty Only Options
            else if (role == 2)
            {
                printf("9. Issue Book (Self-Service)\n");
                printf("10. Return Book\n");
            }

            printf("0. Logout\n");
            printf("Enter your choice: ");
            choice = getValidInt();

            switch (choice)
            {
            // Common Functions
            case 1:
                listBooks(role);
                break;
            case 2:
                searchBook(role, sessionUser);
                break;
            case 3:
                searchAdvanced(role, sessionUser);
                break;
            case 4:
                checkMyBooks(sessionUser);
                break;
            case 5:
                while (getchar() != '\n')
                    ;
                addSuggestion(sessionUser);
                break;
            case 6:
                changePassword(sessionUser);
                break;
            case 7:
                countAvailableBooks();
                break;
            case 8:
                displayRules();
                break;

            // Role Specific Functions
            case 9:
                if (role == 1)
                    addBook();
                else if (role == 2)
                    issueBook();
                else
                    printf("Access Denied.\n");
                break;
            case 10:
                if (role == 1)
                    editBook();
                else if (role == 2)
                    returnBook(role);
                else
                    printf("Access Denied.\n");
                break;
            case 11:
                if (role == 1)
                    deleteBook();
                else
                    printf("Access Denied.\n");
                break;
            case 12:
                if (role == 1)
                    issueBook();
                else
                    printf("Access Denied.\n");
                break;
            case 13:
                if (role == 1)
                    returnBook(role);
                else
                    printf("Access Denied.\n");
                break;
            case 14:
                if (role == 1)
                    addUser();
                else
                    printf("Access Denied.\n");
                break;
            case 15:
                if (role == 1)
                    removeUser(sessionUser);
                else
                    printf("Access Denied.\n");
                break;
            case 16:
                if (role == 1)
                    generateReport();
                else
                    printf("Access Denied.\n");
                break;
            case 17:
                if (role == 1)
                    manageFines();
                else
                    printf("Access Denied.\n");
                break;
            case 0:
                printf("Logging out...\n");
                isLoggedIn = 0; // Go back to login menu
                break;
            default:
                printf("Invalid choice!\n");
            }
        }
    }
    return 0;
}