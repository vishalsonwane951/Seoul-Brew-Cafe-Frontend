import { useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import FeaturedCard from "../components/FeaturedCard";
import API from '../services/api.js';
import { useNavigate } from "react-router-dom";

const BtnFill = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        padding: "15px 40px",
        background: h ? colors.accent : colors.ink,
        color: colors.white,
        border: `1px solid ${h ? colors.accent : colors.ink}`,
        fontFamily: fonts.sans,
        fontSize: "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 400,
        cursor: "pointer",
        transition: "all 0.25s",
      }}
    >
      {children}
    </button>
  );
};

const BtnOutline = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        padding: "15px 40px",
        background: h ? colors.ink : "transparent",
        color: h ? colors.white : colors.ink,
        border: `1px solid ${colors.ink}`,
        fontFamily: fonts.sans,
        fontSize: "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 400,
        cursor: "pointer",
        transition: "all 0.25s",
      }}
    >
      {children}
    </button>
  );
};

//  HERO SECTION
const Hero = ({ setPage }) => {
  const navigate = useNavigate()
  return (
    <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: "72px", animation: "heroFade 0.8s ease forwards" }}>
      <style>{`
      @keyframes heroFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes floatCoffee { 0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);} }
      @keyframes subtitleFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", animation: "subtitleFade 1s ease 0.2s both" }}>
          <div style={{ width: "40px", height: "1px", background: colors.accent }} />
          <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent, fontWeight: 400 }}>
            Sihgad Law College, Pune
          </span>
        </div>
        <h1 style={{ fontFamily: fonts.serif, fontSize: "clamp(3rem, 5.5vw, 6rem)", fontWeight: 700, lineHeight: 0.95, color: colors.ink, letterSpacing: "-2px", margin: 0, animation: "heroFade 1s ease 0.1s both" }}>
          SEOUL<br />
          <em style={{ fontStyle: "italic", fontWeight: 400, color: colors.accent }}>BREW</em>
          <span style={{ display: "block", fontFamily: fonts.sans, fontSize: "0.18em", fontStyle: "normal", fontWeight: 300, color: colors.muted, letterSpacing: "8px", textTransform: "uppercase", marginTop: "12px" }}>Cafe</span>
        </h1>
        <p style={{ fontFamily: fonts.sans, fontSize: "1.05rem", lineHeight: 1.8, color: colors.body, maxWidth: "400px", fontWeight: 300, marginTop: "28px", animation: "subtitleFade 1s ease 0.4s both" }}>
          A Taste of Seoul in Every Sip — inspired by the slow-sip culture of Seoul's finest café alleys, where every cup is a considered ritual.
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "48px", animation: "subtitleFade 1s ease 0.6s both" }}>
          <BtnFill onClick={() => navigate('/menu')}>Explore Menu</BtnFill>
          <BtnOutline onClick={() => navigate('/order')}>Order Now</BtnOutline>
        </div>
        <span style={{ fontFamily: fonts.korean, fontSize: "0.75rem", color: colors.line, letterSpacing: "6px", marginTop: "40px", animation: "subtitleFade 1s ease 0.8s both" }}>
          CAFE      </span>
      </div>

      <div style={{ background: colors.surface, position: "relative", overflow: "hidden", borderRadius:'45px' }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
         <img src="https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg" alt="" style={{width:'100%'}}/>
          {/* <div style={{ fontSize: "6rem", animation: "floatCoffee 5s ease-in-out infinite" }}>☕</div> */}
          <span style={{ fontFamily: fonts.korean, fontSize: "0.85rem", color: colors.muted, letterSpacing: "8px" }}>SEOUL Brew cafe..!</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid ${colors.line}` }}>
          {[["18+", "Drinks"], ["4.9★", "Rating"], ["3K+", "Guests/Mo"]].map(([num, label], i) => (
            <div key={label} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 2 ? `1px solid ${colors.line}` : "none" }}>
              <div style={{ fontFamily: fonts.serif, fontSize: "1.5rem", fontWeight: 700, color: colors.ink1 }}>{num}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted, marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

  )
}



