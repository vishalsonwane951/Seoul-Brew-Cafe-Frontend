import { useState, useEffect, useRef } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";

const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024 };
};

const ALL_BLOGS = [
  {
    _id: "b1",
    title: "How Seoul Brew Began",
    description: "From a small apartment kitchen in Mapo-gu to a full café — the story of our very first cup and the people who believed in us.",
    content: `It started with a single cup of coffee made at 2am in a rented apartment in Mapo-gu, Seoul. Our founder Seo Jiyeon had just returned from a café-hopping trip across Insadong and Mangwon, completely overwhelmed by the quiet ritual of the Korean slow-sip culture.\n\nShe brought those memories back to Pune — along with three kilograms of hand-sourced beans and an obsessive idea: what if a café here felt like the ones there?\n\nThe first Seoul Brew opened in a 400 sq ft space near Sinhgad Law College in early 2018. There were six seats, no menu board, and a hand-painted sign. Within three months, the queue stretched outside.\n\nToday Seoul Brew serves 3,000+ guests a month. But the 2am cup still sits at the heart of everything we do.`,
    images: [
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    ],
    author: "Seo Jiyeon",
    date: "Mar 2024",
    tag: "Origin",
  },
  {
    _id: "b2",
    title: "Finding Our Matcha Source",
    description: "We travelled to Uji, Japan to meet the farmers behind every sip of our ceremonial-grade matcha.",
    content: `Sourcing ceremonial-grade matcha is not a catalogue exercise. It requires trust, time, and being willing to fly to Uji at short notice.\n\nOur head of sourcing Kim Taehwan spent two weeks in Uji, Kyoto, visiting seven farms before finding the one. What made the difference wasn't just the leaf quality — it was the farmer's philosophy. Mr. Yamamoto stone-grinds his matcha at night, when temperatures are cooler, to preserve the chlorophyll.\n\nWe use his harvest exclusively. Every batch arrives in sealed tins with the harvest date handwritten on the lid.\n\nThe result is a matcha latte that stays vivid green for twenty minutes after pouring — something you can only achieve with the real thing.`,
    images: [
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    ],
    author: "Kim Taehwan",
    date: "Jun 2024",
    tag: "Sourcing",
  },
  {
    _id: "b3",
    title: "Community First, Always",
    description: "Every Sunday we open our space to local artists, readers, and dreamers.",
    content: `Sunday mornings at Seoul Brew look different from the rest of the week. The tables get pushed back. A low stage appears. Someone brings a keyboard.\n\nThis is our Open Sunday — a standing weekly event where we invite local artists, musicians, illustrators, and anyone with something to share to use the café as their stage.\n\nIt started as a one-off experiment in April 2023. A student asked if she could sketch portraits for free in the corner. We said yes. Forty people came to watch.\n\nNow Open Sunday draws 80–120 people every week. We donate 10% of that day's revenue to the local arts collective that helps fund the performers.`,
    images: [
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
    ],
    author: "Aisha M.",
    date: "Aug 2024",
    tag: "Culture",
  },
  {
    _id: "b4",
    title: "The Art of the Slow Sip",
    description: "Korean café culture is not about speed. We explore the philosophy of slowing down.",
    content: `In Seoul, a café visit is never a transaction. Nobody orders at the counter, pays, and leaves in five minutes. People arrive, settle in, and stay — sometimes for three hours over a single Americano.\n\nThis is the slow-sip culture, and it is what Seoul Brew is built around.\n\nWe've deliberately designed our space without speed cues. No buzzing queue boards. No calling out names. No "please limit your stay" signs. Instead, there are reading nooks, soft playlists, and natural light that shifts through the afternoon.\n\nWhen guests linger, conversations happen. Ideas form. That is the whole point.`,
    images: [
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    ],
    author: "Priya S.",
    date: "Sep 2024",
    tag: "Culture",
  },
  {
    _id: "b5",
    title: "Behind the Espresso Bar",
    description: "A day in the life of our head barista — rituals, routines, and decisions.",
    content: `Rahul arrives at 6:15am. The café doesn't open until 8, but calibration takes time.\n\nThe first thirty minutes are spent on the grinder. Humidity changes overnight, and even a 0.2g shift in dose can flatten the espresso. He pulls seven shots before he's happy with the extraction.\n\nBy 7:30, the milk is prepped — whole for most drinks, oat for the matcha bar, almond kept aside for the afternoon regulars who always ask for it.\n\nWhen the doors open, Rahul steps back. He believes a great barista becomes invisible at peak hour — no drama, no flair, just consistent, quiet excellence in every cup.`,
    images: [
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    ],
    author: "Rahul K.",
    date: "Oct 2024",
    tag: "Team",
  },
  {
    _id: "b6",
    title: "Seasonal Menu: Winter Edition",
    description: "Brown sugar hojicha, yuzu espresso, and a warm chestnut latte — meet winter.",
    content: `Every season, our kitchen team disappears for a week. They come back with a short, focused menu of drinks that belong to that time of year.\n\nThis winter, three drinks made the cut.\n\nThe Brown Sugar Hojicha is roasted, warm, and faintly smoky — the café equivalent of a blanket. The Yuzu Citrus Espresso cuts through cold mornings with a clean brightness that lingers. And the Chestnut Latte is unapologetically sweet — a once-a-year indulgence we make no apology for.\n\nAll three are available from December through February, while stock lasts. They don't come back once they're gone.`,
    images: [
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
      "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
      "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
    ],
    author: "Seo Jiyeon",
    date: "Nov 2024",
    tag: "Menu",
  },
];

