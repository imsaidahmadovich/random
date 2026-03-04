import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc } from './auth.js';

export async function adminSignUp(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Mark user as admin in Firestore
    await setDoc(doc(db, 'admins', cred.user.uid), { isAdmin: true }, { merge: true });
}

export async function adminSignIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    // Admin verification is handled in admin.html's auth listener
}
