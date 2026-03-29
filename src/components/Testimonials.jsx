import React, { useEffect, useState } from "react";
import { getSettings } from "../firebase/firestore";

export default function Testimonials({ testimonials: propTestimonials }) {
  const [settingsTestimonials, setSettingsTestimonials] = useState([]);

  useEffect(() => {
    if (!propTestimonials) {
      const fetchSettings = async () => {
        const settings = await getSettings();
        if (settings?.testimonials) {
          setSettingsTestimonials(settings.testimonials);
        }
      };
      fetchSettings();
    }
  }, [propTestimonials]);

  const defaultTestimonials = [
    {
      name: "John Smith",
      role: "CEO, Tech Startup",
      text: "Exceptional work! The portfolio website exceeded all expectations. Professional, clean design with amazing user experience.",
      rating: 5,
      initials: "JS",
    },
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      text: "Fantastic attention to detail. The developer understood exactly what we needed and delivered beyond our expectations.",
      rating: 5,
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Design Lead",
      text: "Great collaboration and technical skills. Transformed our vision into a beautiful, functional reality seamlessly.",
      rating: 5,
      initials: "MC",
    },
  ];

  const testimonialsList = propTestimonials || (settingsTestimonials.length > 0 ? settingsTestimonials : defaultTestimonials);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "3rem",
      }}
    >
      {testimonialsList.map((testimonial, idx) => (
        <div
          key={idx}
          className="glass-card"
          style={{
            padding: "3.5rem 2.5rem 2.5rem 2.5rem",
            position: "relative",
          }}
        >
          {/* Quote Icon */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "2rem",
              fontSize: "4rem",
              color: "var(--primary)",
              opacity: 0.3,
              fontFamily: "serif",
            }}
          >
            "
          </div>

          <div
            style={{
              fontSize: "1rem",
              color: "#fbbf24",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.25rem",
            }}
          >
            {"★★★★★".split("").map((s, i) => (
              <span
                key={i}
                style={{ opacity: i < (testimonial.rating || 5) ? 1 : 0.2 }}
              >
                {s}
              </span>
            ))}
          </div>

          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "var(--text-main)",
              marginBottom: "2.5rem",
              fontStyle: "italic",
              opacity: 0.9,
            }}
          >
            "{testimonial.text}"
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "1.2rem",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {testimonial.initials || (testimonial.name ? testimonial.name.charAt(0) : "T")}
            </div>
            <div>
              <h4
                style={{
                  fontSize: "1.15rem",
                  marginBottom: "0.2rem",
                  fontWeight: "800",
                }}
              >
                {testimonial.name}
              </h4>
              <p
                style={{
                  color: "var(--text-dim)",
                  fontSize: "0.85rem",
                  marginBottom: 0,
                  fontWeight: "600",
                }}
              >
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
