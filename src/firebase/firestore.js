import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "./config";

const db = getFirestore(app);
const worksCol = collection(db, "works");
const settingsRef = doc(db, "portfolio", "settings");

// =======================
// ⚡ CACHE HELPER
// =======================
const CACHE_WORKS = "portfolio_works_cache";
const CACHE_SETTINGS = "portfolio_settings_cache";

const saveToCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) { console.error("Cache error:", e); }
};

const getFromCache = (key, maxAge = 600000) => { // 10 mins default
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (maxAge !== Infinity && Date.now() - timestamp > maxAge) return null; // Expired
    return data;
  } catch (e) { return null; }
};

// =======================
// 🔥 WORKS
// =======================

// GET WORKS (LATEST FIRST)
export const getWorks = async (useCache = true) => {
  if (useCache) {
    const cached = getFromCache(CACHE_WORKS, 3600000); // 1 hour cache
    if (cached) return cached;
  }

  try {
    const q = query(worksCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    saveToCache(CACHE_WORKS, data);
    return data;
  } catch (e) {
    const fallback = getFromCache(CACHE_WORKS, Infinity);
    if (fallback) return fallback;
    throw e;
  }
};

// ADD WORK
export const addWork = async (data) => {
  const res = await addDoc(worksCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
  localStorage.removeItem(CACHE_WORKS);
  return res;
};

// UPDATE WORK
export const updateWork = async (id, data) => {
  const ref = doc(db, "works", id);
  const res = await updateDoc(ref, data);
  localStorage.removeItem(CACHE_WORKS);
  return res;
};

// DELETE WORK
export const deleteWork = async (id) => {
  const ref = doc(db, "works", id);
  const res = await deleteDoc(ref);
  localStorage.removeItem(CACHE_WORKS);
  return res;
};

// =======================
// ⚙️ SETTINGS
// =======================

// GET SETTINGS
export const getSettings = async (useCache = true) => {
  if (useCache) {
    const cached = getFromCache(CACHE_SETTINGS, 86400000); // 24 hours cache for settings
    if (cached) return cached;
  }

  try {
    // INCREASE TIMEOUT TO 15s to be safe on slow networks
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 15000)
    );

    const fetchPromise = (async () => {
      const snap = await getDoc(settingsRef);
      const data = snap.exists() ? snap.data() : null;
      if (data) saveToCache(CACHE_SETTINGS, data);
      return data;
    })();

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error("Firestore getSettings error:", error);
    // Return cached data as fallback even if expired
    const cached = getFromCache(CACHE_SETTINGS, Infinity);
    if (cached) return cached;
    return null; // Both live and cache failed
  }
};

// UPDATE SETTINGS
export const updateSettings = async (data) => {
  const res = await setDoc(settingsRef, data, { merge: true });
  // Update cache immediately with the new data to avoid flicker or "No settings found"
  saveToCache(CACHE_SETTINGS, data);
  return res;
};

// INIT (FIRST LOAD)
export const initializeSettings = async () => {
  try {
    const existing = await getSettings(false); // Force fresh check on init

    if (!existing) {
      const defaultSettings = {
        profile: {
          name: "Tarzz",
          title: "Full Stack Developer",
          bio: "I build digital products 🚀",
          email: "your-email@example.com",
          phone: "+62",
        },
        hero: {
          headline: "Hi, I'm Tarzz",
          subtitle: "I build cool web apps 🚀",
          ctaText: "See My Works",
          ctaLink: "#works",
        },
        social: {
          github: "",
          linkedin: "",
          twitter: "",
          email: "",
        },
        footer: {
          copyright: "© 2026 Tarzz",
          tagline: "Build. Ship. Repeat.",
        },
        testimonials: [],
        skills: [
          { name: "React & Next.js", level: "Senior Architect", icon: "⚛️" },
          { name: "TypeScript / JS", level: "Expert", icon: "📜" },
          { name: "UI/UX & Design", level: "Creative specialist", icon: "🎨" },
          { name: "Performance Opt.", level: "Advanced", icon: "⚡" },
          { name: "Cloud & Ops", level: "Expert", icon: "☁️" },
          { name: "AI Integration", level: "Specialist", icon: "🤖" },
        ],
      };

      await updateSettings(defaultSettings);
      return defaultSettings;
    }

    saveToCache(CACHE_SETTINGS, existing);
    return existing;
  } catch (err) {
    console.error("Init Settings failed:", err);
  }
};
