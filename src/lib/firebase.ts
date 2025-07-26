// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "fitgenie-oq9ol",
  "appId": "1:740032401247:web:c63556c5c93dbf2a80b0ea",
  "storageBucket": "fitgenie-oq9ol.firebasestorage.app",
  "apiKey": "AIzaSyAEHgKvSMlDiWd7VjK6rWEE-fBQKH1PU9k",
  "authDomain": "fitgenie-oq9ol.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "740032401247"
};

// Initialize Firebase for client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
