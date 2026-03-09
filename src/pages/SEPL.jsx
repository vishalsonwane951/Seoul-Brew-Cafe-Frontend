import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────────── */
const T = {
  navy: "#0b1120", navy2: "#0f1829", navy3: "#0d1e30",
  green: "#22c55e", green2: "#16a34a", green3: "#dcfce7",
  gold: "#f59e0b", white: "#ffffff", gray: "#94a3b8", gray2: "#64748b",
  red: "#ef4444", orange: "#f97316", blue: "#3b82f6",
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800;900&display=swap');
  .sepl-root *, .sepl-root *::before, .sepl-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sepl-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #0b1120; color: #fff; overflow-x: hidden; }
  .sepl-root button, .sepl-root input, .sepl-root select, .sepl-root textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
  .sepl-root input[type=range] { accent-color: #22c55e; width: 100%; cursor: pointer; }
  .sepl-root select option { background: #0f1829; color: #fff; }
  .sepl-root a { text-decoration: none; }

  @keyframes sepl-fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes sepl-pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.3); } }
  @keyframes sepl-float  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
  @keyframes sepl-spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes sepl-slide-in { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
  @keyframes sepl-ken-burns { 0% { transform: scale(1); } 100% { transform: scale(1.06); } }

  .sepl-fade1 { animation: sepl-fadeUp .6s ease both; }
  .sepl-fade2 { animation: sepl-fadeUp .6s .12s ease both; }
  .sepl-fade3 { animation: sepl-fadeUp .6s .24s ease both; }
  .sepl-fade4 { animation: sepl-fadeUp .6s .36s ease both; }
  .sepl-pulse { animation: sepl-pulse 1.6s infinite; }
  .sepl-float { animation: sepl-float 3s ease-in-out infinite; }

  .sepl-nav-link { color:rgba(255,255,255,.65); font-size:13px; font-weight:500; padding:6px 12px; border-radius:6px; transition:all .2s; cursor:pointer; background:transparent; border:none; }
  .sepl-nav-link:hover { color:#fff; background:rgba(255,255,255,.06); }

  .sepl-svc-card { transition: all .28s ease; }
  .sepl-svc-card:hover { transform: translateY(-5px); }

  .sepl-mon-feat { transition: all .22s; }
  .sepl-mon-feat:hover { background: rgba(34,197,94,.06) !important; border-color: rgba(34,197,94,.25) !important; }

  .sepl-ai-opt { transition: all .18s; cursor: pointer; background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.2); border-radius: 8px; padding: 9px 14px; font-size: 13px; font-weight: 600; color: #22c55e; text-align: left; width: 100%; }
  .sepl-ai-opt:hover, .sepl-ai-opt.sel { background: rgba(34,197,94,.18); border-color: #22c55e; }

  .sepl-btn-pri { background:#22c55e; color:#fff; font-weight:700; border:none; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:all .22s; }
  .sepl-btn-pri:hover { background:#16a34a; transform:translateY(-2px); box-shadow:0 8px 24px rgba(34,197,94,.32); }
  .sepl-btn-out { background:transparent; color:#fff; font-weight:700; border:1px solid rgba(255,255,255,.22); border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:all .22s; }
  .sepl-btn-out:hover { border-color:#22c55e; color:#22c55e; }

  .sepl-form-input { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:12px 14px; font-size:14px; color:#fff; outline:none; transition:border-color .2s; }
  .sepl-form-input:focus { border-color:rgba(34,197,94,.45); }
  .sepl-form-input::placeholder { color:rgba(255,255,255,.28); }
  .sepl-form-select { width:100%; background:#0f1829; border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:12px 14px; font-size:14px; color:#fff; outline:none; }

  .sepl-pm-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,.04); }
  .sepl-ticket-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,.04); }
  .sepl-alarm-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,.04); }

  .sepl-tab-btn { transition:all .2s; cursor:pointer; }
  .sepl-tab-btn:hover { opacity:.85; }

  .sepl-wp-row { transition:all .2s; }
  .sepl-wp-row:hover { background:rgba(255,255,255,.03) !important; }

  .sepl-story-card { transition: all .32s ease; cursor: pointer; }
  .sepl-story-card:hover { transform: translateY(-6px); }
  .sepl-story-card:hover .sepl-story-img { transform: scale(1.05); }

  .sepl-story-img { transition: transform .5s ease; width: 100%; height: 100%; object-fit: cover; }

  .sepl-testi-card { transition: all .28s ease; }
  .sepl-testi-card:hover { transform: translateY(-4px); border-color: rgba(34,197,94,.3) !important; background: rgba(34,197,94,.04) !important; }

  .sepl-testi-nav { transition: all .2s; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: #fff; }
  .sepl-testi-nav:hover { background: rgba(34,197,94,.15); border-color: #22c55e; }

  .sepl-wa-btn { position:fixed; bottom:28px; right:28px; width:56px; height:56px; background:#25d366; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 4px 22px rgba(37,211,102,.45); cursor:pointer; z-index:999; border:none; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#0f1829; }
  ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
`;

/* ─────────────────────────────────────────────
   TINY HELPERS
───────────────────────────────────────────── */
const fmtIN = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n));

const SectionTag = ({ children }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, color:T.green,
    fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:14 }}>
    <div style={{ width:22, height:2, background:T.green, borderRadius:2 }} />
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:38, fontWeight:800,
    letterSpacing:"-0.025em", lineHeight:1.15, marginBottom:14 }}>{children}</h2>
);

const GreenEm = ({ children }) => <span style={{ color:T.green }}>{children}</span>;

const Divider = () => (
  <div style={{ width:60, height:3, background:T.green, borderRadius:2, marginBottom:20 }} />
);

const Tag = ({ type }) => {
  const cfg = type === "new"
    ? { bg:"rgba(245,158,11,.14)", border:"rgba(245,158,11,.3)", color:T.gold, label:"NEW" }
    : { bg:"rgba(34,197,94,.12)", border:"rgba(34,197,94,.25)", color:T.green, label:"ENHANCED" };
  return (
    <span style={{ display:"inline-block", background:cfg.bg, border:`1px solid ${cfg.border}`,
      color:cfg.color, fontSize:10, fontWeight:800, padding:"2px 8px",
      borderRadius:4, letterSpacing:"0.1em", marginBottom:8 }}>
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   1. NAV
───────────────────────────────────────────── */
function Nav({ onNav }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
      background:"rgba(11,17,32,.95)", backdropFilter:"blur(16px)",
      borderBottom:"1px solid rgba(255,255,255,.08)",
      padding:"0 40px", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:38, height:38, background:"linear-gradient(135deg,#22c55e,#16a34a)",
          borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>☀️</div>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:17, letterSpacing:"-0.02em" }}>Sustainfy Energy</div>
          <div style={{ fontSize:9, color:T.green, fontWeight:700, letterSpacing:"0.1em" }}>PRIVATE LIMITED</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {["Home","About Us","Projects","Our Clients","Blog","Careers","Team"].map(l => (
          <button key={l} className="sepl-nav-link">{l}</button>
        ))}
        <button className="sepl-nav-link">Services ▾</button>
      </div>
      <button className="sepl-btn-pri" style={{ fontSize:13, padding:"9px 20px" }}
        onClick={() => onNav("contact")}>Contact Us</button>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   2. HERO
───────────────────────────────────────────── */
function Hero({ onNav }) {
  const stats = [
    { num:"99%", label:"Avg Availability" },
    { num:"150+", label:"Plants Managed" },
    { num:"4 hr", label:"P1 SLA Response" },
    { num:"9 GWp", label:"O&M Experience" },
  ];
  return (
    <section style={{ position:"relative", padding:"80px 80px 70px",
      background:"linear-gradient(135deg,#0b1120 0%,#0f1c2e 60%,#0b1c14 100%)", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)",
        backgroundSize:"50px 50px" }} />
      <div style={{ position:"absolute", top:-100, right:-100, width:600, height:600, pointerEvents:"none",
        background:"radial-gradient(circle,rgba(34,197,94,.12) 0%,transparent 70%)" }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:680 }}>
        <div className="sepl-fade1" style={{ display:"inline-flex", alignItems:"center", gap:8,
          background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.25)",
          borderRadius:30, padding:"6px 16px", fontSize:11, fontWeight:700,
          color:T.green, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:22 }}>
          ⚙️ Asset Management
        </div>
        <h1 className="sepl-fade2" style={{ fontFamily:"'Sora',sans-serif", fontSize:52, fontWeight:900,
          lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:20 }}>
          Expert <GreenEm>Operations &<br/>Maintenance</GreenEm> Services
        </h1>
        <p className="sepl-fade3" style={{ fontSize:17, lineHeight:1.75, color:"rgba(255,255,255,.6)",
          maxWidth:580, marginBottom:36 }}>
          Maximize your solar PV plant's uptime, performance ratio, and ROI with SEPL's comprehensive
          O&amp;M services — backed by predictive intelligence, real-time monitoring, and IEC 61724-compliant reporting.
        </p>
        <div className="sepl-fade4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <button className="sepl-btn-pri" style={{ fontSize:14, padding:"14px 28px" }}
            onClick={() => onNav("contact")}>🔧 Get AMC Quote</button>
          <button className="sepl-btn-out" style={{ fontSize:14, padding:"14px 28px" }}
            onClick={() => onNav("ai")}>⚡ Diagnose My Plant</button>
        </div>
      </div>

      <div className="sepl-fade4" style={{ position:"absolute", right:80, top:"50%",
        transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:14 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)",
            borderRadius:14, padding:"16px 24px", textAlign:"center", minWidth:128,
            backdropFilter:"blur(8px)" }}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:900, color:T.green, lineHeight:1 }}>{s.num}</div>
            <div style={{ fontSize:11, color:T.gray, marginTop:4, letterSpacing:"0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. SERVICES GRID
───────────────────────────────────────────── */
const SERVICES = [
  { tag:"enhanced", icon:"🔍", title:"Predictive / Preventive / Corrective Maintenance",
    desc:"Structured maintenance with SLA tiers (P1–P3), digital work orders, CMMS scheduler, and MTTR/MTBF analytics.", link:"Schedule →", nav:"schedule" },
  { tag:"enhanced", icon:"📋", title:"Comprehensive & Non-Comprehensive AMC",
    desc:"Transparent plan comparison with inclusions/exclusions, SLA commitments, online enrollment with digital contract.", link:"Compare Plans →", nav:"amc" },
  { tag:"new", icon:"🤖", title:"AI-Powered Fault Diagnosis",
    desc:"Describe your plant issue — AI diagnoses probable causes with confidence scores and recommends the right service.", link:"Try Diagnostics →", nav:"ai" },
  { tag:"new", icon:"🧮", title:"Soiling Loss & Cleaning ROI Calculator",
    desc:"Quantify generation & revenue loss from dust. Get location-specific cleaning frequency with full ROI breakdown.", link:"Calculate Now →", nav:"calculator" },
  { tag:"new", icon:"🔔", title:"Warranty Expiry Tracker",
    desc:"Automated alerts 6 months before module/inverter/BOS warranty expiry — ensuring timely End-of-Warranty inspections.", link:"Register Plant →", nav:"warranty" },
  { tag:"enhanced", icon:"📊", title:"Automated Performance Reporting",
    desc:"IEC 61724-1 monthly reports with PR, CUF, loss tree analysis, auto-generated and emailed on the 2nd of every month.", link:"Sample Report →", nav:"dashboard" },
  { tag:"enhanced", icon:"🧹", title:"Module Cleaning Services",
    desc:"Scheduled & on-demand cleaning with DM water protocols, soiling-rate frequency planning, and pre/post performance measurement.", link:"Schedule →", nav:"contact" },
];

function ServicesGrid({ onNav }) {
  const [hov, setHov] = useState(null);
  return (
    <section style={{ padding:"80px 80px", background:T.navy2 }}>
      <Divider />
      <SectionTag>O&M Service Offerings</SectionTag>
      <SectionTitle>Everything Your Solar Plant <GreenEm>Needs to Perform</GreenEm></SectionTitle>
      <p style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,.55)", maxWidth:640, marginBottom:50 }}>
        From routine preventive maintenance to AI-driven predictive diagnostics — SEPL provides end-to-end
        O&amp;M coverage aligned with MNRE guidelines and IEC 62446 standards.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        {SERVICES.map((s, i) => (
          <div key={i} className="sepl-svc-card"
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ background: hov===i ? "rgba(34,197,94,.05)" : "rgba(255,255,255,.03)",
              border:`1px solid ${hov===i ? "rgba(34,197,94,.3)" : "rgba(255,255,255,.08)"}`,
              borderRadius:16, padding:28, position:"relative", overflow:"hidden",
              boxShadow: hov===i ? "0 20px 40px rgba(0,0,0,.3)" : "none",
              cursor:"pointer" }} onClick={() => onNav(s.nav)}>
            <Tag type={s.tag} />
            <div style={{ width:52, height:52, background:"rgba(34,197,94,.1)", borderRadius:12,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:24, marginBottom:16, border:"1px solid rgba(34,197,94,.15)" }}>
              {s.icon}
            </div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700,
              marginBottom:10, lineHeight:1.35 }}>{s.title}</h3>
            <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,.55)" }}>{s.desc}</p>
            <div style={{ marginTop:18, color:T.green, fontSize:12, fontWeight:700,
              display:"flex", alignItems:"center", gap:6 }}>{s.link}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. AMC PLANS
───────────────────────────────────────────── */
const AMC_PLANS = [
  { type:"Essential Coverage", name:"Non-Comprehensive", price:"₹8–12", unit:"/ kWp / year (indicative)",
    popular:false,
    features:[
      { ok:true,  text:"Monthly preventive maintenance visits" },
      { ok:true,  text:"Remote monitoring & alarm management" },
      { ok:true,  text:"Monthly IEC 61724-1 performance report" },
      { ok:true,  text:"Corrective maintenance — labour included" },
      { ok:false, text:"Spare parts & component replacement" },
      { ok:false, text:"Module cleaning (quoted separately)" },
      { ok:false, text:"Annual thermography inspection" },
    ]},
  { type:"Full Coverage", name:"Comprehensive AMC", price:"₹18–28", unit:"/ kWp / year (indicative)",
    popular:true,
    features:[
      { ok:true, text:"Monthly + quarterly PM visits (8/year)" },
      { ok:true, text:"24/7 remote SCADA monitoring" },
      { ok:true, text:"Monthly + annual performance reports" },
      { ok:true, text:"Corrective maintenance — labour + spares" },
      { ok:true, text:"Bi-monthly module cleaning (DM water)" },
      { ok:true, text:"Annual thermography inspection" },
      { ok:true, text:"End-of-year IV curve string testing" },
    ]},
  { type:"Tailored Solution", name:"Custom Portfolio AMC", price:"Custom", unit:"Pricing — Talk to SEPL",
    popular:false,
    features:[
      { ok:true, text:"Multi-site NOC monitoring (pvprotech.com)" },
      { ok:true, text:"Dedicated engineer per site / cluster" },
      { ok:true, text:"Custom SLA with financial penalties" },
      { ok:true, text:"Portfolio-level PR benchmarking" },
      { ok:true, text:"Repowering & decommissioning advisory" },
      { ok:true, text:"Integration with client ERP/CMMS" },
      { ok:true, text:"SLDC compliance & grid curtailment mgmt" },
    ]},
];

const SLA_TIERS = [
  { level:"P1 — CRITICAL", color:T.red, time:"4 hrs", sub:"Response | 24hr Resolution", note:"Generation-impacting faults" },
  { level:"P2 — HIGH",     color:T.gold, time:"24 hrs", sub:"Response | 72hr Resolution", note:"Performance degradation >10%" },
  { level:"P3 — STANDARD", color:T.blue, time:"72 hrs", sub:"Response | 7-day Resolution", note:"Non-critical, scheduled faults" },
];

function AMCPlans({ onNav }) {
  return (
    <section id="amc" style={{ padding:"80px 80px", background:T.navy }}>
      <Divider />
      <SectionTag>Annual Maintenance Contracts</SectionTag>
      <SectionTitle>Choose the <GreenEm>Right AMC Plan</GreenEm><br/>for Your Plant</SectionTitle>
      <p style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,.55)", maxWidth:640, marginBottom:50 }}>
        Transparent scope-of-work, defined SLAs, and zero ambiguity. SEPL's AMC plans are designed for
        C&amp;I rooftops, ground-mount utility plants, and distributed portfolios across India.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22, marginBottom:50 }}>
        {AMC_PLANS.map((plan, i) => (
          <div key={i} style={{ background: plan.popular ? "linear-gradient(160deg,rgba(34,197,94,.08),rgba(11,17,32,.9))" : "rgba(255,255,255,.03)",
            border:`1px solid ${plan.popular ? T.green : "rgba(255,255,255,.08)"}`,
            borderRadius:18, padding:30, position:"relative" }}>
            {plan.popular && (
              <div style={{ position:"absolute", top:0, right:24, background:T.green, color:"#fff",
                fontSize:10, fontWeight:800, padding:"4px 14px", borderRadius:"0 0 8px 8px",
                letterSpacing:"0.1em" }}>MOST POPULAR</div>
            )}
            <div style={{ fontSize:11, color:T.gray, fontWeight:700, letterSpacing:"0.12em",
              textTransform:"uppercase", marginBottom:6 }}>{plan.type}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, marginBottom:6 }}>{plan.name}</div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", margin:"18px 0" }} />
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:T.green, marginBottom:4 }}>
              {plan.price} <span style={{ fontSize:13, color:T.gray, fontWeight:400 }}>{plan.unit}</span>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", margin:"18px 0" }} />
            {plan.features.map((f, j) => (
              <div key={j} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13,
                marginBottom:11, color:"rgba(255,255,255,.75)" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0,
                  background: f.ok ? "rgba(34,197,94,.12)" : "rgba(148,163,184,.08)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>
                  {f.ok ? <span style={{ color:T.green }}>✓</span> : <span style={{ color:T.gray2 }}>✗</span>}
                </div>
                {f.text}
              </div>
            ))}
            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", margin:"22px 0" }} />
            {plan.popular
              ? <button className="sepl-btn-pri" style={{ width:"100%", justifyContent:"center", fontSize:14, padding:"13px" }} onClick={() => onNav("contact")}>Get Quote</button>
              : <button className="sepl-btn-out" style={{ width:"100%", justifyContent:"center", fontSize:14, padding:"13px" }} onClick={() => onNav("contact")}>{i===2 ? "Discuss Requirements" : "Get Quote"}</button>
            }
          </div>
        ))}
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, marginBottom:10 }}>
          Response & Resolution <GreenEm>SLA Commitments</GreenEm>
        </h3>
        <p style={{ fontSize:13, color:T.gray, marginBottom:24 }}>
          All SEPL AMC plans commit to defined response and resolution SLAs based on fault severity.
          Generation-impacting faults (P1) are attended within 4 hours.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {SLA_TIERS.map((s, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)",
              borderRadius:12, padding:"18px 16px" }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", color:s.color, marginBottom:6 }}>{s.level}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800 }}>{s.time}</div>
              <div style={{ fontSize:11, color:T.gray, marginTop:4 }}>{s.sub}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:3 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. AI DIAGNOSTIC
───────────────────────────────────────────── */
const AI_STEPS = [
  { label:"Describe your plant issue", desc:"Select fault category, input symptoms and plant details" },
  { label:"Receive ranked diagnosis", desc:"AI returns top 3 probable causes with probability scores" },
  { label:"Book the right SEPL service", desc:"Direct CTA to book the recommended test or callback" },
];

const AI_DIAGNOSES = [
  { label:"String open circuit / bypass diode failure", pct:68 },
  { label:"Shading / soiling on specific strings",       pct:22 },
  { label:"DC cable connector degradation",              pct:10 },
];

const AI_OPTS = ["📉 Generation Drop", "⚡ Inverter Fault / Error Code", "🔥 Module Hotspot / Damage", "📊 Monitoring System Issue"];

function AIDiagnostic() {
  const [sel, setSel] = useState(null);
  const [phase, setPhase] = useState(0);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  const handleOpt = (i) => {
    setSel(i);
    setTimeout(() => setPhase(1), 400);
  };
  const handleUserSend = () => {
    if (!userInput.trim()) return;
    setPhase(2);
    setTimeout(() => setPhase(3), 600);
    setUserInput("");
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [phase]);

  return (
    <section id="ai" style={{ padding:"80px 80px", background:T.navy3, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:-200, top:-200, width:500, height:500, pointerEvents:"none",
        background:"radial-gradient(circle,rgba(34,197,94,.08),transparent 70%)" }} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", position:"relative", zIndex:1 }}>
        <div>
          <Divider />
          <SectionTag>AI Diagnostics — New Feature</SectionTag>
          <SectionTitle>Describe Your Issue.<br/><GreenEm>Get an Instant Diagnosis.</GreenEm></SectionTitle>
          <p style={{ fontSize:15, lineHeight:1.75, color:"rgba(255,255,255,.55)", marginBottom:30 }}>
            Our solar fault AI engine — trained on IEC 62446, IEC TS 62548 fault taxonomy, and SEPL's portfolio data — returns
            ranked probable causes with confidence scores in seconds.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {AI_STEPS.map((s, i) => (
              <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, background:"rgba(34,197,94,.1)", borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                  fontWeight:800, flexShrink:0, color:T.green, fontFamily:"'Sora',sans-serif" }}>{i+1}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:13, color:T.gray, lineHeight:1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:28, padding:"14px 18px", background:"rgba(245,158,11,.06)",
            border:"1px solid rgba(245,158,11,.22)", borderRadius:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <span>⚠️</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,.6)", lineHeight:1.6 }}>
              For DC-side faults: Always isolate the array before any physical inspection. Do not restart without
              SEPL engineer clearance. (CEA Technical Standards, IEC 62446-1)
            </span>
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)",
          borderRadius:20, overflow:"hidden", boxShadow:"0 30px 60px rgba(0,0,0,.4)" }}>
          <div style={{ background:"linear-gradient(135deg,#0f2415,#162a1a)", padding:"16px 20px",
            display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(34,197,94,.15)" }}>
            <div className="sepl-pulse" style={{ width:10, height:10, borderRadius:"50%", background:T.green }} />
            <span style={{ fontSize:13, fontWeight:700 }}>SEPL Solar Fault Diagnosis Assistant</span>
            <span style={{ marginLeft:"auto", fontSize:10, color:T.green, fontWeight:600 }}>● LIVE</span>
          </div>
          <div style={{ padding:20, maxHeight:440, overflowY:"auto" }}>
            <div style={{ marginBottom:14 }}>
              <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.12)",
                borderRadius:"0 12px 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                color:"rgba(255,255,255,.85)", maxWidth:"85%" }}>
                👋 Hello! I'm SEPL's solar diagnostic assistant. Tell me about your plant issue
                and I'll identify the probable cause instantly.
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.12)",
                borderRadius:"0 12px 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                color:"rgba(255,255,255,.85)", maxWidth:"90%" }}>
                What type of issue are you experiencing?
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
                  {AI_OPTS.map((o, i) => (
                    <button key={i} className={`sepl-ai-opt ${sel===i ? "sel" : ""}`}
                      onClick={() => handleOpt(i)}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
            {phase >= 1 && sel !== null && (
              <div style={{ marginBottom:14, display:"flex", justifyContent:"flex-end" }}>
                <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:"12px 0 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                  color:"rgba(255,255,255,.7)", maxWidth:"80%" }}>{AI_OPTS[sel]}</div>
              </div>
            )}
            {phase >= 1 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.12)",
                  borderRadius:"0 12px 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                  color:"rgba(255,255,255,.85)", maxWidth:"88%" }}>
                  Got it. Has there been a recent weather event? When did the drop start? And what does your monitoring show?
                </div>
              </div>
            )}
            {phase === 2 && (
              <div style={{ marginBottom:14, display:"flex", justifyContent:"flex-end" }}>
                <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:"12px 0 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                  color:"rgba(255,255,255,.7)", maxWidth:"80%" }}>
                  No weather event. Monitoring shows 2 string faults on MPPT-3...
                  <span style={{ display:"inline-block", animation:"sepl-spin .8s linear infinite", marginLeft:6 }}>⏳</span>
                </div>
              </div>
            )}
            {phase >= 3 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.12)",
                  borderRadius:"0 12px 12px 12px", padding:"14px 16px", fontSize:13, lineHeight:1.6,
                  color:"rgba(255,255,255,.85)", maxWidth:"95%" }}>
                  🔍 Analysing your symptoms...
                  <div style={{ background:"linear-gradient(135deg,rgba(34,197,94,.08),rgba(34,197,94,.02))",
                    border:"1px solid rgba(34,197,94,.2)", borderRadius:12, padding:16, marginTop:10 }}>
                    <div style={{ fontSize:11, fontWeight:800, color:T.green, letterSpacing:"0.1em", marginBottom:12 }}>
                      📋 DIAGNOSIS RESULTS — 85% CONFIDENCE
                    </div>
                    {AI_DIAGNOSES.map((d, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                        <div style={{ flex:1, fontSize:11, color:"rgba(255,255,255,.7)", paddingRight:8 }}>{d.label}</div>
                        <div style={{ width:70, height:4, background:"rgba(255,255,255,.08)", borderRadius:2, margin:"0 8px", flexShrink:0 }}>
                          <div style={{ height:"100%", width:`${d.pct}%`, background:T.green, borderRadius:2 }} />
                        </div>
                        <div style={{ fontSize:11, fontWeight:700, color:T.green, width:28, textAlign:"right", flexShrink:0 }}>{d.pct}%</div>
                      </div>
                    ))}
                    <div style={{ marginTop:10, padding:"8px 10px", background:"rgba(34,197,94,.06)",
                      borderRadius:8, fontSize:11, color:"rgba(255,255,255,.6)" }}>
                      <strong style={{ color:T.green }}>Recommended:</strong> IV Curve String Testing on MPPT-3 strings
                      → confirms open circuit and locates fault string.
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:12 }}>
                      <button style={{ flex:1, background:T.green, color:"#fff", fontSize:12, fontWeight:700,
                        padding:"9px", borderRadius:8, border:"none", cursor:"pointer" }}>📅 Book IV Curve Testing</button>
                      <button style={{ flex:1, background:"transparent", color:"#fff", fontSize:12, fontWeight:700,
                        padding:"9px", borderRadius:8, border:"1px solid rgba(255,255,255,.15)", cursor:"pointer" }}>📞 Call Engineer</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", gap:8 }}>
            <input className="sepl-form-input" style={{ flex:1, padding:"10px 14px", fontSize:13 }}
              placeholder="Describe your issue or ask a question..."
              value={userInput} onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleUserSend()} />
            <button style={{ background:T.green, color:"#fff", border:"none", borderRadius:8,
              padding:"10px 16px", fontSize:18, cursor:"pointer" }} onClick={handleUserSend}>➤</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. DASHBOARD
───────────────────────────────────────────── */
const ALARMS = [
  { color:T.red,   text:"INV-02: String fault MPPT-3",       time:"2h ago" },
  { color:T.gold,  text:"PR below threshold (76%)",           time:"Yesterday" },
  { color:T.blue,  text:"Module cleaning due (60 days)",      time:"3 days ago" },
  { color:T.green, text:"INV-01: Fault resolved ✓",           time:"4 days ago" },
];
const TICKETS = [
  { id:"#TKT-041", desc:"INV-02 string fault MPPT-3",  status:"P1 Open",    sc:"ts-open" },
  { id:"#TKT-040", desc:"Module cleaning — Block A",   status:"In Progress",sc:"ts-progress" },
  { id:"#TKT-039", desc:"Quarterly PM — June 2025",    status:"Closed ✓",   sc:"ts-done" },
  { id:"#TKT-038", desc:"Earth resistance test",       status:"Closed ✓",   sc:"ts-done" },
];
const BARS = [70,68,80,82,60,55,85,88,90,87,75,78,88,91];

function Dashboard() {
  const tsStyle = { open:{ bg:"rgba(239,68,68,.12)", color:"#f87171" },
    progress:{ bg:"rgba(245,158,11,.12)", color:"#fbbf24" },
    done:{ bg:"rgba(34,197,94,.12)", color:"#4ade80" } };
  const tMap = { "ts-open":"open","ts-progress":"progress","ts-done":"done" };

  return (
    <section id="dashboard" style={{ padding:"80px 80px", background:T.navy2 }}>
      <Divider />
      <SectionTag>Client Portal — New Feature</SectionTag>
      <SectionTitle>Your Plant. <GreenEm>Your Dashboard.</GreenEm><br/>Your Control.</SectionTitle>
      <p style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,.55)", maxWidth:640, marginBottom:40 }}>
        SEPL O&amp;M clients get a secure, role-based portal — real-time plant KPIs, maintenance ticket tracking,
        and all inspection reports in one place. Available on pvprotech.com.
      </p>

      <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, overflow:"hidden" }}>
        <div style={{ background:"rgba(255,255,255,.04)", padding:"13px 22px", borderBottom:"1px solid rgba(255,255,255,.08)",
          display:"flex", alignItems:"center", gap:8 }}>
          {[T.red,T.gold,T.green].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
          <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.55)", marginLeft:10 }}>
            SEPL Client Portal — Plant Dashboard — Pune Rooftop 500kWp
          </span>
          <div style={{ marginLeft:"auto", background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.22)",
            color:T.green, fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10 }}>🟢 LIVE DATA</div>
        </div>
        <div style={{ padding:24, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[
            { label:"TODAY'S GENERATION", val:"2,184", unit:"kWh", trend:"▲ +3.2% vs yesterday", up:true },
            { label:"PERFORMANCE RATIO",  val:"81.4",  unit:"%",   trend:"▲ Target: 78%",        up:true },
            { label:"PLANT AVAILABILITY", val:"99.2",  unit:"%",   trend:"▲ This month",          up:true },
            { label:"ACTIVE TICKETS",     val:"2",     unit:"open",trend:"1 in progress",         neutral:true },
          ].map((k,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:10, color:T.gray, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>{k.label}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, lineHeight:1 }}>
                {k.val}<span style={{ fontSize:12, color:T.gray, fontWeight:400, marginLeft:4 }}>{k.unit}</span>
              </div>
              <div style={{ fontSize:11, marginTop:6, color: k.neutral ? T.gold : T.green }}>{k.trend}</div>
            </div>
          ))}

          <div style={{ gridColumn:"span 2", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.55)", marginBottom:14 }}>
              ⚡ GENERATION THIS WEEK — Actual vs. Forecast (kWh)
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:80 }}>
              {BARS.map((h, i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"3px 3px 0 0",
                  background: i%2===0 ? "rgba(34,197,94,.18)" : T.green, opacity: i%2===0 ? 1 : 0.9 }} />
              ))}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:10, fontSize:10, color:T.gray }}>
              <span>■ <span style={{ color:"rgba(34,197,94,.5)" }}>Forecast</span></span>
              <span>■ <span style={{ color:T.green }}>Actual</span></span>
              <span style={{ marginLeft:"auto" }}>Mon — Sun</span>
            </div>
          </div>

          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.55)", marginBottom:14 }}>🔔 RECENT ALARMS</div>
            {ALARMS.map((a, i) => (
              <div key={i} className="sepl-alarm-row" style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, paddingBottom:i<ALARMS.length-1?10:0, marginBottom:i<ALARMS.length-1?10:0 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:a.color, flexShrink:0 }} />
                <div style={{ flex:1, color:"rgba(255,255,255,.7)" }}>{a.text}</div>
                <div style={{ fontSize:10, color:T.gray }}>{a.time}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.55)", marginBottom:14 }}>🎫 MAINTENANCE TICKETS</div>
            {TICKETS.map((t, i) => (
              <div key={i} className="sepl-ticket-row" style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, paddingBottom:i<TICKETS.length-1?10:0, marginBottom:i<TICKETS.length-1?10:0 }}>
                <span style={{ color:T.green, fontFamily:"monospace", fontSize:11, width:58, flexShrink:0 }}>{t.id}</span>
                <span style={{ flex:1, color:"rgba(255,255,255,.7)" }}>{t.desc}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10,
                  background:tsStyle[tMap[t.sc]].bg, color:tsStyle[tMap[t.sc]].color }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. MAINTENANCE SCHEDULE
───────────────────────────────────────────── */
const PM_ROWS = [
  { freq:"Monthly",   fc:"monthly",   task:"Visual inspection — modules, mounting, cables, JBs", status:"Due Jul 5", sc:"due" },
  { freq:"Monthly",   fc:"monthly",   task:"Inverter parameter check & log extraction",           status:"Done ✓",    sc:"done" },
  { freq:"Monthly",   fc:"monthly",   task:"Module cleaning (DM water, soiling check)",           status:"Done ✓",    sc:"done" },
  { freq:"Quarterly", fc:"quarterly", task:"Earth resistance & insulation resistance test",       status:"Sep 2025",  sc:"sched" },
  { freq:"Quarterly", fc:"quarterly", task:"Torque check — module clamps & mounting",             status:"Sep 2025",  sc:"sched" },
  { freq:"Bi-Annual", fc:"biannual",  task:"IV Curve string testing — full array",                status:"Dec 2025",  sc:"sched" },
  { freq:"Bi-Annual", fc:"biannual",  task:"Thermal imaging — handheld",                         status:"Dec 2025",  sc:"sched" },
  { freq:"Annual",    fc:"annual",    task:"EL imaging — module defect survey",                   status:"Mar 2026",  sc:"sched" },
  { freq:"Annual",    fc:"annual",    task:"Performance Guarantee Test (IEC 61724)",              status:"Mar 2026",  sc:"sched" },
];
const FREQ_COLORS = { monthly:"#22c55e", quarterly:"#f59e0b", biannual:"#3b82f6", annual:"#8b5cf6" };
const SCHED_STYLES = {
  due:   { bg:"rgba(245,158,11,.12)", color:"#fbbf24" },
  done:  { bg:"rgba(34,197,94,.12)",  color:"#4ade80" },
  sched: { bg:"rgba(59,130,246,.12)", color:"#60a5fa" },
};
const STEPS = [
  { title:"Auto-Generated Work Orders", desc:"Schedule-triggered or alarm-triggered work orders are created automatically in the SEPL CMMS, assigned to the nearest available engineer." },
  { title:"Engineer Mobile App Dispatch", desc:"Field engineers receive job details, plant SLD, access instructions, and a digital checklist on their mobile — with full offline capability for remote sites." },
  { title:"Digital Checklist & Photo Capture", desc:"Engineers complete structured checklists with photo evidence per step — IV tracer data, thermal images, torque readings — all geo-tagged." },
  { title:"Client e-Sign & Auto-Report", desc:"Client digitally approves completed work. Report auto-attaches to the plant record on pvprotech.com and emails to the client within 2 hours." },
];

function MaintenanceSchedule() {
  return (
    <section id="schedule" style={{ padding:"80px 80px", background:T.navy }}>
      <Divider />
      <SectionTag>Preventive Maintenance — CMMS</SectionTag>
      <SectionTitle>Structured Maintenance<br/><GreenEm>Schedules & Work Orders</GreenEm></SectionTitle>
      <p style={{ fontSize:16, lineHeight:1.75, color:"rgba(255,255,255,.55)", maxWidth:640, marginBottom:50 }}>
        SEPL's CMMS-driven scheduler auto-generates work orders, assigns field engineers, and tracks every
        activity with geo-tagged timestamps — fully compliant with IEC 62446-1 Annex C.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:34 }}>
        <div>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:"flex", gap:18, marginBottom:28, position:"relative" }}>
              {i < STEPS.length-1 && (
                <div style={{ position:"absolute", left:19, top:42, bottom:-8, width:2,
                  background:"linear-gradient(to bottom,rgba(34,197,94,.3),transparent)" }} />
              )}
              <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(34,197,94,.12)",
                border:"2px solid rgba(34,197,94,.3)", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15, fontWeight:800, color:T.green, flexShrink:0, fontFamily:"'Sora',sans-serif" }}>{i+1}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:5 }}>{s.title}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", borderRadius:18, overflow:"hidden" }}>
          <div style={{ background:"rgba(255,255,255,.04)", padding:"16px 20px",
            borderBottom:"1px solid rgba(255,255,255,.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:700 }}>📅 PM Schedule — 500kWp Plant</div>
            <div style={{ fontSize:11, color:T.green, fontWeight:600 }}>June 2025</div>
          </div>
          <div style={{ padding:18 }}>
            {PM_ROWS.map((r, i) => (
              <div key={i} className="sepl-pm-row" style={{ display:"flex", alignItems:"center", gap:12,
                paddingBottom:i<PM_ROWS.length-1?11:0, marginBottom:i<PM_ROWS.length-1?11:0 }}>
                <div style={{ width:76, fontSize:10, fontWeight:800, letterSpacing:"0.07em",
                  textTransform:"uppercase", color:FREQ_COLORS[r.fc], flexShrink:0 }}>{r.freq}</div>
                <div style={{ flex:1, fontSize:13, color:"rgba(255,255,255,.75)" }}>{r.task}</div>
                <div style={{ fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10,
                  background:SCHED_STYLES[r.sc].bg, color:SCHED_STYLES[r.sc].color, flexShrink:0 }}>{r.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. SOILING CALCULATOR
───────────────────────────────────────────── */
const SOILING = { raj:0.075, guj:0.05, mah:0.04, kar:0.03, tel:0.04, mp:0.06 };
const FREQ_MAP = { raj:"Monthly", guj:"Every 45 days", mah:"Every 2 months", kar:"Quarterly", tel:"Every 2 months", mp:"Monthly" };

function SoilingCalc() {
  const [cap, setCap]     = useState(500);
  const [state, setState] = useState("mah");
  const [months, setMonths] = useState(2);
  const [tariff, setTariff] = useState(7.5);

  const rate   = SOILING[state] || 0.04;
  const kwhLost = cap * 5.2 * 30 * months * rate;
  const revLost = kwhLost * tariff;
  const cleanCost = cap * 4.5;
  const roi = (revLost / cleanCost).toFixed(1);

  return (
    <section id="calculator" style={{ padding:"80px 80px", background:T.navy2 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:50, alignItems:"start" }}>
        <div>
          <Divider />
          <SectionTag>Module Cleaning — New Feature</SectionTag>
          <SectionTitle>How Much Are You<br/><GreenEm>Losing to Dust?</GreenEm></SectionTitle>
          <p style={{ fontSize:15, lineHeight:1.75, color:"rgba(255,255,255,.55)", marginBottom:28 }}>
            Soiling is India's #1 avoidable solar loss — averaging 4–8% generation loss across most states.
            Calculate your exact financial loss and the ROI of a single cleaning visit.
          </p>
          {[
            ["🌏","Soiling rates sourced from NISE India Soiling Database — state-specific dust accumulation models."],
            ["💧","DM water consumption estimates included — helps plan water sourcing for remote sites."],
            ["📊","Cleaning ROI: cost of one SEPL visit vs. generation recovered in ₹."],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", fontSize:14, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ color:"rgba(255,255,255,.6)", lineHeight:1.65 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, overflow:"hidden" }}>
          <div style={{ background:"rgba(255,255,255,.04)", padding:"16px 22px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700 }}>🧮 Soiling Loss & Cleaning ROI Calculator</div>
            <div style={{ fontSize:12, color:T.gray, marginTop:3 }}>Estimate your generation and revenue loss from soiling</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.6)", marginBottom:6, display:"flex", justifyContent:"space-between" }}>
              Plant Capacity (kWp) <span style={{ color:T.green, fontWeight:700 }}>{cap} kWp</span>
            </div>
            <input type="range" min={10} max={5000} value={cap} onChange={e => setCap(+e.target.value)} style={{ marginBottom:16 }} />

            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.6)", display:"block", marginBottom:6 }}>State / Location</label>
            <select className="sepl-form-select" value={state} onChange={e => setState(e.target.value)} style={{ marginBottom:16 }}>
              <option value="raj">Rajasthan — High dust (6–9% / month)</option>
              <option value="guj">Gujarat — Moderate (4–6% / month)</option>
              <option value="mah">Maharashtra — Moderate (3–5% / month)</option>
              <option value="kar">Karnataka — Low–Moderate (2–4% / month)</option>
              <option value="tel">Telangana — Moderate (3–5% / month)</option>
              <option value="mp">Madhya Pradesh — High (5–7% / month)</option>
            </select>

            <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.6)", marginBottom:6, display:"flex", justifyContent:"space-between" }}>
              Last Cleaning (months ago) <span style={{ color:T.green, fontWeight:700 }}>{months} months</span>
            </div>
            <input type="range" min={1} max={12} value={months} onChange={e => setMonths(+e.target.value)} style={{ marginBottom:16 }} />

            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.6)", display:"block", marginBottom:6 }}>Electricity Tariff (₹/kWh)</label>
            <input type="number" className="sepl-form-input" value={tariff} min={3} max={15} step={0.5}
              onChange={e => setTariff(+e.target.value)} style={{ marginBottom:18 }} />

            <div style={{ background:"linear-gradient(135deg,rgba(34,197,94,.08),rgba(34,197,94,.02))",
              border:"1px solid rgba(34,197,94,.22)", borderRadius:12, padding:18 }}>
              <div style={{ fontSize:11, fontWeight:800, color:T.green, letterSpacing:"0.1em", marginBottom:14 }}>
                📊 YOUR SOILING IMPACT ESTIMATE
              </div>
              {[
                ["Monthly soiling loss (%)",       `${(rate*100).toFixed(1)}% / month`, false],
                ["Accumulated loss to date",        `${fmtIN(kwhLost)} kWh lost`,       true],
                ["Revenue lost (₹)",                `₹ ${fmtIN(revLost)}`,              true],
                ["Recommended cleaning frequency", FREQ_MAP[state],                     false],
                ["Est. cleaning cost (SEPL)",       `₹ ${fmtIN(cleanCost)} / visit`,    false],
              ].map(([lbl, val, hi], i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  marginBottom:10, fontSize:13 }}>
                  <span style={{ color:"rgba(255,255,255,.55)" }}>{lbl}</span>
                  <span style={{ fontWeight:800, color: hi ? T.green : "#fff" }}>{val}</span>
                </div>
              ))}
              <div style={{ marginTop:12, padding:"9px 12px", background:"rgba(34,197,94,.08)",
                borderRadius:8, fontSize:12, color:T.green }}>
                💡 ROI of 1 cleaning visit: ₹{fmtIN(revLost)} recovered vs. ₹{fmtIN(cleanCost)} cost = <strong>{roi}x return</strong>
              </div>
            </div>

            <button className="sepl-btn-pri" style={{ width:"100%", justifyContent:"center", fontSize:14, padding:"13px", marginTop:18, borderRadius:10 }}>
              📅 Schedule Module Cleaning Now
            </button>
            <div style={{ fontSize:11, color:T.gray2, textAlign:"center", marginTop:10 }}>
              * Indicative estimates based on NISE India soiling studies.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. WARRANTY TRACKER
───────────────────────────────────────────── */
const WARRANTY_PLANTS = [
  { icon:"☀️", name:"Pune Rooftop — 500kWp",          detail:"Jinko Solar Mono PERC · Mar 2021 · Warranty: Mar 2046", badge:"25 yrs left", bc:"ok" },
  { icon:"🏭", name:"Rajasthan Ground Mount — 5MWp",   detail:"Trina Solar Poly · Jan 2016 · Warranty: Jan 2041",      badge:"15 yrs left", bc:"ok" },
  { icon:"🏢", name:"Nashik C&I — 250kWp",             detail:"Canadian Solar Poly · Dec 2014 · Warranty: Dec 2026",   badge:"⚠️ 18 months left", bc:"warn" },
  { icon:"⚡", name:"Hyderabad Industrial — 1MWp",     detail:"Vikram Solar Mono · Sep 2014 · Warranty: Sep 2026",     badge:"🔴 Book inspection now", bc:"critical", urgent:true },
];
const WP_BADGE = {
  ok:       { bg:"rgba(34,197,94,.12)",  color:"#4ade80" },
  warn:     { bg:"rgba(245,158,11,.12)", color:"#fbbf24" },
  critical: { bg:"rgba(239,68,68,.12)",  color:"#f87171" },
};

function WarrantyTracker() {
  const [newPlant, setNewPlant] = useState("");

  return (
    <section id="warranty" style={{ padding:"80px 80px", background:T.navy }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:60, alignItems:"center" }}>
        <div>
          <Divider />
          <SectionTag>Warranty Expiry Tracker — New Feature</SectionTag>
          <SectionTitle>Never Miss Your<br/><GreenEm>Warranty Window</GreenEm> Again.</SectionTitle>
          <p style={{ fontSize:15, lineHeight:1.75, color:"rgba(255,255,255,.55)", marginBottom:28 }}>
            Module warranties are valid for 25 years — but claims must be initiated before expiry. SEPL's
            warranty tracker sends automated alerts 6 months before expiry.
          </p>
          {[
            ["🔔","6-Month Advance Alert","Automated email + WhatsApp notification before warranty expiry — giving you time to plan and book."],
            ["📋","IEC 62446-1 Annex A Scope","End-of-Warranty inspections cover safety, electrical performance, thermography, and defect documentation."],
            ["💰","Maximise Warranty Claim Value","SEPL's documented evidence — EL images, thermal data, IV curves — provides the strongest basis for manufacturer claims."],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ display:"flex", gap:14, background:"rgba(255,255,255,.02)",
              border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:16, marginBottom:12 }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{title}</div>
                <div style={{ fontSize:13, color:T.gray, lineHeight:1.65 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(135deg,#0f2415,#162035)", padding:"18px 22px",
            borderBottom:"1px solid rgba(34,197,94,.15)" }}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700 }}>🔔 Warranty Expiry Tracker</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginTop:3 }}>Your registered plants and warranty status</div>
          </div>
          <div style={{ padding:22 }}>
            {WARRANTY_PLANTS.map((p, i) => (
              <div key={i} className="sepl-wp-row"
                style={{ display:"flex", alignItems:"center", gap:14, padding:13,
                  background: p.urgent ? "rgba(239,68,68,.04)" : "rgba(255,255,255,.02)",
                  border:`1px solid ${p.urgent ? "rgba(239,68,68,.3)" : "rgba(255,255,255,.06)"}`,
                  borderRadius:12, marginBottom:10 }}>
                <div style={{ width:40, height:40, background:"rgba(34,197,94,.1)", borderRadius:10,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{p.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:T.gray, marginTop:2 }}>{p.detail}</div>
                </div>
                <div style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:10,
                  background:WP_BADGE[p.bc].bg, color:WP_BADGE[p.bc].color, flexShrink:0 }}>{p.badge}</div>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <input className="sepl-form-input" style={{ flex:1, padding:"10px 14px", fontSize:13 }}
                placeholder="+ Register a new plant..."
                value={newPlant} onChange={e => setNewPlant(e.target.value)} />
              <button className="sepl-btn-pri" style={{ padding:"10px 18px", fontSize:13, borderRadius:9 }}
                onClick={() => setNewPlant("")}>Add Plant</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   10. OUR STORIES — PROJECT SHOWCASE
───────────────────────────────────────────── */
const STORIES = [
  {
    tag:"Case Study",
    tagColor:T.green,
    title:"5 MWp Ground-Mount Revival — Rajasthan",
    subtitle:"From 71% PR to 84% in 90 Days",
    desc:"An IPP plant suffering from chronic underperformance was handed over to SEPL. Within 3 months, systematic fault identification, cable retermination, and a soiling-control schedule recovered ₹38L in annual generation value.",
    stats:[{ val:"+13%", label:"PR Improvement" },{ val:"₹38L", label:"Annual Value Recovered" },{ val:"90 days", label:"Turnaround Time" }],
    img:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    location:"Jodhpur, Rajasthan",
    capacity:"5 MWp",
    type:"Ground Mount",
  },
  {
    tag:"Success Story",
    tagColor:T.gold,
    title:"500 kWp C&I Rooftop — Pune",
    subtitle:"Zero Downtime for 18 Consecutive Months",
    desc:"A large manufacturing client required 99.5%+ availability for their 500 kWp rooftop. SEPL's predictive maintenance model and dedicated NOC support delivered 18 months with zero generation loss due to maintenance.",
    stats:[{ val:"99.8%", label:"Plant Availability" },{ val:"0 hrs", label:"Unplanned Downtime" },{ val:"18 mo", label:"Streak" }],
    img:"https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80",
    location:"Pune, Maharashtra",
    capacity:"500 kWp",
    type:"Rooftop C&I",
  },
  {
    tag:"Warranty Win",
    tagColor:"#a78bfa",
    title:"End-of-Warranty Claim — Gujarat",
    subtitle:"₹1.2 Cr Module Replacement Secured",
    desc:"SEPL's end-of-warranty inspection on a 2 MWp plant — using EL imaging and IV curve testing — identified 142 defective modules. The documented evidence secured a full manufacturer replacement claim worth ₹1.2 Cr.",
    stats:[{ val:"142", label:"Modules Replaced" },{ val:"₹1.2 Cr", label:"Claim Value" },{ val:"100%", label:"Claim Accepted" }],
    img:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
    location:"Ahmedabad, Gujarat",
    capacity:"2 MWp",
    type:"Ground Mount",
  },
  {
    tag:"Portfolio O&M",
    tagColor:T.blue,
    title:"12-Site Portfolio — Pan India",
    subtitle:"Single NOC, Unified Reporting",
    desc:"A renewable energy fund with 12 distributed plants across 5 states consolidated O&M with SEPL. A unified NOC, single monthly report, and standardised SLAs reduced their internal coordination overhead by 60%.",
    stats:[{ val:"12 sites", label:"Under Management" },{ val:"5 states", label:"Coverage" },{ val:"60%", label:"Overhead Reduced" }],
    img:"https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80",
    location:"Pan India",
    capacity:"28 MWp",
    type:"Portfolio",
  },
];

function OurStories({ onNav }) {
  const [active, setActive] = useState(0);
  const story = STORIES[active];

  return (
    <section id="stories" style={{ padding:"80px 80px", background:T.navy3, position:"relative", overflow:"hidden" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", right:-200, bottom:-200, width:600, height:600, pointerEvents:"none",
        background:"radial-gradient(circle,rgba(34,197,94,.06),transparent 70%)" }} />

      <div style={{ position:"relative", zIndex:1 }}>
        <Divider />
        <SectionTag>Our Stories</SectionTag>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
          <SectionTitle>Real Plants. <GreenEm>Real Results.</GreenEm><br/>Real Impact.</SectionTitle>
          <button className="sepl-btn-out" style={{ fontSize:13, padding:"11px 22px", flexShrink:0 }}
            onClick={() => onNav("contact")}>View All Case Studies →</button>
        </div>

        {/* Tab pills */}
        <div style={{ display:"flex", gap:10, marginBottom:36, flexWrap:"wrap" }}>
          {STORIES.map((s, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ padding:"8px 18px", borderRadius:30, fontSize:12, fontWeight:700, cursor:"pointer",
                border:`1px solid ${active===i ? s.tagColor : "rgba(255,255,255,.12)"}`,
                background: active===i ? `${s.tagColor}1a` : "transparent",
                color: active===i ? s.tagColor : "rgba(255,255,255,.5)",
                transition:"all .22s" }}>
              {s.tag}
            </button>
          ))}
        </div>

        {/* Featured story */}
        <div key={active} style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:0,
          borderRadius:20, overflow:"hidden", border:"1px solid rgba(255,255,255,.1)",
          animation:"sepl-fadeUp .4s ease both",
          boxShadow:"0 40px 80px rgba(0,0,0,.5)" }}>
          {/* Image */}
          <div style={{ position:"relative", height:480, overflow:"hidden" }}>
            <img src={story.img} alt={story.title}
              style={{ width:"100%", height:"100%", objectFit:"cover",
                animation:"sepl-ken-burns 8s ease-in-out infinite alternate" }} />
            {/* overlay */}
            <div style={{ position:"absolute", inset:0,
              background:"linear-gradient(to right,transparent 50%,rgba(13,30,48,.95) 100%)" }} />
            <div style={{ position:"absolute", inset:0,
              background:"linear-gradient(to top,rgba(13,30,48,.8) 0%,transparent 50%)" }} />
            {/* Location badge */}
            <div style={{ position:"absolute", bottom:24, left:24, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7,
                background:"rgba(0,0,0,.5)", backdropFilter:"blur(8px)",
                border:"1px solid rgba(255,255,255,.15)", borderRadius:8,
                padding:"6px 12px", fontSize:12, color:"rgba(255,255,255,.8)", fontWeight:600 }}>
                📍 {story.location}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ background:"rgba(0,0,0,.5)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,.15)", borderRadius:8,
                  padding:"5px 11px", fontSize:11, color:"rgba(255,255,255,.7)", fontWeight:600 }}>
                  ⚡ {story.capacity}
                </div>
                <div style={{ background:"rgba(0,0,0,.5)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,.15)", borderRadius:8,
                  padding:"5px 11px", fontSize:11, color:"rgba(255,255,255,.7)", fontWeight:600 }}>
                  🏗️ {story.type}
                </div>
              </div>
            </div>
            {/* Tag */}
            <div style={{ position:"absolute", top:24, left:24,
              background:story.tagColor, color:"#fff",
              fontSize:10, fontWeight:800, padding:"4px 12px",
              borderRadius:20, letterSpacing:"0.1em" }}>{story.tag.toUpperCase()}</div>
          </div>

          {/* Content */}
          <div style={{ background:"rgba(13,30,48,.97)", padding:"40px 44px",
            display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800,
              lineHeight:1.2, marginBottom:8 }}>{story.title}</h3>
            <div style={{ fontSize:14, color:story.tagColor, fontWeight:700, marginBottom:20 }}>
              {story.subtitle}
            </div>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,.6)", marginBottom:30 }}>
              {story.desc}
            </p>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:32 }}>
              {story.stats.map((st, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)",
                  borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:900,
                    color:story.tagColor, lineHeight:1 }}>{st.val}</div>
                  <div style={{ fontSize:10, color:T.gray, marginTop:5, lineHeight:1.4 }}>{st.label}</div>
                </div>
              ))}
            </div>

            <button className="sepl-btn-pri" style={{ fontSize:13, padding:"12px 24px", alignSelf:"flex-start" }}
              onClick={() => onNav("contact")}>📞 Discuss a Similar Project →</button>
          </div>
        </div>

        {/* Story thumbnail grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:24 }}>
          {STORIES.map((s, i) => (
            <div key={i} className="sepl-story-card"
              onClick={() => setActive(i)}
              style={{ borderRadius:14, overflow:"hidden", position:"relative", height:130,
                border:`2px solid ${active===i ? s.tagColor : "rgba(255,255,255,.08)"}`,
                cursor:"pointer", opacity: active===i ? 1 : 0.65 }}>
              <div style={{ overflow:"hidden", height:"100%" }}>
                <img src={s.img} alt={s.title} className="sepl-story-img" />
              </div>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.8),transparent)" }} />
              <div style={{ position:"absolute", bottom:10, left:12, right:12 }}>
                <div style={{ fontSize:9, fontWeight:800, color:s.tagColor, letterSpacing:"0.08em",
                  textTransform:"uppercase", marginBottom:3 }}>{s.tag}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{s.capacity} · {s.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   11. CUSTOMER TESTIMONIALS
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name:"Rajesh Mehta",
    title:"Head of Projects",
    company:"Aditya Renewables Pvt Ltd",
    location:"Pune, Maharashtra",
    avatar:"RM",
    avatarBg:"linear-gradient(135deg,#22c55e,#16a34a)",
    rating:5,
    plant:"500 kWp Rooftop — Pune",
    quote:"SEPL's O&M team transformed how we think about plant performance. Their predictive diagnostics caught a string fault that would have cost us 3 weeks of lost generation if we had discovered it during our routine visit. The client portal gives us full visibility — our finance team loves the automated monthly reports.",
    metric:{ val:"₹14L", label:"Annual saving vs previous O&M vendor" },
  },
  {
    name:"Sunita Krishnamurthy",
    title:"VP – Asset Management",
    company:"Greenpeak Energy Fund",
    location:"Bengaluru, Karnataka",
    avatar:"SK",
    avatarBg:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
    rating:5,
    plant:"12-site Portfolio — Pan India",
    quote:"Managing 12 plants across 5 states was a nightmare before SEPL. Now we have one NOC, one report, one point of contact. Their SLA adherence has been exceptional — P1 faults resolved in under 6 hours every single time. I recommend SEPL to every fund manager in the renewable space.",
    metric:{ val:"99.6%", label:"Avg availability across 12 sites" },
  },
  {
    name:"Amitabh Saxena",
    title:"Director – Operations",
    company:"Sterling Agro Industries",
    location:"Nashik, Maharashtra",
    avatar:"AS",
    avatarBg:"linear-gradient(135deg,#f59e0b,#d97706)",
    rating:5,
    plant:"250 kWp C&I Rooftop — Nashik",
    quote:"We had major concerns about our 10-year-old plant before the warranty expired. SEPL conducted a thorough end-of-warranty inspection and the evidence they compiled — EL images, IV curves, thermal data — helped us successfully claim replacement for 38 degraded modules. We couldn't have done it without them.",
    metric:{ val:"₹42L", label:"Module warranty claim value recovered" },
  },
  {
    name:"Priya Nair",
    title:"CFO",
    company:"Horizon Hospitality Group",
    location:"Hyderabad, Telangana",
    avatar:"PN",
    avatarBg:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
    rating:5,
    plant:"1.2 MWp Rooftop — Hyderabad",
    quote:"What impressed me most was the soiling loss calculator SEPL used during the audit — it showed exactly how much revenue we were leaving on the table with quarterly cleaning. Switching to monthly cleaning paid back in 40 days. The numbers don't lie. SEPL thinks in ₹, not just in kWh.",
    metric:{ val:"6.8x", label:"ROI on monthly cleaning program" },
  },
  {
    name:"Vikram Desai",
    title:"Technical Director",
    company:"NovaSun EPC",
    location:"Ahmedabad, Gujarat",
    avatar:"VD",
    avatarBg:"linear-gradient(135deg,#ef4444,#b91c1c)",
    rating:5,
    plant:"5 MWp Ground Mount — Rajasthan",
    quote:"As an EPC contractor, we hand over plants to SEPL's O&M team after commissioning. The handover process is seamless — they already know the plant's SLD, equipment specs, and commission baseline from the reports we share. Our clients consistently thank us for the recommendation.",
    metric:{ val:"13 plants", label:"Handed over to SEPL in 2024" },
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setCurrent((current - 1 + total) % total);
  const next = () => setCurrent((current + 1) % total);

  // Show 3 at a time on desktop
  const visible = [
    TESTIMONIALS[(current) % total],
    TESTIMONIALS[(current + 1) % total],
    TESTIMONIALS[(current + 2) % total],
  ];

  return (
    <section id="testimonials" style={{ padding:"80px 80px", background:T.navy2, position:"relative", overflow:"hidden" }}>
      {/* background pattern */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(34,197,94,.04) 1px,transparent 1px)",
        backgroundSize:"28px 28px" }} />

      <div style={{ position:"relative", zIndex:1 }}>
        <Divider />
        <SectionTag>Client Testimonials</SectionTag>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
          <div>
            <SectionTitle>Trusted by Plant Owners <GreenEm>Across India</GreenEm></SectionTitle>
            <p style={{ fontSize:15, color:"rgba(255,255,255,.5)", lineHeight:1.7, maxWidth:520 }}>
              From C&I rooftops to utility-scale ground mounts — here's what our clients say about
              SEPL's O&M services.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <button className="sepl-testi-nav" onClick={prev}>←</button>
            <button className="sepl-testi-nav" onClick={next}>→</button>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22, marginBottom:32 }}>
          {visible.map((t, i) => (
            <div key={`${current}-${i}`} className="sepl-testi-card"
              style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)",
                borderRadius:18, padding:28, display:"flex", flexDirection:"column", gap:0,
                animation:"sepl-fadeUp .4s ease both",
                animationDelay:`${i * 0.08}s`,
                position:"relative", overflow:"hidden" }}>
              {/* Quote mark */}
              <div style={{ position:"absolute", top:16, right:20, fontSize:72, lineHeight:1,
                color:"rgba(34,197,94,.07)", fontFamily:"Georgia,serif", pointerEvents:"none" }}>"</div>

              {/* Stars */}
              <div style={{ display:"flex", gap:3, marginBottom:16 }}>
                {Array(t.rating).fill(0).map((_, j) => (
                  <span key={j} style={{ color:"#f59e0b", fontSize:14 }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.7)",
                marginBottom:24, flex:1, fontStyle:"italic" }}>
                "{t.quote}"
              </p>

              {/* Metric pill */}
              <div style={{ background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(34,197,94,.04))",
                border:"1px solid rgba(34,197,94,.2)", borderRadius:10,
                padding:"10px 14px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:900,
                  color:T.green, lineHeight:1 }}>{t.metric.val}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.55)", lineHeight:1.4 }}>{t.metric.label}</div>
              </div>

              {/* Plant */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:18,
                padding:"6px 10px", background:"rgba(255,255,255,.03)",
                border:"1px solid rgba(255,255,255,.07)", borderRadius:8 }}>
                <span style={{ fontSize:13 }}>⚡</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.45)", fontWeight:600 }}>{t.plant}</span>
              </div>

              {/* Author */}
              <div style={{ display:"flex", alignItems:"center", gap:12, borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:18 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:t.avatarBg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, fontWeight:800, color:"#fff", flexShrink:0, letterSpacing:"0.05em" }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:T.gray, marginTop:2 }}>{t.title}</div>
                  <div style={{ fontSize:11, color:T.green, fontWeight:600, marginTop:1 }}>{t.company}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:10, color:"rgba(255,255,255,.35)",
                  textAlign:"right", lineHeight:1.5 }}>
                  📍 {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 24 : 8, height:8,
                borderRadius:4, border:"none", cursor:"pointer",
                background: i === current ? T.green : "rgba(255,255,255,.18)",
                transition:"all .25s" }} />
          ))}
        </div>

        {/* Trust bar */}
        <div style={{ marginTop:48, padding:"24px 32px",
          background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)",
          borderRadius:14, display:"flex", justifyContent:"space-around", alignItems:"center",
          flexWrap:"wrap", gap:20 }}>
          {[
            { val:"150+", label:"Plants Under O&M" },
            { val:"9 GWp", label:"Cumulative Experience" },
            { val:"4.9 / 5", label:"Client Satisfaction" },
            { val:"98.7%", label:"SLA Adherence Rate" },
            { val:"₹12 Cr+", label:"Warranty Claims Secured" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:900, color:T.green }}>{s.val}</div>
              <div style={{ fontSize:11, color:T.gray, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   12. CONTACT SECTION
───────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name:"", company:"", email:"", phone:"", capacity:"", location:"", service:"Comprehensive AMC" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email) setSubmitted(true);
  };

  return (
    <section id="contact" style={{ padding:"70px 80px",
      background:"linear-gradient(135deg,#0f2415 0%,#0b1c14 50%,#162035 100%)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:50, alignItems:"center" }}>
        <div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:36, fontWeight:800, letterSpacing:"-0.02em",
            lineHeight:1.2, marginBottom:12 }}>
            Ready to <GreenEm>Optimize</GreenEm><br/>Your Solar Plant?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.5)", lineHeight:1.7, marginBottom:26 }}>
            Talk to SEPL's O&amp;M experts today. Get a tailored AMC quote, schedule a plant health check,
            or book an immediate site visit for urgent fault diagnosis.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28 }}>
            {["P1 Response: 4 hrs","IEC 61724 Reporting","Pan-India Coverage","150+ Plants Managed","MNRE Compliant O&M"].map((b,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.1)", borderRadius:30, padding:"7px 14px", fontSize:12, color:"rgba(255,255,255,.7)" }}>
                <span style={{ color:T.green }}>✓</span> {b}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:14 }}>
            <button className="sepl-btn-pri" style={{ fontSize:14, padding:"13px 24px" }}>📞 +91 99759 29989</button>
            <button className="sepl-btn-out" style={{ fontSize:14, padding:"13px 24px" }}>💬 WhatsApp</button>
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.09)", borderRadius:20, padding:30 }}>
          {submitted ? (
            <div style={{ textAlign:"center", padding:"30px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:800, marginBottom:8 }}>Request Received!</h4>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.5)" }}>Our team will respond within 24 hours.</p>
              <button className="sepl-btn-out" style={{ fontSize:13, padding:"10px 22px", marginTop:20 }}
                onClick={() => setSubmitted(false)}>Submit Another</button>
            </div>
          ) : (
            <>
              <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, marginBottom:6 }}>Get Your O&amp;M Quote</h4>
              <p style={{ fontSize:13, color:T.gray, marginBottom:22 }}>Fill in your details and our team will respond within 24 hours.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Your Name</label>
                  <input className="sepl-form-input" placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Company</label>
                  <input className="sepl-form-input" placeholder="Company Name" value={form.company} onChange={e => setForm({...form, company:e.target.value})} /></div>
              </div>
              <div style={{ marginBottom:14 }}><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Email Address</label>
                <input className="sepl-form-input" type="email" placeholder="email@company.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></div>
              <div style={{ marginBottom:14 }}><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Phone Number</label>
                <input className="sepl-form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Plant Capacity</label>
                  <input className="sepl-form-input" placeholder="e.g. 500 kWp" value={form.capacity} onChange={e => setForm({...form, capacity:e.target.value})} /></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Plant Location</label>
                  <input className="sepl-form-input" placeholder="State / City" value={form.location} onChange={e => setForm({...form, location:e.target.value})} /></div>
              </div>
              <div style={{ marginBottom:18 }}><label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.55)", display:"block", marginBottom:6 }}>Service Required</label>
                <select className="sepl-form-select" value={form.service} onChange={e => setForm({...form, service:e.target.value})}>
                  {["Comprehensive AMC","Non-Comprehensive AMC","Module Cleaning","Fault Diagnosis / Emergency","End-of-Warranty Inspection","Custom Portfolio O&M"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="sepl-btn-pri" style={{ width:"100%", justifyContent:"center", fontSize:15, padding:"14px", borderRadius:10 }}
                onClick={handleSubmit}>Submit Request →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   13. FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:T.navy2, borderTop:"1px solid rgba(255,255,255,.08)", padding:"56px 80px 28px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:46 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:34, height:34, background:"linear-gradient(135deg,#22c55e,#16a34a)",
              borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>☀️</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16 }}>Sustainfy Energy</div>
          </div>
          <p style={{ fontSize:13, color:T.gray, lineHeight:1.7, maxWidth:240 }}>
            Expert Solar PV Plant Services for Maximum ROI. Inspection, Testing, Design &amp; Engineering, and full O&amp;M solutions across India.
          </p>
          <div style={{ marginTop:16, display:"flex", gap:10 }}>
            <a href="tel:+919975929989" style={{ fontSize:13, color:T.green }}>+91 99759 29989</a>
            <span style={{ color:T.gray }}>·</span>
            <a href="mailto:assure@sustainfyenergy.com" style={{ fontSize:13, color:T.green }}>assure@sustainfyenergy.com</a>
          </div>
        </div>
        {[
          { title:"O&M Services", links:["Predictive Maintenance","Comprehensive AMC","Module Cleaning","Warranty Tracker"] },
          { title:"All Services", links:["Solar Plant Inspection","Solar Plant Testing","Design & Engineering","Consulting","Asset Management"] },
          { title:"Company", links:["About Us","Projects","Our Stories","Blog","Careers","Team","PVProtech Portal ↗"] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase",
              color:"rgba(255,255,255,.4)", marginBottom:16 }}>{col.title}</div>
            {col.links.map(l => (
              <a key={l} style={{ display:"block", fontSize:13, color:T.gray, marginBottom:9,
                transition:"color .2s", cursor:"pointer" }}
                onMouseEnter={e => e.target.style.color=T.green}
                onMouseLeave={e => e.target.style.color=T.gray}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:22,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontSize:12, color:T.gray2 }}>© 2026 Sustainfy Energy Private Limited. All rights reserved.</p>
        <div style={{ display:"flex", gap:20 }}>
          {["Terms & Conditions","Privacy Policy","Code of Conduct"].map(l => (
            <a key={l} style={{ fontSize:12, color:T.gray2, cursor:"pointer",
              transition:"color .2s" }}
              onMouseEnter={e => e.target.style.color=T.green}
              onMouseLeave={e => e.target.style.color=T.gray2}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function Sustainify() {
  useEffect(() => {
    const id = "sepl-global-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => {};
  }, []);

  const scrollTo = (id) => {
    if (id === "contact") { document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <div className="sepl-root">
      <Nav onNav={scrollTo} />
      <div style={{ marginTop:72, padding:"13px 80px", background:T.navy2,
        borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center",
        gap:8, fontSize:12, color:T.gray }}>
        <span style={{ cursor:"pointer", color:T.gray }}>Home</span>
        <span>›</span>
        <span style={{ cursor:"pointer", color:T.gray }}>Asset Management</span>
        <span>›</span>
        <span style={{ color:T.green }}>Operations &amp; Maintenance</span>
      </div>

      <Hero         onNav={scrollTo} />
      <ServicesGrid onNav={scrollTo} />
      <AMCPlans     onNav={scrollTo} />
      <AIDiagnostic />
      <Dashboard />
      <MaintenanceSchedule />
      <SoilingCalc />
      <WarrantyTracker />
      <OurStories   onNav={scrollTo} />
      <Testimonials />
      <Contact />
      <Footer />

      <button className="sepl-wa-btn sepl-float" title="Chat on WhatsApp">💬</button>
    </div>
  );
}