// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(Math.round(v)); }
export function pct(v, total) { return total === 0 ? "0.0%" : ((v / total) * 100).toFixed(1) + "%"; }

export const uid = () => String(Date.now() + Math.random()).replace(".", "");

// ── initial data ───────────────────────────────────────────────────────────
export const INIT_INCOME = [
  { id: uid(), label: "Monthly Salary",     value: 1500, type: "active"  },
  { id: uid(), label: "Rental Income",      value: 500,  type: "passive" },
  { id: uid(), label: "Stock Dividends",    value: 250,  type: "passive" },
];

export const INIT_EXPENSES = [
  // Living & Household
  { id: uid(), label: "Rent",               value: 450,  category: "Living & Household"  },
  { id: uid(), label: "Groceries",          value: 900,  category: "Living & Household"  },

  // Education & Kids
  { id: uid(), label: "Childcare",          value: 120,  category: "Education & Kids"    },
  { id: uid(), label: "School Fees",        value: 110,  category: "Education & Kids"    },
  // Healthcare
  { id: uid(), label: "Health Insurance",   value: 200,  category: "Healthcare"          },
  { id: uid(), label: "Medicines",          value: 150,  category: "Healthcare"          },
  // Transportation
  { id: uid(), label: "Commuting",          value: 130,  category: "Transportation"      },
  { id: uid(), label: "Fuel",               value: 90,  category: "Transportation"      },
];

export const CATS = [
  "Living & Household",
  "Education & Kids",
  "Healthcare",
  "Transportation",
  "Subscriptions",
  "Flexible",
  "Long-term Planning",
  "Debt & Credit",
  "Taxes",
];

export const CAT_LABELS = {
  "Living & Household":  "Living & Household",
  "Education & Kids":    "Education & Kids",
  "Healthcare":          "Healthcare",
  "Transportation":      "Transportation",
  "Subscriptions":       "Subscriptions",
  "Flexible":            "Flexible",
  "Long-term Planning":  "Long-term Planning",
  "Debt & Credit":       "Debt & Credit",
  "Taxes":               "Taxes",
  "Carryover":           "Deficit Carryover",
};

export const CAT_COLORS = {
  "Living & Household":  "#f48fb1",
  "Education & Kids":    "#4db6ac",
  "Healthcare":          "#81c784",
  "Transportation":      "#ffd54f",
  "Subscriptions":       "#a5d6a7",
  "Flexible":            "#ff8a65",
  "Long-term Planning":  "#ce93d8",
  "Debt & Credit":       "#e57373",
  "Taxes":               "#ef9a9a",
  "Carryover":           "#f87171",
};

export const GROUP_COLORS = {
  source:            "#aecde8", // fallback
  source_active:     "#aecde8", // Col 0 · active sources · light blue
  source_passive:    "#1a5fa8", // Col 0 · passive sources · dark blue
  agg:               "#4e88b4", // fallback
  agg_active:        "#aecde8", // Col 1 · Active Income · light blue
  agg_passive:       "#1a5fa8", // Col 1 · Passive Income · dark blue
  total:             "#4e88b4", // Col 2 · mid blue
  category:          "#e57373",
  leaf:              "#f48fb1",
  surplus:           "#66bb6a",
  deficit:           "#f87171",
  carryover_surplus: "#aecde8",
  carryover_deficit: "#f87171",
};

export const LINK_LEFT        = ["#aecde8", "#4e88b4"]; // fallback
export const LINK_LEFT_ACTIVE  = ["#aecde8", "#aecde8"]; // active: light blue throughout
export const LINK_LEFT_PASSIVE = ["#1a5fa8", "#1a5fa8"]; // passive: dark blue throughout
export const LINK_RIGHT = [
  "#f48fb1", // Living & Household
  "#4db6ac", // Education & Kids
  "#81c784", // Healthcare
  "#ffd54f", // Transportation
  "#a5d6a7", // Subscriptions
  "#ff8a65", // Flexible
  "#ce93d8", // Long-term Planning
  "#e57373", // Debt & Credit
  "#ef9a9a", // Taxes
];