const ALL_TAGS = ["All", ...new Set(ALL_BLOGS.map((b) => b.tag))];

// ── Image gallery with scroll ──────────────────────────────────
const ImageGallery = ({ images }) => {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollTo = (i) => {
    setActive(i);
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.offsetWidth * i, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(i);
  };

  return (
    <div style={{ position: "relative", marginBottom: "40px" }}>
      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          borderRadius: "0",
        }}
      >
        {images.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: "100%", scrollSnapAlign: "start" }}>
            <img
              src={src}
              alt={`slide-${i}`}
              style={{ width: "100%", height: "clamp(240px, 45vw, 480px)", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, active - 1))}
            style={{
              position: "absolute", top: "50%", left: "16px",
              transform: "translateY(-50%)",
              background: "rgba(26,15,10,0.55)", border: "none",
              color: "#fff", width: "40px", height: "40px",
              cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: active === 0 ? 0.3 : 1, transition: "opacity 0.2s",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => scrollTo(Math.min(images.length - 1, active + 1))}
            style={{
              position: "absolute", top: "50%", right: "16px",
              transform: "translateY(-50%)",
              background: "rgba(26,15,10,0.55)", border: "none",
              color: "#fff", width: "40px", height: "40px",
              cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: active === images.length - 1 ? 0.3 : 1, transition: "opacity 0.2s",
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === active ? colors.accent : colors.line,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Blog detail overlay ────────────────────────────────────────
const BlogDetail = ({ blog, onClose }) => {
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,5,2,0.72)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflowY: "auto",
        padding: isMobile ? "0" : "40px 20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          width: "100%",
          maxWidth: "780px",
          position: "relative",
          animation: "detailSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <style>{`
          @keyframes detailSlideUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px", zIndex: 10,
            background: "rgba(26,15,10,0.65)", border: "none",
            color: "#fff", width: "36px", height: "36px",
            cursor: "pointer", fontSize: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Image gallery */}
        <ImageGallery images={blog.images} />

        {/* Content */}
        <div style={{ padding: isMobile ? "24px 20px 40px" : "32px 48px 56px" }}>
          {/* Tag */}
          {blog.tag && (
            <span style={{
              display: "inline-block", marginBottom: "16px",
              padding: "3px 10px",
              fontFamily: fonts.sans, fontSize: "0.6rem",
              letterSpacing: "2px", textTransform: "uppercase",
              border: `1px solid ${colors.accent}`, color: colors.accent,
            }}>
              {blog.tag}
            </span>
          )}

          {/* Title */}
          <h2 style={{
            fontFamily: fonts.serif,
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400, color: colors.ink,
            lineHeight: 1.2, margin: "0 0 16px",
          }}>
            {blog.title}
          </h2>

          {/* Author + date */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "16px", marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: `1px solid ${colors.line}`,
            flexWrap: "wrap",
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: "0.75rem", color: colors.accent }}>
              — {blog.author}
            </span>
            <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", color: colors.muted, letterSpacing: "1px", textTransform: "uppercase" }}>
              {blog.date}
            </span>
          </div>

          {/* Body */}
          <div style={{ fontFamily: fonts.sans, fontSize: "0.95rem", color: colors.body, lineHeight: 1.9, fontWeight: 300 }}>
            {blog.content.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom: "20px", margin: "0 0 20px" }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Blog card (grid) ───────────────────────────────────────────
const BlogCard = ({ item, featured = false, onClick }) => {
  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        background: colors.white,
        border: `1px solid ${h ? colors.accent : colors.line}`,
        transition: "all 0.3s ease",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        display: "flex",
        flexDirection: featured ? "row" : "column",
        overflow: "hidden",
      }}
    >
      {/* Photo */}
      <div style={{
        flexShrink: 0,
        width: featured ? "clamp(200px, 40%, 360px)" : "100%",
        height: featured ? "auto" : "clamp(180px, 22vw, 240px)",
        overflow: "hidden",
        position: "relative",
      }}>
        <img
          src={item.images[0]}
          alt={item.title}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transition: "transform 0.5s ease",
            transform: h ? "scale(1.04)" : "scale(1)",
          }}
        />
        {item.images.length > 1 && (
          <span style={{
            position: "absolute", bottom: "10px", right: "10px",
            background: "rgba(26,15,10,0.65)",
            color: "#fff", fontFamily: fonts.sans,
            fontSize: "0.6rem", letterSpacing: "1px",
            padding: "3px 8px",
          }}>
            +{item.images.length - 1} photos
          </span>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: "clamp(20px, 3vw, 32px)", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {item.tag && (
          <span style={{
            alignSelf: "flex-start", padding: "3px 10px",
            fontFamily: fonts.sans, fontSize: "0.6rem",
            letterSpacing: "2px", textTransform: "uppercase",
            border: `1px solid ${colors.accent}`, color: colors.accent,
          }}>
            {item.tag}
          </span>
        )}
        <div style={{ fontFamily: fonts.serif, fontSize: featured ? "clamp(1.2rem, 2.5vw, 1.6rem)" : "clamp(1rem, 1.8vw, 1.1rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.3 }}>
          {item.title}
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: "0.83rem", color: colors.muted, lineHeight: 1.75, fontWeight: 300 }}>
          {item.description}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginTop: "auto", paddingTop: "14px", borderTop: `1px solid ${colors.line}` }}>
          <span style={{ fontFamily: fonts.sans, fontSize: "0.72rem", color: colors.accent }}>— {item.author}</span>
          <span style={{ fontFamily: fonts.sans, fontSize: "0.65rem", color: colors.muted, letterSpacing: "1.5px", textTransform: "uppercase" }}>{item.date}</span>
        </div>
      </div>
    </div>
  );
};

