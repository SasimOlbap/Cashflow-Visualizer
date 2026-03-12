import { useState } from "react";
import { translations } from "./i18n";

const LANGS = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

export default function Landing({ onGetStarted, onLogin, lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang] || translations.en;
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#fafaf8", color: "#1a1a1a", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .cta-btn { transition: opacity 0.2s, transform 0.15s; }

        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .pricing-card:hover { transform: translateY(-6px); }
        .pricing-card { transition: transform 0.25s ease; }
        .nav-link:hover { color: #c4b5fd; }
        .nav-link { transition: color 0.15s; cursor: pointer; }
        .fade-in { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .hero-bg {
          background: radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.35) 0%, transparent 50%),
                      radial-gradient(ellipse at 20% 80%, rgba(79,70,229,0.2) 0%, transparent 50%),
                      #0a0818;
        }
        .lang-select {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 28px 7px 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
        }
        .lang-select:hover { border-color: rgba(255,255,255,0.3); }
        .lang-select option { background: #0f0f1a; color: #e2e8f0; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-demo { display: none !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns button { width: 100% !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 60px 20px 48px !important; }
          .features-section { padding: 56px 20px !important; }
          .pricing-section { padding: 56px 20px !important; }
          .footer-cta-section { padding: 56px 20px !important; }
          .footer-cta-btn { width: 100% !important; }
          nav { padding: 0 20px !important; }
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="hero-bg" style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "baseline", gap: 8, cursor: "pointer" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Cash Flow</span>
            <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>Visualizer</span>
          </div>
          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span onClick={() => scrollTo("features")} className="nav-link" style={{ fontSize: 14, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{t.nav_features}</span>
            <span onClick={() => scrollTo("pricing")} className="nav-link" style={{ fontSize: 14, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{t.nav_pricing}</span>
            <div style={{ position: "relative" }}>
              <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
              </select>
              <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 10, pointerEvents: "none" }}>▾</span>
            </div>
            <button onClick={onLogin} className="cta-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: "#9ca3af" }}>
              {t.nav_login}
            </button>
          </div>
          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexDirection: "column", gap: 5 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 22, height: 2, background: "#9ca3af", borderRadius: 2,
                transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)" : menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
                opacity: menuOpen && i===1 ? 0 : 1, transition: "all 0.2s" }} />
            ))}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile-menu" style={{ flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 0 20px" }}>
            <span onClick={() => scrollTo("features")} style={{ padding: "12px 0", fontSize: 15, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" }}>{t.nav_features}</span>
            <span onClick={() => scrollTo("pricing")} style={{ padding: "12px 0", fontSize: 15, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" }}>{t.nav_pricing}</span>
            <button onClick={onLogin} style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: "#9ca3af" }}>
              {t.nav_login}
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="hero-bg hero-section" style={{ position: "relative", padding: "100px 40px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          <div>
            <div className="fade-in" style={{ animationDelay: "0s", display: "inline-block", background: "rgba(124,58,237,0.2)", color: "#c4b5fd", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 28, fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(124,58,237,0.3)" }}>
              {t.hero_badge}
            </div>
            <h1 className="fade-in" style={{ animationDelay: "0.1s", fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#fff" }}>
              {t.hero_title1}<br /><span style={{ color: "#a78bfa" }}>{t.hero_title2}</span>
            </h1>
            <p className="fade-in" style={{ animationDelay: "0.2s", fontSize: 17, lineHeight: 1.8, color: "#9ca3af", marginBottom: 40, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {t.hero_subtitle}
            </p>
            <div className="fade-in hero-btns" style={{ animationDelay: "0.3s", display: "flex", gap: 12 }}>
              <button onClick={() => scrollTo("pricing")} className="cta-btn" style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {t.hero_cta}
              </button>

            </div>
            <p className="fade-in" style={{ animationDelay: "0.4s", marginTop: 18, fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
              {t.hero_note}
            </p>
          </div>
          {/* Demo card */}
          <div className="fade-in hero-demo" style={{ animationDelay: "0.2s", background: "#0f0f1a", borderRadius: 16, padding: 24, boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{t.demo_overview}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>Cash Flow Visualizer</div>
              </div>
              <div style={{ background: "#1a1a2e", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>Jan 2026</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "stretch", height: 160, marginBottom: 12 }}>
              {[
                [{ h: 100, c: "#b39ddb" }, { h: 35, c: "#9575cd" }, { h: 18, c: "#a78bfa" }],
                [{ h: 100, c: "#b39ddb" }, { h: 50, c: "#9575cd" }],
                [{ h: 153, c: "#6a0dad" }],
                [{ h: 70, c: "#ef9a9a" }, { h: 50, c: "#f48fb1" }, { h: 33, c: "#ce93d8" }],
                [{ h: 60, c: "#ef9a9a" }, { h: 45, c: "#f48fb1" }, { h: 30, c: "#ff8a65" }, { h: 18, c: "#66bb6a" }],
              ].map((col, ci) => (
                <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                  {col.map((b, bi) => <div key={bi} style={{ height: b.h * 0.85, background: b.c, borderRadius: 4, opacity: 0.85 }} />)}
                </div>
              ))}
            </div>
            <div style={{ background: "#161625", borderRadius: 8, padding: "8px 14px", display: "flex", gap: 16, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: "#6b7280" }}>{t.demo_income}: <strong style={{ color: "#c4b5fd" }}>$5,996</strong></span>
              <span style={{ color: "#6b7280" }}>{t.demo_expenses}: <strong style={{ color: "#f48fb1" }}>$5,060</strong></span>
              <span style={{ color: "#6b7280" }}>{t.demo_surplus}: <strong style={{ color: "#66bb6a" }}>$936</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section" style={{ padding: "80px 40px", background: "#fff", borderTop: "1px solid #e8e4df" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{t.features_label}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: "#0f0f1a", letterSpacing: "-0.02em" }}>
              {t.features_heading1}<br />{t.features_heading2}
            </h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {t.features.map((f, i) => (
              <div key={i} className="feature-card" style={{ background: "#fafaf8", border: "1px solid #e8e4df", borderRadius: 14, padding: "28px 22px" }}>
                <div style={{ fontSize: 22, color: "#7c3aed", marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0f0f1a", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section" style={{ padding: "80px 40px", background: "#fafaf8", borderTop: "1px solid #e8e4df" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{t.pricing_label}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: "#0f0f1a", letterSpacing: "-0.02em" }}>{t.pricing_heading}</h2>
          </div>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {t.pricing.map((p, i) => (
              <div key={i} className="pricing-card" style={{ background: p.highlight ? "#0f0f1a" : "#fff", border: p.highlight ? "2px solid #7c3aed" : "1px solid #e8e4df", borderRadius: 16, padding: "32px 28px", position: "relative" }}>
                {p.highlight && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: p.comingSoon ? "#4b5563" : "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 16px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{p.comingSoon ? t.pricing_coming_soon : t.pricing_most_popular}</div>}
                {p.comingSoon && !p.highlight && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#4b5563", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 16px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{t.pricing_coming_soon}</div>}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: p.highlight ? "#9ca3af" : "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900, color: p.highlight ? "#fff" : "#0f0f1a", filter: p.comingSoon ? "blur(6px)" : "none", userSelect: p.comingSoon ? "none" : "auto" }}>{p.price}</span>
                    <span style={{ fontSize: 13, color: p.highlight ? "#6b7280" : "#9ca3af", fontFamily: "'DM Sans', sans-serif", filter: p.comingSoon ? "blur(4px)" : "none" }}>/{p.comingSoon ? t.pricing_per_month : t.pricing_forever}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
                  {p.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span style={{ color: p.comingSoon ? "#6b7280" : "#7c3aed", fontSize: 13 }}>✓</span>
                      <span style={{ fontSize: 13, color: p.highlight ? "#d1d5db" : "#4b5563", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button disabled={p.comingSoon} onClick={!p.comingSoon ? onGetStarted : undefined} style={{ width: "100%", background: p.comingSoon ? (p.highlight ? "#2d2d3a" : "#f3f4f6") : (p.highlight ? "#7c3aed" : "#fff"), color: p.comingSoon ? "#6b7280" : (p.highlight ? "#fff" : "#4b5563"), border: p.highlight ? "none" : "1px solid #e8e4df", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 600, cursor: p.comingSoon ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta-section" style={{ padding: "80px 40px", background: "#0f0f1a", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>{t.footer_cta_heading}</h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 32, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{t.footer_cta_sub}</p>
          <button onClick={onGetStarted} className="cta-btn footer-cta-btn" style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "16px 36px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{t.footer_cta_btn}</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 40px", background: "#0a0a12", borderTop: "1px solid #1f1f35" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#4b5563" }}>Cash Flow Visualizer</span>
          <span style={{ fontSize: 13, color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>{t.footer_rights}</span>
        </div>
      </footer>
    </div>
  );
}
