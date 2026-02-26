import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore, doc, getDoc, setDoc, serverTimestamp,
    collection, addDoc, query, orderBy, onSnapshot, deleteDoc, limit,
    where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
    auth, db, provider, signInWithPopup, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
    doc, getDoc, setDoc, serverTimestamp,
    collection, addDoc, query, orderBy, onSnapshot, deleteDoc, limit,
    where, getDocs
};

export function checkAuth(redirectIfNotAuth = true) {
    return onAuthStateChanged(auth, (user) => {
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
