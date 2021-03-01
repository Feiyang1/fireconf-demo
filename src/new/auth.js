import { firebaseAuth } from './firebase';

export function signInWithEmailPassword(email, pwd) {
    return firebaseAuth.signInWithEmailAndPassword(email, pwd);
}

export function signInAnonymously() {
    return firebaseAuth.signInAnonymously();
}