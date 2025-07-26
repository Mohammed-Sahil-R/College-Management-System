let db;
const request = indexedDB.open('StudentPortalDB', 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  db.createObjectStore('departments', { keyPath: 'name' });
  db.createObjectStore('hods', { keyPath: 'email' });
  db.createObjectStore('teachers', { keyPath: 'email' });
  db.createObjectStore('students', { keyPath: 'usn' });
  db.createObjectStore('schemes', { keyPath: 'name' });
  db.createObjectStore('notes', { autoIncrement: true });
  db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
  db.createObjectStore('principal', { keyPath: 'email' });
};

request.onsuccess = (e) => {
  db = e.target.result;
  const tx = db.transaction('principal', 'readwrite');
  const store = tx.objectStore('principal');
  const getReq = store.get('principal@college.com');
  getReq.onsuccess = () => {
    if (!getReq.result) {
      store.put({ email: 'principal@college.com', password: 'admin123' });
    }
  };
};

request.onerror = () => alert('❌ Failed to open database');

function navigateTo(role) {
  const map = {
    principal: 'login_pages/principal_login.html',
    hod: 'login_pages/hod_login.html',
    teacher: 'login_pages/teacher_login.html',
    student: 'login_pages/student_login.html'
  };
  window.location.href = map[role] || alert('Invalid role');
}

function loginPrincipal() {
  const email = document.getElementById('principalEmail').value;
  const password = document.getElementById('principalPassword').value;
  const tx = db.transaction('principal', 'readonly');
  const store = tx.objectStore('principal');
  const req = store.get(email);
  req.onsuccess = () => {
    const data = req.result;
    if (data && data.password === password) {
      window.location.href = '../dashboard_pages/principal_dashboard.html';
    } else {
      alert('❌ Invalid Principal credentials');
    }
  };
}

function showReset() {
  document.getElementById('principalEmail').value = '';
  document.getElementById('principalPassword').value = '';
  document.getElementById('principalLoginSection').style.display = 'none';
  document.getElementById('resetSection').style.display = 'block';
}

function hideReset() {
  document.getElementById('resetEmail').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('secretPin').value = '';
  document.getElementById('resetSection').style.display = 'none';
  document.getElementById('principalLoginSection').style.display = 'block';
}

function resetPrincipalPassword() {
  const pin = document.getElementById('secretPin').value.trim();
  const email = document.getElementById('resetEmail').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  if (pin !== '1234') return alert('❌ Invalid PIN');
  if (!email || !newPassword) return alert('⚠️ Fill all fields');
  const tx = db.transaction('principal', 'readwrite');
  const store = tx.objectStore('principal');
  const req = store.get(email);
  req.onsuccess = () => {
    const data = req.result;
    if (data) {
      data.password = newPassword;
      store.put(data);
      alert('✅ Password reset successful');
      hideReset();
    } else {
      alert('❌ Principal email not found');
    }
  };
}

function addDepartment() {
  const dept = document.getElementById('newDeptName').value.trim();
  if (!dept) return alert('Enter department name');
  const tx = db.transaction('departments', 'readwrite');
  tx.objectStore('departments').put({ name: dept });
  alert('✅ Department added');
  document.getElementById('newDeptName').value = '';
  loadDepartmentsDropdown();
}

function addScheme() {
  const scheme = document.getElementById('newScheme').value.trim();
  if (!scheme) return alert('Enter scheme');
  const tx = db.transaction('schemes', 'readwrite');
  tx.objectStore('schemes').put({ name: scheme });
  alert('✅ Scheme added');
  document.getElementById('newScheme').value = '';
  loadSchemes();
}
function loadSchemeList() {
  const tx = db.transaction('schemes', 'readonly');
  tx.objectStore('schemes').getAll().onsuccess = (e) => {
    const list = document.getElementById('schemeList');
    if (!list) return;
    list.innerHTML = '';
    e.target.result.forEach(s => {
      list.innerHTML += `<li>${s.name}</li>`;
    });
  };
}

window.onload = () => {
  if (db) loadSchemeList();
  else {
    request.onsuccess = () => {
      db = request.result;
      loadSchemeList();
    };
  }
};
function addHOD() {
  const email = document.getElementById('hodEmail').value;
  const password = document.getElementById('hodPassword').value;
  const dept = document.getElementById('hodDeptDropdown').value;
  if (!email || !password || !dept) return alert("Fill all HOD details");
  const tx = db.transaction('hods', 'readwrite');
  tx.objectStore('hods').put({ email, password, department: dept });
  alert('✅ HOD added');
  document.getElementById('hodEmail').value = '';
  document.getElementById('hodPassword').value = '';
  document.getElementById('hodDeptDropdown').value = '';
  loadHODTable();
}

function deleteHOD(email) {
  const tx = db.transaction('hods', 'readwrite');
  tx.objectStore('hods').delete(email);
  tx.oncomplete = () => {
    alert('🗑️ HOD deleted');
    loadHODTable();
  };
}

