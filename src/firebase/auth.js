import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./config";

const auth = getAuth(app);

// =======================
// 🔐 LOGIN
// =======================
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// =======================
// 🚪 LOGOUT
// =======================
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};

// =======================
// 👀 LISTENER (IMPORTANT)
// =======================
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// =======================
// 🔑 EXPORT AUTH
// =======================
export { auth };
