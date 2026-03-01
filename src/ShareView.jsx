import { useState, useEffect, useRef } from "react";
import { buildLayout } from "./buildLayout";
import { LinkPath, SankeyNode } from "./components";
import { darkTheme } from "./theme";
import { useDrag } from "./useDrag";
import { fmt, pct, GROUP_COLORS, LINK_LEFT, LINK_RIGHT, CATS } from "./constants";

export default function ShareView({ month, data, onGetStarted }) {
  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(700);
  const [svgH, setSvgH] = useState(420);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setSvgW(w); setSvgH(Math.max(300, w * 0.55));
    });
    if (svgRef.current) obs.observe(svgRef.current);
    return () => obs.disconnect();
  }, []);

  const T = darkTheme;
  const { colOffsets, startDrag } = useDrag(svgRef, svgW);

  const { income = [], expenses = [] } = data;

  let layoutResult = { nodes: [], links: [], nodeWidth: 14, grand: 0, totalExp: 0, surplus: 0 };
  try { layoutResult = buildLayout(income, expenses, svgW, svgH, colOffsets); } catch {}
  const { nodes, links, nodeWidth, grand, totalExp, surplus } = layoutResult;

  const nodeMapD = {};
  nodes.forEach(n => { nodeMapD[n.id] = n; });
  links.forEach(l => {
    const s = nodeMapD[l.source], t = nodeMapD[l.target];
    if (s && t) { l.sx = s.x + (s.w || nodeWidth); l.tx = t.x; }
  });

  const getLinkColor = link => {
    const col = link.sourceNode?.col ?? 0;
    if (link.source === "__deficit_src" || link.source === "__deficit_agg" ||
        link.target === "__deficit_agg" || (link.target === "__total" && link.source === "__deficit_agg"))
      return "#f87171";
    if (col <= 1) return LINK_LEFT[Math.min(col, 1)];
    if (link.source === "__surplus" || link.target === "__surplus" || link.target === "__surplus_leaf")
      return "#86efac";
    const idx = CATS.findIndex(c => link.source === "__cat_" + c);
    return idx >= 0 ? LINK_RIGHT[idx] : "#c4b5fd";
  };

  const hovLink = hovered ? links.find(l => l.source + "-" + l.target === hovered) : null;

  // Parse month label e.g. "2026-01" → "January 2026"
  const monthLabel = (() => {
    try {
      const [y, m] = month.split("-");
      return new Date(y, m - 1).toLocaleString("default", { month: "long", year: "numeric" });
    } catch { return month; }
  })();

  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.18) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.12) 0%, transparent 50%), #0a0818",
      color: T.text,
      boxSizing: "border-box",
      position: "relative",
    }}>
      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 4 }}>Shared · Cash Flow Visualizer</div>
            <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: "#fff" }}>
              {monthLabel}
            </h1>
          </div>
          <button onClick={onGetStarted} style={{
            background: "#7c3aed", border: "none", borderRadius: 10,
            padding: "10px 20px", color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Try it free →
          </button>
        </div>

        {/* Sankey */}
        <div ref={svgRef} style={{ background: T.bgCard, borderRadius: 14, padding: "12px 8px", border: `1px solid ${T.border}`, marginBottom: 10 }}>
          <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
            {links.map(l => (
              <LinkPath key={l.source + "-" + l.target} link={l} color={getLinkColor(l)} onHover={setHovered} hovered={hovered} />
            ))}
            {nodes.map(n => (
              <SankeyNode key={n.id} n={n} nodeWidth={nodeWidth} T={T}
                GROUP_COLORS={GROUP_COLORS} grand={grand} fmt={fmt} pct={pct} startDrag={startDrag} />
            ))}
          </svg>
        </div>

        {/* Tooltip bar */}
        <div style={{ background: T.bgCard, borderRadius: 10, height: 46, padding: "8px 14px",
          border: `1px solid ${T.border}`, fontSize: 14, color: T.textNode,
          display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
            <span style={{ fontSize: 14, color: T.textMuted }}>Income: <strong style={{ color: "#c4b5fd" }}>${Number(grand).toLocaleString()}</strong></span>
            <span style={{ fontSize: 14, color: T.textMuted }}>Expenses: <strong style={{ color: "#fbcfe8" }}>${Number(totalExp).toLocaleString()}</strong></span>
            <span style={{ fontSize: 14, color: T.textMuted }}>
              {surplus >= 0
                ? <><strong style={{ color: "#86efac" }}>Surplus</strong>{": "}<strong style={{ color: "#86efac" }}>${surplus.toLocaleString()}</strong></>
                : <><strong style={{ color: "#f87171" }}>Deficit</strong>{": "}<strong style={{ color: "#f87171" }}>${Math.abs(surplus).toLocaleString()}</strong></>}
            </span>
          </div>
          <div>
            {hovLink
              ? <span><span style={{ color: T.textDim, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Flow · </span><strong style={{ color: "#c4b5fd" }}>{hovLink.sourceNode.label} → {hovLink.targetNode.label}</strong><span style={{ color: T.textDim }}> · ${hovLink.value.toLocaleString()} ({pct(hovLink.value, grand)})</span></span>
              : <span style={{ color: T.textFaint }}>Hover over an item to see details</span>
            }
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "32px 24px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 10 }}>Cash Flow Visualizer</div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>
            Visualize your own finances
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 20 }}>
            Track your income and expenses with beautiful Sankey diagrams — free forever.
          </p>
          <button onClick={onGetStarted} style={{
            background: "#7c3aed", border: "none", borderRadius: 10,
            padding: "12px 28px", color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}>
            Get Started Free →
          </button>
        </div>

      </div>
    </div>
  );
}
