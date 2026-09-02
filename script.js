// Splash Screen Timer
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('splash-hidden');
    }, 2200);
});

// ⚠️ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVsmFa6Xr-_EfUqh_ZS6tmzBwcdMZq0JA",
    authDomain: "universal-portal-dashboard.firebaseapp.com",
    projectId: "universal-portal-dashboard",
    storageBucket: "universal-portal-dashboard.firebasestorage.app",
    messagingSenderId: "403036962443",
    appId: "1:403036962443:web:5a15ac684c76efd2c3de8e",
    databaseURL: "https://universal-portal-dashboard-default-rtdb.firebaseio.com"
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database();

// 🟢 Check User Auth Status -> Dashboard Version 2 (`dashboard-v2.html`) Connection Added!
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'dashboard_v2.html';
    }
});

// Error Handlers
function showAuthError(message) {
    const node = document.getElementById("auth-error");
    if (node) {
        node.textContent = message;
        node.style.display = "block";
    }
}
function clearAuthError() {
    const node = document.getElementById("auth-error");
    if (node) {
        node.textContent = "";
        node.style.display = "none";
    }
}

// Toggle Password Lock/Unlock View
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// 🔑 Forgot Password Functionality
function handleForgotPassword() {
    const email = document.getElementById('login-email').value;
    if (!email) {
        showAuthError("Please enter your email address first to reset password.");
        return;
    }
    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Password reset email sent to " + email + ". Please check your inbox!");
        })
        .catch((error) => {
            showAuthError("Error: " + error.message);
        });
}

// Multilingual Translation Support
const translations = {
    en: {
        dir: 'ltr',
        logo: 'Eagle Network SBZ',
        badge: 'Built for Cable & Wi-Fi Operators',
        title: 'Manage Your Entire Cable & Broadband Empire',
        desc: 'All-in-one portal to streamline customer billing, automate payments, resolve signal faults, and manage your local network easily.',
        feat1: 'Automated Multi-Operator Billing & Invoicing',
        feat2: 'Dedicated Customer Mobile App Support',
        feat3: 'Instant Cable Cut & Signal Fault Alerts',
        statLbl1: 'App Users',
        statLbl2: 'Operators',
        statLbl3: 'Uptime',
        tabLogin: 'Sign In',
        tabRegister: 'Register Operator',
        lblLoginEmail: 'Email Address',
        lblLoginPass: 'Password',
        forgotPass: 'Forgot Password?',
        btnLoginSubmit: 'Login to Portal',
        lblRegName: 'Operator / Business Name',
        lblRegEmail: 'Email Address',
        lblRegPass: 'Create Password',
        btnRegSubmit: 'Create Operator Account'
    },
    hi: {
        dir: 'ltr',
        logo: 'Eagle Network SBZ',
        badge: 'केबल और वाई-फाई ऑपरेटरों के लिए निर्मित',
        title: 'अपने पूरे केबल और ब्रॉडबैंड नेटवर्क को मैनेज करें',
        desc: 'ग्राहक बिलिंग, ऑटोमैटिक भुगतान, सिग्नल फॉल्ट सुलझाने और अपने लोकल नेटवर्क को आसानी से संचालित करने का ऑल-इन-वन पोर्टल।',
        feat1: 'ऑटोमैटिक मल्टी-ऑपरेटर बिलिंग और रसीद',
        feat2: 'ग्राहकों के लिए विशेष मोबाइल ऐप सपोर्ट',
        feat3: 'केबल कटने और सिग्नल फ़ॉल्ट का तुरंत अलर्ट',
        statLbl1: 'ऐप ग्राहक',
        statLbl2: 'नेटवर्क ऑपरेटर',
        statLbl3: 'सक्रिय सर्वर',
        tabLogin: 'साइन इन करें',
        tabRegister: 'नया ऑपरेटर जोड़ें',
        lblLoginEmail: 'ईमेल आईडी',
        lblLoginPass: 'पासवर्ड',
        forgotPass: 'पासवर्ड भूल गए?',
        btnLoginSubmit: 'डैशबोर्ड में लॉगिन करें',
        lblRegName: 'ऑपरेटर / कंपनी का नाम',
        lblRegEmail: 'ईमेल आईडी',
        lblRegPass: 'पासवर्ड बनाएं',
        btnRegSubmit: 'ऑपरेटर अकाउंट बनाएं'
    },
    ur: {
        dir: 'rtl',
        logo: 'Eagle Network SBZ',
        badge: 'کیبل اور وائی فائی آپریٹرز کے لیے خاص',
        title: 'اپنے کیبل اور براڈ بینڈ نیٹ ورک کا مکمل انتظام کریں',
        desc: 'کسٹمر بلنگ، خودکار ادائیگیاں، سگنل کی خرابیوں کو حل کرنے اور اپنے مقامی نیٹ ورک کو آسانی سے چلانے کا بہترین پورٹل۔',
        feat1: 'خودکار بلنگ اور رسیدیں',
        feat2: 'کسٹمرز کے لیے خصوصی موبائل ایپ',
        feat3: 'کیبل کٹنے اور سگنل کی خرابی کا فوری الرٹ',
        statLbl1: 'ایپ کسٹمرز',
        statLbl2: 'آپریٹرز',
        statLbl3: 'سرور سسٹم',
        tabLogin: 'سائن ان کریں',
        tabRegister: 'نیا آپریٹر رجسٹر کریں',
        lblLoginEmail: 'ای میل',
        lblLoginPass: 'پاسورڈ',
        forgotPass: 'پاسورڈ بھول گئے؟',
        btnLoginSubmit: 'پورٹل میں لاگ ان کریں',
        lblRegName: 'آپریٹر / کمپنی کا نام',
        lblRegEmail: 'ای میل',
        lblRegPass: 'پاسورڈ بنائیں',
        btnRegSubmit: 'نیا اکاؤنٹ بنائیں'
    }
};

