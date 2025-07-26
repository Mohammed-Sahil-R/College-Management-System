# 🎓 College Management System

A modern, role-based College Management System built using **HTML**, **CSS**, **JavaScript**, and **IndexedDB**. This system helps manage **students, teachers, HODs, and principals** with functionality to upload and download notes, upload and view results, and manage departments and academic schemes — all stored locally in the browser using IndexedDB (no server or backend required).

---

## 🚀 Features

### 👨‍🏫 Principal Dashboard
- Add/view/delete HODs
- Add departments
- Add schemes

### 🧑‍💼 HOD Dashboard
- Add/view/delete teachers
- Add/view/delete students

### 👩‍🏫 Teacher Dashboard
- Upload notes with:
  - Semester
  - Subject Name and Code
  - Module Number and Name
  - PDF file upload
- Upload results for students:
  - USN-based
  - Subject, Code, Test Type
  - Marks and Scheme
- View/delete uploaded notes and results

### 🎓 Student Dashboard
- Search and download notes by:
  - Semester
  - Subject Code (dropdown)
  - Module (dropdown)
- View results by:
  - USN
  - Test Type (filter by IA1, IA2, SEE)

---

## 🗂️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Database**: IndexedDB (Browser-based, no server)
- **File Handling**: Notes stored in base64 format
- **Storage**: Fully offline-capable (data saved in browser)

---

## 📁 Folder Structure

📦 college-management-system/
├── 📁 dashboard_pages/
│ ├── principal_dashboard.html
│ ├── hod_dashboard.html
│ ├── teacher_dashboard.html
│ └── student_dashboard.html
├── 📁 login_pages/
│ ├── principal_login.html
│ ├── hod_login.html
│ ├── teacher_login.html
│ └── student_login.html
├── 📁 static/
│ ├── style.css
│ └── script.js
├── index.html
└── README.md

---

## 📦 How to Use

1. Clone or download this repo
2. Open `index.html` in any browser
3. Use the portal:
   - Principal: `principal@college.com` / `admin123`
   - HODs, Teachers, Students: Add via dashboard

> ℹ️ All data is stored in the browser using IndexedDB. No backend required.

---

## 📷 Screenshots

><img width="1280" height="584" alt="image" src="https://github.com/user-attachments/assets/79f188b9-48b3-438b-9bea-48e6e42d5a73" />
<img width="1346" height="626" alt="image" src="https://github.com/user-attachments/assets/b3de9c79-4db3-4e3b-aaeb-abb7df6d3670" />
<img width="1341" height="613" alt="image" src="https://github.com/user-attachments/assets/6e08d267-1d12-469c-bb4d-ddd18df74ba2" />
<img width="1329" height="613" alt="image" src="https://github.com/user-attachments/assets/c2f27568-ded8-4da8-99f6-e3a2359c01f0" />
<img width="1321" height="637" alt="image" src="https://github.com/user-attachments/assets/c4a1be84-d8ae-48bb-abe7-2a275c1dffe6" />
<img width="1366" height="617" alt="image" src="https://github.com/user-attachments/assets/eaf2ad6b-fbfa-443d-b577-07c963338250" />





---

## 📜 License

This project is open-source and free to use for academic and personal projects.

---
