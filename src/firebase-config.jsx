
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDfpcFPQkYJ2K0FXrL6S6zEd-c7GKIIPXY",
    authDomain: "fireapp-35650.firebaseapp.com",
    projectId: "fireapp-35650",
    storageBucket: "fireapp-35650.appspot.com",
    messagingSenderId: "358116860797",
    appId: "1:358116860797:web:a794fdc63f53dcb3c62214",
    measurementId: "G-MYLHP1G13L"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export default database;