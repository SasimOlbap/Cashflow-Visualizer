import { useState, useRef, useCallback } from "react";
import { uid } from "./constants";

const CATS = [
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

// ── Hardcoded groups per category ─────────────────────────────────────────────
export const GROUPS_BY_CAT = {
  "Living & Household":    ["Rent/Mortgage", "Groceries", "Household Goods", "Utilities", "Internet & TV", "Mobile", "Drugstore", "Home & Garden", "Insurance"],
  "Education & Kids":      ["Childcare", "School Fees", "Sport Classes", "Allowance", "Books & Supplies"],
  "Healthcare":            ["Doctor & Hospital", "Pharmacy", "Dentistry", "Gym & Wellness", "Health Insurance"],
  "Transportation":        ["Fuel", "Public Transport", "Train Tickets", "Parking & Tolls", "Car Insurance", "Car Maintenance"],
  "Subscriptions":         ["Streaming", "Music", "Software", "News & Magazines", "Real Estate Portals", "Other Subscription"],
  "Discretionary":         ["Dining Out", "Clothing", "Shopping", "Appliances", "Recreation", "Renovation", "Pets", "Beauty & Care", "Gifts", "Cash Withdrawal"],
  "Savings & Investments": ["Emergency Fund", "Investments", "Pension", "Savings Transfer"],
  "Debt & Credit":         ["Loan Repayment", "Credit Card", "Financial Services", "Bank Charges"],
  "Taxes":                 ["Income Tax", "VAT", "Government Fee", "Consular Services"],
};

// ── Claude API call (via serverless proxy) ────────────────────────────────────
async function parseStatementWithClaude(rawText) {
  const response = await fetch("/api/parse-statement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to parse statement.");
  }
  const { transactions } = await response.json();
  if (!Array.isArray(transactions)) throw new Error("Unexpected response from parser.");
  return transactions;
}

// ── PDF text extraction ───────────────────────────────────────────────────────
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("Failed to load PDF library."));
    document.head.appendChild(script);
  });
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
}

