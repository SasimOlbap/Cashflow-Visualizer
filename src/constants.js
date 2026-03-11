// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return Math.round(v).toLocaleString(); }
export function pct(v, total) { return total === 0 ? "0%" : Math.round((v / total) * 100) + "%"; }

export const uid = () => String(Date.now() + Math.random()).replace(".", "");

// ── initial data ───────────────────────────────────────────────────────────
export const INIT_INCOME = [
  { id: uid(), label: "Monthly Salary",  value: 900, type: "active"  },
  { id: uid(), label: "Rental Income",   value: 500, type: "passive" },
  { id: uid(), label: "Stock Dividends", value: 255, type: "passive" },
];

export const INIT_EXPENSES = [
  // Living & Household
  { id: uid(), label: "Rent",               value: 400,  category: "Living & Household"  },
  { id: uid(), label: "Groceries",          value: 140,  category: "Living & Household"  },
  { id: uid(), label: "Electricity",        value: 80,   category: "Living & Household"  },
  // Education & Kids
  { id: uid(), label: "Childcare",          value: 90,   category: "Education & Kids"    },
  { id: uid(), label: "School Fees",        value: 110,  category: "Education & Kids"    },
  { id: uid(), label: "Tennis classes",     value: 50,   category: "Education & Kids"    },
  // Healthcare
  { id: uid(), label: "Health Insurance",   value: 200,  category: "Healthcare"          },
  { id: uid(), label: "Medicines",          value: 130,  category: "Healthcare"          },
  // Transportation
  { id: uid(), label: "Car Insurance",      value: 180,  category: "Transportation"      },
  { id: uid(), label: "Fuel",               value: 90,   category: "Transportation"      },
  // Subscriptions
  { id: uid(), label: "Streaming Services", value: 50,   category: "Subscriptions"       },
];

// Single source of truth for all category names — used by buildLayout, App, editor dropdown
export const CATS = [
  "Living & Household",
  "Education & Kids",
  "Healthcare",
  "Transportation",
  "Subscriptions",
  "Discretionary",
  "Savings & Investments",
  "Debt & Credit",
  "Taxes",
];

export const CAT_LABELS = {
  "Living & Household":    "Living & Household",
  "Education & Kids":      "Education & Kids",
  "Healthcare":            "Healthcare",
  "Transportation":        "Transportation",
  "Subscriptions":         "Subscriptions",
  "Discretionary":         "Discretionary",
  "Savings & Investments": "Savings & Investments",
  "Debt & Credit":         "Debt & Credit",
  "Taxes":                 "Taxes",
  "Carryover":             "Deficit Carryover",
};

export const CAT_COLORS = {
  "Living & Household":    "#d48000",
  "Education & Kids":      "#d88e00",
  "Healthcare":            "#dd9c00",
  "Transportation":        "#e1aa00",
  "Subscriptions":         "#e6b800",
  "Discretionary":         "#d6b123",
  "Savings & Investments": "#c7ab46",
  "Debt & Credit":         "#b7a569",
  "Taxes":                 "#a89f8c",
  "Carryover":             "#f87171",
};

export const GROUP_COLORS = {
  source:            "#4aab96",
  source_active:     "#4aab96",
  source_passive:    "#0d5c45",
  agg:               "#2a8a72",
  agg_active:        "#4aab96",
  agg_passive:       "#0d5c45",
  total:             "#4e88b4",
  category:          "#e57373",
  leaf:              "#d48000",
  surplus:           "#4cef5a",
  deficit:           "#ff4444",
  carryover_surplus: "#4cef5a",
  carryover_deficit: "#ff4444",
};

export const LINK_LEFT         = ["#4aab96", "#2a8a72"];
export const LINK_LEFT_ACTIVE  = ["#4aab96", "#4aab96"];
export const LINK_LEFT_PASSIVE = ["#0d5c45", "#0d5c45"];
export const LINK_RIGHT = [
  "#d48000", // Living & Household
  "#d88e00", // Education & Kids
  "#dd9c00", // Healthcare
  "#e1aa00", // Transportation
  "#e6b800", // Subscriptions
  "#d6b123", // Discretionary
  "#c7ab46", // Savings & Investments
  "#b7a569", // Debt & Credit
  "#a89f8c", // Taxes
];
