import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAk-Cj-ST_omvkVWIOEBuGHA5OiyiXW3Rs',
  authDomain: 'quizplatform-c461a.firebaseapp.com',
  projectId: 'quizplatform-c461a',
  storageBucket: 'quizplatform-c461a.appspot.com',
  messagingSenderId: '415360348213',
  appId: '1:415360348213:web:4b8d9dd7fed78fad58417c',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app); 

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, doc, setDoc, getDoc };
