import React, { useEffect, useState } from "react";
import { getWorks, deleteWork, getSettings } from "../../firebase/firestore";
import { logout } from "../../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

export default function Dashboard() {
  const [works, setWorks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [worksData, settingsData] = await Promise.all([
          getWorks(),
          getSettings()
        ]);
        setWorks(worksData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteWork(id);
        setWorks(works.filter((w) => w.id !== id));
      } catch (err) {
        alert("Error deleting work: " + err.message);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar-style Header */}
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
              {settings?.profile?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Admin Dashboard</h1>
              <p style={{ fontSize: '0.75rem', marginBottom: 0 }}>Managing {settings?.profile?.name || 'Portfolio'}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Site</Link>
             <button onClick={handleLogout} className="btn" style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Quick Stats / Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</span>
            <h3 style={{ marginBottom: '0.25rem' }}>{works.length}</h3>
            <p style={{ fontSize: '0.875rem' }}>Total Projects</p>
          </div>
          
          <button onClick={() => navigate("/admin/add")} className="admin-card" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'transparent', transition: 'var(--transition)' }}>
             <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>➕</span>
             <h3 style={{ fontSize: '1.125rem' }}>Add New Project</h3>
             <p style={{ fontSize: '0.875rem' }}>Create a new portfolio item</p>
          </button>

          <button onClick={() => navigate("/admin/settings")} className="admin-card" style={{ cursor: 'pointer', transition: 'var(--transition)' }}>
             <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>⚙️</span>
             <h3 style={{ fontSize: '1.125rem' }}>Site Settings</h3>
             <p style={{ fontSize: '0.875rem' }}>Update profile, hero, & colors</p>
          </button>
        </div>

        {/* Projects List */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Your Projects</h2>
            <Link to="/admin/add" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>+ Create New</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--primary)', fontWeight: '600', animation: 'pulse 2s infinite' }}>Loading your works...</p>
            </div>
          ) : works.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
              <p style={{ marginBottom: '1.5rem' }}>You haven't added any projects yet.</p>
              <button onClick={() => navigate("/admin/add")} className="btn btn-primary">Add Your First Project</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {works.map((work) => (
                <div key={work.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius)', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <img src={work.imageURL} alt={work.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ marginBottom: '0.25rem' }}>{work.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {work.techStack?.slice(0, 3).map((t, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'var(--bg-main)', borderRadius: '4px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => navigate(`/admin/edit/${work.id}`)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(work.id)} className="btn" style={{ background: '#fee2e2', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
