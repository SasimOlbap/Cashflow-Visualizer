// ── subcomponents ──────────────────────────────────────────────────────────

// ── LinkPath ──────────────────────────────────────────────────────────────
export function LinkPath({ link, color, onHover, hovered, colX }) {
  const { sx, tx, sy0, sy1, ty0, ty1 } = link;
  const mx  = (sx + tx) / 2;
  const key = link.source + "-" + link.target;
  const isSurplusLink = link.target === "__surplus";
  const isDeficitLink = link.target === "__deficit_agg";
  // surplus: straight col2->col3, curve col3->col4
  const col4x = colX ? colX[4] : tx;
  const swx   = colX ? colX[3] : mx;
  const scmx  = (swx + col4x) / 2;
  // deficit: straight col2->col1, curve col1->col0
  const col0x = colX ? colX[0] : tx;
  const dwx   = colX ? colX[1] : mx;
  const dcmx  = (dwx + col0x) / 2;
  const d = isSurplusLink
    ? `M${sx},${sy0} L${swx},${sy0} C${scmx},${sy0} ${scmx},${ty0} ${col4x},${ty0} L${col4x},${ty1} C${scmx},${ty1} ${scmx},${sy1} ${swx},${sy1} L${sx},${sy1} Z`
    : isDeficitLink
    ? `M${sx},${sy0} L${dwx},${sy0} C${dcmx},${sy0} ${dcmx},${ty0} ${col0x},${ty0} L${col0x},${ty1} C${dcmx},${ty1} ${dcmx},${sy1} ${dwx},${sy1} L${sx},${sy1} Z`
    : `M${sx},${sy0} C${mx},${sy0} ${mx},${ty0} ${tx},${ty0} L${tx},${ty1} C${mx},${ty1} ${mx},${sy1} ${sx},${sy1} Z`;
  return (
    <path d={d} fill={color} opacity={hovered === key ? 0.85 : 0.4}
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
export function SankeyNode({ n, nodeWidth, T, GROUP_COLORS, grand, fmt, pct, startDrag, isDark, nx: nxProp }) {
  const isSurplus = n.id === "__surplus";
  const isDeficit = n.id === "__deficit_agg";
  const c   = isDeficit ? GROUP_COLORS.deficit : isSurplus ? GROUP_COLORS.surplus : GROUP_COLORS[n.group];
  const nw  = n.w || nodeWidth;
  const nx  = nxProp ?? n.x;
  // surplus/deficit render at outer cols, label on outer side
  const right  = isSurplus ? false : isDeficit ? true : n.col <= 1;
  const lx     = right ? nx + nw + 6 : nx - 6;
  const anchor = right ? "start" : "end";
  const my = n.y + n.h / 2;
  const fs = Math.min(14, Math.max(9, n.h * 0.30));
  return (
    <g key={n.id}>
      <rect x={nx} y={n.y} width={nw} height={n.h} fill={c} rx={3}
        style={{ filter: `drop-shadow(0 0 3px ${c}88)`, cursor: "ew-resize" }}
        onMouseDown={e => startDrag(n.col, e)} onTouchStart={e => startDrag(n.col, e)} />
      <rect x={nx - 6} y={n.y} width={nw + 12} height={n.h} fill="transparent"
        style={{ cursor: "ew-resize" }}
        onMouseDown={e => startDrag(n.col, e)} onTouchStart={e => startDrag(n.col, e)} />
      <text x={lx} y={my - 6} textAnchor={anchor} fill={T.textNode} fontSize={fs} fontWeight={600}>{n.label}</text>
      <text x={lx} y={my + 8} textAnchor={anchor} fontSize={Math.max(9, fs - 1)}>
        <tspan fill={T.textNode}>{fmt(n.value)}</tspan>
        <tspan fill={isDark ? "#ffffff" : "#000000"} fontSize={Math.max(8, fs - 2)} dx={5}>{pct(n.value, grand)}</tspan>
      </text>
    </g>
  );
}
