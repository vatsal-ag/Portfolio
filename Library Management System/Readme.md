# Multi-Role Library Management System (LMS)

A robust, console-based Library Management System implemented in **C**. This project supports three distinct user roles (Admin, Faculty, and Student), each with specific permissions. It utilizes CSV file handling to persist data for books, users, and transaction history.

## 🚀 Features

### **User Roles & Authentication**
* **Admin:** Full system control (Manage books, users, fines, and reports).
* **Faculty:** View books, self-service book issuance, and returns.
* **Student:** View books, check personal borrowing history, and make suggestions.
* **Secure Access:** Session-based login with password reset functionality.

### **Core Functionalities**
* **Book Management:** Add, edit, delete, and list books with full attribute tracking.
* **Search System:** Search by unique ID or use "Advanced Search" (Title/Author/Genre).
* **Borrowing Logic:** * Faculty: 30-day limit.
    * Students: 15-day limit.
    * Automatic Fine: ₹10/day for overdue items.
* **Reporting:** Generate custom text-based reports filtered by user and date.


## 📋 Login Credentials (Test Accounts)

You can use the following accounts to test the different role-based menus:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Faculty** | `Fac1234` | `1234` |
| **Student** | `student` | `stu123` |
| **Student (Alt)** | `Stu1234` | `1234` |


## 📁 File Structure

| File | Description |
| :--- | :--- |
| `library.csv` | Stores book details and current availability status. |
| `users.csv` | Stores user credentials, roles, and accumulated fines. |
| `history.csv` | Logs return transactions for report generation. |
| `recommendations.txt` | Stores book suggestions submitted by users. |


## 💻 Technical Highlights

* **Struct-Based Design:** Organized data using `struct Book` and `struct User`.
* **Input Validation:** Custom functions to prevent buffer overflows and CSV injection.
* **File Persistence:** Uses standard I/O to maintain a lightweight database without external dependencies.

