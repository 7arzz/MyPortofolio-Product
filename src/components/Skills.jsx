import React, { useEffect, useState } from "react";
import { getSettings } from "../firebase/firestore";

export default function Skills({ skills: propSkills }) {
  const [settingsSkills, setSettingsSkills] = useState([]);

  useEffect(() => {
    if (!propSkills) {
      const fetchSettings = async () => {
        const settings = await getSettings();
        if (settings?.skills) {
          setSettingsSkills(settings.skills);
        }
      };
      fetchSettings();
    }
  }, [propSkills]);

  const defaultSkills = [
    { name: "React & Next.js", level: "Senior Architect", icon: "⚛️" },
    { name: "TypeScript / JS", level: "Expert", icon: "📜" },
    { name: "UI/UX & Design", level: "Creative specialist", icon: "🎨" },
    { name: "Performance Opt.", level: "Advanced", icon: "⚡" },
    { name: "Cloud & Ops", level: "Expert", icon: "☁️" },
    { name: "AI Integration", level: "Specialist", icon: "🤖" },
  ];

  const skillsData =
    propSkills ||
    (settingsSkills.length > 0 ? settingsSkills : defaultSkills);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2.5rem",
      }}
    >
      {skillsData.map((skill, idx) => (
        <div
          key={idx}
          className="glass-card"
          style={{
            padding: "2.5rem",
            display: "flex",
            gap: "1.75rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              flexShrink: 0,
              filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))",
            }}
          >
            {skill.icon}
          </div>
          <div>
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              {skill.name}
            </h3>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--primary)",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {skill.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
