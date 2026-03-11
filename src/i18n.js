export const translations = {
  en: {
    // Nav
    nav_features: "Features",
    nav_pricing: "Pricing",
    nav_login: "Log In",

    // Hero
    hero_badge: "Personal Finance · Visual",
    hero_title1: "Visualize your money,",
    hero_title2: "month by month.",
    hero_subtitle: "A beautiful Sankey diagram that shows exactly where your money comes from and where it goes — every single month.",
    hero_cta: "Get Started Free →",
    hero_secondary: "See how it works",
    hero_note: "No credit card required · Free forever plan",

    // Demo card
    demo_overview: "Financial Overview",

    // Features section
    features_label: "Features",
    features_heading1: "Everything you need to",
    features_heading2: "understand your finances",
    features: [
      { title: "Interactive Sankey Diagram", desc: "Watch your money flow visually from income to every expense category in real time." },
      { title: "12-Month Overview",          desc: "Navigate through every month of the year and build a complete picture of your finances." },
      { title: "Share & Export",             desc: "Share a snapshot of any month via URL, or export your full data as a JSON file." },
      { title: "Cloud Sync",                 desc: "Your data is saved securely in the cloud. Access it from any device, any time." },
    ],

    // Pricing
    pricing_label: "Pricing",
    pricing_heading: "Simple, transparent pricing",
    pricing_coming_soon: "Coming Soon",
    pricing_most_popular: "Most Popular",
    pricing_forever: "forever",
    pricing_per_month: "per month",
    pricing: [
      {
        name: "Free", price: "$0", highlight: false, cta: "Get Started Free", comingSoon: false,
        features: ["User account + cloud sync", "Full Sankey diagram editor", "12 months of data", "1 financial profile", "Dark / Light mode", "Multi-language (EN, ES, DE)"],
      },
      {
        name: "Pro", price: "$7", highlight: true, cta: "Coming Soon", comingSoon: true,
        features: ["Everything in Free", "Multiple years of data", "Trend & comparison charts", "Budget targets", "Export to PDF / CSV"],
      },
      {
        name: "Business", price: "$15", highlight: false, cta: "Coming Soon", comingSoon: true,
        features: ["Everything in Pro", "Multiple financial profiles", "Bank API auto-import", "Shared access & collaboration", "Priority support"],
      },
    ],

    // Footer CTA
    footer_cta_heading: "Start for free today.",
    footer_cta_sub: "No credit card required. Set up in under a minute.",
    footer_cta_btn: "Get Started Free",
    footer_rights: "© 2026 · All rights reserved",

    // App header
    app_overview: "Financial Overview",
    app_title: "Cash Flow Visualizer",
    app_backup: "↓ Back-up",
    app_restore: "↑ Restore",
    app_share: "⊕ Share",
    app_share_copied: "✓ Copied!",
    app_sign_out: "Sign Out",
    app_dark: "🌙 Dark",
    app_light: "☀️ Light",
    app_copy_prev: "Copy from previous month",
    app_total: "Total",

    // App editor
    app_income: "Income",
    app_expenses: "Expenses",
    app_active: "Active",
    app_passive: "Passive",
    app_add_placeholder: "New item…",
    app_add_btn: "+ Add",

    // Tooltip bar
    tooltip_income: "Income",
    tooltip_expenses: "Expenses",
    tooltip_surplus: "Surplus",
    tooltip_deficit: "Deficit",
    tooltip_hint: "Hover over an item to see details",
    tooltip_flow: "Flow",

    // Categories
    cat_living_household:      "Living & Household",
    cat_education_kids:        "Education & Kids",
    cat_healthcare:            "Healthcare",
    cat_transportation:        "Transportation",
    cat_subscriptions:         "Subscriptions",
    cat_discretionary:         "Discretionary",
    cat_savings:               "Savings & Investments",
    cat_debt:                  "Debt & Credit",
    cat_taxes:                 "Taxes",
    cat_surplus:           "Surplus",
    cat_deficit:           "Deficit",
    cat_active:            "Active Income",
    cat_passive:           "Passive Income",
    cat_surplus_carryover: "↩ Surplus Carryover",
    cat_deficit_carryover: "↩ Deficit Carryover",

    // Auth
    auth_email: "Email",
    auth_password: "Password",
    auth_login_btn: "Log In",
    auth_signup_btn: "Sign Up",
    auth_no_account: "Don't have an account?",
    auth_have_account: "Already have an account?",
    auth_signup_link: "Sign up",
    auth_login_link: "Log in",

    // Months
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  },

  es: {
    // Nav
    nav_features: "Funciones",
    nav_pricing: "Precios",
    nav_login: "Iniciar sesión",

    // Hero
    hero_badge: "Finanzas Personales · Visual",
    hero_title1: "Visualiza tu dinero,",
    hero_title2: "mes a mes.",
    hero_subtitle: "Un hermoso diagrama de Sankey que muestra exactamente de dónde viene tu dinero y adónde va — cada mes.",
    hero_cta: "Comenzar gratis →",
    hero_secondary: "Ver cómo funciona",
    hero_note: "Sin tarjeta de crédito · Plan gratuito para siempre",

    // Demo card
    demo_overview: "Resumen Financiero",

    // Features section
    features_label: "Funciones",
    features_heading1: "Todo lo que necesitas para",
    features_heading2: "entender tus finanzas",
    features: [
      { title: "Diagrama Sankey Interactivo", desc: "Observa visualmente cómo fluye tu dinero desde los ingresos hasta cada categoría de gastos en tiempo real." },
      { title: "Visión de 12 Meses",          desc: "Navega por cada mes del año y construye una imagen completa de tus finanzas." },
      { title: "Compartir y Exportar",         desc: "Comparte una instantánea de cualquier mes por URL o exporta todos tus datos como archivo JSON." },
      { title: "Sincronización en la Nube",    desc: "Tus datos se guardan de forma segura en la nube. Accede desde cualquier dispositivo, en cualquier momento." },
    ],

    // Pricing
    pricing_label: "Precios",
    pricing_heading: "Precios simples y transparentes",
    pricing_coming_soon: "Próximamente",
    pricing_most_popular: "Más Popular",
    pricing_forever: "para siempre",
    pricing_per_month: "por mes",
    pricing: [
      {
        name: "Gratis", price: "$0", highlight: false, cta: "Comenzar gratis", comingSoon: false,
        features: ["Cuenta de usuario + sincronización", "Editor completo de Sankey", "12 meses de datos", "1 perfil financiero", "Modo oscuro / claro", "Multiidioma (EN, ES, DE)"],
      },
      {
        name: "Pro", price: "$7", highlight: true, cta: "Próximamente", comingSoon: true,
        features: ["Todo lo de Gratis", "Varios años de datos", "Gráficos de tendencias y comparación", "Objetivos de presupuesto", "Exportar a PDF / CSV"],
      },
      {
        name: "Business", price: "$15", highlight: false, cta: "Próximamente", comingSoon: true,
        features: ["Todo lo de Pro", "Múltiples perfiles financieros", "Importación automática bancaria", "Acceso compartido y colaboración", "Soporte prioritario"],
      },
    ],

    // Footer CTA
    footer_cta_heading: "Empieza gratis hoy.",
    footer_cta_sub: "Sin tarjeta de crédito. Configúrate en menos de un minuto.",
    footer_cta_btn: "Comenzar gratis",
    footer_rights: "© 2026 · Todos los derechos reservados",

    // App header
    app_overview: "Resumen Financiero",
    app_title: "Visualizador de Flujo de Caja",
    app_backup: "↓ Respaldar",
    app_restore: "↑ Restaurar",
    app_share: "⊕ Compartir",
    app_share_copied: "✓ ¡Copiado!",
    app_sign_out: "Cerrar sesión",
    app_dark: "🌙 Oscuro",
    app_light: "☀️ Claro",
    app_copy_prev: "Copiar del mes anterior",
    app_total: "Total",

    // App editor
    app_income: "Ingresos",
    app_expenses: "Gastos",
    app_active: "Activo",
    app_passive: "Pasivo",
    app_add_placeholder: "Nuevo elemento…",
    app_add_btn: "+ Agregar",

    // Tooltip bar
    tooltip_income: "Ingresos",
    tooltip_expenses: "Gastos",
    tooltip_surplus: "Superávit",
    tooltip_deficit: "Déficit",
    tooltip_hint: "Pasa el cursor sobre un elemento para ver detalles",
    tooltip_flow: "Flujo",

    // Categories
    cat_living_household:      "Vivienda y Hogar",
    cat_education_kids:        "Educación e Hijos",
    cat_healthcare:            "Salud",
    cat_transportation:        "Transporte",
    cat_subscriptions:         "Suscripciones",
    cat_discretionary:         "Discrecional",
    cat_savings:               "Ahorro e Inversiones",
    cat_debt:                  "Deuda y Crédito",
    cat_taxes:                 "Impuestos",
    cat_surplus:           "Superávit",
    cat_deficit:           "Déficit",
    cat_active:            "Ingresos Activos",
    cat_passive:           "Ingresos Pasivos",
    cat_surplus_carryover: "↩ Superávit Anterior",
    cat_deficit_carryover: "↩ Déficit Anterior",

    // Auth
    auth_email: "Correo electrónico",
    auth_password: "Contraseña",
    auth_login_btn: "Iniciar sesión",
    auth_signup_btn: "Registrarse",
    auth_no_account: "¿No tienes cuenta?",
    auth_have_account: "¿Ya tienes cuenta?",
    auth_signup_link: "Regístrate",
    auth_login_link: "Inicia sesión",

    // Months
    months: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
  },

  de: {
    // Nav
    nav_features: "Funktionen",
    nav_pricing: "Preise",
    nav_login: "Anmelden",

    // Hero
    hero_badge: "Persönliche Finanzen · Visuell",
    hero_title1: "Visualisiere dein Geld,",
    hero_title2: "Monat für Monat.",
    hero_subtitle: "Ein wunderschönes Sankey-Diagramm, das genau zeigt, woher dein Geld kommt und wohin es geht — jeden Monat.",
    hero_cta: "Kostenlos starten →",
    hero_secondary: "So funktioniert es",
    hero_note: "Keine Kreditkarte erforderlich · Kostenloser Plan für immer",

    // Demo card
    demo_overview: "Finanzübersicht",

    // Features section
    features_label: "Funktionen",
    features_heading1: "Alles was du brauchst, um",
    features_heading2: "deine Finanzen zu verstehen",
    features: [
      { title: "Interaktives Sankey-Diagramm", desc: "Beobachte visuell, wie dein Geld von den Einnahmen zu jeder Ausgabenkategorie fließt — in Echtzeit." },
      { title: "12-Monats-Übersicht",           desc: "Navigiere durch jeden Monat des Jahres und baue ein vollständiges Bild deiner Finanzen auf." },
      { title: "Teilen & Exportieren",          desc: "Teile einen Snapshot eines beliebigen Monats per URL oder exportiere alle Daten als JSON-Datei." },
      { title: "Cloud-Synchronisation",         desc: "Deine Daten werden sicher in der Cloud gespeichert. Greife von jedem Gerät jederzeit darauf zu." },
    ],

    // Pricing
    pricing_label: "Preise",
    pricing_heading: "Einfache, transparente Preise",
    pricing_coming_soon: "Demnächst",
    pricing_most_popular: "Beliebteste",
    pricing_forever: "für immer",
    pricing_per_month: "pro Monat",
    pricing: [
      {
        name: "Kostenlos", price: "$0", highlight: false, cta: "Kostenlos starten", comingSoon: false,
        features: ["Konto + Cloud-Synchronisation", "Vollständiger Sankey-Editor", "12 Monate Daten", "1 Finanzprofil", "Dunkel- / Hellmodus", "Mehrsprachig (EN, ES, DE)"],
      },
      {
        name: "Pro", price: "$7", highlight: true, cta: "Demnächst", comingSoon: true,
        features: ["Alles aus Kostenlos", "Mehrere Jahre Daten", "Trend- & Vergleichsdiagramme", "Budgetziele", "Export als PDF / CSV"],
      },
      {
        name: "Business", price: "$15", highlight: false, cta: "Demnächst", comingSoon: true,
        features: ["Alles aus Pro", "Mehrere Finanzprofile", "Automatischer Bank-Import", "Geteilter Zugang & Zusammenarbeit", "Prioritätssupport"],
      },
    ],

    // Footer CTA
    footer_cta_heading: "Starte noch heute kostenlos.",
    footer_cta_sub: "Keine Kreditkarte erforderlich. In unter einer Minute eingerichtet.",
    footer_cta_btn: "Kostenlos starten",
    footer_rights: "© 2026 · Alle Rechte vorbehalten",

    // App header
    app_overview: "Finanzübersicht",
    app_title: "Geldfluss-Visualisierer",
    app_backup: "↓ Sichern",
    app_restore: "↑ Wiederherstellen",
    app_share: "⊕ Teilen",
    app_share_copied: "✓ Kopiert!",
    app_sign_out: "Abmelden",
    app_dark: "🌙 Dunkel",
    app_light: "☀️ Hell",
    app_copy_prev: "Vom Vormonat kopieren",
    app_total: "Gesamt",

    // App editor
    app_income: "Einnahmen",
    app_expenses: "Ausgaben",
    app_active: "Aktiv",
    app_passive: "Passiv",
    app_add_placeholder: "Neuer Eintrag…",
    app_add_btn: "+ Hinzufügen",

    // Tooltip bar
    tooltip_income: "Einnahmen",
    tooltip_expenses: "Ausgaben",
    tooltip_surplus: "Überschuss",
    tooltip_deficit: "Defizit",
    tooltip_hint: "Bewege die Maus über einen Eintrag für Details",
    tooltip_flow: "Fluss",

    // Categories
    cat_living_household:      "Wohnen & Haushalt",
    cat_education_kids:        "Bildung & Kinder",
    cat_healthcare:            "Gesundheit",
    cat_transportation:        "Transport",
    cat_subscriptions:         "Abonnements",
    cat_discretionary:         "Ermessensausgaben",
    cat_savings:               "Sparen & Investitionen",
    cat_debt:                  "Schulden & Kredit",
    cat_taxes:                 "Steuern",
    cat_surplus:           "Überschuss",
    cat_deficit:           "Defizit",
    cat_active:            "Aktive Einnahmen",
    cat_passive:           "Passive Einnahmen",
    cat_surplus_carryover: "↩ Überschuss Übertrag",
    cat_deficit_carryover: "↩ Defizit Übertrag",

    // Auth
    auth_email: "E-Mail",
    auth_password: "Passwort",
    auth_login_btn: "Anmelden",
    auth_signup_btn: "Registrieren",
    auth_no_account: "Noch kein Konto?",
    auth_have_account: "Bereits ein Konto?",
    auth_signup_link: "Registrieren",
    auth_login_link: "Anmelden",

    // Months
    months: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
  },
};

export function useTranslation(lang = "en") {
  const t = translations[lang] || translations.en;
  return { t, lang };
}
