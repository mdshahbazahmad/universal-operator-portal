// =========================================================
// EAGLE NETWORK SBZ - CORE APP SCRIPT (app.js)
// =========================================================

// 1. Firebase Initialization & Auth State Listener
document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged((user) => {
            const currentPath = window.location.pathname;
            
            // यदि यूज़र लॉगिन है और index.html पर है, तो उसे सीधे डैशबोर्ड भेजें
            if (user && (currentPath.endsWith("index.html") || currentPath === "/")) {
                window.location.href = "dashboard.html";
            }
        });
    }
});

// 2. Tab Switcher Logic for Login & Register Forms
function switchTab(type) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const errBox = document.getElementById('auth-error');

    if (errBox) errBox.style.display = 'none';

    if (type === 'login') {
        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
        if (formLogin) formLogin.style.display = 'block';
        if (formRegister) formRegister.style.display = 'none';
    } else {
        if (tabRegister) tabRegister.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
        if (formRegister) formRegister.style.display = 'block';
        if (formLogin) formLogin.style.display = 'none';
    }
}

// 3. Password Visibility Toggle
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