function loginHOD() {
  const email = document.getElementById('hodEmail').value;
  const password = document.getElementById('hodPassword').value;
  const tx = db.transaction('hods', 'readonly');
  const req = tx.objectStore('hods').get(email);
  req.onsuccess = () => {
    if (req.result && req.result.password === password) {
      window.location.href = '../dashboard_pages/hod_dashboard.html';
    } else {
      alert('❌ Invalid HOD credentials');
    }
  };
}

function addTeacher() {
  const name = document.getElementById('teacherName').value.trim();
  const email = document.getElementById('teacherEmail').value.trim();
  const password = document.getElementById('teacherPassword').value.trim();
  const dept = document.getElementById('teacherDept').value;
  if (!name || !email || !password || !dept) return alert("Fill all teacher details");
  const tx = db.transaction('teachers', 'readwrite');
  tx.objectStore('teachers').put({ name, email, password, department: dept });
  tx.oncomplete = () => {
    alert('✅ Teacher added');
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherEmail').value = '';
    document.getElementById('teacherPassword').value = '';
    document.getElementById('teacherDept').value = '';
    loadTeacherTable();
  };
}

function deleteTeacher(email) {
  const tx = db.transaction('teachers', 'readwrite');
  tx.objectStore('teachers').delete(email);
  tx.oncomplete = () => {
    alert('🗑️ Teacher deleted');
    loadTeacherTable();
  };
}

function loginTeacher() {
  const email = document.getElementById('teacherEmail').value;
  const password = document.getElementById('teacherPassword').value;
  const tx = db.transaction('teachers', 'readonly');
  const req = tx.objectStore('teachers').get(email);
  req.onsuccess = () => {
    if (req.result && req.result.password === password) {
      window.location.href = '../dashboard_pages/teacher_dashboard.html';
    } else {
      alert('❌ Invalid Teacher credentials');
    }
  };
}

function loginStudent() {
  const usn = document.getElementById('studentUSN').value;
  const tx = db.transaction('students', 'readonly');
  const req = tx.objectStore('students').get(usn);
  req.onsuccess = () => {
    if (req.result) {
      window.location.href = '../dashboard_pages/student_dashboard.html';
    } else {
      alert('❌ USN not found');
    }
  };
}

function addStudent() {
  const name = document.getElementById('studentName').value.trim();
  const usn = document.getElementById('studentUSN').value.trim();
  const sem = document.getElementById('studentSem').value;
  const scheme = document.getElementById('studentScheme').value;
  const dob = document.getElementById('studentDOB').value;
  const mobile = document.getElementById('studentMobile').value;
  const email = document.getElementById('studentEmail').value;
  if (!name || !usn || !sem || !scheme) return alert("Fill required student fields");
  const tx = db.transaction('students', 'readwrite');
  tx.objectStore('students').put({ name, usn, sem, scheme, dob, mobile, email });
  tx.oncomplete = () => {
    alert('✅ Student added');
    document.getElementById('studentName').value = '';
    document.getElementById('studentUSN').value = '';
    document.getElementById('studentSem').value = '';
    document.getElementById('studentScheme').value = '';
    document.getElementById('studentDOB').value = '';
    document.getElementById('studentMobile').value = '';
    document.getElementById('studentEmail').value = '';
    loadStudentTable();
  };
}

function uploadNote() {
  const sem = document.getElementById('noteSem').value;
  const subject = document.getElementById('noteSubjectName').value;
  const code = document.getElementById('noteSubjectCode').value;
  const modNo = document.getElementById('noteModuleNo').value;
  const modName = document.getElementById('noteModuleName').value;
  const file = document.getElementById('noteFile').files[0];

  if (!file) return alert('Upload file required');

  const reader = new FileReader();
  reader.onload = () => {
    const fileData = reader.result; // base64 string

    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').add({ sem, subject, code, modNo, modName, file: fileData });
    tx.oncomplete = () => {
      alert('✅ Note uploaded');
      searchNotes();  // Refresh table
    };
  };

  reader.readAsDataURL(file); // ✅ Convert file to base64
}



