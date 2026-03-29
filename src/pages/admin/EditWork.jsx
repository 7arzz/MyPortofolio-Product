import React, { useState, useEffect } from "react";
import { updateWork, getWorks } from "../../firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import "../../index.css";

export default function EditWork() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageURL: "",
    category: "Web Development",
    techStack: "",
    link: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const works = await getWorks();
        const work = works.find((w) => w.id === id);
        if (work) {
          setFormData({
            title: work.title || "",
            description: work.description || "",
            imageURL: work.imageURL || "",
            category: work.category || "Web Development",
            techStack: Array.isArray(work.techStack) ? work.techStack.join(", ") : "",
            link: work.link || ""
          });
        } else {
           alert("Project not found!");
           navigate("/admin/dashboard");
        }
      } catch (err) {
        console.error("Error loading project:", err);
      }
      setLoading(false);
    };
    fetchWork();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateWork(id, {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()).filter(t => t),
      });
      alert("✅ Project updated successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      alert("❌ Error: " + error.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem', animation: 'pulse 1.5s infinite' }}>
          Fetching Project Details...
        </p>
      </div>
    );
  }

  return (
     <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '4rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <span className="card-tag">EDITING PROJECT</span>
            <h1 style={{ marginTop: '0.75rem' }}>Update Portfolio Item</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="btn btn-outline">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Project Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Project Name" required />
            </div>
            <div className="input-group">
              <label>Category / Specialization</label>
              <input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Web Development" />
            </div>
          </div>

          <div className="input-group">
            <label>Detailed Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required />
          </div>

          <div className="input-group">
            <label>Image URL *</label>
            <input name="imageURL" value={formData.imageURL} onChange={handleChange} required />
            {formData.imageURL && (
              <div style={{ marginTop: '1rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', height: '180px' }}>
                <img src={formData.imageURL} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Tech Stack</label>
            <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Tailwind, Node.js" />
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Separate items with commas</p>
          </div>

          <div className="input-group">
            <label>Live Project Link</label>
            <input name="link" value={formData.link} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 2 }}>
              {saving ? "Saving Updates..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="btn btn-outline" style={{ flex: 1 }}>
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
