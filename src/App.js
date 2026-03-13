import { useState, useEffect, useRef, Component } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { buildLayout } from "./buildLayout";
import { LinkPath, ItemRow, SankeyNode } from "./components";
import { useDrag } from "./useDrag";
import { darkTheme, lightTheme } from "./theme";
import { supabase } from "./supabase";
import Landing from "./Landing";
import CheckEmail from "./CheckEmail";
import Welcome from "./Welcome";
import ShareView from "./ShareView";
import {
  uid, fmt, pct,
  INIT_INCOME, INIT_EXPENSES, CATS, CAT_COLORS,
  GROUP_COLORS, LINK_LEFT, LINK_LEFT_ACTIVE, LINK_LEFT_PASSIVE, LINK_RIGHT,
} from "./constants";
import { translations } from "./i18n";
import TourOverlay, { shouldShowTour } from "./TourOverlay";
import { TierContext } from "./TierContext";
import ImportScreen from "./ImportScreen";

// ── DoubleArrow nav icon ──────────────────────────────────────────────────────
function DoubleArrow({ direction, color }) {
  const size = 20;
  const w = 8, h = 12;
  const cy = size / 2;
  const sep = 6;
  const sw = 1.7;
  let p1, p2;
  if (direction === "right") {
    const x1 = size / 2 - sep / 2 - w;
    const x2 = size / 2 - sep / 2;
    p1 = `M${x1},${cy-h/2} L${x1+w},${cy} L${x1},${cy+h/2}`;
    p2 = `M${x2},${cy-h/2} L${x2+w},${cy} L${x2},${cy+h/2}`;
  } else {
    const x1 = size / 2 + sep / 2 + w;
    const x2 = size / 2 + sep / 2;
    p1 = `M${x1},${cy-h/2} L${x1-w},${cy} L${x1},${cy+h/2}`;
    p2 = `M${x2},${cy-h/2} L${x2-w},${cy} L${x2},${cy+h/2}`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <path d={p1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d={p2} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Mobile-only screen ───────────────────────────────────────────────────────
function MobileOnly({ onBack }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.25) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.15) 0%, transparent 55%), #0a0818",
      padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;600&display=swap');`}</style>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 320 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Financial Overview</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>Cash Flow Visualizer</div>
        </div>
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🖥️</div>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 14, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Best on desktop</h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: "#9ca3af", marginBottom: 32, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
          Cash Flow Visualizer is optimized for desktop. Please open it on a larger screen for the full experience.
        </p>
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />
        <p style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Meanwhile, explore what it can do:</p>
        <button onClick={onBack} style={{ width: "100%", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Back to Landing Page
        </button>
      </div>
    </div>
  );
}

// ── error boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false }; }
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Something went wrong 😅</h2>
        <p>Try refreshing the page.</p>
        <button onClick={() => window.location.reload()}
          style={{ padding: "8px 20px", cursor: "pointer", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 15 }}>
          Refresh
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ── category migration ────────────────────────────────────────────────────────
// Maps old category keys → new keys so existing Supabase data loads correctly
const CATEGORY_MIGRATION = {
  "Living":                "Living & Household",
  "Payroll":               "Taxes",
  "Long-Term":             "Savings & Investments",
  "Long-term Planning":    "Savings & Investments",
  "Housing":               "Living & Household",
  "Household Goods":       "Living & Household",
  "Living Costs":          "Living & Household",
  "Education":             "Education & Kids",
  "Kids":                  "Education & Kids",
  "Flexible":              "Discretionary",
};
const migrateExpenses = (expenses) =>
  expenses.map(e => ({
    ...e,
    category: CATEGORY_MIGRATION[e.category] ?? e.category,
  }));

// ── month helpers ─────────────────────────────────────────────────────────────
const toKey  = (y, m) => `${y}-${String(m).padStart(2, "0")}`;
const today   = new Date();
const initKey = toKey(today.getFullYear(), 1);

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function App() {
  const [session, setSession] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("cf_lang") || "en");
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [checkEmail, setCheckEmail] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const isNewSignup = useRef(false);

  // Detect shared link params before auth loads
  const sharedParams = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const data = params.get("data");
      const month = params.get("month");
      if (data && month) {
        return { month, data: JSON.parse(decodeURIComponent(atob(data))) };
      }
    } catch {}
    return null;
  })();

  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.replace("#", "?"));
    const type = hashParams.get("type");
    const isRecovery = type === "recovery";
    const isEmailVerification = (hash.includes("access_token") && !isRecovery) || new URLSearchParams(window.location.search).get("type") === "signup";

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && isRecovery) {
        setShowResetPassword(true);
        window.history.replaceState({}, "", window.location.pathname);
      } else if (session && isEmailVerification) {
        setShowWelcome(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN" && isNewSignup.current) {
        setShowWelcome(true);
        isNewSignup.current = false;
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Show shared view immediately — no auth needed
  if (sharedParams) return (
    <ShareView
      month={sharedParams.month}
      data={sharedParams.data}
      onGetStarted={() => { window.history.replaceState({}, "", window.location.pathname); window.location.reload(); }}
    />
  );

  if (authLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f0f1a" }}>
      <div style={{ color: "#c4b5fd", fontSize: 18 }}>Loading...</div>
    </div>
  );

  const handleSetLang = (l) => { setLang(l); localStorage.setItem("cf_lang", l); };

  const isMobile = window.innerWidth < 768;

  const tier = ["free", "pro", "business"].includes(process.env.REACT_APP_TIER)
    ? process.env.REACT_APP_TIER
    : "free";

  if (showWelcome && session) return <Welcome onEnter={() => setShowWelcome(false)} />;
  if (showResetPassword && session) return <ResetPasswordScreen onDone={() => { setShowResetPassword(false); supabase.auth.signOut(); }} />;
  const handleSignOut = async () => { setShowAuth(false); await supabase.auth.signOut(); };
  if (session) return isMobile ? <MobileOnly onBack={async () => { await supabase.auth.signOut(); window.location.reload(); }} /> : <TierContext.Provider value={tier}><ErrorBoundary><CashFlow session={session} lang={lang} setLang={handleSetLang} onSignOut={handleSignOut} /></ErrorBoundary></TierContext.Provider>;
  if (checkEmail) return <CheckEmail email={checkEmail} />;
  if (showAuth) return <ErrorBoundary><AuthScreen mode={authMode} onCheckEmail={(email) => setCheckEmail(email)} onNewSignup={() => { isNewSignup.current = true; }} /></ErrorBoundary>;
  return <Landing onGetStarted={() => { setAuthMode("signup"); setShowAuth(true); }} onLogin={() => { setAuthMode("login"); setShowAuth(true); }} lang={lang} setLang={handleSetLang} />;
}

// ── auth screen ───────────────────────────────────────────────────────────────
function AuthScreen({ onCheckEmail, mode, onNewSignup }) {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [isLogin,      setIsLogin]      = useState(mode !== "signup");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [forgotSent,   setForgotSent]   = useState(false);
  const [forgotEmail,  setForgotEmail]  = useState("");

  const handleSubmit = async () => {
    if (!isLogin && !captchaToken) { setError("Please complete the CAPTCHA."); return; }
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else {
        const { error } = await supabase.auth.signUp({
          email, password, options: { captchaToken }
        });
        if (error) setError(error.message);
        else { onNewSignup(); onCheckEmail(email); }
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email) { setError("Enter your email above first."); return; }
    setError(""); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setForgotEmail(email);
    setForgotSent(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.35) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.2) 0%, transparent 50%), #0a0818"
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, background: "#161625", border: "1px solid #2d2b55", borderRadius: 16, padding: "40px 36px", width: 360 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 8 }}>Financial Overview</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Cash Flow Visualizer</h1>

        {forgotSent ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Reset your password</p>
            <div style={{ textAlign: "center", fontSize: 36, margin: "8px 0" }}>✉️</div>
            <p style={{ color: "#a9a9b3", fontSize: 14, textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              We sent a reset link to<br />
              <strong style={{ color: "#a78bfa" }}>{forgotEmail}</strong>
            </p>
            <p style={{ color: "#6b7280", fontSize: 13, textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              Click the link in the email to set a new password. Check your spam folder if you don't see it.
            </p>
            <button onClick={() => { setForgotSent(false); setError(""); }} style={{
              background: "transparent", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", padding: 4, marginTop: 8,
            }}>← Back to login</button>
          </div>
        ) : (
          <>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px" }}>{isLogin ? "Log in to your account" : "Create a new account"}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ background: "#0f0f1a", border: "1px solid #2d2b55", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 14px", outline: "none" }} />
              <div>
                <input type="password" placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ width: "100%", background: "#0f0f1a", border: "1px solid #2d2b55", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 14px", outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
                {isLogin && (
                  <div style={{ textAlign: "right" }}>
                    <span onClick={handleForgot} style={{ color: "#a78bfa", fontSize: 12, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                    >Forgot password?</span>
                  </div>
                )}
              </div>
              {!isLogin && (
                <Turnstile siteKey="0x4AAAAAACoz0vl4zffyhzPf" onSuccess={token => setCaptchaToken(token)} options={{ theme: "dark" }} />
              )}
              {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}
              <button onClick={handleSubmit} disabled={loading || (!isLogin && !captchaToken)} style={{
                background: (!isLogin && !captchaToken) ? "#3d2b6e" : "#7c3aed",
                border: "none", borderRadius: 8, color: "#fff",
                fontSize: 15, fontWeight: 600, padding: "11px",
                cursor: (!isLogin && !captchaToken) ? "not-allowed" : "pointer", marginTop: 4,
              }}>
                {loading ? "..." : isLogin ? "Log In" : "Sign Up"}
              </button>
              <button onClick={() => { setIsLogin(l => !l); setError(""); }} style={{
                background: "transparent", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", padding: 4,
              }}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── reset password screen ─────────────────────────────────────────────────────
function ResetPasswordScreen({ onDone }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const handleReset = async () => {
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setError(""); setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
    setTimeout(() => onDone(), 2500);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.35) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.2) 0%, transparent 50%), #0a0818"
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, background: "#161625", border: "1px solid #2d2b55", borderRadius: 16, padding: "40px 36px", width: 360 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 8 }}>Financial Overview</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Cash Flow Visualizer</h1>
        {success ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 28 }}>
            <div style={{ fontSize: 36 }}>✅</div>
            <p style={{ color: "#86efac", fontSize: 15, textAlign: "center", margin: 0 }}>Password updated! Redirecting to login...</p>
          </div>
        ) : (
          <>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px" }}>Choose a new password</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="password" placeholder="New password" value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ background: "#0f0f1a", border: "1px solid #2d2b55", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 14px", outline: "none" }} />
              <input type="password" placeholder="Confirm new password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleReset()}
                style={{ background: "#0f0f1a", border: "1px solid #2d2b55", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 14px", outline: "none" }} />
              {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}
              <button onClick={handleReset} disabled={loading} style={{
                background: "#7c3aed", border: "none", borderRadius: 8, color: "#fff",
                fontSize: 15, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
              }}>
                {loading ? "..." : "Set new password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── category key map for i18n ─────────────────────────────────────────────────
const CAT_I18N_KEY = {
  "Living & Household":    "cat_living_household",
  "Education & Kids":      "cat_education_kids",
  "Healthcare":            "cat_healthcare",
  "Transportation":        "cat_transportation",
  "Subscriptions":         "cat_subscriptions",
  "Discretionary":         "cat_discretionary",
  "Savings & Investments": "cat_savings",
  "Debt & Credit":         "cat_debt",
  "Taxes":                 "cat_taxes",
};

function CashFlow({ session, lang, setLang, onSignOut }) {
  const tr = (key) => (translations[lang] || translations.en)[key] || key;
  // ── refs & size ───────────────────────────────────────────────────────────
  const svgRef        = useRef(null);
  const monthStripRef  = useRef(null);
  const tooltipBarRef  = useRef(null);
  const editorRef      = useRef(null);
  const backupBtnsRef  = useRef(null);
  const settingsBtnsRef = useRef(null);
  const [svgW, setSvgW] = useState(600);
  const [svgH, setSvgH] = useState(440);

  useEffect(() => {    const compute = (containerW) => {
      const w = Math.min(1200, Math.max(320, containerW));
      const svgTop = svgRef.current ? svgRef.current.getBoundingClientRect().top : 160;
      const bottomBarH = 80; // bottom card height + breathing room
      const maxH = Math.max(500, window.innerHeight - svgTop - bottomBarH);
      const h = Math.min(700, Math.max(500, Math.min(w * 0.57, maxH)));
      setSvgW(w);
      setSvgH(h);
    };

    const obs = new ResizeObserver(entries => {
      compute(entries[0].contentRect.width);
    });
    if (svgRef.current) obs.observe(svgRef.current);

    // Also recompute on window resize (catches viewport height changes)
    const onResize = () => {
      if (svgRef.current) compute(svgRef.current.getBoundingClientRect().width);
    };
    window.addEventListener("resize", onResize);

    return () => { obs.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  // ── state ─────────────────────────────────────────────────────────────────
  const [darkMode,  setDarkMode]  = useState(true);
  const [showTour,  setShowTour]  = useState(() => shouldShowTour());
  const [loggingOut, setLoggingOut] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [hovEmpty,  setHovEmpty]  = useState(null); // key of hovered empty month
  const [hovered,   setHovered]   = useState(null);
  const [months,    setMonths]    = useState(() => {
    const empty = {};
    for (let i = 1; i <= 12; i++) empty[toKey(today.getFullYear(), i)] = { income: [], expenses: [] };
    return empty;
  });
  const [curKey,    setCurKey]    = useState(initKey);
  const [hovMonth,  setHovMonth]  = useState(null);
  const [ctxMenu,   setCtxMenu]   = useState(null);
  const [confirmDel,setConfirmDel]= useState(null); // key to delete
  const cloudLoaded = useRef(false); // blocks saves until initial cloud load is done
  const saveTimer   = useRef(null);  // debounce timer for Supabase saves
  const ctxMenuTimer = useRef(null);

  // ── carryover state ───────────────────────────────────────────────────────
  // carryoverOverrides: { [monthKey]: { value: number, isManual: boolean } }
  const [carryoverOverrides, setCarryoverOverrides] = useState({});
  const [carryoverPrompt, setCarryoverPrompt] = useState(null); // { key, autoValue, prevLabel }
  const [editingCarryover, setEditingCarryover] = useState(false);
  const [carryoverEditVal, setCarryoverEditVal] = useState("");

  const deleteMonth = async (key) => {
    // Delete from Supabase first
    const [y, m] = key.split("-").map(Number);
    const { error } = await supabase.from("cashflow").delete()
      .eq("user_id", session.user.id)
      .eq("year", y)
      .eq("month", m);
    if (error) { console.error("Failed to delete month:", error); return; }
    setMonths(p => {
      const next = { ...p };
      delete next[key];
      return next;
    });
    if (curKey === key) {
      const remaining = Object.keys(months).filter(k => k !== key).sort();
      if (remaining.length > 0) {
        // Go to the nearest previous month, or the first one if none before
        const before = remaining.filter(k => k < key);
        setCurKey(before.length > 0 ? before[before.length - 1] : remaining[0]);
      }
    }
    setConfirmDel(null);
    setCtxMenu(null);
  };
  const [niLabel,   setNiLabel]   = useState("");
  const [niType,    setNiType]    = useState("active");
  const [neLabel,   setNeLabel]   = useState("");
  const [neCat,     setNeCat]     = useState("Living & Household");

  // ── cloud sync ────────────────────────────────────────────────────────────
  // Load all months from Supabase on mount
  useEffect(() => {
    const loadFromCloud = async () => {
      const year = today.getFullYear();

      // Clear localStorage first so previous user's data doesn't leak
      try { localStorage.removeItem("cf_months"); } catch {}

      const { data, error } = await supabase
        .from("cashflow")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("year", year);

      if (error) return;

      // Start with clean empty months
      const empty = { income: [], expenses: [] };
      const freshMonths = {};
      for (let i = 1; i <= 12; i++) freshMonths[toKey(year, i)] = empty;

      // Overlay with cloud data if any exists, otherwise seed January with defaults
      if (data?.length) {
        data.forEach(row => {
          freshMonths[toKey(year, row.month)] = { income: row.income, expenses: migrateExpenses(row.expenses) };
        });
      } else {
        freshMonths[initKey] = { income: INIT_INCOME, expenses: INIT_EXPENSES };
        // Save default January to Supabase so it persists on next login
        await supabase.from("cashflow").upsert({
          user_id: session.user.id,
          year, month: 1,
          income: INIT_INCOME,
          expenses: INIT_EXPENSES,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,year,month" });
      }

      setMonths(freshMonths);
      cloudLoaded.current = true;
    };
    loadFromCloud();
  }, [session.user.id]);

  // Save current month to Supabase whenever it changes
  const saveMonth = async (key, data) => {
    if (!cloudLoaded.current) return;
    const [y, m] = key.split("-").map(Number);
    await supabase.from("cashflow").upsert({
      user_id: session.user.id,
      year: y, month: m,
      income: data.income,
      expenses: data.expenses,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,year,month" });
  };

  const forceSaveMonth = async (key, data) => {
    const [y, m] = key.split("-").map(Number);
    await supabase.from("cashflow").upsert({
      user_id: session.user.id,
      year: y, month: m,
      income: data.income,
      expenses: data.expenses,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,year,month" });
  };

  // Auto-save to localStorage as fallback
  useEffect(() => {
    try { localStorage.setItem("cf_months", JSON.stringify(months)); } catch {}
  }, [months]);

  // Current month data
  const displayKey = hovMonth || curKey;
  const curData    = months[displayKey] || { income: [], expenses: [] };
  const income     = curData.income;
  const expenses   = curData.expenses;
  const isEmpty    = income.length === 0 && expenses.length === 0;

  const debouncedSave = (key, data) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveMonth(key, data), 800);
  };

  const setIncome   = (fn) => setMonths(p => {
    const updated = { ...p[curKey], income: fn(p[curKey]?.income || []) };
    debouncedSave(curKey, updated);
    return { ...p, [curKey]: updated };
  });
  const setExpenses = (fn) => setMonths(p => {
    const updated = { ...p[curKey], expenses: fn(p[curKey]?.expenses || []) };
    debouncedSave(curKey, updated);
    return { ...p, [curKey]: updated };
  });

  const copyFromPrev = () => {
    const [y, m] = curKey.split("-").map(Number);
    const prevKey = m === 1 ? toKey(y - 1, 12) : toKey(y, m - 1);
    const prev = months[prevKey];
    if (!prev) return;
    const updated = {
      income:   prev.income.map(i   => ({ ...i, id: uid() })),
      expenses: prev.expenses.map(e => ({ ...e, id: uid() })),
    };
    setMonths(p => ({ ...p, [curKey]: updated }));
    saveMonth(curKey, updated);
  };
  const [y, m] = curKey.split("-").map(Number);
  const prevKey = m === 1 ? toKey(y - 1, 12) : toKey(y, m - 1);
  const hasPrev = !!(months[prevKey]?.income?.length || months[prevKey]?.expenses?.length);

  const T = darkMode ? darkTheme : lightTheme;
  const { colOffsets, startDrag } = useDrag(svgRef, svgW);

  // ── data handlers ─────────────────────────────────────────────────────────
  const updInLabel = (id, v) => setIncome(p => p.map(i => i.id === id ? { ...i, label: v } : i));
  const updInValue = (id, v) => setIncome(p => p.map(i => i.id === id ? { ...i, value: v } : i));
  const remIn      = id      => setIncome(p => p.filter(i => i.id !== id));
  const addIn = () => {
    if (!niLabel.trim()) return;
    setIncome(p => [...p, { id: uid(), label: niLabel.trim(), value: 0, type: niType }]);
    setNiLabel("");
  };

  const updExLabel = (id, v) => setExpenses(p => p.map(e => e.id === id ? { ...e, label: v } : e));
  const updExValue = (id, v) => setExpenses(p => p.map(e => e.id === id ? { ...e, value: v } : e));
  const remEx      = id      => setExpenses(p => p.filter(e => e.id !== id));
  const addEx = () => {
    if (!neLabel.trim()) return;
    setExpenses(p => [...p, { id: uid(), label: neLabel.trim(), value: 0, category: neCat }]);
    setNeLabel("");
  };

  // ── import from bank statement ────────────────────────────────────────────
  const [importConfirm, setImportConfirm] = useState(null); // holds pending transactions

  const applyImport = (transactions) => {
    const newIncome = transactions.filter(t => t.type === "income").map(t => ({ id: uid(), label: t.description, value: t.amount, type: "active" }));

    // Aggregate expenses by group+category — each unique group becomes one leaf node,
    // summing amounts of all transactions that share the same group and category.
    const expenseMap = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      const key = `${t.category}||${t.group || t.description}`;
      if (expenseMap[key]) {
        expenseMap[key].value += t.amount;
      } else {
        expenseMap[key] = { id: uid(), label: t.group || t.description, value: t.amount, category: t.category };
      }
    });
    const newExpenses = Object.values(expenseMap);
    setMonths(p => {
      const updated = { income: newIncome, expenses: newExpenses };
      saveMonth(curKey, updated);
      return { ...p, [curKey]: updated };
    });
  };

  const handleImportTransactions = (transactions) => {
    const cur = months[curKey] || { income: [], expenses: [] };
    const hasData = (cur.income?.length || 0) + (cur.expenses?.length || 0) > 0;
    if (hasData) {
      setImportConfirm(transactions);
      return;
    }
    applyImport(transactions);
  };

  // ── carryover helpers ─────────────────────────────────────────────────────
  const getCarryoverAuto = (key) => {
    const [y, m] = key.split("-").map(Number);
    const pk = m === 1 ? toKey(y - 1, 12) : toKey(y, m - 1);
    const prev = months[pk];
    if (!prev?.income?.length && !prev?.expenses?.length) return null;

    // Delegate entirely to buildLayout — single source of truth for surplus calculation
    const prevCarry = getCarryoverValue(pk);
    const prevIncomeWithCarryover = prevCarry !== null && prevCarry > 0
      ? [...prev.income, { id: "__carryover", label: "", value: prevCarry, type: "passive" }]
      : prev.income;
    const prevExpensesWithCarryover = prevCarry !== null && prevCarry < 0
      ? [...prev.expenses, { id: "__carryover_exp", label: "", value: Math.abs(prevCarry), category: "Carryover" }]
      : prev.expenses;

    const { surplus } = buildLayout(prevIncomeWithCarryover, prevExpensesWithCarryover, 600, 400);
    return surplus;
  };

  const getCarryoverValue = (key) => {
    const override = carryoverOverrides[key];
    if (override) return override.value;
    return getCarryoverAuto(key);
  };

  const isCarryoverManual = (key) => !!(carryoverOverrides[key]?.isManual);

  // Watch for prev month changes and prompt if current month has manual carryover
  const prevMonthDataRef = useRef(null);
  useEffect(() => {
    if (!cloudLoaded.current) return;
    if (!isCarryoverManual(curKey)) return;
    const [y, m] = curKey.split("-").map(Number);
    const pk = m === 1 ? toKey(y - 1, 12) : toKey(y, m - 1);
    const prevData = JSON.stringify(months[pk]);
    if (prevMonthDataRef.current === null) { prevMonthDataRef.current = prevData; return; }
    if (prevData === prevMonthDataRef.current) return;
    prevMonthDataRef.current = prevData;
    const autoVal = getCarryoverAuto(curKey);
    if (autoVal === null) return;
    const currentVal = carryoverOverrides[curKey]?.value;
    if (autoVal !== currentVal) {
      const prevMonth = MONTH_NAMES[m === 1 ? 11 : m - 2];
      setCarryoverPrompt({ key: curKey, autoValue: autoVal, prevLabel: prevMonth });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months]);

  useEffect(() => { prevMonthDataRef.current = null; }, [curKey]);

  // Build income/expense arrays with carryover injected
  const getIncomeWithCarryover = (key) => {
    const base = months[key]?.income || [];
    const carryVal = getCarryoverValue(key);
    if (carryVal === null || carryVal <= 0) return base;
    // Only surplus carryover goes into income
    return [...base, { id: "__carryover", label: tr("cat_surplus_carryover"), value: carryVal, type: "passive", _isCarryover: true }];
  };

  const getExpensesWithCarryover = (key) => {
    const base = months[key]?.expenses || [];
    const carryVal = getCarryoverValue(key);
    if (carryVal === null || carryVal >= 0) return base;
    // Deficit carryover injected as special expense - buildLayout handles it on left side
    return [...base, { id: "__carryover_exp", label: tr("cat_deficit_carryover"), value: Math.abs(carryVal), category: "Carryover", _isCarryover: true }];
  };


  const importRef = useRef(null);
  const [shareCopied, setShareCopied] = useState(false);

  const handleSave = () => {
    const data = JSON.stringify(months, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `cashflow-${today.getFullYear()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const migrated = Object.fromEntries(
          Object.entries(parsed).map(([key, val]) => [
            key,
            { income: val.income || [], expenses: migrateExpenses(val.expenses || []) }
          ])
        );
        setMonths(migrated);
        cloudLoaded.current = true;
        Object.entries(migrated).forEach(([key, data]) => {
          if (data.income?.length || data.expenses?.length) forceSaveMonth(key, data);
        });
      } catch { alert("Invalid file format."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleShare = () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(months[curKey])));
      const url = `${window.location.origin}${window.location.pathname}?month=${curKey}&data=${encoded}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  };

  let layoutResult = { nodes: [], links: [], nodeWidth: 14, grand: 0, earnedIncome: 0, totalExp: 0, surplus: 0 };
  try {
    const incomeWithCarryover   = getIncomeWithCarryover(displayKey);
    const expensesWithCarryover = getExpensesWithCarryover(displayKey);
    layoutResult = buildLayout(incomeWithCarryover, expensesWithCarryover, svgW, svgH, colOffsets);
  } catch {}
  const { nodes, links, nodeWidth, grand, earnedIncome, totalExp, surplus, colX } = layoutResult;

  // Translate node labels for current language
  const NODE_I18N = {
    "__active":           "cat_active",
    "__passive":          "cat_passive",
    "__carryover":        "cat_surplus_carryover",
    "__carryover_deficit":"cat_deficit_carryover",
    "__surplus":          "cat_surplus",
    "__deficit_cat":      "cat_deficit",
  };
  nodes.forEach(n => {
    if (n.id.startsWith("__cat_")) {
      const cat = n.id.replace("__cat_", "");
      const key = CAT_I18N_KEY[cat];
      if (key) n.label = tr(key) || n.label;
    } else if (NODE_I18N[n.id]) {
      n.label = tr(NODE_I18N[n.id]) || n.label;
    }
  });

  // Assign category color to leaf nodes
  nodes.forEach(n => {
    if (n.group === "leaf") {
      const parentLink = links.find(l => l.target === n.id);
      if (parentLink) {
        const catNode = nodes.find(nd => nd.id === parentLink.source);
        if (catNode?.color) n.color = catNode.color;
      }
    }
  });

  const nodeMapD = {};
  nodes.forEach(n => { nodeMapD[n.id] = n; });
  links.forEach(l => {
    const s = nodeMapD[l.source], t = nodeMapD[l.target];
    if (s && t) { l.sx = s.x + (s.w || nodeWidth); l.tx = t.x; }
  });

  const getLinkColor = link => {
    const col = link.sourceNode?.col ?? 0;
    if (link.source === "__col1_deficit_phantom") return "transparent";
    if (link.source === "__total" && link.target === "__deficit_cat") return "#f87171";
    if (link.source === "__total" && link.target === "__surplus")     return "#86efac";
    if (link.source === "__carryover") return "#86efac";
    if (link.source === "__carryover_deficit") return "#f87171";
    if (col <= 1) {
      const grp = link.sourceNode?.group ?? "";
      if (grp === "source_active"  || grp === "agg_active")  return LINK_LEFT_ACTIVE[Math.min(col, 1)];
      if (grp === "source_passive" || grp === "agg_passive") return LINK_LEFT_PASSIVE[Math.min(col, 1)];
      return LINK_LEFT[Math.min(col, 1)];
    }
    // col3->col4: source is __cat_X — color by source category
    const srcIdx = CATS.findIndex(c => link.source === "__cat_" + c);
    if (srcIdx >= 0) return LINK_RIGHT[srcIdx];
    // col2->col3: source is __total — color by target category
    const tgtIdx = CATS.findIndex(c => link.target === "__cat_" + c);
    if (tgtIdx >= 0) return LINK_RIGHT[tgtIdx];
    return "#9575cd";
  };

  const hovLink = hovered ? links.find(l => l.chainId === hovered || l.source + "-" + l.target === hovered) : null;

  // ── shared styles ─────────────────────────────────────────────────────────
  const cardSt  = { background: T.bgCard, borderRadius: 14, padding: "14px 16px",
    border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 0, transition: "background 0.1s" };
  const inpSt   = { flex: 1, minWidth: 0, background: T.bgInput, border: `1px solid ${T.borderInput}`,
    borderRadius: 6, color: T.textNode, fontSize: 15, padding: "5px 7px", outline: "none" };
  const selSt   = { background: T.bgInput, border: `1px solid ${T.borderInput}`, borderRadius: 6,
    color: T.selText, fontSize: 15, padding: "5px 7px", outline: "none" };
  const btnSt   = { background: T.btnBg, border: "none", borderRadius: 6, color: T.btnText,
    fontSize: 15, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 };
  const subHead = label => (
    <div style={{ fontSize: 13, letterSpacing: "0.13em", textTransform: "uppercase",
      color: T.textSub, margin: "10px 0 5px" }}>{label}</div>
  );
  const colHead = (label, total, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <span style={{ fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accentHead }}>{label}</span>
      <span style={{ fontSize: 19, fontWeight: 700, color }}>${Number(total).toLocaleString()}</span>
    </div>
  );

  // ── render ────────────────────────────────────────────────────────────────
  if (loggingOut) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f0f1a" }}><div style={{ color: "#c4b5fd", fontSize: 18 }}>Signing out...</div></div>;
  return (
    <>
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: darkMode
        ? `radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.18) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.12) 0%, transparent 50%), ${T.bg}`
        : `radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 50%), ${T.bg}`, minHeight: "100vh",
      padding: "24px 18px", color: T.text, boxSizing: "border-box", transition: "background 0.1s, color 0.1s", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: darkMode ? "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)" : "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: T.accent, marginBottom: 4 }}>Financial Overview</div>
              <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, margin: "0", letterSpacing: "-0.02em" }}>Cash Flow Visualizer</h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
                <div ref={backupBtnsRef} style={{ display: "flex", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                  {[
                    { label: tr("app_backup"), onClick: handleSave },
                    { label: tr("app_restore"), onClick: () => importRef.current?.click() },
                    { label: tr("app_share"), onClick: handleShare, active: shareCopied },
                    { label: "Import Statement", onClick: () => setShowImport(true) },
                  ].map((btn, i) => (
                    <button key={i} onClick={btn.onClick} style={{
                      background: btn.active ? "#16a34a" : T.bgCard,
                      border: "none",
                      borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
                      color: btn.active ? "#fff" : T.text,
                      fontSize: 13, fontWeight: 500,
                      padding: "6px 14px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 0.2s",
                    }}>
                      {btn.active ? tr("app_share_copied") : btn.label}
                    </button>
                  ))}
                </div>
                <div ref={settingsBtnsRef} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <select value={lang} onChange={e => setLang(e.target.value)} style={{
                    background: T.btnBg, border: `1px solid ${T.border}`, borderRadius: 10,
                    padding: "6px 28px 6px 10px", cursor: "pointer", color: T.btnText,
                    fontSize: 13, fontWeight: 500, outline: "none",
                    appearance: "none", WebkitAppearance: "none",
                  }}>
                    {[{ code: "en", flag: "🇬🇧", label: "EN" }, { code: "es", flag: "🇪🇸", label: "ES" }, { code: "de", flag: "🇩🇪", label: "DE" }].map(l => (
                      <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: T.textMuted, fontSize: 10, pointerEvents: "none" }}>▾</span>
                </div>
                <button onClick={() => setDarkMode(d => !d)} style={{
                  background: T.btnBg, border: `1px solid ${T.border}`, borderRadius: 10,
                  padding: "6px 14px", cursor: "pointer", color: T.btnText,
                  fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s", flexShrink: 0,
                }}>
                  {darkMode ? tr("app_light") : tr("app_dark")}
                </button>
                <button onClick={async () => { setLoggingOut(true); await onSignOut(); setLoggingOut(false); }} style={{
                  background: T.btnBg, border: `1px solid ${T.border}`, borderRadius: 10,
                  padding: "6px 14px", cursor: "pointer", color: T.btnText,
                  fontSize: 13, fontWeight: 500, transition: "all 0.2s", flexShrink: 0,
                }}>
                  {tr("app_sign_out")}
                </button>
                </div>{/* /settingsBtnsRef */}
              </div>
              <button onClick={copyFromPrev} style={{
                background: "#7c3aed", border: "none", borderRadius: 20,
                padding: "6px 14px", cursor: "pointer", color: "#fff",
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                visibility: (isEmpty && hasPrev) ? "visible" : "hidden",
              }}>
                {tr("app_copy_prev")}
              </button>
            </div>
          </div>
        </div>

        {/* Sankey card — month strip on top, tooltip bar on bottom */}
        {(() => {
          const hlColor = "#c4b5fd";
          const dataMonths = MONTH_NAMES
            .map((_, i) => toKey(today.getFullYear(), i + 1))
            .filter(key => !!(months[key]?.income?.length || months[key]?.expenses?.length));
          const curDataIdx = dataMonths.indexOf(curKey);
          const canGoPrev  = curDataIdx > 0;
          const canGoNext  = curDataIdx < dataMonths.length - 1;
          const goPrev = () => { if (canGoPrev) { setCurKey(dataMonths[curDataIdx - 1]); setHovMonth(null); } };
          const goNext = () => { if (canGoNext) { setCurKey(dataMonths[curDataIdx + 1]); setHovMonth(null); } };
          const navBtnSt = (enabled) => ({
            background: T.btnBg, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: "5px 9px", cursor: enabled ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: enabled ? 1 : 0.28, transition: "opacity 0.15s", flexShrink: 0,
          });
          return (
            <div style={{ background: T.bgCard, borderRadius: 14, border: `1px solid ${T.border}`, transition: "background 0.1s", overflow: "hidden" }}>

              {/* Month strip */}
              <div ref={monthStripRef} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 44, borderBottom: `1px solid ${T.border}` }}>
                {/* ← → grouped pill on the left */}
                <div style={{ display: "flex", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <button onClick={goPrev} disabled={!canGoPrev} style={{ ...navBtnSt(canGoPrev), border: "none", borderRadius: 0 }}>
                    <DoubleArrow direction="left" color={hlColor} />
                  </button>
                  <div style={{ width: 1, background: T.border, flexShrink: 0 }} />
                  <button onClick={goNext} disabled={!canGoNext} style={{ ...navBtnSt(canGoNext), border: "none", borderRadius: 0 }}>
                    <DoubleArrow direction="right" color={hlColor} />
                  </button>
                </div>
                <div style={{ display: "flex", flex: 1, gap: 2 }} onClick={() => setCtxMenu(null)}>
                  {(tr("months") || MONTH_NAMES).map((name, i) => {
                    const key = toKey(today.getFullYear(), i + 1);
                    const isSelected = key === curKey;
                    const isHovered  = key === hovMonth;
                    const hasData    = !!(months[key]?.income?.length || months[key]?.expenses?.length);
                    const prevKey = i === 0 ? null : toKey(today.getFullYear(), i);
                    const prevHasData = prevKey && !!(months[prevKey]?.income?.length || months[prevKey]?.expenses?.length);
                    return (
                      <div key={key} style={{ flex: 1, position: "relative" }}
                        onMouseEnter={() => {
                          clearTimeout(ctxMenuTimer.current);
                          if (!hasData && key !== curKey && prevHasData) setHovEmpty(key);
                        }}
                        onMouseLeave={() => {
                          setHovEmpty(null);
                          ctxMenuTimer.current = setTimeout(() => setCtxMenu(null), 200);
                        }}
                      >
                      <button
                        onClick={() => { if (hasData) { setCurKey(key); setHovMonth(null); setHovEmpty(null); } }}
                        onMouseEnter={() => hasData && setHovMonth(key)}
                        onMouseLeave={() => setHovMonth(null)}
                        onContextMenu={e => { if (hasData) { e.preventDefault(); setCtxMenu({ key, i }); } }}
                        style={{
                          width: "100%",
                          flex: 1, background: isSelected || isHovered ? "rgba(167,139,250,0.12)" : "transparent",
                          border: isSelected ? `1px solid ${T.border}` : isHovered ? `1px solid ${T.accent}44` : "1px solid transparent",
                          borderRadius: 7,
                          color: isSelected || isHovered ? hlColor : hasData ? T.text : T.textFaint,
                          fontSize: 13, fontWeight: isSelected || isHovered ? 700 : 400,
                          padding: "5px 2px", cursor: hasData ? "pointer" : "default", textAlign: "center",
                          opacity: isSelected || isHovered ? 1 : hasData ? 0.85 : 0.45,
                          transition: "all 0.15s", whiteSpace: "nowrap",
                        }}>{name}</button>
                      {hovEmpty === key && prevHasData && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 6px)",
                          ...(i >= 10 ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }),
                          background: darkMode ? "rgba(30,27,46,0.92)" : "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                          border: `1px solid ${T.accent}59`,
                          borderRadius: 8, padding: "4px", zIndex: 999,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: 200,
                        }}>
                          <div style={{ position: "absolute", top: -10, left: 0, right: 0, height: 10 }} />
                          <button onClick={() => {
                            const prev = months[prevKey];
                            const copied = {
                              income: prev.income.map(i => ({ ...i, id: uid() })),
                              expenses: prev.expenses.map(e => ({ ...e, id: uid() })),
                            };
                            setMonths(p => ({ ...p, [key]: copied }));
                            saveMonth(key, copied);
                            setCurKey(key);
                            setHovEmpty(null);
                          }} style={{
                            width: "100%", background: "transparent", border: "none",
                            borderRadius: 6, color: T.textNode, fontSize: 11, padding: "6px 8px",
                            cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
                            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >📋 Copy data from previous month</button>
                          <button onClick={() => { setCurKey(key); setShowImport(true); setHovEmpty(null); }} style={{
                            width: "100%", background: "transparent", border: "none",
                            borderRadius: 6, color: T.textNode, fontSize: 11, padding: "6px 8px",
                            cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
                            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >📥 Import data</button>
                        </div>
                      )}
                      {ctxMenu?.key === key && (
                        <div
                          onMouseEnter={() => clearTimeout(ctxMenuTimer.current)}
                          onMouseLeave={() => { ctxMenuTimer.current = setTimeout(() => setCtxMenu(null), 200); }}
                          style={{
                            position: "absolute", top: "calc(100% + 6px)",
                            ...(i >= 10 ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }),
                            background: darkMode ? "rgba(30,27,46,0.92)" : "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                            border: `1px solid ${T.accent}59`,
                            borderRadius: 8, padding: "4px", zIndex: 999,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: 148,
                          }}>
                          <button onClick={() => { setConfirmDel(ctxMenu.key); setCtxMenu(null); }} style={{
                            width: "100%", background: "transparent", border: "none",
                            borderRadius: 6, color: "#f87171", fontSize: 11, padding: "6px 8px",
                            cursor: "pointer", textAlign: "center", whiteSpace: "nowrap",
                            fontFamily: "inherit", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: 6,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >🗑 Delete month</button>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SVG */}
              <div ref={svgRef} style={{ padding: "12px 8px", minHeight: 320, maxHeight: 750, overflow: "hidden" }}>
                <svg key={curKey} width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
                  {links.filter(l => l.source !== "__carryover_deficit").map(l => (
                    <LinkPath key={l.source + "-" + l.target} link={l} color={getLinkColor(l)} onHover={setHovered} hoveredChain={hovered} colX={colX} />
                  ))}
                  {links.filter(l => l.source === "__carryover_deficit").map(l => (
                    <LinkPath key={l.source + "-" + l.target} link={l} color={getLinkColor(l)} onHover={setHovered} hoveredChain={hovered} colX={colX} />
                  ))}
                  {nodes.map(n => (
                    <SankeyNode key={n.id} n={n} nodeWidth={nodeWidth} T={T}
                      GROUP_COLORS={GROUP_COLORS} grand={grand} earnedIncome={earnedIncome} totalExp={totalExp} fmt={fmt} pct={pct} startDrag={startDrag} isDark={darkMode} hoveredLinks={links.filter(l => l.chainId === hovered || (l.chainIds && l.chainIds.includes(hovered)))}
                      labelTotal="Total" labelIncome={tr("app_income")} labelExpenses={tr("app_expenses")} />
                  ))}
                </svg>
              </div>

              {/* Tooltip bar */}
              <div ref={tooltipBarRef} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: 44, borderTop: `1px solid ${T.border}`, fontSize: 14, color: T.textNode, transition: "background 0.1s" }}>
                <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                  <span style={{ color: T.textMuted }}>{tr("tooltip_income")}: <strong style={{ color: T.accent }}>${Number(earnedIncome).toLocaleString()}</strong></span>
                  <span style={{ color: T.textMuted }}>{tr("tooltip_expenses")}: <strong style={{ color: T.text }}>${Number(totalExp).toLocaleString()}</strong></span>
                  <span style={{ color: T.textMuted }}>
                    {surplus >= 0
                      ? <><strong style={{ color: darkMode ? "#86efac" : "#16a34a" }}>{tr("tooltip_surplus")}</strong>{": "}<strong style={{ color: darkMode ? "#86efac" : "#16a34a" }}>${surplus.toLocaleString()}</strong></>
                      : <><strong style={{ color: darkMode ? "#f87171" : "#dc2626" }}>{tr("tooltip_deficit")}</strong>{": "}<strong style={{ color: darkMode ? "#f87171" : "#dc2626" }}>${Math.abs(surplus).toLocaleString()}</strong></>}
                  </span>
                  {(() => {
                    const cv = getCarryoverValue(displayKey);
                    if (cv === null) return null;
                    const isPos = cv >= 0;
                    const color = isPos ? "#86efac" : "#f87171";
                    return (
                      <span style={{ color: T.textMuted }}>
                        ↩ <strong style={{ color }}>{isPos ? "+" : "-"}${Math.abs(cv).toLocaleString()}</strong>
                      </span>
                    );
                  })()}
                </div>
                <div>
                  {hovLink ? (
                    <span>
                      <span style={{ color: T.textDim, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.1em" }}>{tr("tooltip_flow")} · </span>
                      <strong style={{ color: T.accent }}>{hovLink.sourceNode.label} → {hovLink.targetNode.label}</strong>
                      <span style={{ color: T.textDim }}> · ${hovLink.value.toLocaleString()} ({pct(hovLink.value, grand)})</span>
                    </span>
                  ) : (
                    <span style={{ color: T.textMuted }}>{tr("tooltip_hint")}</span>
                  )}
                </div>
              </div>

            </div>
          );
        })()}

        {/* Editor */}
        <div ref={editorRef} style={{ display: "flex", gap: 14, marginTop: 10, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Income */}
          <div style={{ ...cardSt, flex: 1, minWidth: 240 }}>
            {colHead(tr("app_income"), earnedIncome, "#c4b5fd")}
            {subHead(tr("app_active"))}
            {income.filter(i => i.type === "active").map(item => (
              <ItemRow key={item.id} item={item} accent="#818cf8" T={T}
                onLabel={v => updInLabel(item.id, v)} onValue={v => updInValue(item.id, v)} onRemove={() => remIn(item.id)} />
            ))}
            {subHead(tr("app_passive"))}
            {income.filter(i => i.type === "passive").map(item => (
              <ItemRow key={item.id} item={item} accent="#a78bfa" T={T}
                onLabel={v => updInLabel(item.id, v)} onValue={v => updInValue(item.id, v)} onRemove={() => remIn(item.id)} />
            ))}
            {/* Carryover row - surplus or deficit, both shown in income panel */}
            {(() => {
              const carryVal = getCarryoverValue(curKey);
              if (carryVal === null) return null;
              const isPos = carryVal > 0;
              const color = isPos ? "#86efac" : "#f87171";
              const label = isPos ? tr("cat_surplus_carryover") : tr("cat_deficit_carryover");
              const absVal = Math.abs(carryVal);
              const isManual = isCarryoverManual(curKey);
              return (
                <div style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: T.textSub, marginBottom: 6 }}>
                    Carryover {isManual ? <span style={{ color: T.textDim, fontSize: 10 }}>(manual)</span> : <span style={{ color: T.textDim, fontSize: 10 }}>(auto)</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 3, height: 34, borderRadius: 2, background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1, background: T.bgInput, border: `1px solid ${T.borderInput}`, borderRadius: 6, color, fontSize: 14, padding: "4px 7px", fontWeight: 600 }}>
                      {label}
                    </div>
                    {editingCarryover ? (
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", color: T.textDim, fontSize: 14, pointerEvents: "none" }}>$</span>
                        <input type="number" min="0" value={carryoverEditVal}
                          onChange={e => setCarryoverEditVal(e.target.value)}
                          onBlur={() => { const v = Number(carryoverEditVal); if (!isNaN(v)) setCarryoverOverrides(p => ({ ...p, [curKey]: { value: isPos ? v : -v, isManual: true } })); setEditingCarryover(false); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingCarryover(false); }}
                          autoFocus style={{ width: 86, background: T.bgInput, border: `1px solid ${T.accent}`, borderRadius: 6, color: T.textVal, fontSize: 14, padding: "4px 6px 4px 18px", outline: "none" }} />
                      </div>
                    ) : (
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", color: T.textDim, fontSize: 14, pointerEvents: "none" }}>$</span>
                        <div onClick={() => { setCarryoverEditVal(String(absVal)); setEditingCarryover(true); }}
                          style={{ width: 86, background: T.bgInput, border: `1px solid ${T.borderInput}`, borderRadius: 6, color: T.textVal, fontSize: 14, padding: "4px 6px 4px 18px", cursor: "pointer" }}
                        >{absVal.toLocaleString()}</div>
                      </div>
                    )}
                    <button title="Reset to auto" onClick={() => setCarryoverOverrides(p => { const n = { ...p }; delete n[curKey]; return n; })}
                      style={{ background: "none", border: "none", color: isManual ? T.textMuted : T.textFaint, cursor: isManual ? "pointer" : "default", fontSize: 14, padding: "0 2px", lineHeight: 1 }}
                      onMouseEnter={e => { if (isManual) e.currentTarget.style.color = color; }}
                      onMouseLeave={e => { e.currentTarget.style.color = isManual ? T.textMuted : T.textFaint; }}
                    >↺</button>
                  </div>
                </div>
              );
            })()}
            <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
              <input placeholder={tr("app_add_placeholder")} value={niLabel} onChange={e => setNiLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addIn()} style={inpSt} />
              <select value={niType} onChange={e => setNiType(e.target.value)} style={selSt}>
                <option value="active">{tr("app_active")}</option>
                <option value="passive">{tr("app_passive")}</option>
              </select>
              <button onClick={addIn} style={btnSt}>{tr("app_add_btn")}</button>
            </div>
          </div>

          {/* Expenses */}
          <div style={{ ...cardSt, flex: 1, minWidth: 240 }}>
            {colHead(tr("app_expenses"), totalExp, "#fbcfe8")}
            {CATS.map(cat => (
              <div key={cat}>
                {subHead(tr(CAT_I18N_KEY[cat]) || cat)}
                {expenses.filter(e => e.category === cat).map(item => (
                  <ItemRow key={item.id} item={item} accent={CAT_COLORS[cat]} T={T}
                    onLabel={v => updExLabel(item.id, v)} onValue={v => updExValue(item.id, v)} onRemove={() => remEx(item.id)} />
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
              <input placeholder={tr("app_add_placeholder")} value={neLabel} onChange={e => setNeLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addEx()} style={selSt} />
              <select value={neCat} onChange={e => setNeCat(e.target.value)} style={selSt}>
                {CATS.map(c => <option key={c} value={c}>{tr(CAT_I18N_KEY[c]) || c}</option>)}
              </select>
              <button onClick={addEx} style={btnSt}>{tr("app_add_btn")}</button>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
      {/* Carryover update prompt */}
      {carryoverPrompt && (
        <div onClick={() => setCarryoverPrompt(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1002, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "28px 32px", maxWidth: 360, width: "90%",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>↩</div>
            <h3 style={{ color: T.text, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Carryover changed</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              <strong style={{ color: T.text }}>{carryoverPrompt.prevLabel}</strong> was updated.
              Reset carryover to the new auto-calculated value of{" "}
              <strong style={{ color: carryoverPrompt.autoValue >= 0 ? "#86efac" : "#f87171" }}>
                {carryoverPrompt.autoValue >= 0 ? "+" : "-"}${Math.abs(carryoverPrompt.autoValue).toLocaleString()}
              </strong>?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setCarryoverPrompt(null)} style={{
                flex: 1, background: T.btnBg, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: T.text, fontSize: 14, fontWeight: 600,
              }}>Keep manual</button>
              <button onClick={() => {
                setCarryoverOverrides(p => { const n = { ...p }; delete n[carryoverPrompt.key]; return n; });
                setCarryoverPrompt(null);
              }} style={{
                flex: 1, background: "#7c3aed", border: "none",
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: "#fff", fontSize: 14, fontWeight: 600,
              }}>Reset to auto</button>
            </div>
          </div>
        </div>
      )}


      {/* Import screen */}
      {showImport && (
        <ImportScreen
          onClose={() => setShowImport(false)}
          onImport={(txns) => { handleImportTransactions(txns); }}
          T={T}
          darkMode={darkMode}
        />
      )}

      {/* Import overwrite confirmation */}
      {importConfirm && (
        <div onClick={() => setImportConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "28px 32px", maxWidth: 380, width: "90%",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)", textAlign: "center",
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: T.text, fontSize: 17, fontWeight: 700, marginBottom: 10, margin: "0 0 10px" }}>Replace existing data?</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              This month already has data. Importing will <strong style={{ color: "#f87171" }}>erase all current entries</strong> and replace them with the imported transactions.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setImportConfirm(null)} style={{
                flex: 1, background: T.btnBg, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: T.text, fontSize: 14, fontWeight: 600,
              }}>Cancel</button>
              <button onClick={() => { applyImport(importConfirm); setImportConfirm(null); setShowImport(false); }} style={{
                flex: 1, background: "#ef4444", border: "none",
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: "#fff", fontSize: 14, fontWeight: 600,
              }}>Yes, replace</button>
            </div>
          </div>
        </div>
      )}

      {/* Tour overlay */}
      {showTour && (
        <TourOverlay
          backupBtnsRef={backupBtnsRef}
          settingsBtnsRef={settingsBtnsRef}
          monthStripRef={monthStripRef}
          svgRef={svgRef}
          tooltipBarRef={tooltipBarRef}
          editorRef={editorRef}
          darkMode={darkMode}
          onDone={() => setShowTour(false)}
        />
      )}

      {/* Confirm delete dialog */}
      {confirmDel && (
        <div onClick={() => setConfirmDel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1002, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "28px 32px", maxWidth: 340, width: "90%",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗑</div>
            <h3 style={{ color: T.text, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete this month?</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              All data for <strong style={{ color: T.text }}>{confirmDel}</strong> will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDel(null)} style={{
                flex: 1, background: T.btnBg, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: T.text, fontSize: 14, fontWeight: 600,
              }}>Cancel</button>
              <button onClick={() => deleteMonth(confirmDel)} style={{
                flex: 1, background: "#ef4444", border: "none",
                borderRadius: 10, padding: "10px", cursor: "pointer",
                color: "#fff", fontSize: 14, fontWeight: 600,
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
