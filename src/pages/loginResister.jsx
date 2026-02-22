import { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   SEOUL BREW CAFÉ — Auth Page
   Pure UI component. No auth logic.
   Registration collects API payload fields.
   Connect your own backend / middleware.
───────────────────────────────────────── */

const C = {
  cream: "#f5f0e8",
  espresso: "#1a0f0a",
  mocha: "#3d1f0f",
  latte: "#c49a6c",
  foam: "#ede8df",
  blush: "#d4846a",
  dark: "#120a06",
};

/* ── Inject fonts + keyframes once ── */
function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("sb-fonts")) return;

    const link = document.createElement("link");
    link.id = "sb-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nanum+Myeongjo:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "sb-kf";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      @keyframes sb-slideLeft  { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
      @keyframes sb-slideRight { from{transform:translateX(100%);opacity:0}  to{transform:translateX(0);opacity:1} }
      @keyframes sb-fadeUp     { from{transform:translateY(24px);opacity:0}  to{transform:translateY(0);opacity:1} }
      @keyframes sb-formSwap   { from{opacity:0;transform:translateY(8px)}   to{opacity:1;transform:translateY(0)} }
      @keyframes sb-steam {
        0%   { transform:translateY(0) scale(1);        opacity:0; }
        25%  { opacity:.55; }
        100% { transform:translateY(-170px) scale(2.8); opacity:0; }
      }
      @keyframes sb-bean {
        from { transform:translateY(0) rotate(0deg); }
        to   { transform:translateY(-18px) rotate(22deg); }
      }
      @keyframes sb-tabLine {
        from { transform:scaleX(0); }
        to   { transform:scaleX(1); }
      }
      @keyframes sb-spin { to { transform: rotate(360deg); } }
      .sb-input::placeholder { color:rgba(26,15,10,0.28) !important; }
      .sb-input:focus {
        border-color:#d4846a !important;
        box-shadow:0 0 0 3px rgba(212,132,106,0.14) !important;
      }
      .sb-btn-main:hover  { background:#3d1f0f !important; transform:translateY(-1px) !important; }
      .sb-btn-main:active { transform:translateY(0) !important; }
      .sb-social:hover    { border-color:#c49a6c !important; background:#ede8df !important; }
      .sb-link:hover      { text-decoration:underline !important; }
    `;
    document.head.appendChild(style);
  }, []);
}

/* ── Coffee Cup SVG ── */
function CupIllustration() {
  return (
    <svg width="148" height="168" viewBox="0 0 160 180" fill="none"
      style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))" }}>
      <ellipse cx="80" cy="160" rx="58" ry="9" fill="#6b3a1a" opacity=".45" />
      <path d="M36 82 Q31 142 51 156 Q80 166 109 156 Q129 142 124 82Z" fill="#4a2008" />
      <path d="M36 82 Q31 142 51 156 Q80 166 109 156 Q129 142 124 82Z"
        fill="url(#cupShade)" opacity=".4" />
      <ellipse cx="80" cy="82" rx="44" ry="11" fill="#6b3a1a" />
      <ellipse cx="80" cy="82" rx="39" ry="9" fill="#180d05" />
      <ellipse cx="80" cy="82" rx="28" ry="6" fill="#1e1008" />
      <path d="M71 79 Q71 73 75.5 73 Q80 73 80 77.5 Q80 73 84.5 73 Q89 73 89 79 Q89 85 80 90 Q71 85 71 79Z"
        fill="#c49a6c" opacity=".55" />
      <path d="M124 97 Q150 97 150 117 Q150 137 124 137"
        stroke="#5a2d0c" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M124 97 Q146 97 146 117 Q146 137 124 137"
        stroke="#7a3d14" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M43 97 Q41 122 46 144" stroke="rgba(255,255,255,0.07)"
        strokeWidth="5" strokeLinecap="round" />
      <defs>
        <linearGradient id="cupShade" x1="160" y1="82" x2="36" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Reusable input field ── */
function Field({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: "0.68rem", fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: C.mocha, marginBottom: 6, fontFamily: "'DM Sans',sans-serif",
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="sb-input"
        style={{
          width: "100%", padding: "12px 15px",
          border: `1.5px solid ${error ? "#c0392b" : "rgba(26,15,10,0.13)"}`,
          borderRadius: 5, background: "white",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
          color: C.espresso, outline: "none",
          transition: "border-color 0.22s, box-shadow 0.22s",
        }}
      />
      {error && (
        <p style={{ fontSize: "0.71rem", color: "#c0392b", marginTop: 4,
          fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Primary CTA button ── */
function PrimaryBtn({ children, onClick, loading }) {
  return (
    <button onClick={onClick} className="sb-btn-main" disabled={loading}
      style={{
        width: "100%", padding: "14px",
        background: C.espresso, color: C.cream,
        border: "none", borderRadius: 5,
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.79rem",
        fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: loading ? "not-allowed" : "pointer", marginTop: 6,
        transition: "background 0.3s, transform 0.18s",
        opacity: loading ? 0.72 : 1,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
      {loading && (
        <span style={{
          width: 13, height: 13,
          border: "2px solid rgba(245,240,232,0.35)",
          borderTopColor: C.cream, borderRadius: "50%",
          animation: "sb-spin 0.7s linear infinite", display: "inline-block",
        }} />
      )}
      {children}
    </button>
  );
}

/* ── OR divider ── */
function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12,
      margin: "18px 0", color: "rgba(26,15,10,0.3)", fontSize: "0.74rem",
      fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(26,15,10,0.1)" }} />
      or continue with
      <div style={{ flex: 1, height: 1, background: "rgba(26,15,10,0.1)" }} />
    </div>
  );
}

/* ── Google social button ── */
function GoogleBtn() {
  return (
    <button className="sb-social"
      style={{
        width: "100%", padding: "12px",
        border: "1.5px solid rgba(26,15,10,0.12)",
        borderRadius: 5, background: "white",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
        color: C.espresso, cursor: "pointer",
        transition: "border-color 0.22s, background 0.22s",
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}

/* ═══════════════════════════════════════
   LOGIN FORM
   Payload shape: { email, password }
═══════════════════════════════════════ */
function LoginForm({ onSwitchToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    /*
    ┌─────────────────────────────────────────┐
    │  LOGIN API PAYLOAD                      │
    │  POST /api/auth/login                   │
    │                                         │
    │  const payload = {                      │
    │    email:    form.email,                │
    │    password: form.password,             │
    │  };                                     │
    │                                         │
    │  Replace below with your API call:      │
    │  await yourAuthService.login(payload);  │
    └─────────────────────────────────────────┘
    */
    const payload = { email: form.email, password: form.password };
    console.log("🔐 Login payload →", payload);

    setTimeout(() => setLoading(false), 1400); // ← replace with real API call
  };

  return (
    <div style={{ animation: "sb-formSwap 0.35s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.85rem",
        color: C.espresso, marginBottom: 6, lineHeight: 1.1 }}>
        Welcome back
      </h2>
      <p style={{ color: "rgba(26,15,10,0.46)", fontSize: "0.87rem",
        marginBottom: 28, fontFamily: "'DM Sans',sans-serif" }}>
        Sign in to your Seoul Brew account
      </p>

      <Field label="Email" type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />

      <Field label="Password" type="password" placeholder="••••••••"
        value={form.password} onChange={set("password")} error={errors.password} />

      <div style={{ textAlign: "right", marginTop: -4, marginBottom: 20 }}>
        <a href="#" className="sb-link"
          style={{ fontSize: "0.77rem", color: C.blush, textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif" }}>
          Forgot password?
        </a>
      </div>

      <PrimaryBtn onClick={handleSubmit} loading={loading}>Sign In</PrimaryBtn>

      <OrDivider />
      <GoogleBtn />

      <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.84rem",
        color: "rgba(26,15,10,0.46)", fontFamily: "'DM Sans',sans-serif" }}>
        Don't have an account?{" "}
        <a href="#" className="sb-link"
          onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}
          style={{ color: C.blush, fontWeight: 600, textDecoration: "none" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   REGISTER FORM
   API Payload shape:
   {
     firstName:       string,
     lastName:        string,
     email:           string,
     phone:           string,
     password:        string,
     confirmPassword: string,
     agreeToTerms:    boolean,
   }
═══════════════════════════════════════ */
function RegisterForm({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim())  errs.lastName  = "Required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone) errs.phone = "Phone number is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Min. 8 characters";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.agreeToTerms) errs.agreeToTerms = "You must agree to the terms to continue";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    /*
    ┌─────────────────────────────────────────────┐
    │  REGISTRATION API PAYLOAD                   │
    │  POST /api/auth/register                    │
    │                                             │
    │  const payload = {                          │
    │    firstName:       form.firstName,         │
    │    lastName:        form.lastName,          │
    │    email:           form.email,             │
    │    phone:           form.phone,             │
    │    password:        form.password,          │
    │    confirmPassword: form.confirmPassword,   │
    │    agreeToTerms:    form.agreeToTerms,      │
    │  };                                         │
    │                                             │
    │  Your middleware handles:                   │
    │  - Password hashing (bcrypt etc.)           │
    │  - Email uniqueness check                   │
    │  - Verification email dispatch              │
    │  - JWT / session token response             │
    └─────────────────────────────────────────────┘
    */
    const payload = {
      firstName:       form.firstName,
      lastName:        form.lastName,
      email:           form.email,
      phone:           form.phone,
      password:        form.password,
      confirmPassword: form.confirmPassword,
      agreeToTerms:    form.agreeToTerms,
    };
    console.log("📋 Register payload →", payload);

    setTimeout(() => { setLoading(false); setSuccess(true); }, 1400); // ← replace with real API call
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{ textAlign: "center", animation: "sb-fadeUp 0.4s ease", padding: "48px 0" }}>
        <div style={{ fontSize: "3.2rem", marginBottom: 16 }}>☕</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem",
          color: C.espresso, marginBottom: 10 }}>
          Account Created!
        </h2>
        <p style={{ color: "rgba(26,15,10,0.48)", fontSize: "0.9rem",
          fontFamily: "'DM Sans',sans-serif", lineHeight: 1.65, marginBottom: 30,
          maxWidth: 280, margin: "0 auto 30px" }}>
          Welcome to Seoul Brew. Check your email to verify your account.
        </p>
        <button onClick={() => { setSuccess(false); onSwitchToLogin(); }}
          className="sb-btn-main"
          style={{ padding: "13px 36px", background: C.espresso, color: C.cream,
            border: "none", borderRadius: 5, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem",
            fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "background 0.3s" }}>
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: "sb-formSwap 0.35s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.85rem",
        color: C.espresso, marginBottom: 6, lineHeight: 1.1 }}>
        Join Seoul Brew
      </h2>
      <p style={{ color: "rgba(26,15,10,0.46)", fontSize: "0.87rem",
        marginBottom: 26, fontFamily: "'DM Sans',sans-serif" }}>
        Create your account and start your coffee journey
      </p>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="First Name" placeholder="Minji"
          value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Field label="Last Name" placeholder="Kim"
          value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>

      <Field label="Email Address" type="email" placeholder="you@example.com"
        value={form.email} onChange={set("email")} error={errors.email} />

      <Field label="Phone Number" type="tel" placeholder="+82 10 0000 0000"
        value={form.phone} onChange={set("phone")} error={errors.phone} />

      {/* Password row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Password" type="password" placeholder="Min. 8 chars"
          value={form.password} onChange={set("password")} error={errors.password} />
        <Field label="Confirm" type="password" placeholder="••••••••"
          value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
      </div>

      {/* Terms checkbox */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10,
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          <input
            type="checkbox"
            checked={form.agreeToTerms}
            onChange={set("agreeToTerms")}
            style={{ marginTop: 3, accentColor: C.blush,
              width: 15, height: 15, cursor: "pointer", flexShrink: 0 }}
          />
          <span style={{ fontSize: "0.77rem", color: "rgba(26,15,10,0.52)", lineHeight: 1.5 }}>
            I agree to the{" "}
            <a href="#" className="sb-link" style={{ color: C.blush, textDecoration: "none" }}>
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className="sb-link" style={{ color: C.blush, textDecoration: "none" }}>
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p style={{ fontSize: "0.71rem", color: "#c0392b", marginTop: 4,
            fontFamily: "'DM Sans',sans-serif" }}>
            {errors.agreeToTerms}
          </p>
        )}
      </div>

      <PrimaryBtn onClick={handleSubmit} loading={loading}>Create Account</PrimaryBtn>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.84rem",
        color: "rgba(26,15,10,0.46)", fontFamily: "'DM Sans',sans-serif" }}>
        Already have an account?{" "}
        <a href="#" className="sb-link"
          onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}
          style={{ color: C.blush, fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </a>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════ */
export default function SeoulBrewAuth() {
  useGlobalStyles();
  const [tab, setTab] = useState("login");

  const beans = [
    { top: "14%",    left: "9%",   dur: "4s",   delay: "0s"   },
    { top: "67%",    left: "17%",  dur: "5.2s", delay: "1.1s" },
    { top: "31%",    right: "11%", dur: "6s",   delay: "0.4s" },
    { bottom: "19%", right: "7%",  dur: "4.6s", delay: "2s"   },
    { bottom: "40%", left: "13%",  dur: "5.8s", delay: "1.6s" },
    { top: "52%",    right: "22%", dur: "4.2s", delay: "0.8s" },
  ];

  const steams = [
    { w: 80, h: 80, bottom: "37%", left: "41%", dur: "3s",   delay: "0s"   },
    { w: 60, h: 60, bottom: "37%", left: "48%", dur: "3.6s", delay: "0.9s" },
    { w: 70, h: 70, bottom: "37%", left: "36%", dur: "3.3s", delay: "1.6s" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh",
      fontFamily: "'DM Sans',sans-serif", background: C.dark, overflow: "hidden" }}>

      {/* ══ LEFT — Brand Panel ══ */}
      <div style={{
        position: "relative", width: "46%", background: C.mocha,
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", overflow: "hidden",
        animation: "sb-slideLeft 0.85s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {/* Subtle noise overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }} />

        {/* Floating beans */}
        {beans.map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: 11, height: 17, borderRadius: "50%",
            background: "rgba(196,154,108,0.18)",
            animation: `sb-bean ${b.dur} ease-in-out infinite alternate`,
            animationDelay: b.delay, ...b,
          }} />
        ))}

        {/* Steam puffs */}
        {steams.map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s.w, height: s.h,
            borderRadius: "50%", opacity: 0,
            background: "radial-gradient(circle, rgba(196,154,108,0.22) 0%, transparent 70%)",
            animation: `sb-steam ${s.dur} ease-in infinite`,
            animationDelay: s.delay, bottom: s.bottom, left: s.left,
          }} />
        ))}

        {/* Brand content */}
        <div style={{
          position: "relative", zIndex: 2, display: "flex",
          flexDirection: "column", alignItems: "center", gap: 22,
          animation: "sb-fadeUp 1s 0.35s both",
        }}>
          <CupIllustration />

          <div style={{
            fontFamily: "'Playfair Display',serif", color: C.cream,
            fontSize: "clamp(2.2rem,3.8vw,3.2rem)", letterSpacing: "-0.02em",
            lineHeight: 1, textAlign: "center",
          }}>
            <span style={{ fontStyle: "italic", color: C.latte }}>Seoul</span> Brew
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 1, background: C.latte, opacity: 0.45 }} />
            <div style={{ fontFamily: "'Nanum Myeongjo',serif", color: C.latte,
              fontSize: "0.82rem", letterSpacing: "0.28em" }}>
              서울 브루 카페
            </div>
            <div style={{ width: 36, height: 1, background: C.latte, opacity: 0.45 }} />
          </div>

          <p style={{
            fontFamily: "'Playfair Display',serif", fontStyle: "italic",
            color: C.cream, opacity: 0.62, fontSize: "0.95rem",
            textAlign: "center", maxWidth: 240, lineHeight: 1.7,
          }}>
            "Where every cup tells a story of Seoul's spirit"
          </p>

          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: C.latte, opacity: i === 2 ? 0.9 : 0.35,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — Form Panel ══ */}
      <div style={{
        flex: 1, background: C.cream,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 36px", overflowY: "auto",
        animation: "sb-slideRight 0.85s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{
          width: "100%", maxWidth: 410,
          animation: "sb-fadeUp 1s 0.55s both",
        }}>

          {/* Tab switcher */}
          <div style={{
            display: "flex",
            borderBottom: "2px solid rgba(26,15,10,0.1)",
            marginBottom: 34,
          }}>
            {[["login", "Sign In"], ["register", "Create Account"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "12px 8px", border: "none", background: "none",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.73rem", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: tab === t ? C.espresso : "rgba(26,15,10,0.33)",
                  cursor: "pointer", position: "relative", transition: "color 0.28s",
                }}>
                {label}
                {tab === t && (
                  <span style={{
                    position: "absolute", bottom: -2, left: 0, right: 0,
                    height: 2, background: C.blush, display: "block",
                    animation: "sb-tabLine 0.28s ease",
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Active form */}
          {tab === "login"
            ? <LoginForm onSwitchToRegister={() => setTab("register")} />
            : <RegisterForm onSwitchToLogin={() => setTab("login")} />
          }
        </div>
      </div>
    </div>
  );
}