// ── CSV text extraction ───────────────────────────────────────────────────────
async function extractCsvText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ── Step indicators ───────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Upload", "Processing", "Review", "Done"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700,
              background: i < current ? "#7c3aed" : i === current ? "#a78bfa" : "rgba(255,255,255,0.08)",
              color: i <= current ? "#fff" : "#6b7280",
              border: i === current ? "2px solid #a78bfa" : "2px solid transparent",
              transition: "all 0.3s",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === current ? "#a78bfa" : "#6b7280", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 48, height: 2, margin: "0 4px", marginBottom: 18,
              background: i < current ? "#7c3aed" : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ImportScreen({ onClose, onImport, T, darkMode }) {
  const [step, setStep]               = useState(0);
  const [dragOver, setDragOver]       = useState(false);
  const [error, setError]             = useState("");
  const [transactions, setTransactions] = useState([]);
  const fileRef = useRef(null);

  const accent     = "#7c3aed";
  const accentSoft = "rgba(124,58,237,0.12)";
  const card       = darkMode ? "#161625" : "#ffffff";
  const border     = darkMode ? "#2d2b55" : "#e5e7eb";
  const text       = darkMode ? "#e2e8f0" : "#111827";
  const muted      = darkMode ? "#9ca3af" : "#6b7280";

  const processFile = useCallback(async (file) => {
    setError("");
    setStep(1);
    try {
      let rawText = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        rawText = await extractPdfText(file);
      } else {
        rawText = await extractCsvText(file);
      }
      if (!rawText.trim()) throw new Error("Could not extract any text from the file.");

      const parsed = await parseStatementWithClaude(rawText);
      if (!Array.isArray(parsed) || parsed.length === 0)
        throw new Error("No transactions found in the statement.");

      setTransactions(parsed.map(t => ({
        ...t,
        id: uid(),
        include: true,
        auto: true,
        incomeType: t.incomeType || "active",
        group: (GROUPS_BY_CAT[t.category] || []).includes(t.group) ? t.group : "",
      })));
      setStep(2);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setStep(0);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const toggleInclude = (id) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, include: !t.include } : t));

  const setCategory = (id, cat) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, category: cat, group: "", auto: false } : t));

  const setGroup = (id, grp) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, group: grp } : t));

  const setIncomeType = (id, incomeType) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, incomeType } : t));

  const missingGroup = transactions.filter(t => t.include && t.type === "expense" && !t.group);
  const canImport = transactions.filter(t => t.include).length > 0 && missingGroup.length === 0;
  const includedCount = transactions.filter(t => t.include).length;

  const handleConfirm = () => {
    if (!canImport) return;
    const included = transactions.filter(t => t.include);
    onImport(included);
    setStep(3);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: card, border: `1px solid ${border}`, borderRadius: 20,
        width: "100%", maxWidth: step === 2 ? 980 : 520,
        maxHeight: "90vh", overflow: "auto",
        padding: 40, position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        transition: "max-width 0.3s",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", color: muted,
          fontSize: 20, cursor: "pointer", lineHeight: 1,
        }}>×</button>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, marginBottom: 4 }}>
            Bank Statement
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: text }}>Import Transactions</h2>
        </div>

        <Steps current={step} />

        {/* ── Step 0: Upload ── */}
        {step === 0 && (
          <div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? accent : border}`,
                borderRadius: 14, padding: "48px 24px",
                textAlign: "center", cursor: "pointer",
                background: dragOver ? accentSoft : "transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: text }}>
                Drop your bank statement here
              </p>
              <p style={{ margin: 0, fontSize: 13, color: muted }}>
                or click to browse &nbsp;·&nbsp; PDF or CSV
              </p>
              <input ref={fileRef} type="file" accept=".pdf,.csv" onChange={handleFileInput} style={{ display: "none" }} />
            </div>
            {error && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#f87171", fontSize: 13 }}>
                {error}
              </div>
            )}
            <p style={{ marginTop: 20, fontSize: 12, color: muted, textAlign: "center", lineHeight: 1.6 }}>
              Your statement is processed securely. No data is stored beyond your account.
            </p>
          </div>
        )}

        {/* ── Step 1: Processing ── */}
        {step === 1 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 52, height: 52, border: "3px solid #2d2b55", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "ring-spin 0.9s linear infinite", margin: "0 auto 24px" }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 8 }}>Analysing your statement…</p>
            <p style={{ fontSize: 13, color: muted }}>Claude is reading and categorising your transactions.</p>
            <style>{`@keyframes ring-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: muted }}>
                Found <strong style={{ color: text }}>{transactions.length}</strong> transactions.
                {" "}<span style={{ color: accent }}>{includedCount} selected</span> for import.
                {missingGroup.length > 0 && (
                  <span style={{ marginLeft: 10, color: "#f87171", fontSize: 12 }}>
                    ⚠ {missingGroup.length} row{missingGroup.length !== 1 ? "s" : ""} missing a group
                  </span>
                )}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setTransactions(p => p.map(t => ({ ...t, include: true })))}
                  style={{ fontSize: 12, color: accent, background: "none", border: "none", cursor: "pointer" }}>
                  Select all
                </button>
                <span style={{ color: border }}>|</span>
                <button onClick={() => setTransactions(p => p.map(t => ({ ...t, include: false })))}
                  style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer" }}>
                  Deselect all
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "32px 90px 1fr 90px 150px 140px 28px",
                gap: 8, padding: "8px 12px",
                background: darkMode ? "rgba(255,255,255,0.04)" : "#f9fafb",
                borderBottom: `1px solid ${border}`,
                fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                <div></div>
                <div>Date</div>
                <div>Description</div>
                <div style={{ textAlign: "right" }}>Amount</div>
                <div>Category / Type</div>
                <div>Group</div>
                <div></div>
              </div>

              {/* Rows */}
              <div style={{ maxHeight: 400, overflow: "auto" }}>
                {transactions.map((t, i) => {
                  const groupOptions = GROUPS_BY_CAT[t.category] || [];
                  const isMissingGroup = t.include && t.type === "expense" && !t.group;
                  return (
                    <div key={t.id} style={{
                      display: "grid", gridTemplateColumns: "32px 90px 1fr 90px 150px 140px 28px",
                      gap: 8, padding: "8px 12px", alignItems: "center",
                      borderBottom: i < transactions.length - 1 ? `1px solid ${border}` : "none",
                      background: isMissingGroup
                        ? (darkMode ? "rgba(239,68,68,0.07)" : "rgba(239,68,68,0.04)")
                        : !t.include ? (darkMode ? "rgba(0,0,0,0.2)" : "#f9fafb") : "transparent",
                      opacity: t.include ? 1 : 0.45,
                      transition: "opacity 0.15s, background 0.15s",
                    }}>
                      {/* Include toggle */}
                      <input type="checkbox" checked={t.include} onChange={() => toggleInclude(t.id)}
                        style={{ cursor: "pointer", accentColor: accent }} />

                      {/* Date */}
                      <div style={{ fontSize: 12, color: muted }}>{t.date}</div>

                      {/* Description */}
                      <div style={{ fontSize: 13, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.description}
                        {t.auto && (
                          <span style={{ marginLeft: 6, fontSize: 10, color: accent, background: accentSoft, padding: "1px 5px", borderRadius: 4 }}>AI</span>
                        )}
                      </div>

                      {/* Amount */}
                      <div style={{
                        fontSize: 13, fontWeight: 600, textAlign: "right",
                        color: t.type === "income" ? "#86efac" : "#f87171",
                      }}>
                        {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>

                      {/* Category (expenses) or Income Type (income) */}
                      {t.type === "expense" ? (
                        <select value={t.category} onChange={e => setCategory(t.id, e.target.value)} style={{
                          background: darkMode ? "#0f0f1a" : "#f3f4f6",
                          border: `1px solid ${border}`, borderRadius: 6,
                          color: text, fontSize: 11, padding: "3px 6px", outline: "none", width: "100%",
                        }}>
                          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <select value={t.incomeType || "active"} onChange={e => setIncomeType(t.id, e.target.value)} style={{
                          background: darkMode ? "#0f0f1a" : "#f3f4f6",
                          border: `1px solid ${border}`, borderRadius: 6,
                          color: "#86efac", fontSize: 11, padding: "3px 6px", outline: "none", width: "100%",
                        }}>
                          <option value="active">Active</option>
                          <option value="passive">Passive</option>
                        </select>
                      )}

                      {/* Group (expenses only) */}
                      {t.type === "expense" ? (
                        <select value={t.group || ""} onChange={e => setGroup(t.id, e.target.value)} style={{
                          background: darkMode ? "#0f0f1a" : "#f3f4f6",
                          border: `1px solid ${isMissingGroup ? "#f87171" : border}`,
                          borderRadius: 6, color: t.group ? text : "#f87171",
                          fontSize: 11, padding: "3px 6px", outline: "none", width: "100%",
                        }}>
                          <option value="">— pick group —</option>
                          {groupOptions.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      ) : (
                        <div />
                      )}

                      {/* Type indicator */}
                      <div style={{ fontSize: 14, color: muted }}>{t.type === "income" ? "↓" : "↑"}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center" }}>
              {missingGroup.length > 0 && (
                <span style={{ fontSize: 12, color: "#f87171", marginRight: 8 }}>
                  Assign a group to all selected rows before importing.
                </span>
              )}
              <button onClick={onClose} style={{
                background: "none", border: `1px solid ${border}`, borderRadius: 10,
                padding: "10px 20px", cursor: "pointer", color: muted, fontSize: 14,
              }}>Cancel</button>
              <button onClick={handleConfirm} disabled={!canImport} style={{
                background: !canImport ? (darkMode ? "#3d2b6e" : "#c4b5fd") : accent,
                border: "none", borderRadius: 10, padding: "10px 24px",
                cursor: !canImport ? "not-allowed" : "pointer",
                color: "#fff", fontSize: 14, fontWeight: 600,
                opacity: !canImport ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}>
                Import {includedCount} transaction{includedCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: text, marginBottom: 8 }}>Import complete!</p>
            <p style={{ fontSize: 13, color: muted, marginBottom: 28 }}>
              {includedCount} transaction{includedCount !== 1 ? "s were" : " was"} added to your current month.
            </p>
            <button onClick={onClose} style={{
              background: accent, border: "none", borderRadius: 10,
              padding: "10px 28px", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 600,
            }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
