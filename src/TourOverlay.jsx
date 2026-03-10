import { useState, useEffect } from "react";

const TOUR_KEY = "cf_tour_done";

// 8 steps total
const STEPS = [
  {
    id: "backup-btns",
    title: "Backup, Restore & Share",
    desc: "Save your data as a JSON file, restore from a previous backup, or copy a shareable link.",
    icon: "💾",
    placement: "below-right",   // below the button group, right-aligned
  },
  {
    id: "settings-btns",
    title: "Settings",
    desc: "Sign out, switch between light and dark mode, or change the display language.",
    icon: "⚙️",
    placement: "below-right",   // below the button group, right-aligned
  },
  {
    id: "month-strip",
    title: "Navigate months",
    desc: "Click any month to view or edit it. Use the arrows to jump between months with data.",
    icon: "📅",
    placement: "below-center",  // below the month strip, centered
  },
  {
    id: "svg-area",
    title: "Your money flow",
    desc: "This Sankey diagram shows exactly where your money comes from and where it goes — every single month.",
    icon: "🌊",
    placement: "left-middle-screen", // fixed left side, vertically centred in viewport
  },
  {
    id: "col2-node",
    title: "Income vs Expenses",
    desc: "The center column shows your total income on the left and total expenses on the right.",
    icon: "⚖️",
    placement: "left-middle-screen",
  },
  {
    id: "ribbon-hover",
    title: "Hover to explore",
    desc: "Hover over any ribbon or node to highlight its full chain and see detailed flow information.",
    icon: "✨",
    placement: "left-middle-screen",
  },
  {
    id: "surplus-node",
    title: "Surplus & Deficit",
    desc: "Quick view of financial data for the selected month.",
    icon: "💚",
    placement: "above-center",  // above the tooltipBar, horizontally centered on it
  },
  {
    id: "editor",
    title: "Edit your data",
    desc: "Add, edit, or remove income sources and expenses here. The diagram updates live as you type.",
    icon: "✏️",
    placement: "left-middle",   // left side, vertically centred on editor
  },
];

