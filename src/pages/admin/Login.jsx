import React, { useState } from "react";
import { login } from "../../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Login failed. Please check your connection.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)', zIndex: 0 }} />

      <div style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 1 }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="card-tag" style={{ marginBottom: '1rem' }}>SECURE ACCESS</span>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Portal</h1>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to manage your site.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: '600' }}>
                {error}
              </div>
            )}

            <div className="input-group">
              <label>Administrator Email</label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Secure Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
            
            <Link to="/" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>
              ← Return to public site
            </Link>
          </form>

          <div style={{ marginTop: '3rem', pt: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
             V 2.0.0 • POWERED BY ANTIGRAVITY ENGINE
          </div>
        </div>
      </div>
    </div>
  );
}
