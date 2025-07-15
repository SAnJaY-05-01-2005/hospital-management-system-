// Admin-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize doctors and patients in localStorage if not exists
    if (!localStorage.getItem('doctors')) {
        localStorage.setItem('doctors', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', JSON.stringify([]));
    }
    
    // Tab switching functionality
    const doctorsTab = document.querySelector('.tab-btn:nth-child(1)'); // First tab button
    const patientsTab = document.querySelector('.tab-btn:nth-child(2)'); // Second tab button
    const doctorsContent = document.getElementById('doctors');
    const patientsContent = document.getElementById('patients');

    if (doctorsTab && patientsTab) {
        doctorsTab.addEventListener('click', function() {
            doctorsTab.classList.add('active');
            patientsTab.classList.remove('active');
            doctorsContent.classList.add('active');
            patientsContent.classList.remove('active');
        });

        patientsTab.addEventListener('click', function() {
            patientsTab.classList.add('active');
            doctorsTab.classList.remove('active');
            patientsContent.classList.add('active');
            doctorsContent.classList.remove('active');
            renderPatientsTable(); // Make sure to render the table when switching tabs
        });
    }

    // Add Doctor Form
    const addDoctorBtn = document.getElementById('add-doctor-btn');
    const doctorForm = document.getElementById('doctor-form');
    const doctorFormElement = document.getElementById('doctorForm');
    const cancelDoctorBtn = document.getElementById('cancel-doctor');
    
    if (addDoctorBtn && doctorForm && doctorFormElement && cancelDoctorBtn) {
        let currentDoctorId = null;
        
        addDoctorBtn.addEventListener('click', function() {
            currentDoctorId = null;
            doctorForm.style.display = 'block';
            doctorFormElement.reset();
            window.scrollTo(0, doctorForm.offsetTop);
        });
        
        cancelDoctorBtn.addEventListener('click', function() {
            doctorForm.style.display = 'none';
        });
        
        doctorFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('doctor-name').value;
            const email = document.getElementById('doctor-email').value;
            const specialization = document.getElementById('doctor-specialization').value;
            const phone = document.getElementById('doctor-phone').value;
            const address = document.getElementById('doctor-address').value;
            
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            
            if (currentDoctorId) {
                // Update existing doctor
                const doctorIndex = doctors.findIndex(d => d.id === currentDoctorId);
                if (doctorIndex !== -1) {
                    doctors[doctorIndex] = {
                        ...doctors[doctorIndex],
                        name,
                        email,
                        specialization,
                        phone,
                        address
                    };
                }
            } else {
                // Add new doctor
                const newDoctor = {
                    id: Date.now().toString(),
                    name,
                    email,
                    specialization,
                    phone,
                    address,
                    createdAt: new Date().toISOString()
                };
                doctors.push(newDoctor);
            }
            
            localStorage.setItem('doctors', JSON.stringify(doctors));
            doctorForm.style.display = 'none';
            renderDoctorsTable();
        });
        
        // Render doctors table
        function renderDoctorsTable() {
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            const tableBody = document.querySelector('#doctors-table tbody');
            
            tableBody.innerHTML = '';
            
            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${doctor.name}</td>
                    <td>${doctor.specialization}</td>
                    <td>${doctor.email}</td>
                    <td>${doctor.phone}</td>
                    <td>
                        <button class="btn action-btn edit-doctor" data-id="${doctor.id}">Edit</button>
                        <button class="btn action-btn delete-doctor" data-id="${doctor.id}">Delete</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-doctor').forEach(btn => {
                btn.addEventListener('click', function() {
                    const doctorId = this.getAttribute('data-id');
                    const doctors = JSON.parse(localStorage.getItem('doctors'));
                    const doctor = doctors.find(d => d.id === doctorId);
                    
                    if (doctor) {
                        currentDoctorId = doctor.id;
                        document.getElementById('doctor-name').value = doctor.name;
                        document.getElementById('doctor-email').value = doctor.email;
                        document.getElementById('doctor-specialization').value = doctor.specialization;
                        document.getElementById('doctor-phone').value = doctor.phone;
                        document.getElementById('doctor-address').value = doctor.address;
                        
                        doctorForm.style.display = 'block';
                        window.scrollTo(0, doctorForm.offsetTop);
                    }
                });
            });
            
            document.querySelectorAll('.delete-doctor').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this doctor?')) {
                        const doctorId = this.getAttribute('data-id');
                        const doctors = JSON.parse(localStorage.getItem('doctors'));
                        const updatedDoctors = doctors.filter(d => d.id !== doctorId);
                        
                        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
                        renderDoctorsTable();
                    }
                });
            });
        }
        
        // Initial render
        renderDoctorsTable();
    }
    
    // Add Patient Form
    const addPatientBtn = document.getElementById('add-patient-btn');
    const patientForm = document.getElementById('patient-form');
    const patientFormElement = document.getElementById('patientForm');
    const cancelPatientBtn = document.getElementById('cancel-patient');
    
    if (addPatientBtn && patientForm && patientFormElement && cancelPatientBtn) {
        let currentPatientId = null;
        
        addPatientBtn.addEventListener('click', function() {
            currentPatientId = null;
            patientForm.style.display = 'block';
            patientFormElement.reset();
            window.scrollTo(0, patientForm.offsetTop);
        });
        
        cancelPatientBtn.addEventListener('click', function() {
            patientForm.style.display = 'none';
        });
        
        patientFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('patient-name').value;
            const email = document.getElementById('patient-email').value;
            const dob = document.getElementById('patient-dob').value;
            const gender = document.getElementById('patient-gender').value;
            const phone = document.getElementById('patient-phone').value;
            const address = document.getElementById('patient-address').value;
            const medicalHistory = document.getElementById('patient-medical-history').value;
            
            const patients = JSON.parse(localStorage.getItem('patients'));
            
            if (currentPatientId) {
                // Update existing patient
                const patientIndex = patients.findIndex(p => p.id === currentPatientId);
                if (patientIndex !== -1) {
                    patients[patientIndex] = {
                        ...patients[patientIndex],
                        name,
                        email,
                        dob,
                        gender,
                        phone,
                        address,
                        medicalHistory
                    };
                }
            } else {
                // Add new patient
                const newPatient = {
                    id: Date.now().toString(),
                    name,
                    email,
                    dob,
                    gender,
                    phone,
                    address,
                    medicalHistory,
                    createdAt: new Date().toISOString()
                };
                patients.push(newPatient);
            }
            
            localStorage.setItem('patients', JSON.stringify(patients));
            patientForm.style.display = 'none';
            renderPatientsTable();
        });
        
        // Render patients table
        function renderPatientsTable() {
            const patients = JSON.parse(localStorage.getItem('patients'));
            const tableBody = document.querySelector('#patients-table tbody');
            
            tableBody.innerHTML = '';
            
            patients.forEach(patient => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${patient.name}</td>
                    <td>${patient.email}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.dob}</td>
                    <td>${patient.gender}</td>
                    <td>
                        <button class="btn action-btn edit-patient" data-id="${patient.id}">Edit</button>
                        <button class="btn action-btn delete-patient" data-id="${patient.id}">Delete</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-patient').forEach(btn => {
                btn.addEventListener('click', function() {
                    const patientId = this.getAttribute('data-id');
                    const patients = JSON.parse(localStorage.getItem('patients'));
                    const patient = patients.find(p => p.id === patientId);
                    
                    if (patient) {
                        currentPatientId = patient.id;
                        document.getElementById('patient-name').value = patient.name;
                        document.getElementById('patient-email').value = patient.email;
                        document.getElementById('patient-dob').value = patient.dob;
                        document.getElementById('patient-gender').value = patient.gender;
                        document.getElementById('patient-phone').value = patient.phone;
                        document.getElementById('patient-address').value = patient.address;
                        document.getElementById('patient-medical-history').value = patient.medicalHistory || '';
                        
                        patientForm.style.display = 'block';
                        window.scrollTo(0, patientForm.offsetTop);
                    }
                });
            });
            
            document.querySelectorAll('.delete-patient').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this patient?')) {
                        const patientId = this.getAttribute('data-id');
                        const patients = JSON.parse(localStorage.getItem('patients'));
                        const updatedPatients = patients.filter(p => p.id !== patientId);
                        
                        localStorage.setItem('patients', JSON.stringify(updatedPatients));
                        renderPatientsTable();
                    }
                });
            });
        }
        
        // Initial render
        renderPatientsTable();
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});