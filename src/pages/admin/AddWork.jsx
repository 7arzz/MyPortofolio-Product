import React, { useState, useEffect } from "react";
import { addWork } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import "../../index.css";

export default function AddWork() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageURL: "",
    category: "Web Development",
    techStack: "",
    link: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsub();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.imageURL) {
      alert("Please fill all required fields! (Title, Description, Image)");
      return;
    }

    setLoading(true);
    try {
      await addWork({
        ...formData,
        techStack: formData.techStack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        createdAt: new Date(),
      });
      alert("✅ Project successfully added!");
      navigate("/admin/dashboard");
    } catch (error) {
      alert("❌ Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '4rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <span className="card-tag">NEW PROJECT</span>
            <h1 style={{ marginTop: '0.75rem' }}>Add New Work</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="btn btn-outline">Discard</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Project Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="My Creative Project" required />
            </div>
            <div className="input-group">
              <label>Category / Specialization</label>
              <input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Web Development" />
            </div>
          </div>

          <div className="input-group">
            <label>Detailed Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Explain the project goal, your role, and the outcome..." required />
          </div>

          <div className="input-group">
            <label>Image URL * (Display Photo)</label>
            <input name="imageURL" value={formData.imageURL} onChange={handleChange} placeholder="https://example.com/project-thumb.jpg" required />
            {formData.imageURL && (
              <div style={{ marginTop: '1rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', height: '180px' }}>
                <img src={formData.imageURL} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Technologies Used</label>
            <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, Firebase (comma separated)" />
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Separate items with commas</p>
          </div>

          <div className="input-group">
            <label>Project Live Link / Case Study</label>
            <input name="link" value={formData.link} onChange={handleChange} placeholder="https://myproj.com" />
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              {loading ? "Creating Entry..." : "Publish Project"}
            </button>
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="btn btn-outline" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
