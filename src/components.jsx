import React from 'react';
// ── subcomponents ──────────────────────────────────────────────────────────

// ── LinkPath ──────────────────────────────────────────────────────────────
export function LinkPath({ link, color, onHover, hovered, colX }) {
  const { sx, tx, sy0, sy1, ty0, ty1 } = link;
  const mx  = (sx + tx) / 2;
  const key = link.source + "-" + link.target;
  // Standard bezier ribbon
  const d = `M${sx},${sy0} C${mx},${sy0} ${mx},${ty0} ${tx},${ty0} L${tx},${ty1} C${mx},${ty1} ${mx},${sy1} ${sx},${sy1} Z`;
  return (
    <path d={d} fill={color} opacity={hovered === key ? 0.6 : 0.3}
      style={{ transition: "opacity 0.15s", cursor: "pointer" }}
      onMouseEnter={() => onHover(key)} onMouseLeave={() => onHover(null)} />
  );
}

// ── ItemRow ───────────────────────────────────────────────────────────────
export function ItemRow({ item, accent, onLabel, onValue, onRemove, T }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
      <div style={{ width: 3, height: 34, borderRadius: 2, background: accent, flexShrink: 0 }} />
      <input value={item.label} onChange={e => onLabel(e.target.value)}
        style={{ flex: 1, minWidth: 0, background: T.bgInput, border: `1px solid ${T.borderInput}`,
          borderRadius: 6, color: T.textNode, fontSize: 15, padding: "4px 7px", outline: "none" }} />
      <div style={{ position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)",
          color: T.textDim, fontSize: 15, pointerEvents: "none" }}>$</span>
        <input type="number" min="0" value={item.value} onChange={e => onValue(e.target.value)}
          onFocus={e => e.target.select()}
          style={{ width: 86, background: T.bgInput, border: `1px solid ${T.borderInput}`,
            borderRadius: 6, color: T.textVal, fontSize: 15, padding: "4px 6px 4px 18px", outline: "none" }} />
      </div>
      <button onClick={onRemove}
        style={{ background: "none", border: "none", color: T.textFaint, cursor: "pointer", fontSize: 19, padding: "0 2px", lineHeight: 1 }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ff6b6b")}
        onMouseLeave={e => (e.currentTarget.style.color = T.textFaint)}>×</button>
    </div>
  );
}

// ── SankeyNode ────────────────────────────────────────────────────────────
export function SankeyNode({ n, nodeWidth, T, GROUP_COLORS, grand, totalExp, fmt, pct, startDrag, isDark, hoveredKey }) {
  // No local state — label visibility driven purely by ribbon hover from parent
  const isSurplus  = n.id === "__surplus";
  const isDeficit  = n.id === "__deficit_cat";
  const isPhantom  = n.id === "__surplus_phantom"
    || n.id === "__deficit_phantom"
    || n.id === "__carryover_phantom"
    || n.id === "__col0_deficit_phantom"
    || n.id === "__col1_deficit_phantom"
    || n.id === "__col1_surplus_phantom"
    || n.id === "__col3_surplus_phantom"
    || n.id === "__col3_deficit_phantom"
    || n.id === "__deficit_src_phantom";

  if (isPhantom) return <g key={n.id} />;
  if (!isFinite(n.y) || !isFinite(n.h)) return <g key={n.id} />;

  const c = isDeficit
    ? GROUP_COLORS.deficit
    : isSurplus
      ? GROUP_COLORS.surplus
      : n.color || GROUP_COLORS[n.group] || GROUP_COLORS.category;

  const nw      = n.w || nodeWidth;
  const right   = n.col <= 1;
  const my      = n.y + n.h / 2;
  const fs      = Math.min(14, Math.max(9, n.h * 0.30));
  const fs2     = Math.max(9, fs - 1);
  const fs3     = Math.max(8, fs - 2);
  const valCol  = T.textNode;
  const sepCol  = isDark ? "#ffffff" : "#000000";

  // Col0, col4: hover-only labels
  const isHoverOnly = n.col === 0 || n.col === 4;
  // Col1, col3: always show % only
  const isPctOnly = n.col === 1 || n.col === 3;

  // hoveredKey is "sourceId-targetId" — show label if this node is source or target
  const isRibbonHovered = hoveredKey && (
    hoveredKey.startsWith(n.id + "-") ||
    hoveredKey.endsWith("-" + n.id)
  );
  const showLabel = isHoverOnly ? !!isRibbonHovered : true;

  const rect = (
    <>
      <rect x={n.x} y={n.y} width={nw} height={n.h} fill={c} rx={3}
        style={{ filter: `drop-shadow(0 0 3px ${c}88)`, cursor: "ew-resize" }}
        onMouseDown={e => startDrag(n.col, e)} onTouchStart={e => startDrag(n.col, e)}
        />
      <rect x={n.x - 6} y={n.y} width={nw + 12} height={n.h} fill="transparent"
        style={{ cursor: "ew-resize" }}
        onMouseDown={e => startDrag(n.col, e)} onTouchStart={e => startDrag(n.col, e)} />
    </>
  );

  // Col2: show label + total value only, no %
  if (n.col === 2) {
    const lxLeft  = n.x - 6;
    const lxRight = n.x + nw + 6;
    return (
      <g key={n.id}>
        {rect}
        <text x={lxLeft} y={my + fs/2} textAnchor="end" fontSize={fs} style={{pointerEvents:"none"}}>
          <tspan fill={valCol} fontWeight={600}>Total Income</tspan>
          <tspan fill={valCol} fontSize={fs2}> ${fmt(grand)}</tspan>
        </text>
        <text x={lxRight} y={my + fs/2} textAnchor="start" fontSize={fs} style={{pointerEvents:"none"}}>
          <tspan fill={valCol} fontWeight={600}>Total Expenses</tspan>
          <tspan fill={valCol} fontSize={fs2}> ${fmt(totalExp)}</tspan>
        </text>
      </g>
    );
  }

  const lx     = right ? n.x + nw + 6 : n.x - 6;
  const anchor = right ? "start" : "end";

  // Col1 and col3: show label + % only on one line
  if (isPctOnly) {
    return (
      <g key={n.id}>
        {rect}
        <text x={lx} y={my + fs/2} textAnchor={anchor} fontSize={fs} style={{pointerEvents:"none"}}>
          <tspan fill={valCol} fontWeight={600}>{n.label}</tspan>
          <tspan fill={valCol} fontSize={fs2}> {pct(n.value, grand)}</tspan>
        </text>
      </g>
    );
  }

  // Col0, col4: hover-only full label + value / %
  return (
    <g key={n.id}>
      {rect}
      {showLabel && (
        <>
          <text x={lx} y={my + fs/2} textAnchor={anchor} fontSize={fs} style={{pointerEvents:"none"}}>
            <tspan fill={valCol} fontWeight={600}>{n.label}</tspan>
            <tspan fill={valCol} fontSize={fs2}> ${fmt(n.value)}</tspan>
            <tspan fill={sepCol} fontSize={fs3}> / </tspan>
            <tspan fill={sepCol} fontSize={fs3}>{pct(n.value, grand)}</tspan>
          </text>
        </>
      )}
    </g>
  );
}
