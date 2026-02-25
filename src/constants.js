// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(Math.round(v)); }
export function pct(v, total) { return total === 0 ? "0.0%" : ((v / total) * 100).toFixed(1) + "%"; }

export const uid = () => String(Date.now() + Math.random()).replace(".", "");

// ── initial data ───────────────────────────────────────────────────────────
export const INIT_INCOME = [
  { id: uid(), label: "Monthly Wage",    value: 5300, type: "active"  },
  { id: uid(), label: "Cashback Reward", value: 287,  type: "passive" },
  { id: uid(), label: "Stock Dividends", value: 262,  type: "passive" },
  { id: uid(), label: "Bank Interest",   value: 147,  type: "passive" },
];

export const INIT_EXPENSES = [
  { id: uid(), label: "Federal Tax",              value: 494, category: "Payroll"    },
  { id: uid(), label: "Public Welfare",           value: 677, category: "Payroll"    },
  { id: uid(), label: "Utilities & Bills",        value: 758, category: "Living"     },
  { id: uid(), label: "Groceries",                value: 933, category: "Living"     },
  { id: uid(), label: "Personal Hygiene",         value: 649, category: "Living"     },
  { id: uid(), label: "Commuting",                value: 825, category: "Living"     },
  { id: uid(), label: "Retirement Savings",       value: 536, category: "Long-Term"  },
  { id: uid(), label: "Investment Contributions", value: 392, category: "Long-Term"  },
  { id: uid(), label: "Real Estate Fund",         value: 287, category: "Long-Term"  },
  { id: uid(), label: "Flexible Spending",        value: 409, category: "Flexible"   },
];

export const CATS = ["Payroll", "Living", "Long-Term", "Flexible"];

export const CAT_LABELS = {
  Payroll: "Payroll Deductions",
  Living: "Living Costs",
  "Long-Term": "Long-Term Planning",
  Flexible: "Flexible Spending",
};

export const CAT_COLORS = {
  Payroll: "#fde68a",
  Living: "#fbcfe8",
  "Long-Term": "#bfdbfe",
  Flexible: "#d9f99d",
};

export const GROUP_COLORS = {
  source: "#a78bfa",
  agg: "#818cf8",
  total: "#6366f1",
  category: "#c4b5fd",
  leaf: "#d8b4fe",
  surplus: "#86efac",
  deficit: "#f87171",
};

export const LINK_LEFT  = ["#c4b5fd", "#a78bfa"];
export const LINK_RIGHT = ["#fde68a", "#fbcfe8", "#bfdbfe", "#d9f99d"];
