// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return v >= 1000 ? Math.round(v / 1000) + "K" : String(Math.round(v)); }
export function pct(v, total) { return total === 0 ? "0%" : Math.round((v / total) * 100) + "%"; }

export const uid = () => String(Date.now() + Math.random()).replace(".", "");

// ── initial data ───────────────────────────────────────────────────────────
export const INIT_INCOME = [
  { id: uid(), label: "Monthly Wage",    value: 4500, type: "active"  },
  { id: uid(), label: "Bank Interest",   value: 350,  type: "passive" },
  { id: uid(), label: "Cashback Reward", value: 287,  type: "passive" },
  { id: uid(), label: "Rental Income",   value: 1100, type: "passive" },
  { id: uid(), label: "Stock Dividends", value: 462,  type: "passive" },
];

export const INIT_EXPENSES = [
  // Living & Household
  { id: uid(), label: "Mortgage / Rent",    value: 1400, category: "Living & Household"  },
  { id: uid(), label: "Groceries",          value: 900,  category: "Living & Household"  },
  { id: uid(), label: "Electricity",        value: 200,  category: "Living & Household"  },
  { id: uid(), label: "Household Supplies", value: 150,  category: "Living & Household"  },
  { id: uid(), label: "Internet & TV",      value: 95,   category: "Living & Household"  },
  { id: uid(), label: "Mobile Service",     value: 75,   category: "Living & Household"  },
  // Education & Kids
  { id: uid(), label: "Tuition & Courses",  value: 200,  category: "Education & Kids"    },
  { id: uid(), label: "Childcare",          value: 400,  category: "Education & Kids"    },
  { id: uid(), label: "School Fees",        value: 150,  category: "Education & Kids"    },
  { id: uid(), label: "Kids Activities",    value: 100,  category: "Education & Kids"    },
  { id: uid(), label: "Books & Supplies",   value: 80,   category: "Education & Kids"    },
  // Healthcare
  { id: uid(), label: "Health Insurance",   value: 320,  category: "Healthcare"          },
  { id: uid(), label: "Pharmacy & Medical", value: 150,  category: "Healthcare"          },
  // Transportation
  { id: uid(), label: "Commuting",          value: 300,  category: "Transportation"      },
  { id: uid(), label: "Car Insurance",      value: 180,  category: "Transportation"      },
  { id: uid(), label: "Fuel",               value: 150,  category: "Transportation"      },
  // Subscriptions
  { id: uid(), label: "Streaming Services", value: 50,   category: "Subscriptions"       },
  { id: uid(), label: "Gym Membership",     value: 40,   category: "Subscriptions"       },
  { id: uid(), label: "Software & Apps",    value: 30,   category: "Subscriptions"       },
  // Flexible
  { id: uid(), label: "Eating Out",         value: 280,  category: "Flexible"            },
  { id: uid(), label: "Clothing & Shoes",   value: 180,  category: "Flexible"            },
  { id: uid(), label: "Entertainment",      value: 130,  category: "Flexible"            },
  // Long-term Planning
  { id: uid(), label: "Retirement Fund",    value: 450,  category: "Long-term Planning"  },
  { id: uid(), label: "Investment Account", value: 300,  category: "Long-term Planning"  },
  { id: uid(), label: "Real Estate Fund",   value: 200,  category: "Long-term Planning"  },
  // Debt & Credit
  { id: uid(), label: "Credit Card",        value: 300,  category: "Debt & Credit"       },
  { id: uid(), label: "Personal Loan",      value: 200,  category: "Debt & Credit"       },
  // Taxes
  { id: uid(), label: "Federal Tax",        value: 500,  category: "Taxes"               },
  { id: uid(), label: "Public Welfare",     value: 350,  category: "Taxes"               },
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
  surplus:           "#4cef5a",
  deficit:           "#ff4444",
  carryover_surplus: "#4cef5a",
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
