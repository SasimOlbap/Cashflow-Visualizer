import { fmt, CATS, CAT_LABELS } from "./constants";

export function buildLayout(income, expenses, width, height, colOffsets = [0, 0, 0, 0, 0]) {
  const active     = income.filter(i => i.type === "active");
  const passive    = income.filter(i => i.type === "passive");
  const activeSum  = active.reduce((s, i)  => s + (Number(i.value) || 0), 0);
  const passiveSum = passive.reduce((s, i) => s + (Number(i.value) || 0), 0);
  const grand      = activeSum + passiveSum;
  const catSums    = {};
  CATS.forEach(c => { catSums[c] = expenses.filter(e => e.category === c).reduce((s, e) => s + (Number(e.value) || 0), 0); });
  const totalExp     = CATS.reduce((s, c) => s + catSums[c], 0);
  const surplus      = grand - totalExp;
  const deficit      = surplus < 0 ? Math.abs(surplus) : 0;
  const totalNodeVal = deficit > 0 ? totalExp : grand;

  const nodes = [];
  const push = (id, label, value, group) => nodes.push({ id, label, value: value || 0, group });

  active.forEach(i  => push(i.id, i.label, Number(i.value) || 0, "source"));
  passive.forEach(i => push(i.id, i.label, Number(i.value) || 0, "source"));
  // deficit shown only as agg in col1, rendered at col0
  if (deficit > 0) push("__deficit_phantom", "", deficit, "source"); // phantom for col0 height balance
  if (activeSum  > 0) push("__active",      "Active Income",  activeSum,  "agg");
  if (passiveSum > 0) push("__passive",     "Passive Income", passiveSum, "agg");
  if (deficit    > 0) push("__deficit_agg", "Deficit",        deficit,    "agg");
  push("__total", deficit > 0 ? "Expenses " + fmt(totalExp) : "Income " + fmt(grand), totalNodeVal, "total");
  CATS.forEach(c => { if (catSums[c] > 0) push("__cat_" + c, CAT_LABELS[c], catSums[c], "category"); });
  // surplus as category (col3) for sizing, rendered visually at col4
  if (surplus > 0) push("__surplus", "Surplus", surplus, "category");
  CATS.forEach(c => {
    expenses.filter(e => e.category === c && (Number(e.value) || 0) > 0)
      .forEach(e => push(e.id, e.label, Number(e.value) || 0, "leaf"));
  });
  if (surplus > 0) push("__surplus_phantom", "", surplus, "leaf"); // phantom at bottom of col4

  const links = [];
  const addLink = (s, t, v) => { if (v > 0) links.push({ source: s, target: t, value: v }); };

  active.forEach(i  => { if (activeSum  > 0) addLink(i.id, "__active",  Number(i.value) || 0); });
  passive.forEach(i => { if (passiveSum > 0) addLink(i.id, "__passive", Number(i.value) || 0); });
  if (activeSum  > 0) addLink("__active",      "__total", activeSum);
  if (passiveSum > 0) addLink("__passive",     "__total", passiveSum);
  // no deficit_src link needed
  if (deficit    > 0) addLink("__deficit_agg", "__total", deficit);
  CATS.forEach(c => { if (catSums[c] > 0) addLink("__total", "__cat_" + c, catSums[c]); });
  if (surplus > 0) addLink("__total", "__surplus", surplus);
  expenses.forEach(e => {
    const v = Number(e.value) || 0;
    if (v > 0 && catSums[e.category] > 0) addLink("__cat_" + e.category, e.id, v);
  });


  const colMap    = { source: 0, agg: 1, total: 2, category: 3, leaf: 4 };
  const colWidths = [20, 20, 20, 20, 20];
  const nodeWidth = 20;
  const nodeMap   = {};
  nodes.forEach(n => { n.col = colMap[n.group]; n.w = colWidths[n.col]; nodeMap[n.id] = n; });

  const safeW = isFinite(width)  && width  > 0 ? width  : 600;
  const safeH = isFinite(height) && height > 0 ? height : 400;
  const safeOffsets = (colOffsets || []).map(o => isFinite(o) ? o : 0);

  const labelPad  = Math.max(30, Math.min(60, safeW * 0.06));
  const inner     = safeW - labelPad * 2;
  const baseColX  = [
    labelPad - 0.03 * inner,
    labelPad + 0.25 * inner,
    labelPad + 0.50 * inner,
    labelPad + 0.75 * inner,
    labelPad + 1.02 * inner,
  ];
  const actualColX = baseColX.map((x, i) => {
    const v = x + (safeOffsets[i] || 0);
    return isFinite(v) ? v : x;
  });
  nodes.forEach(n => { n.x = actualColX[n.col]; });

  const getHeightScale = ci => {
    const scales = [0.85, 0.90, 1.00, 0.90, 0.85];
    return scales[ci] ?? 0.85;
  };

  const buckets = [[], [], [], [], []];
  nodes.forEach(n => buckets[n.col].push(n));
  const gap = 8;
  buckets.forEach((col, ci) => {
    const tot = col.reduce((s, n) => s + n.value, 0);
    if (!tot) return;
    const avail = Math.max(10, safeH * getHeightScale(ci) - gap * Math.max(0, col.length - 1));
    let y = 0;
    col.forEach(n => {
      n.h = Math.max(4, (n.value / tot) * avail);
      if (!isFinite(n.h)) n.h = 4;
      n.y = y; y += n.h + gap;
    });
    const off = (safeH - (y - gap)) / 2;
    col.forEach(n => { n.y += isFinite(off) ? off : 0; });
  });

  const srcOff = {}, tgtOff = {};
  const srcRem = {}, tgtRem = {};
  nodes.forEach(n => { srcOff[n.id] = 0; tgtOff[n.id] = 0; srcRem[n.id] = n.h; tgtRem[n.id] = n.h; });
  links.forEach(l => {
    try {
      const s = nodeMap[l.source], t = nodeMap[l.target];
      if (!s || !t) return;
      const sh = Math.min(s.value > 0 ? (l.value / s.value) * s.h : 0, srcRem[s.id]);
      const th = Math.min(t.value > 0 ? (l.value / t.value) * t.h : 0, tgtRem[t.id]);
      if (!isFinite(sh) || !isFinite(th)) return;
      l.sy0 = s.y + srcOff[s.id]; l.sy1 = l.sy0 + sh;
      l.ty0 = t.y + tgtOff[t.id]; l.ty1 = l.ty0 + th;
      l.sx  = s.x + (s.w || nodeWidth);
      l.tx  = t.x;
      l.sourceNode = s; l.targetNode = t;
      srcOff[s.id] += sh; tgtOff[t.id] += th;
      srcRem[s.id] -= sh; tgtRem[t.id] -= th;
    } catch {}
  });

  return { nodes, links, nodeWidth, grand, totalExp, surplus, colX: actualColX };
}
