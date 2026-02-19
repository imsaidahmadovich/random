import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1leyURVpzS25EJmvLoyjs2Fw9UEBu4qk",
    authDomain: "studio-9250134783-acbf5.firebaseapp.com",
    projectId: "studio-9250134783-acbf5",
    storageBucket: "studio-9250134783-acbf5.firebasestorage.app",
    messagingSenderId: "1006866960554",
    appId: "1:1006866960554:web:69e4fde1a680d9e12f80d3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, onAuthStateChanged, signOut };

export function checkAuth(redirectIfNotAuth = true) {
    onAuthStateChanged(auth, (user) => {
        if (!user && redirectIfNotAuth) {
            window.location.href = "login.html";
        }
    });
}

export function logout() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
}