function changeLanguage(lang) {
    const data = translations[lang];
    document.documentElement.dir = data.dir;
    document.getElementById('txt-logo').innerText = data.logo;
    document.getElementById('txt-badge').innerText = data.badge;
    document.getElementById('txt-title').innerText = data.title;
    document.getElementById('txt-desc').innerText = data.desc;
    document.getElementById('feat-1').innerText = data.feat1;
    document.getElementById('feat-2').innerText = data.feat2;
    document.getElementById('feat-3').innerText = data.feat3;
    document.getElementById('stat-lbl-1').innerText = data.statLbl1;
    document.getElementById('stat-lbl-2').innerText = data.statLbl2;
    document.getElementById('stat-lbl-3').innerText = data.statLbl3;
    document.getElementById('tab-login').innerText = data.tabLogin;
    document.getElementById('tab-register').innerText = data.tabRegister;
    document.getElementById('lbl-login-email').innerText = data.lblLoginEmail;
    document.getElementById('lbl-login-pass').innerText = data.lblLoginPass;
    document.getElementById('txt-forgot-pass').innerText = data.forgotPass;
    document.getElementById('btn-login-submit').innerText = data.btnLoginSubmit;
    document.getElementById('lbl-reg-name').innerText = data.lblRegName;
    document.getElementById('lbl-reg-email').innerText = data.lblRegEmail;
    document.getElementById('lbl-reg-pass').innerText = data.lblRegPass;
    document.getElementById('btn-reg-submit').innerText = data.btnRegSubmit;
}

function switchTab(tab) {
    clearAuthError();
    if(tab === 'login') {
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-register').style.display = 'none';
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
    } else {
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-register').style.display = 'block';
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    clearAuthError();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // 🚀 Direct link to Dashboard Version 2
            window.location.href = 'dashboard_v2.html';
        })
        .catch((error) => {
            showAuthError("Login Failed: " + error.message);
        });
}

function handleRegister(e) {
    e.preventDefault();
    clearAuthError();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            const firestorePromise = db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                companyName: "Eagle Network SBZ",
                role: "operator",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            const realtimePromise = realtimeDb.ref(`operators/${user.uid}/profile`).set({
                name: name,
                email: email,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });

            return Promise.all([firestorePromise, realtimePromise]);
        })
        .then(() => {
            alert("Account Created Successfully!");
            // 🚀 Direct link to Dashboard Version 2
            window.location.href = 'dashboard_v2.html';
        })
        .catch((error) => {
            showAuthError("Registration Error: " + error.message);
        });
}
