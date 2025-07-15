// Main script for common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    function openTab(tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        const tabButtons = document.getElementsByClassName('tab-btn');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }
        
        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
    }
    
    // Make openTab function available globally
    window.openTab = openTab;
    
    // Admin tab functionality
    if (typeof openAdminTab !== 'undefined') {
        window.openAdminTab = function(tabName) {
            const tabContents = document.querySelectorAll('.dashboard .tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            const tabButtons = document.querySelectorAll('.dashboard .tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.currentTarget.classList.add('active');
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Logout button functionality
    const logoutButtons = document.querySelectorAll('#logout-btn');
    if (logoutButtons.length > 0) {
        logoutButtons.forEach(button => {
            button.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        });
    }
    
    // Check if user is logged in when accessing dashboard pages
    if (window.location.pathname.includes('admin.html') || 
        window.location.pathname.includes('doctor.html') || 
        window.location.pathname.includes('patient.html')) {
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            window.location.href = 'index.html';
        } else {
            // Check if user has the right role for the page
            const role = window.location.pathname.split('.')[0].split('/').pop();
            
            if (currentUser.role !== role) {
                window.location.href = 'index.html';
            }
        }
    }
});





















