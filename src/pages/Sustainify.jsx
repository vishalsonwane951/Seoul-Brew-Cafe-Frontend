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
      {/* grid overlay */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)",
        backgroundSize:"50px 50px" }} />
      {/* glow */}
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

      {/* stats */}
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
  { tag:"enhanced", icon:"📡", title:"Plant Monitoring & SCADA",
    desc:"Real-time inverter-level monitoring, multi-brand compatibility (SMA, Sungrow, Huawei, ABB), configurable alarm engine.", link:"View Dashboard →", nav:"monitoring" },
  { tag:"new", icon:"🧮", title:"Soiling Loss & Cleaning ROI Calculator",
    desc:"Quantify generation & revenue loss from dust. Get location-specific cleaning frequency with full ROI breakdown.", link:"Calculate Now →", nav:"calculator" },
  { tag:"new", icon:"🔔", title:"Warranty Expiry Tracker",
    desc:"Automated alerts 6 months before module/inverter/BOS warranty expiry — ensuring timely End-of-Warranty inspections.", link:"Register Plant →", nav:"warranty" },
  { tag:"enhanced", icon:"📊", title:"Automated Performance Reporting",
    desc:"IEC 61724-1 monthly reports with PR, CUF, loss tree analysis, auto-generated and emailed on the 2nd of every month.", link:"Sample Report →", nav:"dashboard" },
  { tag:"new", icon:"🚁", title:"Drone-Based Thermography O&M",
    desc:"AI hotspot classification per IEC 62446-3. Scan 1 MWp in under 3 hours with structured defect reporting.", link:"Enquire →", nav:"contact" },
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
      { ok:false, text:"Annual drone thermography inspection" },
    ]},
  { type:"Full Coverage", name:"Comprehensive AMC", price:"₹18–28", unit:"/ kWp / year (indicative)",
    popular:true,
    features:[
      { ok:true, text:"Monthly + quarterly PM visits (8/year)" },
      { ok:true, text:"24/7 remote SCADA monitoring" },
      { ok:true, text:"Monthly + annual performance reports" },
      { ok:true, text:"Corrective maintenance — labour + spares" },
      { ok:true, text:"Bi-monthly module cleaning (DM water)" },
      { ok:true, text:"Annual drone thermography inspection" },
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

      {/* SLA Tiers */}
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
  const [phase, setPhase] = useState(0); // 0=options, 1=followup, 2=input, 3=results
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
        {/* Left */}
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

        {/* AI Widget */}
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)",
          borderRadius:20, overflow:"hidden", boxShadow:"0 30px 60px rgba(0,0,0,.4)" }}>
          {/* header */}
          <div style={{ background:"linear-gradient(135deg,#0f2415,#162a1a)", padding:"16px 20px",
            display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(34,197,94,.15)" }}>
            <div className="sepl-pulse" style={{ width:10, height:10, borderRadius:"50%", background:T.green }} />
            <span style={{ fontSize:13, fontWeight:700 }}>SEPL Solar Fault Diagnosis Assistant</span>
            <span style={{ marginLeft:"auto", fontSize:10, color:T.green, fontWeight:600 }}>● LIVE</span>
          </div>
          {/* chat body */}
          <div style={{ padding:20, maxHeight:440, overflowY:"auto" }}>
            {/* bot greeting */}
            <div style={{ marginBottom:14 }}>
              <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.12)",
                borderRadius:"0 12px 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                color:"rgba(255,255,255,.85)", maxWidth:"85%" }}>
                👋 Hello! I'm SEPL's solar diagnostic assistant. Tell me about your plant issue
                and I'll identify the probable cause instantly.
              </div>
            </div>
            {/* options */}
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
            {/* user selected */}
            {phase >= 1 && sel !== null && (
              <div style={{ marginBottom:14, display:"flex", justifyContent:"flex-end" }}>
                <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:"12px 0 12px 12px", padding:"11px 15px", fontSize:13, lineHeight:1.6,
                  color:"rgba(255,255,255,.7)", maxWidth:"80%" }}>{AI_OPTS[sel]}</div>
              </div>
            )}
            {/* followup */}
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
                  <span style={{ display:"inline-block", animation:"sepl-spin .8s linear infinite",
                    marginLeft:6 }}>⏳</span>
                </div>
              </div>
            )}
            {/* diagnosis */}
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
          {/* input */}
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
        {/* window bar */}
        <div style={{ background:"rgba(255,255,255,.04)", padding:"13px 22px", borderBottom:"1px solid rgba(255,255,255,.08)",
          display:"flex", alignItems:"center", gap:8 }}>
          {[T.red,T.gold,T.green].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
          <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.55)", marginLeft:10 }}>
            SEPL Client Portal — Plant Dashboard — Pune Rooftop 500kWp
          </span>
          <div style={{ marginLeft:"auto", background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.22)",
            color:T.green, fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10 }}>🟢 LIVE DATA</div>
        </div>
        {/* body */}
        <div style={{ padding:24, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {/* KPIs */}
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

          {/* Chart */}
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

          {/* Alarms */}
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

          {/* Tickets */}
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
  { freq:"Bi-Annual", fc:"biannual",  task:"Thermal imaging — handheld / drone",                  status:"Dec 2025",  sc:"sched" },
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
        {/* Steps */}
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
        {/* Schedule table */}
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
   8. SCADA MONITORING
───────────────────────────────────────────── */
const INVERTERS = [
  { name:"INV-01 (100kW)", power:"98.4 kW",  st:"ok",   status:"ONLINE" },
  { name:"INV-02 (100kW)", power:"71.2 kW",  st:"warn", status:"STRING FAULT" },
  { name:"INV-03 (100kW)", power:"99.1 kW",  st:"ok",   status:"ONLINE" },
  { name:"INV-04 (100kW)", power:"97.8 kW",  st:"ok",   status:"ONLINE" },
  { name:"INV-05 (100kW)", power:"100.2 kW", st:"ok",   status:"ONLINE" },
  { name:"INV-06 (100kW)", power:"0 kW",     st:"fault",status:"OFFLINE" },
];
const INV_STYLE = {
  ok:    { border:"rgba(34,197,94,.2)",  color:"#4ade80" },
  warn:  { border:"rgba(245,158,11,.3)", color:"#fbbf24" },
  fault: { border:"rgba(239,68,68,.3)",  color:"#f87171" },
};
const MON_FEATS = [
  { icon:"📡", title:"Inverter-Brand Agnostic Integration", desc:"Compatible with SMA, Sungrow, Huawei, ABB, Delta via Modbus RTU/TCP, RS485, and manufacturer APIs." },
  { icon:"🌤️", title:"Weather Station Integration",        desc:"GHI, POA irradiance, module temperature, wind speed correlated with generation for loss tree analysis (IEC 61724-1)." },
  { icon:"🔔", title:"Configurable Alarm Engine",          desc:"Set PR threshold alarms, inverter fault triggers, and earth fault alerts — escalated via SMS, email, and WhatsApp." },
  { icon:"📈", title:"Day-Ahead Generation Forecasting",   desc:"Satellite-based irradiance forecasting with ±5% accuracy — critical for IPPs with DISCOM scheduling obligations." },
];

function Monitoring() {
  return (
    <section id="monitoring" style={{ padding:"80px 80px", background:T.navy3 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:50, alignItems:"start" }}>
        <div>
          <Divider />
          <SectionTag>Real-Time SCADA Monitoring</SectionTag>
          <SectionTitle>Complete Plant<br/><GreenEm>Visibility. Anytime.</GreenEm></SectionTitle>
          <p style={{ fontSize:15, lineHeight:1.75, color:"rgba(255,255,255,.55)", marginBottom:28 }}>
            Multi-inverter-brand monitoring with string-level fault heatmaps, weather station integration, and
            a configurable alarm engine — all accessible on pvprotech.com.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {MON_FEATS.map((f, i) => (
              <div key={i} className="sepl-mon-feat"
                style={{ display:"flex", gap:16, background:"rgba(255,255,255,.03)",
                  border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:18 }}>
                <div style={{ width:44, height:44, background:"rgba(34,197,94,.1)", borderRadius:10,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCADA panel */}
        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", borderRadius:18, overflow:"hidden" }}>
          <div style={{ background:"rgba(255,255,255,.04)", padding:"13px 18px",
            borderBottom:"1px solid rgba(255,255,255,.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.6)" }}>⚙️ SCADA — Inverter Status Overview — 500kWp</span>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.green, fontWeight:600 }}>
              <div className="sepl-pulse" style={{ width:7, height:7, borderRadius:"50%", background:T.green }} />LIVE
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, padding:18 }}>
            {INVERTERS.map((inv, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,.03)", borderRadius:10, padding:14,
                border:`1px solid ${INV_STYLE[inv.st].border}`, textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.55)", marginBottom:6 }}>{inv.name}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:INV_STYLE[inv.st].color }}>{inv.power}</div>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", color:INV_STYLE[inv.st].color, marginTop:4, textTransform:"uppercase" }}>{inv.status}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,.08)", display:"flex", gap:12 }}>
            {[["847","W/m² GHI"],["892","W/m² POA"],["52°C","Module Temp"],["466 kW","Total Output"]].map(([v,l],i) => (
              <div key={i} style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:T.green }}>{v}</div>
                <div style={{ fontSize:10, color:T.gray, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. SOILING CALCULATOR
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

        {/* Calc card */}
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

            {/* Results */}
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
   10. WARRANTY TRACKER
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
   11. CONTACT SECTION
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
   12. FOOTER
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
          { title:"O&M Services", links:["Predictive Maintenance","Comprehensive AMC","SCADA Monitoring","Module Cleaning","Drone Thermography","Warranty Tracker"] },
          { title:"All Services", links:["Solar Plant Inspection","Solar Plant Testing","Design & Engineering","Consulting","Asset Management"] },
          { title:"Company", links:["About Us","Projects","Blog","Careers","Team","PVProtech Portal ↗"] },
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
export default function SustainifyOM() {
  // Inject global CSS once
  useEffect(() => {
    const id = "sepl-global-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => { /* keep styles */ };
  }, []);

  const scrollTo = (id) => {
    if (id === "contact") { document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <div className="sepl-root">
      <Nav onNav={scrollTo} />
      {/* breadcrumb */}
      <div style={{ marginTop:72, padding:"13px 80px", background:T.navy2,
        borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center",
        gap:8, fontSize:12, color:T.gray }}>
        <span style={{ cursor:"pointer", color:T.gray }}>Home</span>
        <span>›</span>
        <span style={{ cursor:"pointer", color:T.gray }}>Asset Management</span>
        <span>›</span>
        <span style={{ color:T.green }}>Operations &amp; Maintenance</span>
      </div>

      <Hero    onNav={scrollTo} />
      <ServicesGrid onNav={scrollTo} />
      <AMCPlans     onNav={scrollTo} />
      <AIDiagnostic />
      <Dashboard />
      <MaintenanceSchedule />
      <Monitoring />
      <SoilingCalc />
      <WarrantyTracker />
      <Contact />
      <Footer />

      {/* WhatsApp FAB */}
      <button className="sepl-wa-btn sepl-float" title="Chat on WhatsApp">💬</button>
    </div>
  );
}