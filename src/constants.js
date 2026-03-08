// ── helpers ────────────────────────────────────────────────────────────────
export function fmt(v) { return v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(Math.round(v)); }
export function pct(v, total) { return total === 0 ? "0.0%" : ((v / total) * 100).toFixed(1) + "%"; }

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
  // Debt & Credit
  { id: uid(), label: "Credit Card",        value: 300,  category: "Debt & Credit"       },
  { id: uid(), label: "Personal Loan",      value: 200,  category: "Debt & Credit"       },
  // Education
  { id: uid(), label: "Tuition & Courses",  value: 200,  category: "Education"           },
  { id: uid(), label: "Books & Supplies",   value: 80,   category: "Education"           },
  // Flexible
  { id: uid(), label: "Eating Out",         value: 280,  category: "Flexible"            },
  { id: uid(), label: "Clothing & Shoes",   value: 180,  category: "Flexible"            },
  { id: uid(), label: "Entertainment",      value: 130,  category: "Flexible"            },
  // Healthcare
  { id: uid(), label: "Health Insurance",   value: 320,  category: "Healthcare"          },
  { id: uid(), label: "Pharmacy & Medical", value: 150,  category: "Healthcare"          },
  // Household Goods
  { id: uid(), label: "Mortgage / Rent",    value: 1400, category: "Household Goods"     },
  { id: uid(), label: "Electricity",        value: 200,  category: "Household Goods"     },
  { id: uid(), label: "Internet & TV",      value: 95,   category: "Household Goods"     },
  { id: uid(), label: "Mobile Service",     value: 75,   category: "Household Goods"     },
  { id: uid(), label: "Household Supplies", value: 150,  category: "Household Goods"     },
  { id: uid(), label: "Renovation",         value: 120,  category: "Household Goods"     },
  // Kids
  { id: uid(), label: "Childcare",          value: 400,  category: "Kids"                },
  { id: uid(), label: "School Fees",        value: 150,  category: "Kids"                },
  { id: uid(), label: "Kids Activities",    value: 100,  category: "Kids"                },
  // Living Costs
  { id: uid(), label: "Groceries",          value: 900,  category: "Living Costs"        },
  { id: uid(), label: "Personal Hygiene",   value: 120,  category: "Living Costs"        },
  // Long-term Planning
  { id: uid(), label: "Retirement Fund",    value: 450,  category: "Long-term Planning"  },
  { id: uid(), label: "Investment Account", value: 300,  category: "Long-term Planning"  },
  { id: uid(), label: "Real Estate Fund",   value: 200,  category: "Long-term Planning"  },
  // Subscriptions
  { id: uid(), label: "Streaming Services", value: 50,   category: "Subscriptions"       },
  { id: uid(), label: "Gym Membership",     value: 40,   category: "Subscriptions"       },
  { id: uid(), label: "Software & Apps",    value: 30,   category: "Subscriptions"       },
  // Taxes
  { id: uid(), label: "Federal Tax",        value: 500,  category: "Taxes"               },
  { id: uid(), label: "Public Welfare",     value: 350,  category: "Taxes"               },
  // Transportation
  { id: uid(), label: "Commuting",          value: 300,  category: "Transportation"      },
  { id: uid(), label: "Car Insurance",      value: 180,  category: "Transportation"      },
  { id: uid(), label: "Fuel",               value: 150,  category: "Transportation"      },
];

export const CATS = [
  "Debt & Credit",
  "Education",
  "Flexible",
  "Healthcare",
  "Household Goods",
  "Kids",
  "Living Costs",
  "Long-term Planning",
  "Subscriptions",
  "Taxes",
  "Transportation",
];

export const CAT_LABELS = {
  "Debt & Credit":      "Debt & Credit",
  "Education":          "Education",
  "Flexible":           "Flexible Spending",
  "Healthcare":         "Healthcare",
  "Household Goods":    "Household Goods",
  "Kids":               "Kids & Childcare",
  "Living Costs":       "Living Costs",
  "Long-term Planning": "Long-term Planning",
  "Subscriptions":      "Subscriptions",
  "Taxes":              "Taxes",
  "Transportation":     "Transportation",
  "Carryover":          "Deficit Carryover",
};

export const CAT_COLORS = {
  "Debt & Credit":      "#e57373",
  "Education":          "#4db6ac",
  "Flexible":           "#ff8a65",
  "Healthcare":         "#81c784",
  "Household Goods":    "#64b5f6",
  "Kids":               "#f06292",
  "Living Costs":       "#f48fb1",
  "Long-term Planning": "#ce93d8",
  "Subscriptions":      "#a5d6a7",
  "Taxes":              "#ef9a9a",
  "Transportation":     "#ffd54f",
  "Carryover":          "#f87171",
};

export const GROUP_COLORS = {
  source:            "#aecde8", // Col 0 · light blue
  agg:               "#4e88b4", // Col 1 · mid blue
  total:             "#1a5fa8", // Col 2 · dark blue
  category:          "#e57373",
  leaf:              "#f48fb1",
  surplus:           "#66bb6a",
  deficit:           "#f87171",
  carryover_surplus: "#aecde8",
  carryover_deficit: "#f87171",
};

export const LINK_LEFT  = ["#aecde8", "#4e88b4"]; // light → mid blue
export const LINK_RIGHT = [
  "#e57373", // Debt & Credit
  "#4db6ac", // Education
  "#ff8a65", // Flexible
  "#81c784", // Healthcare
  "#64b5f6", // Household Goods
  "#f06292", // Kids
  "#f48fb1", // Living Costs
  "#ce93d8", // Long-term Planning
  "#a5d6a7", // Subscriptions
  "#ef9a9a", // Taxes
  "#ffd54f", // Transportation
];
