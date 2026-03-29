import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardWork from "../components/CardWork";
import { getWorks } from "../firebase/firestore";
import "../index.css";

export default function Works() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchWorks = async () => {
      const cachedWorks = localStorage.getItem("portfolio_works_cache");
      if (cachedWorks) {
        const { data } = JSON.parse(cachedWorks);
        setWorks(data);
      }

      try {
        const list = await getWorks();
        setWorks(list);
      } catch (err) {
        console.error("Error fetching works:", err);
      }
      setLoading(false);
    };
    fetchWorks();
  }, []);

  const filteredWorks =
    filter === "all"
      ? works
      : works.filter(
          (work) =>
            work.techStack &&
            Array.isArray(work.techStack) &&
            work.techStack.some((tech) =>
              tech.toLowerCase().includes(filter.toLowerCase()),
            ),
        );

  const allTechs = Array.from(
    new Set(
      works.flatMap((work) =>
        Array.isArray(work.techStack) ? work.techStack : [],
      ),
    ),
  ).sort();

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
            <span className="hero-tag">Portfolio</span>
            <h1 className="hero-headline">Creative Case Studies</h1>
            <p className="hero-subtitle">
              A deep dive into my projects, ranging from large-scale applications to small experimental prototypes.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section">
          <div className="container">
            {/* Filter Section */}
            {allTechs.length > 0 && (
              <div style={{ marginBottom: "5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--text-main)", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Filter by Technology
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "btn btn-primary" : "btn btn-outline"}
                    style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}
                  >
                    Show All
                  </button>
                  {allTechs.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setFilter(tech)}
                      className={filter === tech ? "btn btn-primary" : "btn btn-outline"}
                      style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Works Grid */}
            {works.length === 0 && loading ? (
              <div className="card-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ height: '450px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }}></div>
                ))}
              </div>
            ) : filteredWorks.length === 0 ? (
              <div className="glass-card" style={{ textAlign: "center", padding: "6rem 2rem" }}>
                 <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>📭</div>
                <h2 style={{ marginBottom: '1rem' }}>Zero results found</h2>
                <p style={{ color: "var(--text-muted)", fontSize: '1.1rem' }}>
                  {filter === "all"
                    ? "Currently brainstorming new ideas for future projects."
                    : `No projects found tagged with "${filter}".`}
                </p>
                {filter !== "all" && (
                  <button onClick={() => setFilter("all")} className="btn btn-primary" style={{ marginTop: '2.5rem' }}>
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="card-grid">
                {filteredWorks.map((work) => (
                  <CardWork key={work.id} work={work} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
