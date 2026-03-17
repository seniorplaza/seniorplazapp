
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
    const firebaseConfig = {
      apiKey: "AIzaSyAgIIBfWoP8-CeIjROMGTYQqWNT_W_W7J0",
      authDomain: "seniorplazapp.firebaseapp.com",
      projectId: "seniorplazapp",
      storageBucket: "seniorplazapp.firebasestorage.app",
      messagingSenderId: "694158550344",
      appId: "1:694158550344:web:c8af7d87cd1dfbc6137f7d",
      measurementId: "G-8SDL7VSBHK"
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  
