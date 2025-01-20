// firebase-config.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxAkWR8Y0PrGxdMooejekrQYYjsTz9p1Y",
    authDomain: "feelgood-web.firebaseapp.com",
    databaseURL: "https://feelgood-web-default-rtdb.firebaseio.com/",
    projectId: "feelgood-web",
    storageBucket: "feelgood-web.appspot.com",
    messagingSenderId: "812145082703",
    appId: "1:812145082703:web:87d1fdc59e05b5ce99853a",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Export the database reference
export { db };
