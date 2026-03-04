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
  // Housing
  { id: uid(), label: "Mortgage / Rent",    value: 1400, category: "Housing"    },
  { id: uid(), label: "Electricity",        value: 200,  category: "Housing"    },
  { id: uid(), label: "Internet & TV",      value: 95,   category: "Housing"    },
  { id: uid(), label: "Mobile Service",     value: 75,   category: "Housing"    },
  { id: uid(), label: "Household Goods",    value: 150,  category: "Housing"    },
  { id: uid(), label: "Renovation",         value: 120,  category: "Housing"    },
  // Healthcare
  { id: uid(), label: "Health Insurance",   value: 320,  category: "Healthcare" },
  { id: uid(), label: "Pharmacy & Medical", value: 150,  category: "Healthcare" },
  // Living
  { id: uid(), label: "Groceries",          value: 900,  category: "Living"     },
  { id: uid(), label: "Commuting",          value: 300,  category: "Living"     },
  { id: uid(), label: "Personal Hygiene",   value: 120,  category: "Living"     },
  { id: uid(), label: "Transport",          value: 180,  category: "Living"     },
  // Payroll
  { id: uid(), label: "Federal Tax",        value: 500,  category: "Payroll"    },
  { id: uid(), label: "Public Welfare",     value: 350,  category: "Payroll"    },
  // Long-Term
  { id: uid(), label: "Retirement Fund",    value: 450,  category: "Long-Term"  },
  { id: uid(), label: "Investment Account", value: 300,  category: "Long-Term"  },
  { id: uid(), label: "Real Estate Fund",   value: 200,  category: "Long-Term"  },
  // Flexible
  { id: uid(), label: "Eating Out",         value: 280,  category: "Flexible"   },
  { id: uid(), label: "Clothing & Shoes",   value: 180,  category: "Flexible"   },
  { id: uid(), label: "Entertainment",      value: 130,  category: "Flexible"   },
];

export const CATS = ["Housing", "Healthcare", "Living", "Payroll", "Long-Term", "Flexible"];

export const CAT_LABELS = {
  Housing:     "Housing",
  Healthcare:  "Healthcare",
  Living:      "Living Costs",
  Payroll:     "Payroll Deductions",
  "Long-Term": "Long-Term Planning",
  Flexible:    "Flexible Spending",
};

export const CAT_COLORS = {
  Housing:     "#64b5f6",
  Healthcare:  "#81c784",
  Living:      "#f48fb1",
  Payroll:     "#ef9a9a",
  "Long-Term": "#ce93d8",
  Flexible:    "#ff8a65",
};

export const GROUP_COLORS = {
  source:   "#b39ddb",
  agg:      "#9575cd",
  total:    "#6a0dad",
  category: "#e57373",
  leaf:     "#f48fb1",
  surplus:  "#66bb6a",
  deficit:  "#f87171",
};

export const LINK_LEFT  = ["#b39ddb", "#9575cd"];
export const LINK_RIGHT = ["#64b5f6", "#81c784", "#f48fb1", "#ef9a9a", "#ce93d8", "#ff8a65"];