//  ABOUT SECTION
const About = () => (
  <section style={{ background: colors.off, padding: "120px 56px" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "4/5", background: colors.surface, border: `1px solid ${colors.line}`, display: "flex",borderRadius:'45px', alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {/* <span style={{ fontFamily: fonts.korean, fontSize: "4rem", color: colors.line }}>CAFE</span> */}
            <img src="https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg" alt="" style={{ width:'100%'}}/>

            <div style={{ position: "absolute", bottom: "-12px", right: "-12px", width: "80px", height: "80px", border: `1px solid ${colors.accent}`, opacity: 0.4 }} />
          </div>
          <div style={{ position: "absolute", top: "-16px", left: "-16px", width: "88px", height: "88px", borderRadius: "50%", background: colors.accent, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <span style={{ fontFamily: fonts.serif, fontSize: "1.4rem", fontWeight: 700, color: colors.white, lineHeight: 1 }}>6+</span>
            <span style={{ fontFamily: fonts.sans, fontSize: "0.5rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.white, opacity: 0.85 }}>Years</span>
          </div>

        </div>

        <div>
          <Eyebrow text="Our Story" />
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.15, margin: "0 0 24px 0" }}>
            Inspired by the<br />
            <em style={{ fontStyle: "italic", color: colors.accent }}>streets of Seoul</em>
          </h2>
          <p style={{ fontFamily: fonts.sans, fontSize: "0.93rem", lineHeight: 1.9, color: colors.body, fontWeight: 300, marginBottom: "20px" }}>
            Inspired by the vibrant streets of Seoul, we bring authentic Korean coffee culture to your city. From handcrafted espresso to signature desserts, every detail is brewed with passion.
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: "0.93rem", lineHeight: 1.9, color: colors.body, fontWeight: 300 }}>
            Every ingredient is sourced with care — single-origin beans from Jeju Island, premium ceremonial-grade matcha, and traditional recipes passed through our founder's family for three generations.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: colors.line, border: `1px solid ${colors.line}`, marginTop: "40px" }}>
            {[
              ["Handcrafted", "Every cup made fresh to order"],
              ["Authentic", "True to Seoul's café culture"],
              ["Sourced", "Direct-trade Korean ingredients"],
              ["Community", "10% profits to local artisans"],
            ].map(([title, desc]) => {
              const [h, setH] = useState(false);
              return (
                <div key={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? colors.surface : colors.white, padding: "18px 20px", transition: "background 0.2s" }}>
                  <div style={{ fontFamily: fonts.sans, fontSize: "0.78rem", fontWeight: 500, color: colors.ink, marginBottom: "3px" }}>{title}</div>
                  <div style={{ fontFamily: fonts.sans, fontSize: "0.74rem", color: colors.muted, lineHeight: 1.5, fontWeight: 300 }}>{desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Featured = () => {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [linkH, setLinkH] = useState(false);

  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      // Use /menu/user endpoint (public menu - no auth required)
      const res = await API.get("/menu/user");
      setMenu(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const featured = menu
    ? [
      ...(menu.Coffee?.filter((i) => i.available !== false).slice(0, 1) ?? []),
      ...(menu.matcha?.filter((i) => i.available !== false).slice(0, 1) ?? []),
      ...(menu.food?.filter((i) => i.available !== false).slice(0, 1) ?? []),
    ]
    : [];

  // FIX: Define ErrorBox inline since it's not imported
  const ErrorBox = ({ message, onRetry }) => (
    <div style={{ 
      background: 'rgba(255,100,100,0.1)', 
      border: '1px solid rgba(255,100,100,0.3)', 
      padding: '16px', 
      borderRadius: '8px',
      color: '#ff6b6b',
      fontFamily: 'inherit',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            background: 'rgba(255,100,100,0.2)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            color: '#ff6b6b',
            cursor: 'pointer',
            marginLeft: '12px'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );

  return (
    <section style={{ background: colors.ink, padding: "120px 56px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "1px", background: colors.accent }} />
              <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent }}>
                Fan Favourites
              </span>
            </div>
            <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: colors.white, lineHeight: 1.1, margin: 0 }}>
              Featured <em style={{ fontStyle: "italic", color: colors.accent }}>Favorites</em>
            </h2>
          </div>

          <button
            onMouseEnter={() => setLinkH(true)}
            onMouseLeave={() => setLinkH(false)}
            onClick={() => navigate('/menu')}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: fonts.sans,
              fontSize: "0.75rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 400,
              color: linkH ? colors.white : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s",
              marginBottom: "4px",
            }}
          >
            <span>→</span> Full Menu
          </button>
        </div>

        {error && <div style={{ marginBottom: "24px" }}><ErrorBox message={error} onRetry={fetchMenu} /></div>}


        {featured.map((item) => (
          <FeaturedCard key={item.id} item={item} />
        ))}

      </div>
    </section>
  );
};

//  TESTIMONIALS
const TESTIMONIALS = [
  { quote: "Best coffee experience I've ever had.", author: "Priya S." },
  { quote: "Feels like a cafe straight from Seoul.", author: "Rahul K." },
  { quote: "Amazing ambiance and delicious desserts!", author: "Aisha M." },
];

const TestimonialCard = ({ quote, author }) => {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: colors.white, border: `1px solid ${h ? colors.accent : colors.line}`, padding: "40px 32px", transition: "all 0.3s ease", transform: h ? "translateY(-6px)" : "translateY(0)" }}
    >
      <p style={{ fontFamily: fonts.sans, fontSize: "0.9rem", color: colors.ink, lineHeight: 1.6, marginBottom: "16px" }}>“{quote}”</p>
      <span style={{ fontFamily: fonts.sans, fontSize: "0.75rem", fontWeight: 500, color: colors.accent }}>{author}</span>
    </div>
  );
};

const Testimonials = () => (
  <section style={{ padding: "120px 56px", background: colors.off }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
        {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
      </div>
    </div>
  </section>
);

// HOME PAGE
export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <About />
      <Featured setPage={setPage} />
      <Testimonials />
    </>
  );
}





// import { useNavigate } from 'react-router-dom';
// import { useApp } from '../Admin/context/AppContext';
// import { T } from '../Admin/globalstyle';

// const FEATURES = [
//   { icon:'☕', title:'Specialty Coffee', desc:'Single-origin beans roasted in Seoul, brewed with precision and care.' },
//   { icon:'🍵', title:'Jeju Matcha',       desc:'Stone-ground Jeju Island matcha, ceremonial grade and incredibly smooth.' },
//   { icon:'🧇', title:'Korean Bites',      desc:'Red bean waffles, honey toast, and seasonal baked goods fresh daily.' },
//   { icon:'📅', title:'Easy Reservations', desc:'Book your table in seconds, no fuss, guaranteed seating.' },
// ];

// const TESTIMONIALS = [
//   { name:'김민지', rating:5, text:'Best dalgona latte in all of Seoul. I come here every single week!', platform:'Google' },
//   { name:'Sarah M.', rating:5, text:'A must-visit! The red bean waffle changed my life. Seriously.', platform:'TripAdvisor' },
//   { name:'이준호', rating:5, text:'분위기도 최고, 커피도 최고. 서울에서 가장 좋아하는 카페입니다.', platform:'Naver' },
// ];

//   export default function Home() {
//     const navigate = useNavigate();
//     const { menuItems } = useApp();
//     const featured = Array.isArray(menuItems)
//   ? menuItems.filter(m => m.available).slice(0, 4)
//   : [];


//   return (
//     <div>
//       {/* HERO */}
//       <div style={{ background:`linear-gradient(135deg, ${T.custBrown} 0%, #5a2e12 50%, #8b5a2e 100%)`,
//         minHeight:'88vh', display:'flex', alignItems:'center', justifyContent:'center',
//         position:'relative', overflow:'hidden' }}>
//         {/* Background pattern */}
//         <div style={{ position:'absolute', inset:0, opacity:0.06,
//           backgroundImage:`repeating-linear-gradient(45deg, ${T.custAmber} 0, ${T.custAmber} 1px, transparent 0, transparent 50%)`,
//           backgroundSize:'30px 30px' }} />
//         <div style={{ textAlign:'center', zIndex:1, padding:'0 20px' }}>
//           <div style={{ fontFamily:T.mono, fontSize:'0.65rem', letterSpacing:'0.5em', color:T.custAmber, marginBottom:20, opacity:0.85 }}>WELCOME TO</div>
//           <h1 style={{ fontFamily:T.display, fontSize:'clamp(5rem,14vw,11rem)', letterSpacing:'0.03em', color:'#f5f0e8', lineHeight:0.9, marginBottom:20 }}>
//             Seoul<br />Brew
//           </h1>
//           <p style={{ fontFamily:T.serif, fontSize:'1.1rem', color:'rgba(245,240,232,0.7)', maxWidth:460, margin:'0 auto 40px', lineHeight:1.7 }}>
//             Specialty coffee, Korean-inspired flavors, and a warm corner in Hongdae to call your own.
//           </p>
//           <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
//             <button className="cust-btn cust-btn-amber" onClick={()=>navigate('/menu')}>Explore Menu</button>
//             <button className="cust-btn cust-btn-outline" style={{ color:'#f5f0e8', borderColor:'rgba(245,240,232,0.5)' }} onClick={()=>navigate('/reserve')}>Reserve a Table</button>
//           </div>
//           <div style={{ marginTop:50, display:'flex', gap:40, justifyContent:'center', flexWrap:'wrap' }}>
//             {[['342+','Happy Reviews'],['4.8★','Average Rating'],['5+','Years in Hongdae']].map(([v,l])=>(
//               <div key={l} style={{ textAlign:'center' }}>
//                 <div style={{ fontFamily:T.display, fontSize:'2.4rem', color:T.custAmber }}>{v}</div>
//                 <div style={{ fontFamily:T.mono, fontSize:'0.55rem', color:'rgba(245,240,232,0.5)', letterSpacing:'0.15em' }}>{l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px' }}>

//         {/* FEATURES */}
//         <div style={{ padding:'80px 0 60px' }}>
//           <div style={{ textAlign:'center', marginBottom:48 }}>
//             <div style={{ fontFamily:T.mono, fontSize:'0.58rem', letterSpacing:'0.35em', color:T.custAmber, marginBottom:12 }}>WHY SEOUL BREW</div>
//             <h2 style={{ fontFamily:T.display, fontSize:'3rem', color:T.custBrown }}>Crafted With Love</h2>
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
//             {FEATURES.map((f,i)=>(
//               <div key={i} style={{ textAlign:'center', padding:'32px 20px', background:'#fff', borderRadius:16, border:`1px solid rgba(61,31,13,0.07)` }}>
//                 <div style={{ fontSize:'2.5rem', marginBottom:16 }}>{f.icon}</div>
//                 <div style={{ fontFamily:T.display, fontSize:'1.2rem', color:T.custBrown, marginBottom:10 }}>{f.title}</div>
//                 <div style={{ fontSize:'0.82rem', color:'rgba(61,31,13,0.6)', lineHeight:1.65 }}>{f.desc}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FEATURED MENU */}
//         <div style={{ padding:'20px 0 70px' }}>
//           <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36 }}>
//             <div>
//               <div style={{ fontFamily:T.mono, fontSize:'0.58rem', letterSpacing:'0.35em', color:T.custAmber, marginBottom:8 }}>WHAT WE MAKE</div>
//               <h2 style={{ fontFamily:T.display, fontSize:'2.6rem', color:T.custBrown }}>Fan Favourites</h2>
//             </div>
//             <button className="cust-btn cust-btn-outline" onClick={()=>navigate('/menu')}>See Full Menu →</button>
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
//             {featured.map(item=>(
//               <div key={item.id} className="cust-card" onClick={()=>navigate('/order')}>
//                 <div style={{ background:`linear-gradient(135deg,${T.custBrown},#8b5a2e)`, height:160, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem' }}>{item.img}</div>
//                 <div style={{ padding:'16px' }}>
//                   <div style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:6 }}>{item.name}</div>
//                   <div style={{ fontSize:'0.78rem', color:'rgba(61,31,13,0.55)', marginBottom:10, lineHeight:1.5 }}>{item.desc}</div>
//                   <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                     <div style={{ fontFamily:T.mono, fontSize:'0.82rem', color:T.custAmber, fontWeight:700 }}>₹{item.price.toLocaleString()}</div>
//                     <span className="tag tag-green">{item.category}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TESTIMONIALS */}
//         <div style={{ padding:'20px 0 80px' }}>
//           <div style={{ textAlign:'center', marginBottom:44 }}>
//             <div style={{ fontFamily:T.mono, fontSize:'0.58rem', letterSpacing:'0.35em', color:T.custAmber, marginBottom:10 }}>WHAT PEOPLE SAY</div>
//             <h2 style={{ fontFamily:T.display, fontSize:'2.6rem', color:T.custBrown }}>Guest Reviews</h2>
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
//             {TESTIMONIALS.map((t,i)=>(
//               <div key={i} style={{ background:'#fff', borderRadius:16, padding:28, border:`1px solid rgba(61,31,13,0.07)` }}>
//                 <div style={{ color:T.custAmber, fontSize:'1.2rem', letterSpacing:3, marginBottom:14 }}>{'★'.repeat(t.rating)}</div>
//                 <div style={{ fontSize:'0.85rem', lineHeight:1.7, color:'rgba(61,31,13,0.7)', marginBottom:18 }}>"{t.text}"</div>
//                 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                   <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{t.name}</div>
//                   <span className="tag tag-amber">{t.platform}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA BANNER */}
//         <div style={{ background:`linear-gradient(135deg,${T.custBrown},#5a2e12)`, borderRadius:20, padding:'60px 48px', textAlign:'center', marginBottom:80 }}>
//           <div style={{ fontFamily:T.display, fontSize:'2.8rem', color:'#f5f0e8', marginBottom:16 }}>Visit Us in Hongdae</div>
//           <div style={{ fontFamily:T.mono, fontSize:'0.65rem', color:'rgba(245,240,232,0.6)', letterSpacing:'0.2em', marginBottom:10 }}>서울시 마포구 홍대입구로 23, 2F</div>
//           <div style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.custAmber, marginBottom:32 }}>Mon–Fri 08:00–22:00 · Sat–Sun 09:00–23:00</div>
//           <div style={{ display:'flex', gap:14, justifyContent:'center' }}>
//             <button className="cust-btn cust-btn-amber" onClick={()=>navigate('/reserve')}>Book a Table</button>
//             <button className="cust-btn cust-btn-outline" style={{ color:'#f5f0e8', borderColor:'rgba(245,240,232,0.5)' }} onClick={()=>navigate('/order')}>Order Ahead</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }