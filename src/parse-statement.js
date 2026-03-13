export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: `You are a bank statement parser. Extract transactions from the raw text and return ONLY a valid JSON array, no markdown, no explanation.

Each transaction object must have:
- "date": "YYYY-MM-DD"
- "description": string (merchant name only, short and clean, max 40 chars)
- "amount": positive number (always positive, no currency symbols)
- "type": "income" or "expense"
- "category": one of exactly these for expenses: "Living & Household", "Education & Kids", "Healthcare", "Transportation", "Subscriptions", "Discretionary", "Savings & Investments", "Debt & Credit", "Taxes". For income use "income".

Categorization rules:
- Salary, wages, freelance, government benefits → income
- Rent, mortgage, utilities, groceries, supermarkets, home supplies, drugstores → Living & Household
- Schools, childcare, kids activities → Education & Kids
- Doctor, pharmacy, gym, health insurance → Healthcare
- Fuel, petrol, public transport, car insurance, parking → Transportation
- Netflix, Spotify, Apple, Amazon Prime, software subscriptions → Subscriptions
- Restaurants, bars, cafes, shopping, entertainment, hobbies, beauty → Discretionary
- Loan repayments, credit card payments, bank transfers → Debt & Credit
- Tax payments, government fees → Taxes
- Savings transfers, investments, pension → Savings & Investments

For German statements: amounts use comma as decimal separator (e.g. -39,80 € = 39.80). Negative = expense, positive = income.

Return ONLY the JSON array.`,
        messages: [{ role: "user", content: `Parse this bank statement:\n\n${text.slice(0, 15000)}` }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: `Claude API error: ${err}` });
    }

    const data = await response.json();
    const raw = data.content?.map(b => b.text || "").join("") || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const transactions = JSON.parse(clean);
    return res.status(200).json({ transactions });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
