import React from "react";

/**
 * ComingSoonBanner
 * Drop-in replacement for any Pro/Business gated feature.
 *
 * Props:
 *   featureName  {string}  – e.g. "Advanced Analytics"
 *   requiredTier {string}  – "pro" | "business"  (default "pro")
 *   height       {string}  – CSS height of the placeholder (default "100%")
 */
export default function ComingSoonBanner({
  featureName = "This feature",
  requiredTier = "pro",
  height = "100%",
}) {
  const label = requiredTier === "business" ? "Business" : "Pro";
  const emoji = requiredTier === "business" ? "🏢" : "⚡";

  return (
    <div style={{ ...styles.wrapper, height }}>
      <div style={styles.card}>
        <span style={styles.badge}>
          {emoji} {label}
        </span>
        <p style={styles.title}>{featureName}</p>
        <p style={styles.sub}>Coming soon</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "28px 36px",
    borderRadius: "14px",
    border: "1.5px dashed var(--border, #d1d5db)",
    background: "var(--bg-card, rgba(255,255,255,0.04))",
    textAlign: "center",
    userSelect: "none",
  },
  badge: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--accent, #6366f1)",
    background: "var(--accent-subtle, rgba(99,102,241,0.10))",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary, #111827)",
  },
  sub: {
    margin: 0,
    fontSize: "12px",
    color: "var(--text-muted, #9ca3af)",
  },
};