// ── Tag pill ───────────────────────────────────────────────────
const TagPill = ({ label, active, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "8px 20px",
        background: active ? colors.ink : h ? colors.off : "transparent",
        color: active ? colors.white : h ? colors.ink : colors.muted,
        border: `1px solid ${active ? colors.ink : colors.line}`,
        fontFamily: fonts.sans, fontSize: "0.68rem",
        letterSpacing: "2px", textTransform: "uppercase",
        fontWeight: 400, cursor: "pointer",
        transition: "all 0.2s", whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
};

// ── Blog Page ──────────────────────────────────────────────────
const BlogPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const isNarrow = isMobile || isTablet;
  const [activeTag, setActiveTag] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = activeTag === "All" ? ALL_BLOGS : ALL_BLOGS.filter((b) => b.tag === activeTag);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ paddingTop: "72px" }}>

      {/* Hero banner */}
      <section style={{ background: colors.ink, padding: isMobile ? "56px 20px 48px" : isTablet ? "72px 40px 64px" : "96px 56px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="Seoul Brew Journal" />
          <h1 style={{ fontFamily: fonts.serif, fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: colors.white, lineHeight: 1.1, margin: "0 0 20px" }}>
            Stories, Sourcing &{" "}
            <em style={{ fontStyle: "italic", color: colors.accent }}>Seoul Culture</em>
          </h1>
          <p style={{ fontFamily: fonts.sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, fontWeight: 300, maxWidth: "520px", margin: 0 }}>
            Behind every cup is a story worth telling — meet the people, places, and ideas that make Seoul Brew what it is.
          </p>
        </div>
      </section>

      {/* Tag filters — sticky */}
      <section style={{ background: colors.white, borderBottom: `1px solid ${colors.line}`, padding: isMobile ? "0 20px" : isTablet ? "0 40px" : "0 56px", position: "sticky", top: "72px", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", padding: "16px 0" }}>
          {ALL_TAGS.map((tag) => (
            <TagPill key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
          ))}
        </div>
      </section>

      {/* Cards */}
      <section style={{ background: colors.off, padding: isMobile ? "48px 20px 80px" : isTablet ? "64px 40px 100px" : "80px 56px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "64px", textAlign: "center", fontFamily: fonts.sans, color: colors.muted, fontSize: "0.88rem", fontStyle: "italic", border: `1px solid ${colors.line}`, background: colors.white }}>
              No stories in this category yet.
            </div>
          )}

          {featured && (
            <div style={{ marginBottom: "clamp(24px, 3vw, 32px)" }}>
              <BlogCard item={featured} featured={!isMobile} onClick={() => setSelected(featured)} />
            </div>
          )}

          {rest.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "clamp(16px, 2vw, 24px)" }}>
              {rest.map((blog) => (
                <BlogCard key={blog._id} item={blog} onClick={() => setSelected(blog)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail overlay */}
      {selected && <BlogDetail blog={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default BlogPage;