import React from "react";

export default function CardWork({ work, onDelete, onEdit, isAdmin = false }) {
  if (!work) return null;

  const handleView = () => {
    if (work.link) {
      window.open(work.link, "_blank");
    }
  };

  return (
    <div className="card">
      <div className="card-image-wrapper">
        {work.imageURL ? (
          <img
            src={work.imageURL}
            alt={work.title}
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-dim)',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Project Preview
          </div>
        )}
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          {work.category && <span className="card-tag">{work.category}</span>}
        </div>
        
        <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{work.title}</h3>
        
        <p style={{ 
          fontSize: '0.95rem', 
          marginBottom: '1.5rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.6'
        }}>
          {work.description}
        </p>

        {/* Tech Stack */}
        {work.techStack && work.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
            {work.techStack.map((tech, idx) => (
              <span key={idx} style={{ 
                fontSize: '0.75rem', 
                padding: '0.4rem 0.8rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontWeight: '700',
                color: 'var(--text-main)',
                letterSpacing: '0.02em'
              }}>
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          {work.link && (
            <button onClick={handleView} className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }}>
              View Case Study
            </button>
          )}

          {isAdmin && (
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
              <button
                onClick={() => onEdit?.(work.id)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '0.6rem' }}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete?.(work.id)}
                className="btn"
                style={{ 
                  flex: 1, 
                  padding: '0.6rem', 
                  background: 'var(--accent)', 
                  color: 'white' 
                }}
              >
                Del
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
