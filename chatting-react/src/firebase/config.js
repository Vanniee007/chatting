import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBzxqMornFljLk6GmN17os-q8rqgKzBr-M",
    authDomain: "chat-app-f7a36.firebaseapp.com",
    projectId: "chat-app-f7a36",
    storageBucket: "chat-app-f7a36.appspot.com",
    messagingSenderId: "907718942711",
    appId: "1:907718942711:web:afe14994ca16d26faa18f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db ,storage};
