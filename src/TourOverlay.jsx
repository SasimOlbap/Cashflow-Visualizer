import { useState, useEffect, useRef } from "react";

const TOUR_KEY = "cf_tour_done";

const STEPS = [
  {
    id: "month-strip",
    title: "Navigate months",
    desc: "Click any month to view or edit it. Use the arrows to jump between months with data.",
    position: "bottom",
    icon: "📅",
  },
  {
    id: "svg-area",
    title: "Your money flow",
    desc: "This Sankey diagram shows exactly where your money comes from and where it goes — every single month.",
    position: "center",
    icon: "🌊",
  },
  {
    id: "col2-node",
    title: "Income vs Expenses",
    desc: "The center column shows your total income on the left and total expenses on the right.",
    position: "center",
    icon: "⚖️",
  },
  {
    id: "ribbon-hover",
    title: "Hover to explore",
    desc: "Hover over any ribbon or node to highlight its full chain and see detailed flow information.",
    position: "center",
    icon: "✨",
  },
  {
    id: "surplus-node",
    title: "Surplus & Deficit",
    desc: "Green means you saved money this month. Red means you spent more than you earned — it carries over to next month.",
    position: "center",
    icon: "💚",
  },
  {
    id: "tooltip-bar",
    title: "Live summary",
    desc: "Your income, expenses, and surplus or deficit are always visible here at a glance.",
    position: "top",
    icon: "📊",
  },
  {
    id: "editor",
    title: "Edit your data",
    desc: "Add, edit, or remove income sources and expenses here. The diagram updates live as you type.",
    position: "top",
    icon: "✏️",
  },
];

export default function TourOverlay({ monthStripRef, svgRef, tooltipBarRef, editorRef, darkMode, onDone }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const tooltipRef = useRef(null);

  const current = STEPS[step];

  // Measure target element
  useEffect(() => {
    const measure = () => {
      let el = null;
      if (current.id === "month-strip" && monthStripRef?.current) el = monthStripRef.current;
      else if (current.id === "tooltip-bar" && tooltipBarRef?.current) el = tooltipBarRef.current;
      else if (current.id === "editor" && editorRef?.current) el = editorRef.current;
      else if (svgRef?.current) el = svgRef.current;

      if (el) {
        // Scroll element into view smoothly
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => setRect(el.getBoundingClientRect()), 150);
      }
    };
    measure();
    setTimeout(measure, 50);
  }, [step, monthStripRef, svgRef, tooltipBarRef, editorRef, current.id]);

  // Fade in on mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleDone();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleDone = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.setItem(TOUR_KEY, "1");
      onDone();
    }, 400);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  // Tooltip position
  const getTooltipStyle = () => {
    if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const pad = 16;
    const tipW = 320;
    const tipH = 210;
    const pos = current.position;

    if (pos === "bottom") {
      return {
        top: rect.bottom + pad,
        left: Math.min(
          Math.max(rect.left + rect.width / 2 - tipW / 2, 12),
          window.innerWidth - tipW - 12
        ),
        width: tipW,
      };
    }
    if (pos === "top") {
      return {
        top: Math.max(rect.top - tipH - pad, 12),
        left: Math.min(
          Math.max(rect.left + rect.width / 2 - tipW / 2, 12),
          window.innerWidth - tipW - 12
        ),
        width: tipW,
      };
    }
    // center — float over the SVG area
    return {
      top: rect.top + rect.height / 2 - tipH / 2,
      left: Math.min(
        Math.max(rect.left + rect.width / 2 - tipW / 2, 12),
        window.innerWidth - tipW - 12
      ),
      width: tipW,
    };
  };

  // Spotlight rect (with padding)
  const spotlight = rect ? {
    x: rect.left - 6,
    y: rect.top - 6,
    w: rect.width + 12,
    h: rect.height + 12,
  } : null;

  const bg = darkMode ? "#0f0f1a" : "#ffffff";
  const border = darkMode ? "#2e2b50" : "#ddd8f5";
  const text = darkMode ? "#d4d4f7" : "#2a2850";
  const textMuted = darkMode ? "#6b6b8a" : "#7070a0";
  const accent = "#7c3aed";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      opacity: visible && !exiting ? 1 : 0,
      transition: "opacity 0.4s ease",
      pointerEvents: exiting ? "none" : "auto",
    }}>
      {/* SVG backdrop with spotlight cutout */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.x} y={spotlight.y}
                width={spotlight.w} height={spotlight.h}
                rx={10} fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%" height="100%"
          fill={darkMode ? "rgba(5,3,15,0.75)" : "rgba(20,10,50,0.55)"}
          mask="url(#spotlight-mask)"
        />
        {/* Spotlight border glow */}
        {spotlight && (
          <rect
            x={spotlight.x} y={spotlight.y}
            width={spotlight.w} height={spotlight.h}
            rx={10} fill="none"
            stroke="#7c3aed" strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.6))" }}
          />
        )}
      </svg>

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          ...getTooltipStyle(),
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: "20px 22px",
          boxShadow: darkMode
            ? "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)"
            : "0 24px 60px rgba(79,70,229,0.15), 0 0 0 1px rgba(124,58,237,0.1)",
          transition: "top 0.3s ease, left 0.3s ease",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        {/* Step indicator + skip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6,
                height: 6, borderRadius: 3,
                background: i === step ? accent : i < step ? `${accent}66` : (darkMode ? "#2e2b50" : "#ddd8f5"),
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <button
            onClick={handleDone}
            style={{
              background: "none", border: "none", color: textMuted,
              fontSize: 12, cursor: "pointer", padding: "2px 6px",
              fontFamily: "inherit", letterSpacing: "0.05em",
            }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = textMuted}
          >
            Skip tour
          </button>
        </div>

        {/* Icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>{current.icon}</span>
          <h3 style={{
            margin: 0, fontSize: 16, fontWeight: 700,
            color: text, letterSpacing: "-0.02em",
          }}>
            {current.title}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          margin: "0 0 18px", fontSize: 13.5, color: textMuted,
          lineHeight: 1.65,
        }}>
          {current.desc}
        </p>

        {/* Progress bar + Back + Next buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              background: "none",
              border: `1px solid ${border}`,
              borderRadius: 8,
              padding: "8px 14px", color: step === 0 ? (darkMode ? "#2e2b50" : "#ddd8f5") : textMuted,
              fontSize: 13, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
              fontFamily: "inherit",
              transition: "color 0.15s, border-color 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (step > 0) e.currentTarget.style.color = text; }}
            onMouseLeave={e => { e.currentTarget.style.color = step === 0 ? (darkMode ? "#2e2b50" : "#ddd8f5") : textMuted; }}
          >
            ← Back
          </button>

          {/* Progress bar */}
          <div style={{
            flex: 1, height: 3, borderRadius: 2,
            background: darkMode ? "#2e2b50" : "#ede9fc",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: `linear-gradient(90deg, ${accent}, #a78bfa)`,
              borderRadius: 2,
              transition: "width 0.4s ease",
            }} />
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            style={{
              background: accent, border: "none", borderRadius: 8,
              padding: "8px 18px", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.02em",
              boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
              transition: "opacity 0.15s, transform 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {step < STEPS.length - 1 ? "Next →" : "Let's go! 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function shouldShowTour() {
  return !localStorage.getItem(TOUR_KEY);
}
