const https = require("https");

function httpsPost(url, headers, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: "POST",
      headers: { ...headers, "Content-Length": Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  try {
    const payload = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8096,
      system: `You are a bank statement parser. Extract transactions from the raw text and return ONLY a valid JSON array, no markdown, no explanation.

Each transaction object must have:
- "date": "YYYY-MM-DD"
- "description": string (merchant name only, short and clean, max 40 chars)
- "amount": positive number (always positive, no currency symbols)
- "type": "income" or "expense"
- "category": one of exactly these for expenses: "Living & Household", "Education & Kids", "Healthcare", "Transportation", "Subscriptions", "Discretionary", "Savings & Investments", "Debt & Credit", "Taxes". For income use "income".
- "group": one of the allowed groups for the chosen category (see list below). For income leave as empty string "".

Allowed groups per category (you MUST pick exactly one from the list for each expense):
- "Living & Household":    "Rent/Mortgage", "Groceries", "Household Goods", "Utilities", "Internet & TV", "Mobile", "Drugstore", "Home & Garden", "Insurance"
- "Education & Kids":      "Childcare", "School Fees", "Sport Classes", "Allowance", "Books & Supplies"
- "Healthcare":            "Doctor & Hospital", "Pharmacy", "Dentistry", "Gym & Wellness", "Health Insurance"
- "Transportation":        "Fuel", "Public Transport", "Train Tickets", "Parking & Tolls", "Car Insurance", "Car Maintenance"
- "Subscriptions":         "Streaming", "Music", "Software", "News & Magazines", "Real Estate Portals", "Other Subscription"
- "Discretionary":         "Dining Out", "Clothing", "Shopping", "Appliances", "Recreation", "Renovation", "Pets", "Beauty & Care", "Gifts", "Cash Withdrawal"
- "Savings & Investments": "Emergency Fund", "Investments", "Pension", "Savings Transfer"
- "Debt & Credit":         "Loan Repayment", "Credit Card", "Financial Services", "Bank Charges"
- "Taxes":                 "Income Tax", "VAT", "Government Fee", "Consular Services"

Categorization rules:
- Salary, wages, freelance, government benefits → income (group: "")
- Rent, mortgage → Living & Household / Rent/Mortgage
- Supermarkets, grocery stores (ALDI, REWE, Lidl, Edeka, etc.) → Living & Household / Groceries
- Utilities (electricity, gas, water) → Living & Household / Utilities
- Internet, TV, landline → Living & Household / Internet & TV
- Mobile phone carriers → Living & Household / Mobile
- Drugstores (DM, Rossmann, etc.) → Living & Household / Drugstore
- Insurance (dental, general, home) → Living & Household / Insurance
- Schools, childcare, kids activities → Education & Kids
- Sport classes, extracurriculars → Education & Kids / Sport Classes
- Doctor, hospital → Healthcare / Doctor & Hospital
- Pharmacy → Healthcare / Pharmacy
- Dentist → Healthcare / Dentistry
- Gym, fitness, wellness → Healthcare / Gym & Wellness
- Health insurance → Healthcare / Health Insurance
- Fuel, petrol stations (Aral, Shell, BP, tank) → Transportation / Fuel
- Public transport, bus, tram → Transportation / Public Transport
- Train, Deutsche Bahn, rail → Transportation / Train Tickets
- Parking → Transportation / Parking & Tolls
- Car insurance → Transportation / Car Insurance
- Netflix, Spotify, Apple, Amazon Prime, streaming → Subscriptions / Streaming
- Software, app subscriptions → Subscriptions / Software
- ImmobilienScout, WG-Gesucht, real estate portals → Subscriptions / Real Estate Portals
- Restaurants, cafes, fast food, bakeries → Discretionary / Dining Out
- Clothing stores (Deichmann, Zara, H&M, etc.) → Discretionary / Clothing
- Cash withdrawals (Geldautomat, ATM) → Discretionary / Cash Withdrawal
- Pets, vet, pet supplies → Discretionary / Pets
- Home renovation, building supplies → Discretionary / Renovation
- Electronics, appliances → Discretionary / Appliances
- Savings, transfers to savings → Savings & Investments / Savings Transfer
- Investments, ETF, broker → Savings & Investments / Investments
- Pension → Savings & Investments / Pension
- Loan repayment → Debt & Credit / Loan Repayment
- Credit card payment → Debt & Credit / Credit Card
- Bank charges, account fees → Debt & Credit / Bank Charges
- Financial advisors, financial services → Debt & Credit / Financial Services
- Tax payments → Taxes / Income Tax
- Consulate, embassy fees → Taxes / Consular Services

For German statements: amounts use comma as decimal separator (e.g. -39,80 € = 39.80). Negative = expense, positive = income.

Return ONLY the JSON array.`,
      messages: [{ role: "user", content: `Parse this bank statement:\n\n${text.slice(0, 8000)}` }],
    });

    const result = await httpsPost(
      "https://api.anthropic.com/v1/messages",
      {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      payload
    );

    if (result.status !== 200) {
      return res.status(502).json({ error: `Claude API error: ${result.body}` });
    }

    const data = JSON.parse(result.body);
    const raw = data.content?.map(b => b.text || "").join("") || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const transactions = JSON.parse(clean);
    return res.status(200).json({ transactions });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
