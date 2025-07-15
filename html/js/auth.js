// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize users in localStorage if not exists
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            const role = document.getElementById('signup-role').value;
            
            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (!name || !email || !password || !role) {
                alert('Please fill all fields!');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users'));
            const userExists = users.some(user => user.email === email);
            
            if (userExists) {
                alert('User with this email already exists!');
                return;
            }
            
            // Add new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Account created successfully! Please login.');
            openTab('login');
            signupForm.reset();
        });
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;
            
            // Validate form
            if (!email || !password || !role) {
                alert('Please fill all fields!');
                return;
            }
            
            // Check user credentials
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password && u.role === role);
            
            if (!user) {
                alert('Invalid credentials or role!');
                return;
            }
            
            // Store current user in localStorage and redirect
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            switch(role) {
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                case 'doctor':
                    window.location.href = 'doctor.html';
                    break;
                case 'patient':
                    window.location.href = 'patient.html';
                    break;
                default:
                    alert('Invalid role!');
            }
        });
    }
    
    // Forgot Password Form
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('forgot-email').value;
            const role = document.getElementById('forgot-role').value;
            
            // Validate form
            if (!email || !role) {
                alert('Please fill all fields!');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.role === role);
            
            if (!user) {
                alert('No account found with this email and role!');
                return;
            }
            
            // In a real app, you would send a password reset email
            alert('Password reset instructions have been sent to your email (simulated).');
            forgotForm.reset();
        });
    }
});
















