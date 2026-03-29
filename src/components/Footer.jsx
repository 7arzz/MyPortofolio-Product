import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "../firebase/firestore";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const footerData = settings?.footer || {
    copyright: `© ${new Date().getFullYear()} Portfolio. All rights reserved.`,
    tagline:
      "Building the next generation of digital experiences with precision and passion.",
  };

  const socialData = settings?.social || {};
  const profileName = settings?.profile?.name || "Portfolio";

  return (
    <footer
      style={{
        background: "rgba(255,255,255,0.01)",
        borderTop: "1px solid var(--border)",
        padding: "8rem 0 4rem 0",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "5rem",
            marginBottom: "6rem",
          }}
        >
          {/* Brand Section */}
          <div style={{ maxWidth: "400px" }}>
            <Link
              to="/"
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "var(--text-main)",
                textDecoration: "none",
                display: "block",
                marginBottom: "2rem",
              }}
            >
              <span className="text-gradient">{profileName}</span>
            </Link>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "var(--text-muted)",
              }}
            >
              {footerData.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: "1.25rem",
                marginBottom: "2rem",
                fontWeight: "800",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "1rem" }}>
                <Link
                  to="/"
                  style={{
                    color: "var(--text-dim)",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "var(--transition)",
                  }}
                >
                  Home Overview
                </Link>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <Link
                  to="/works"
                  style={{
                    color: "var(--text-dim)",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "var(--transition)",
                  }}
                >
                  Case Studies
                </Link>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <Link
                  to="/contact"
                  style={{
                    color: "var(--text-dim)",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "var(--transition)",
                  }}
                >
                  Contact Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4
              style={{
                fontSize: "1.25rem",
                marginBottom: "2rem",
                fontWeight: "800",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Social presence
            </h4>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {Object.entries(socialData).map(
                ([platform, url]) =>
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{
                        padding: "0.6rem 1.25rem",
                        fontSize: "0.85rem",
                        textTransform: "capitalize",
                        borderRadius: "10px",
                      }}
                    >
                      {platform}
                    </a>
                  ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            paddingTop: "3rem",
          }}
        >
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-dim)",
              fontWeight: "600",
            }}
          >
            {footerData.copyright}
          </p>
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            <Link
              to="/admin"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-dim)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Admin Dashboard
            </Link>
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--text-dim)",
                fontWeight: "600",
              }}
            >
              Ready for a{" "}
              <span style={{ color: "var(--primary)" }}>Growth</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
