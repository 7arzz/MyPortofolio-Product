import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Skills from "../components/Skills";
import Testimonials from "../components/Testimonials";
import { getWorks, getSettings } from "../firebase/firestore";
import CardWork from "../components/CardWork";
import "../index.css";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [hero, setHero] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedSettings = localStorage.getItem("portfolio_settings_cache");
      const cachedWorks = localStorage.getItem("portfolio_works_cache");
      
      if (cachedSettings) {
        const { data } = JSON.parse(cachedSettings);
        setProfile(data?.profile);
        setHero(data?.hero);
      }
      
      if (cachedWorks) {
        const { data } = JSON.parse(cachedWorks);
        setWorks(data.slice(0, 3));
      }

      try {
        const [settings, worksData] = await Promise.all([
          getSettings(),
          getWorks(),
        ]);

        setProfile(settings?.profile);
        setHero(settings?.hero);
        setWorks(worksData.slice(0, 3));
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const heroData = {
    headline: hero?.headline || "Creative Developer & UI Designer",
    subtitle: hero?.subtitle || "I build high-performance digital products with a focus on aesthetics and user experience. 🚀",
    ctaText: hero?.ctaText || "View My Projects",
    ctaLink: hero?.ctaLink || "/works",
  };

  return (
    <>
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content reveal">
              <span className="hero-tag">
                Available for New Projects
              </span>
              <h1 className="hero-headline">
                {heroData.headline}
              </h1>
              <p className="hero-subtitle">
                {heroData.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <Link to={heroData.ctaLink} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                  {heroData.ctaText}
                </Link>
                <Link to="/contact" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
                  Let's Work Together
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="section" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="container">
             <div className="text-center" style={{ marginBottom: '5rem' }}>
                <span className="card-tag">Stack</span>
                <h2 style={{ marginTop: '1rem' }}>My Technical Expertise</h2>
             </div>
             <Skills />
          </div>
        </section>

        {/* FEATURED WORKS SECTION */}
        <section className="section" id="works">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <span className="card-tag">Portfolio</span>
                <h2 style={{ marginTop: '1rem' }}>Selected Projects</h2>
                <p style={{ maxWidth: '500px', marginTop: '1.25rem', fontSize: '1.1rem' }}>
                  A collection of digital solutions where innovation meets meticulous design.
                </p>
              </div>
              <Link to="/works" className="btn btn-outline">
                Explore All
              </Link>
            </div>

            <div className="card-grid">
              {works.length > 0 ? (
                works.map((work) => <CardWork key={work.id} work={work} />)
              ) : (
                [1,2,3].map(i => (
                  <div key={i} style={{ height: '450px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }}></div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="section" style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '5rem' }}>
              <span className="card-tag">Kind Words</span>
              <h2 style={{ marginTop: '1rem' }}>Client Feedback</h2>
            </div>
            <Testimonials />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="section">
          <div className="container">
            <div className="glass-card" style={{ padding: '6rem 4rem', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Let's build something <span className="text-gradient">remarkable</span>.</h2>
              <p style={{ maxWidth: '650px', margin: '0 auto 3rem auto', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                Have a project in mind or just want to say hi? I'm always open to discussing new ideas and creative collaborations.
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>
                Start a Conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