export default function TourOverlay({
  backupBtnsRef, settingsBtnsRef,
  monthStripRef, svgRef, tooltipBarRef, editorRef,
  darkMode, onDone,
}) {
  const [step, setStep]               = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tooltipPos, setTooltipPos]   = useState({ top: 80, left: 24 });
  const [visible, setVisible]         = useState(false);
  const [exiting, setExiting]         = useState(false);

  const current = STEPS[step];
  const TIP_W   = 320;
  const PAD     = 14;

  const getSpotlightEl = (id) => {
    if (id === "backup-btns")   return backupBtnsRef?.current;
    if (id === "settings-btns") return settingsBtnsRef?.current;
    if (id === "month-strip")   return monthStripRef?.current;
    if (id === "tooltip-bar")   return tooltipBarRef?.current;
    if (id === "surplus-node")  return tooltipBarRef?.current;
    if (id === "editor")        return editorRef?.current;
    return svgRef?.current;
  };

  const computePositions = () => {
    const el = getSpotlightEl(current.id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpotlightRect(r);

    if (current.placement === "below-right") {
      // Below the element, right-aligned to it, clamped inside viewport
      const left = Math.min(Math.max(r.right - TIP_W, 12), window.innerWidth - TIP_W - 12);
      setTooltipPos({ top: r.bottom + PAD, left });

    } else if (current.placement === "below-center") {
      // Below the element, horizontally centred on it
      const left = Math.min(Math.max(r.left + r.width / 2 - TIP_W / 2, 12), window.innerWidth - TIP_W - 12);
      setTooltipPos({ top: r.bottom + PAD, left });

    } else if (current.placement === "left-middle-screen") {
      // Fixed left side, vertically centred in the visible viewport (not the element)
      const tipH = 230;
      setTooltipPos({ top: Math.max((window.innerHeight - tipH) / 2, 20), left: 24 });

    } else if (current.placement === "above-center") {
      // Above the element, horizontally centred on it
      const tipH = 240;
      const left = Math.min(Math.max(r.left + r.width / 2 - TIP_W / 2, 12), window.innerWidth - TIP_W - 12);
      setTooltipPos({ top: Math.max(r.top - tipH - PAD, 12), left });

    } else if (current.placement === "left-middle") {
      // Left side, vertically centred on the editor card
      const centreY = r.top + r.height / 2;
      const tipH = 220;
      setTooltipPos({
        top:  Math.max(Math.min(centreY - tipH / 2, window.innerHeight - tipH - 20), 20),
        left: 24,
      });
    }
  };

  useEffect(() => {
    const el = getSpotlightEl(current.id);

    if (current.placement === "left-middle") {
      // Scroll editor into view first, then measure
      if (editorRef?.current) editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const t = setTimeout(computePositions, 500);
      return () => clearTimeout(t);
    }

    if (current.placement === "above-center") {
      // Scroll tooltipBar into view, then position tooltip above it
      if (el) el.scrollIntoView({ behavior: "smooth", block: "end" });
      const t = setTimeout(computePositions, 450);
      return () => clearTimeout(t);
    }

    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const t = setTimeout(computePositions, 220);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleDone();
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleDone = () => {
    setExiting(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      localStorage.setItem(TOUR_KEY, "1");
      onDone();
    }, 400);
  };

  const progress  = ((step + 1) / STEPS.length) * 100;
  const spotlight = spotlightRect ? {
    x: spotlightRect.left - 6, y: spotlightRect.top - 6,
    w: spotlightRect.width + 12, h: spotlightRect.height + 12,
  } : null;

  const bg        = darkMode ? "#0f0f1a" : "#ffffff";
  const border    = darkMode ? "#2e2b50" : "#ddd8f5";
  const text      = darkMode ? "#d4d4f7" : "#2a2850";
  const textMuted = darkMode ? "#6b6b8a" : "#7070a0";
  const accent    = "#7c3aed";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      opacity: visible && !exiting ? 1 : 0,
      transition: "opacity 0.4s ease",
      pointerEvents: exiting ? "none" : "auto",
    }}>
      {/* Backdrop + spotlight */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlight && <rect x={spotlight.x} y={spotlight.y} width={spotlight.w} height={spotlight.h} rx={10} fill="black" />}
          </mask>
        </defs>
        <rect width="100%" height="100%"
          fill={darkMode ? "rgba(5,3,15,0.78)" : "rgba(20,10,50,0.55)"}
          mask="url(#spotlight-mask)" />
        {spotlight && (
          <rect x={spotlight.x} y={spotlight.y} width={spotlight.w} height={spotlight.h}
            rx={10} fill="none" stroke="#7c3aed" strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.6))" }} />
        )}
      </svg>

      {/* Tooltip card */}
      <div style={{
        position: "fixed",
        top: tooltipPos.top, left: tooltipPos.left,
        width: TIP_W,
        background: bg, border: `1px solid ${border}`, borderRadius: 14,
        padding: "20px 22px",
        boxShadow: darkMode
          ? "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)"
          : "0 24px 60px rgba(79,70,229,0.15), 0 0 0 1px rgba(124,58,237,0.1)",
        transition: "top 0.35s ease, left 0.35s ease",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        zIndex: 10000,
      }}>
        {/* Dots + skip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6, height: 6, borderRadius: 3,
                background: i === step ? accent : i < step ? `${accent}66` : (darkMode ? "#2e2b50" : "#ddd8f5"),
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <button onClick={handleDone} style={{
            background: "none", border: "none", color: textMuted,
            fontSize: 12, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit",
          }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = textMuted}
          >Skip tour</button>
        </div>

        {/* Icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>{current.icon}</span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: text, letterSpacing: "-0.02em" }}>
            {current.title}
          </h3>
        </div>

        {/* Desc */}
        <p style={{ margin: "0 0 18px", fontSize: 13.5, color: textMuted, lineHeight: 1.65 }}>
          {current.desc}
        </p>

        {/* Back + progress bar + Next */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={handleBack} disabled={step === 0} style={{
            background: "none", border: `1px solid ${border}`, borderRadius: 8,
            padding: "8px 14px",
            color: step === 0 ? (darkMode ? "#2e2b50" : "#ddd8f5") : textMuted,
            fontSize: 13, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { if (step > 0) e.currentTarget.style.color = text; }}
            onMouseLeave={e => { e.currentTarget.style.color = step === 0 ? (darkMode ? "#2e2b50" : "#ddd8f5") : textMuted; }}
          >← Back</button>

          <div style={{ flex: 1, height: 3, borderRadius: 2, background: darkMode ? "#2e2b50" : "#ede9fc", overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: `linear-gradient(90deg, ${accent}, #a78bfa)`,
              borderRadius: 2, transition: "width 0.4s ease",
            }} />
          </div>

          <button onClick={handleNext} style={{
            background: accent, border: "none", borderRadius: 8,
            padding: "8px 18px", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: "0.02em",
            boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
            transition: "opacity 0.15s, transform 0.15s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >{step < STEPS.length - 1 ? "Next →" : "Let's go! 🚀"}</button>
        </div>
      </div>
    </div>
  );
}

export function shouldShowTour() {
  return !localStorage.getItem(TOUR_KEY);
}
