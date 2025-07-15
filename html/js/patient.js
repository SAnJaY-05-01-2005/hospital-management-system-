// Patient-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    
    // Initialize appointments in localStorage if not exists
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
    }
    
    // Display patient profile
    const patientProfile = document.getElementById('patient-profile');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const patientProfileForm = document.getElementById('patientProfileForm');
    const cancelProfileBtn = document.getElementById('cancel-profile');
    
    if (patientProfile) {
        // Find the patient in the patients array
        const patient = patients.find(p => p.email === currentUser.email) || {
            name: currentUser.name,
            email: currentUser.email,
            dob: 'Not specified',
            gender: 'Not specified',
            phone: 'Not specified',
            address: 'Not specified',
            medicalHistory: 'None'
        };
        
        // Display profile
        patientProfile.innerHTML = `
            <div class="profile-details">
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <p><strong>Date of Birth:</strong> ${patient.dob}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Address:</strong> ${patient.address}</p>
                <p><strong>Medical History:</strong> ${patient.medicalHistory || 'None'}</p>
            </div>
        `;
        
        // Edit profile functionality
        editProfileBtn.addEventListener('click', function() {
            document.getElementById('edit-patient-name').value = patient.name;
            document.getElementById('edit-patient-email').value = patient.email;
            document.getElementById('edit-patient-dob').value = patient.dob;
            document.getElementById('edit-patient-gender').value = patient.gender;
            document.getElementById('edit-patient-phone').value = patient.phone;
            document.getElementById('edit-patient-address').value = patient.address;
            document.getElementById('edit-patient-medical-history').value = patient.medicalHistory || '';
            
            profileForm.style.display = 'block';
            window.scrollTo(0, profileForm.offsetTop);
        });
        
        cancelProfileBtn.addEventListener('click', function() {
            profileForm.style.display = 'none';
        });
        
        patientProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updatedPatient = {
                id: patient.id || Date.now().toString(),
                name: document.getElementById('edit-patient-name').value,
                email: document.getElementById('edit-patient-email').value,
                dob: document.getElementById('edit-patient-dob').value,
                gender: document.getElementById('edit-patient-gender').value,
                phone: document.getElementById('edit-patient-phone').value,
                address: document.getElementById('edit-patient-address').value,
                medicalHistory: document.getElementById('edit-patient-medical-history').value,
                createdAt: patient.createdAt || new Date().toISOString()
            };
            
            // Update or add patient to the array
            let updatedPatients;
            if (patient.id) {
                updatedPatients = patients.map(p => p.id === patient.id ? updatedPatient : p);
            } else {
                updatedPatients = [...patients, updatedPatient];
            }
            
            localStorage.setItem('patients', JSON.stringify(updatedPatients));
            
            // Update current user name if changed
            if (currentUser.name !== updatedPatient.name) {
                const users = JSON.parse(localStorage.getItem('users'));
                const updatedUsers = users.map(u => {
                    if (u.email === currentUser.email) {
                        return { ...u, name: updatedPatient.name };
                    }
                    return u;
                });
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                
                // Update currentUser in localStorage
                const updatedCurrentUser = { ...currentUser, name: updatedPatient.name };
                localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            }
            
            profileForm.style.display = 'none';
            location.reload(); // Refresh to show updated profile
        });
    }
    
    // Display patient's doctors
    const doctorsTableBody = document.querySelector('#patient-doctors-table tbody');
    if (doctorsTableBody) {
        // For simplicity, we'll show all doctors
        // In a real app, you would filter by doctors assigned to this patient
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.email}</td>
                <td>${doctor.phone}</td>
            `;
            
            doctorsTableBody.appendChild(row);
        });
    }
    
    // Appointments functionality
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentFormElement = document.getElementById('appointmentForm');
    const cancelAppointmentBtn = document.getElementById('cancel-appointment');
    const appointmentsTableBody = document.querySelector('#appointments-table tbody');
    
    if (newAppointmentBtn && appointmentForm && appointmentFormElement && cancelAppointmentBtn && appointmentsTableBody) {
        let currentAppointmentId = null;
        
        // Populate doctor dropdown
        const doctorSelect = document.getElementById('appointment-doctor');
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} (${doctor.specialization})`;
            doctorSelect.appendChild(option);
        });
        
        newAppointmentBtn.addEventListener('click', function() {
            currentAppointmentId = null;
            appointmentForm.style.display = 'block';
            appointmentFormElement.reset();
            window.scrollTo(0, appointmentForm.offsetTop);
        });
        
        cancelAppointmentBtn.addEventListener('click', function() {
            appointmentForm.style.display = 'none';
        });
        
        appointmentFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const doctorId = document.getElementById('appointment-doctor').value;
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            const reason = document.getElementById('appointment-reason').value;
            
            if (!doctorId || !date || !time || !reason) {
                alert('Please fill all fields!');
                return;
            }
            
            const selectedDoctor = doctors.find(d => d.id === doctorId);
            
            const appointments = JSON.parse(localStorage.getItem('appointments'));
            
            if (currentAppointmentId) {
                // Update existing appointment
                const appointmentIndex = appointments.findIndex(a => a.id === currentAppointmentId);
                if (appointmentIndex !== -1) {
                    appointments[appointmentIndex] = {
                        ...appointments[appointmentIndex],
                        doctorId,
                        doctorName: selectedDoctor.name,
                        doctorSpecialization: selectedDoctor.specialization,
                        date,
                        time,
                        reason,
                        status: 'Pending'
                    };
                }
            } else {
                // Add new appointment
                const newAppointment = {
                    id: Date.now().toString(),
                    patientId: currentUser.email, // Using email as identifier
                    patientName: currentUser.name,
                    doctorId,
                    doctorName: selectedDoctor.name,
                    doctorSpecialization: selectedDoctor.specialization,
                    date,
                    time,
                    reason,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                };
                appointments.push(newAppointment);
            }
            
            localStorage.setItem('appointments', JSON.stringify(appointments));
            appointmentForm.style.display = 'none';
            renderAppointmentsTable();
        });
        
        // Render appointments table
        function renderAppointmentsTable() {
            const appointments = JSON.parse(localStorage.getItem('appointments'));
            const patientAppointments = appointments.filter(a => a.patientId === currentUser.email);
            
            appointmentsTableBody.innerHTML = '';
            
            patientAppointments.forEach(appointment => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${appointment.doctorName} (${appointment.doctorSpecialization})</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.reason}</td>
                    <td>${appointment.status}</td>
                    <td>
                        <button class="btn action-btn edit-appointment" data-id="${appointment.id}">Edit</button>
                        <button class="btn action-btn cancel-appointment" data-id="${appointment.id}">Cancel</button>
                    </td>
                `;
                
                appointmentsTableBody.appendChild(row);
            });
            
            // Add event listeners to edit and cancel buttons
            document.querySelectorAll('.edit-appointment').forEach(btn => {
                btn.addEventListener('click', function() {
                    const appointmentId = this.getAttribute('data-id');
                    const appointments = JSON.parse(localStorage.getItem('appointments'));
                    const appointment = appointments.find(a => a.id === appointmentId);
                    
                    if (appointment) {
                        currentAppointmentId = appointment.id;
                        document.getElementById('appointment-doctor').value = appointment.doctorId;
                        document.getElementById('appointment-date').value = appointment.date;
                        document.getElementById('appointment-time').value = appointment.time;
                        document.getElementById('appointment-reason').value = appointment.reason;
                        
                        appointmentForm.style.display = 'block';
                        window.scrollTo(0, appointmentForm.offsetTop);
                    }
                });
            });
            
            document.querySelectorAll('.cancel-appointment').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to cancel this appointment?')) {
                        const appointmentId = this.getAttribute('data-id');
                        const appointments = JSON.parse(localStorage.getItem('appointments'));
                        const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
                        
                        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                        renderAppointmentsTable();
                    }
                });
            });
        }
        
        // Initial render
        renderAppointmentsTable();
    }

    // Explicit logout button functionality (FIXED)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});