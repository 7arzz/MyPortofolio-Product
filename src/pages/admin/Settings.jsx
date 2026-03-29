import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      // ⚡ Try immediate cache load
      const cached = localStorage.getItem("portfolio_settings_cache");
      if (cached) {
        setSettings(JSON.parse(cached).data);
      }

      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      const updatedSettings = { ...settings, [section]: data };
      await updateSettings(updatedSettings);
      setSettings(updatedSettings);
      alert("✅ Changes saved successfully!");
    } catch (error) {
      alert("❌ Error saving settings: " + error.message);
    }
    setSaving(false);
  };

  if (loading && !settings) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem', animation: 'pulse 1.5s infinite' }}>
          Searching for your site configuration...
        </p>
      </div>
    );
  }

  // FORCE INITIALIZE FALLBACK
  const handleForceInit = async () => {
    setLoading(true);
    try {
      const def = await initializeSettings();
      setSettings(def);
      alert("✅ Default settings created!");
    } catch (err) {
      alert("❌ Critical Error: " + err.message);
    }
    setLoading(false);
  };

  if (!settings) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'var(--bg-main)', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Site configuration not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          This can happen if your database is empty or the connection timed out. 
          Tap below to initialize your site with default settings.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleForceInit} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>Initialize Defaults</button>
          <button onClick={() => window.location.reload()} className="btn btn-outline">Retry Connection</button>
        </div>
        <p style={{ fontSize: '0.8rem', mt: '2rem', color: 'var(--text-muted)' }}>Connection issue? Check your internet & Firebase rules.</p>
      </div>
    );
  }

  const tabs = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "hero", icon: "🚀", label: "Hero Content" },
    { id: "stack", icon: "🛠️", label: "Tech Stack" },
    { id: "testimonials", icon: "⭐️", label: "Testimonials" },
    { id: "social", icon: "🔗", label: "Social Links" },
    { id: "footer", icon: "🏢", label: "Footer Info" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Portfolio Settings</h1>
            <p style={{ color: 'var(--text-muted)' }}>Customize your site presence and configuration.</p>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }}>Back</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem', flexWrap: 'wrap' }}>
          {/* Tabs Sidebar */}
          <aside>
            <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius)',
                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--text-main)',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Settings Content */}
          <main>
            {activeTab === "profile" && (
              <ProfileSection settings={settings.profile} onSave={(data) => handleSave("profile", data)} saving={saving} />
            )}
            {activeTab === "hero" && (
              <HeroSection settings={settings.hero} onSave={(data) => handleSave("hero", data)} saving={saving} />
            )}
            {activeTab === "stack" && (
              <StackSection settings={settings.skills} onSave={(data) => handleSave("skills", data)} saving={saving} />
            )}
            {activeTab === "testimonials" && (
              <TestimonialsSection settings={settings.testimonials} onSave={(data) => handleSave("testimonials", data)} saving={saving} />
            )}
            {activeTab === "social" && (
              <SocialSection settings={settings.social} onSave={(data) => handleSave("social", data)} saving={saving} />
            )}
            {activeTab === "footer" && (
              <FooterSection settings={settings.footer} onSave={(data) => handleSave("footer", data)} saving={saving} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ------------------------
// SECTION COMPONENTS
// ------------------------

function StackSection({ settings, onSave, saving }) {
  const [list, setList] = useState(settings || []);

  const handleAdd = () => {
    setList([...list, { name: "", level: "", icon: "⚡" }]);
  };

  const handleRemove = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Manage Tech Stack</h3>
        <button onClick={handleAdd} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Add Skill</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {list.map((item, idx) => (
          <div key={idx} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', position: 'relative' }}>
            <button 
              onClick={() => handleRemove(idx)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.5rem' }}
            >
              ×
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Icon</label>
                <input value={item.icon} onChange={(e) => handleChange(idx, "icon", e.target.value)} placeholder="⚛️" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Skill Name</label>
                <input value={item.name} onChange={(e) => handleChange(idx, "name", e.target.value)} placeholder="React" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Expertise Level</label>
                <input value={item.level} onChange={(e) => handleChange(idx, "level", e.target.value)} placeholder="Expert" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => onSave(list)} disabled={saving} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
        {saving ? "Saving Stack..." : "Update Tech Stack"}
      </button>
    </div>
  );
}

function TestimonialsSection({ settings, onSave, saving }) {
  const [list, setList] = useState(settings || []);

  const handleAdd = () => {
    setList([...list, { name: "", role: "", text: "", rating: 5 }]);
  };

  const handleRemove = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Manage Testimonials</h3>
        <button onClick={handleAdd} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Add New</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {list.map((item, idx) => (
          <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', position: 'relative' }}>
            <button 
              onClick={() => handleRemove(idx)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.5rem' }}
            >
              ×
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Name</label>
                <input value={item.name} onChange={(e) => handleChange(idx, "name", e.target.value)} placeholder="Client Name" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Role / Company</label>
                <input value={item.role} onChange={(e) => handleChange(idx, "role", e.target.value)} placeholder="CEO at Tech" />
              </div>
            </div>

            <div className="input-group">
                <label>Rating (1-5)</label>
                <select value={item.rating || 5} onChange={(e) => handleChange(idx, "rating", parseInt(e.target.value))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Testimonial Text</label>
              <textarea rows="3" value={item.text} onChange={(e) => handleChange(idx, "text", e.target.value)} placeholder="Write the feedback here..." />
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
         <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No testimonials added yet.</p>
      )}

      <button onClick={() => onSave(list)} disabled={saving} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
        {saving ? "Saving Testimonials..." : "Save All Testimonials"}
      </button>
    </div>
  );
}

function ProfileSection({ settings, onSave, saving }) {
  const [form, setForm] = useState(settings || {});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '1.5rem' }}>Public Profile</h3>
      <div className="input-group">
        <label>Your Name (Used in Branding)</label>
        <input name="name" value={form.name || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Professional Title</label>
        <input name="title" value={form.title || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Bio (About Me)</label>
        <textarea name="bio" rows="4" value={form.bio || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Contact Email</label>
        <input name="email" type="email" value={form.email || ""} onChange={handleChange} />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
        {saving ? "Saving Changes..." : "Update Profile"}
      </button>
    </div>
  );
}

function HeroSection({ settings, onSave, saving }) {
  const [form, setForm] = useState(settings || {});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '1.5rem' }}>Welcome Section (Hero)</h3>
      <div className="input-group">
        <label>Hero Headline</label>
        <input name="headline" value={form.headline || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Subtitle / Intro</label>
        <textarea name="subtitle" rows="3" value={form.subtitle || ""} onChange={handleChange} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label>CTA Button Text</label>
          <input name="ctaText" value={form.ctaText || ""} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>CTA Target Link</label>
          <input name="ctaLink" value={form.ctaLink || ""} onChange={handleChange} />
        </div>
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
        {saving ? "Updating Hero..." : "Update Hero Section"}
      </button>
    </div>
  );
}

function SocialSection({ settings, onSave, saving }) {
  const [form, setForm] = useState(settings || {});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '1.5rem' }}>Connect Socials</h3>
      <div className="input-group">
        <label>GitHub Profile URL</label>
        <input name="github" value={form.github || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>LinkedIn Profile URL</label>
        <input name="linkedin" value={form.linkedin || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Twitter/X Profile URL</label>
        <input name="twitter" value={form.twitter || ""} onChange={handleChange} />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
        {saving ? "Updating Socials..." : "Update Social Connections"}
      </button>
    </div>
  );
}

function FooterSection({ settings, onSave, saving }) {
  const [form, setForm] = useState(settings || {});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '1.5rem' }}>Footer & Copyright</h3>
      <div className="input-group">
        <label>Copyright Text</label>
        <input name="copyright" value={form.copyright || ""} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label>Brand Tagline</label>
        <input name="tagline" value={form.tagline || ""} onChange={handleChange} />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
        {saving ? "Updating Footer..." : "Update Footer Content"}
      </button>
    </div>
  );
}
