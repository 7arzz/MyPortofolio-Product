import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../firebase/config";
import { getSettings } from "../firebase/firestore";
import "../index.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({});
  const [social, setSocial] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      const cached = localStorage.getItem("portfolio_settings_cache");
      if (cached) {
        const { data } = JSON.parse(cached);
        setProfile(data?.profile || {});
        setSocial(data?.social || {});
      }

      try {
        const settings = await getSettings();
        setProfile(settings?.profile || {});
        setSocial(settings?.social || {});
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "contacts"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <Navbar />
      
      <main style={{ paddingTop: '100px' }}>
        {/* Header */}
        <section className="section" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="container reveal">
            <span className="hero-tag">Let's Talk</span>
            <h1 className="hero-headline">Start a Conversation</h1>
            <p className="hero-subtitle">
              Have a question, a project idea, or just want to connect? I am always open to new opportunities and creative collaborations.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '5rem' }}>
              
              {/* Info Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '-0.02em' }}>Contact Details</h3>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', color: 'var(--primary)' }}>Email me</p>
                    <a href={`mailto:${profile.email}`} style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '700', textDecoration: 'none', wordBreak: 'break-all' }}>{profile.email || "hello@example.com"}</a>
                  </div>
                  
                  {profile.phone && (
                    <div style={{ marginBottom: '2rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', color: 'var(--primary)' }}>Call me</p>
                      <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '700' }}>{profile.phone}</p>
                    </div>
                  )}

                  <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '800' }}>Social presence</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {Object.entries(social).map(([platform, url]) => (
                        url && (
                          <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', textTransform: 'capitalize', borderRadius: '10px' }}>
                            {platform}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div>
                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '4rem' }}>
                  <h2 style={{ marginBottom: '2.5rem', fontSize: '2rem' }}>Send a Message</h2>
                  
                  {success && (
                    <div style={{ padding: '1.5rem', borderRadius: 'var(--radius)', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', marginBottom: '3rem', textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>
                      ✨ Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <div className="input-field">
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Your Name</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="What is your name?" required />
                    </div>
                    <div className="input-field">
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" required />
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" required />
                  </div>

                  <div style={{ marginBottom: '3rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows="6" placeholder="Tell me more about your project goals..." required />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
                    {loading ? "Sending Message..." : "Propel Message"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
      
      <Footer />
    </>
  );
}