function showManageNotes() {
  const section = document.getElementById('manageNotesSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}


function searchNotes() {
  const tx = db.transaction('notes', 'readonly');
  tx.objectStore('notes').getAll().onsuccess = (e) => {
    const notes = e.target.result;
    const tbody = document.querySelector('#notesTable tbody');
    tbody.innerHTML = '';

    if (notes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">❌ No notes found</td></tr>';
    } else {
      notes.forEach((note, index) => {
        tbody.innerHTML += `
          <tr>
            <td>${note.sem}</td>
            <td>${note.code}</td>
            <td>${note.modNo} - ${note.modName}</td>
            <td><a href="${note.file}" download="Note${index + 1}.pdf">Download</a></td>
          </tr>
        `;
      });
    }
  };
}


function uploadResult() {
  const usn = document.getElementById('resUSN').value;
  const subject = document.getElementById('resSubName').value;
  const code = document.getElementById('resSubCode').value;
  const marks = document.getElementById('resMarks').value;
  const type = document.getElementById('resTestType').value;
  const sem = document.getElementById('resSem').value;
  const scheme = document.getElementById('resScheme').value;
  if (!usn || !subject || !marks || !type) return alert('Fill all result fields');
  const tx = db.transaction('results', 'readwrite');
  tx.objectStore('results').add({ usn, subject, code, marks, type, sem, scheme });
  alert('✅ Result uploaded');
  loadResultTable();
}

function deleteResult(id) {
  const tx = db.transaction('results', 'readwrite');
  tx.objectStore('results').delete(id);
  tx.oncomplete = () => loadResultTable();
}

function searchResultByUSN() {
  const usn = document.getElementById('resultSearchUSN').value.trim();
  const selectedType = document.getElementById('resultSearchTestType').value;
  const tx = db.transaction('results', 'readonly');
  tx.objectStore('results').getAll().onsuccess = (e) => {
    let data = e.target.result.filter(r => r.usn === usn);
    if (selectedType) data = data.filter(r => r.type === selectedType);
    const tbody = document.querySelector('#studentResultTable tbody');
    tbody.innerHTML = '';
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">❌ No results found</td></tr>';
    } else {
      data.forEach(r => {
        tbody.innerHTML += `<tr><td>${r.subject}</td><td>${r.code}</td><td>${r.marks}</td><td>${r.type}</td></tr>`;
      });
    }
  };
}

function loadDepartmentsDropdown() {
  const tx = db.transaction('departments', 'readonly');
  tx.objectStore('departments').getAll().onsuccess = (e) => {
    const data = e.target.result;
    const dropdowns = document.querySelectorAll('#hodDeptDropdown, #teacherDept, #teacherDepartment'); // ✅ added teacherDepartment
    dropdowns.forEach(drop => {
      drop.innerHTML = '<option value="">Select Department</option>';
      data.forEach(d => {
        drop.innerHTML += `<option value="${d.name}">${d.name}</option>`;
      });
    });
  };
}

function loadSchemes() {
  const tx = db.transaction('schemes', 'readonly');
  tx.objectStore('schemes').getAll().onsuccess = (e) => {
    const data = e.target.result;
    const dropdowns = document.querySelectorAll('#studentScheme, #resScheme');
    dropdowns.forEach(drop => {
      drop.innerHTML = '<option value="">Select Scheme</option>';
      data.forEach(s => {
        drop.innerHTML += `<option value="${s.name}">${s.name}</option>`;
      });
    });
  };
}

function loadHODTable() {
  const tx = db.transaction('hods', 'readonly');
  tx.objectStore('hods').getAll().onsuccess = (e) => {
    const tbody = document.querySelector('#hodTable tbody');
    tbody.innerHTML = '';
    e.target.result.forEach(h => {
      tbody.innerHTML += `<tr><td>${h.email}</td><td>${h.department}</td><td><button onclick="deleteHOD('${h.email}')">Delete</button></td></tr>`;
    });
  };
}

function loadTeacherTable() {
  const tx = db.transaction('teachers', 'readonly');
  tx.objectStore('teachers').getAll().onsuccess = (e) => {
    const tbody = document.querySelector('#teacherTable tbody');
    tbody.innerHTML = '';
    e.target.result.forEach(t => {
      tbody.innerHTML += `<tr><td>${t.name}</td><td>${t.email}</td><td>${t.department}</td><td><button onclick="deleteTeacher('${t.email}')">Delete</button></td></tr>`;
    });
  };
}

function loadStudentTable() {
  const tx = db.transaction('students', 'readonly');
  tx.objectStore('students').getAll().onsuccess = (e) => {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';
    e.target.result.forEach(s => {
      tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.usn}</td><td>${s.sem}</td><td>${s.scheme}</td><td><button>Delete</button></td></tr>`;
    });
  };
}

function loadNoteTable() {
  const tx = db.transaction('notes', 'readonly');
  tx.objectStore('notes').getAll().onsuccess = (e) => {
    const notes = e.target.result;
    const tbody = document.querySelector('#noteTable tbody');
    tbody.innerHTML = '';

    if (notes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">❌ No notes found</td></tr>';
    } else {
      notes.forEach((note, index) => {
        const fileURL = URL.createObjectURL(note.file);
        tbody.innerHTML += `
          <tr>
            <td>${note.sem}</td>
            <td>${note.code}</td>
            <td>${note.modNo} - ${note.modName}</td>
            <td><a href="${fileURL}" download="Note${index + 1}.pdf">Download</a></td>
          </tr>
        `;
      });
    }
  };
}

function loadResultTable() {
  const tx = db.transaction('results', 'readonly');
  tx.objectStore('results').getAll().onsuccess = (e) => {
    const tbody = document.querySelector('#resultTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    e.target.result.forEach(r => {
      tbody.innerHTML += `<tr><td>${r.usn}</td><td>${r.subject}</td><td>${r.marks}</td><td>${r.type}</td><td><button onclick="deleteResult(${r.id})">Delete</button></td></tr>`;
    });
  };
}
