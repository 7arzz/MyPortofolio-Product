import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// CONFIG LU
const firebaseConfig = {
  apiKey: "AIzaSyAYZ1RozW_ExSrK3NVEK7yPmO5h2Z4r08c",
  authDomain: "myportofolio-dfeaf.firebaseapp.com",
  projectId: "myportofolio-dfeaf",
  storageBucket: "myportofolio-dfeaf.firebasestorage.app",
  messagingSenderId: "655403371234",
  appId: "1:655403371234:web:be0d07411d4acd3a812cbb",
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EXPORT
export { app, auth };
