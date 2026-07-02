// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on Dashboard pages
    const isDashboard = window.location.pathname.includes('dashboard');
    const isAdminDashboard = window.location.pathname.includes('admin-dashboard');
    const isClientDashboard = window.location.pathname.includes('client-dashboard');
    const isLoginOrSignup = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
    
    const currentUser = JSON.parse(localStorage.getItem('ar_currentUser'));

    if (isDashboard) {
        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            // Verify roles
            if (isAdminDashboard && currentUser.role !== 'admin') {
                window.location.href = 'client-dashboard.html';
            }
            if (isClientDashboard && currentUser.role !== 'client') {
                window.location.href = 'admin-dashboard.html';
            }
            
            // Display user email
            const emailDisplays = document.querySelectorAll('.user-email-display');
            emailDisplays.forEach(el => {
                el.textContent = currentUser.email;
            });
        }
    }

    if (isLoginOrSignup && currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    }

    // Signup Logic
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            let isValid = true;

            // Password match check
            if (password !== confirmPassword) {
                const confirmGroup = document.getElementById('confirmPassword').closest('.form-group');
                confirmGroup.classList.add('error');
                confirmGroup.querySelector('.error-message').textContent = 'Passwords do not match';
                isValid = false;
            }

            // Password strength check (min 8 chars, 1 number)
            const strongPasswordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;
            if (!strongPasswordRegex.test(password)) {
                const passGroup = document.getElementById('password').closest('.form-group');
                passGroup.classList.add('error');
                passGroup.querySelector('.error-message').textContent = 'Password must be at least 8 characters and contain a number';
                isValid = false;
            }

            if (isValid) {
                // Store user in localstorage database array
                let users = JSON.parse(localStorage.getItem('ar_users')) || [];
                
                // Check if email exists
                if (users.find(u => u.email === email)) {
                    alert('Email already registered. Please login.');
                    return;
                }

                // Determine role (for demo purposes, if email contains 'admin', make them admin)
                const role = email.includes('admin') ? 'admin' : 'client';

                users.push({
                    name, company, email, phone, password, role
                });
                
                localStorage.setItem('ar_users', JSON.stringify(users));
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            }
        });
    }

    // Login Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Optional: hardcoded admin for testing without signup
            if (email === 'admin@ar.com' && password === 'admin123') {
                 localStorage.setItem('ar_currentUser', JSON.stringify({ email: email, role: 'admin' }));
                 window.location.href = 'admin-dashboard.html';
                 return;
            }

            let users = JSON.parse(localStorage.getItem('ar_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('ar_currentUser', JSON.stringify({
                    email: user.email,
                    role: user.role,
                    name: user.name
                }));
                
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'client-dashboard.html';
                }
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // Logout Logic
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ar_currentUser');
            window.location.href = 'login.html';
        });
    });
});
