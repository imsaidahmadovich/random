import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp,
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
    doc, getDoc, setDoc, updateDoc, serverTimestamp,
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

// OpenRouter API Key DB fetch helper
let cachedOpenRouterKey = null;
export async function getOpenRouterKey() {
    if (cachedOpenRouterKey) return cachedOpenRouterKey;
    try {
        const keyRef = doc(db, "config", "openrouter");
        const keySnap = await getDoc(keyRef);
        if (keySnap.exists() && keySnap.data().key) {
            cachedOpenRouterKey = keySnap.data().key;
            return cachedOpenRouterKey;
        }
        const fallback = "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";
        await setDoc(keyRef, { key: fallback }, { merge: true });
        cachedOpenRouterKey = fallback;
        return fallback;
    } catch (e) {
        console.error("Error with OpenRouter API key fetch:", e);
        return "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";
    }
}
