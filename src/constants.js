// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return v >= 1000 ? Math.round(v / 1000) + "K" : String(Math.round(v)); }
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
  "Living & Household":    "#f48fb1",
  "Education & Kids":      "#4db6ac",
  "Healthcare":            "#81c784",
  "Transportation":        "#ffd54f",
  "Subscriptions":         "#a5d6a7",
  "Discretionary":         "#ff8a65",
  "Savings & Investments": "#ce93d8",
  "Debt & Credit":         "#e57373",
  "Taxes":                 "#ef9a9a",
  "Carryover":             "#f87171",
};

export const GROUP_COLORS = {
  source:            "#aecde8",
  source_active:     "#aecde8",
  source_passive:    "#1a5fa8",
  agg:               "#4e88b4",
  agg_active:        "#aecde8",
  agg_passive:       "#1a5fa8",
  total:             "#4e88b4",
  category:          "#e57373",
  leaf:              "#f48fb1",
  surplus:           "#4cef5a",
  deficit:           "#ff4444",
  carryover_surplus: "#4cef5a",
  carryover_deficit: "#ff4444",
};

export const LINK_LEFT         = ["#aecde8", "#4e88b4"];
export const LINK_LEFT_ACTIVE  = ["#aecde8", "#aecde8"];
export const LINK_LEFT_PASSIVE = ["#1a5fa8", "#1a5fa8"];
export const LINK_RIGHT = [
  "#f48fb1", // Living & Household
  "#4db6ac", // Education & Kids
  "#81c784", // Healthcare
  "#ffd54f", // Transportation
  "#a5d6a7", // Subscriptions
  "#ff8a65", // Discretionary
  "#ce93d8", // Savings & Investments
  "#e57373", // Debt & Credit
  "#ef9a9a", // Taxes
];
