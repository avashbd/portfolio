import { useState, useEffect } from "react";
import { ArrowUpRight, Facebook, Linkedin, Instagram, Github, Dribbble, Moon, Sun, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../lib/api.js";

const FONT_ID = "avash-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SEGMENT_DEFS = [
  { id: "3d", label: { en: "3D Visualization", bn: "থ্রিডি ভিজ্যুয়ালাইজেশন" } },
  { id: "other", label: { en: "Structural & Other Work", bn: "স্ট্রাকচারাল ও অন্যান্য কাজ" } },
];

const COPY = {
  en: {
    hello: "HELLO! ⚡",
    imLabel: "I'M",
    nav: ["ABOUT", "WORK", "CONTACT"],
    whatIDo: "WHAT I DO",
    getInTouch: "GET IN TOUCH",
    haveProject: "Have a project in mind?",
    contactBody:
      "Open for 3D visualization, structural design, and architectural drafting work — send the brief, I'll get back with a scope.",
    loading: "Loading…",
    empty: "Projects coming soon.",
    projectsLabel: "PROJECTS",
    featuredLabel: "FEATURED WORK",
  },
  bn: {
    hello: "হ্যালো! ⚡",
    imLabel: "আমি",
    nav: ["সম্পর্কে", "কাজ", "যোগাযোগ"],
    whatIDo: "যা করি",
    getInTouch: "যোগাযোগ করুন",
    haveProject: "কোনো প্রজেক্ট মাথায় আছে?",
    contactBody:
      "থ্রিডি ভিজ্যুয়ালাইজেশন, স্ট্রাকচারাল ডিজাইন, বা ড্রাফটিংয়ের জন্য খোলা আছি — ব্রিফ পাঠান, স্কোপ নিয়ে ফিরে আসবো।",
    loading: "লোড হচ্ছে…",
    empty: "প্রজেক্ট শীঘ্রই আসছে।",
    projectsLabel: "প্রজেক্ট",
    featuredLabel: "বাছাই করা কাজ",
  },
};

function useBdClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hour12: true }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function FeaturedSlideshow({ projects, dark, dim, text, purple, label }) {
  const slides = projects.filter((p) => p.featured && p.images?.[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];
  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-16 pt-20">
      <p className="text-xs tracking-[0.25em] mb-6 font-medium" style={{ color: purple }}>{label}</p>
      <div className="relative rounded-2xl overflow-hidden" style={{ height: "60vh", minHeight: 320, background: dark ? "#1a1a1a" : "#eaeaea" }}>
        {slides.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === index ? 1 : 0,
              backgroundImage: `url('${p.images[0]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 70%)" }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#f4f4f0", textTransform: "uppercase" }}>
            {current.title}
          </h3>
          <p className="text-xs md:text-sm mt-1" style={{ color: "rgba(244,244,240,0.75)" }}>
            {current.tags?.join(", ")} {current.tags?.length ? "·" : ""} {current.year}
          </p>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)", color: "#fff", border: "none" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)", color: "#fff", border: "none" }}
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 right-4 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === index ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === index ? purple : "rgba(255,255,255,0.5)",
                    border: "none",
                    transition: "width 0.3s",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function PublicSite() {
  useFonts();
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(true);
  const [activeSegment, setActiveSegment] = useState(0);
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = COPY[lang];
  const bdTime = useBdClock();

  useEffect(() => {
    Promise.all([api.getSettings(), api.listProjects()])
      .then(([s, p]) => {
        setSettings(s.settings);
        setProjects(p.projects || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bg = dark ? "#111111" : "#f4f4f0";
  const text = dark ? "#f4f4f0" : "#111111";
  const dim = dark ? "#a3a3a3" : "#6b6b6b";
  const purple = "#6b21a8";

  const segDef = SEGMENT_DEFS[activeSegment];
  const segProjects = projects.filter((p) => p.segment === segDef.id);

  const name = settings?.name || "Avash";
  const tagline = settings?.tagline || "";
  const photo = settings?.profilePhoto;
  const socials = settings?.socials || {};
  const stats = settings?.stats || {};
  const marquee = settings?.marqueeText || "";

  return (
    <div style={{ background: bg, color: text, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* ===== HERO ===== */}
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "32%",
            height: "100%",
            background: `linear-gradient(180deg, ${purple} 0%, transparent 100%)`,
            opacity: dark ? 0.9 : 0.7,
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-16 py-8 flex flex-col" style={{ minHeight: "100vh" }}>
          <header className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2.5 text-lg font-bold">
              <div style={{ width: 24, height: 24, background: text, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              {name.toUpperCase()}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === "en" ? "bn" : "en")}
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-2 rounded-full"
                style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
              >
                <Globe size={12} /> {lang === "en" ? "বাংলা" : "English"}
              </button>
              <div
                className="hidden sm:flex items-center gap-2.5 text-sm px-4 py-2 rounded-full"
                style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
              >
                {bdTime} • BD
              </div>
              <button
                onClick={() => setDark(!dark)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: purple, color: "#fff", border: "none" }}
                aria-label="Toggle theme"
              >
                {dark ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </header>

          <div className="hidden md:flex flex-col gap-6 text-right absolute" style={{ right: "4rem", top: "15%" }}>
            {t.nav.map((l, i) => (
              <a
                key={l}
                href={i === 0 ? "#work" : i === 1 ? "#work" : "#contact"}
                className="text-sm font-medium tracking-widest hover:opacity-70 transition"
                style={{ color: text, textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </div>

          <main className="flex-1 relative flex items-center justify-between py-16">
            <div className="flex-1 flex flex-col z-10" style={{ gap: "4rem" }}>
              <div className="text-sm md:text-base font-medium tracking-widest" style={{ color: dim }}>
                {t.hello}
                <br />
                {t.imLabel} <span style={{ fontWeight: 700, color: text }}>{name.toUpperCase()}</span>
              </div>
              <a
                href="#contact"
                className="flex items-center justify-center rounded-full transition-all duration-500 hover:scale-105 hover:bg-white hover:text-black group"
                style={{ width: 110, height: 110, border: `1px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, textDecoration: "none", color: text, backdropFilter: "blur(8px)" }}
              >
                <ArrowUpRight size={36} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-500" />
              </a>
            </div>

            <div className="absolute left-1/2 top-1/2 text-center w-full flex flex-col items-center justify-center pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
              <h1
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(3.5rem, 11vw, 11rem)",
                  lineHeight: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  color: "transparent",
                  WebkitTextStroke: `2px ${dark ? "#f5f5dc" : "#1a1a1a"}`,
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  marginLeft: "-3%",
                }}
              >
                STRUCTURE
              </h1>

              <div className="relative flex items-center justify-center pointer-events-auto" style={{ height: "42vh", zIndex: 15, margin: "1rem 0" }}>
                {photo ? (
                  <img 
                    src={photo} 
                    alt={name} 
                    className="transition-transform duration-700 hover:scale-105"
                    style={{ 
                      width: "min(65vw, 300px)", 
                      height: "min(85vw, 400px)", 
                      borderRadius: "150px 150px 16px 16px", 
                      objectFit: "cover", 
                      boxShadow: dark ? "0 30px 60px -15px rgba(107, 33, 168, 0.6)" : "0 30px 60px -15px rgba(0,0,0,0.2)",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"}`
                    }} 
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: 180,
                      borderRadius: "90px 90px 0 0",
                      background: `linear-gradient(180deg, ${purple}55, ${purple}00)`,
                      border: `1px dashed ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      letterSpacing: 1,
                      color: dim,
                      textAlign: "center",
                    }}
                  >
                    YOUR PHOTO
                    <br />
                    (PNG, no bg)
                  </div>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(3.5rem, 11vw, 11rem)",
                  lineHeight: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: dark ? "#f5f5dc" : "#1a1a1a",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  marginRight: "-3%",
                }}
              >
                VISUALIZED
              </h1>
            </div>

            <div className="hidden md:flex flex-1 flex-col items-end text-right z-10" style={{ gap: "3rem", height: "100%", justifyContent: "flex-end", paddingBottom: "2rem" }}>
              <p style={{ maxWidth: 280, fontSize: "0.85rem", lineHeight: 1.7, color: dim, fontWeight: 300 }}>{tagline.toUpperCase()}</p>
              <div className="flex flex-col gap-2.5">
                {stats.projectsCount && (
                  <div className="flex items-baseline justify-end gap-2.5" style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Anton', sans-serif" }}>
                    {stats.projectsCount} <span style={{ color: purple, fontSize: "1rem", letterSpacing: 1 }}>{t.projectsLabel}</span>
                  </div>
                )}
                <div className="flex items-center justify-end gap-3 pt-1">
                  {socials.facebook && <a href={socials.facebook} className="hover:scale-110 transition-transform" target="_blank" rel="noreferrer"><Facebook size={16} style={{ color: dim }} /></a>}
                  {socials.linkedin && <a href={socials.linkedin} className="hover:scale-110 transition-transform" target="_blank" rel="noreferrer"><Linkedin size={16} style={{ color: dim }} /></a>}
                  {socials.instagram && <a href={socials.instagram} className="hover:scale-110 transition-transform" target="_blank" rel="noreferrer"><Instagram size={16} style={{ color: dim }} /></a>}
                  {socials.github && <a href={socials.github} className="hover:scale-110 transition-transform" target="_blank" rel="noreferrer"><Github size={16} style={{ color: dim }} /></a>}
                  {socials.dribbble && <a href={socials.dribbble} className="hover:scale-110 transition-transform" target="_blank" rel="noreferrer"><Dribbble size={16} style={{ color: dim }} /></a>}
                </div>
              </div>
            </div>
          </main>
        </div>

        {marquee && (
          <div
            className="absolute bottom-0 left-0 w-full flex overflow-hidden backdrop-blur-md"
            style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, padding: "14px 0", zIndex: 20 }}
          >
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.25rem", color: dim, whiteSpace: "nowrap", animation: "avash-marquee 22s linear infinite" }}>
              {(marquee + " * ").repeat(2)}
            </div>
            <style>{`@keyframes avash-marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}
      </div>

      {/* ===== FEATURED SLIDESHOW ===== */}
      {!loading && (
        <FeaturedSlideshow projects={projects} dark={dark} dim={dim} text={text} purple={purple} label={t.featuredLabel} />
      )}

      {/* ===== WORK ===== */}
      <section id="work" className="max-w-6xl mx-auto px-6 md:px-16 py-20">
        <p className="text-xs tracking-[0.25em] mb-8 font-medium" style={{ color: purple }}>{t.whatIDo}</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {SEGMENT_DEFS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSegment(i)}
              className="px-4 py-2 rounded-full text-sm border transition-all duration-300"
              style={{
                borderColor: activeSegment === i ? purple : dark ? "#2a2a2a" : "#dcdcdc",
                background: activeSegment === i ? purple : "transparent",
                color: activeSegment === i ? "#fff" : dim,
              }}
            >
              {s.label[lang]}
            </button>
          ))}
        </div>

        <h2 className="mb-10" style={{ fontFamily: "'Anton', sans-serif", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: 1 }}>
          {segDef.label[lang]}
        </h2>

        {loading ? (
          <p className="text-sm" style={{ color: dim }}>{t.loading}</p>
        ) : segProjects.length === 0 ? (
          <p className="text-sm" style={{ color: dim }}>{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {segProjects.map((p) => (
              <div key={p.id} className="group rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: dark ? "#232323" : "#e2e2e2", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                <div
                  className="rounded-lg h-32 mb-4 flex items-center justify-center text-xs overflow-hidden"
                  style={{ background: p.images?.[0] ? `url('${p.images[0]}') center/cover` : dark ? "#1a1a1a" : "#eaeaea", color: dim }}
                >
                  {!p.images?.[0] && "IMAGE"}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm" style={{ fontWeight: 500 }}>{p.title}</h4>
                  {p.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                      <ArrowUpRight size={14} className="mt-0.5 shrink-0" style={{ color: purple }} />
                    </a>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: dim }}>{p.tags?.join(", ")} {p.tags?.length ? "·" : ""} {p.year}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CONTACT ===== */}
      <footer id="contact" className="max-w-6xl mx-auto px-6 md:px-16 py-20 border-t" style={{ borderColor: dark ? "#232323" : "#e2e2e2" }}>
        <p className="text-xs tracking-[0.25em] mb-4 font-medium" style={{ color: purple }}>{t.getInTouch}</p>
        <h3 className="mb-4" style={{ fontFamily: "'Anton', sans-serif", fontSize: "2rem", textTransform: "uppercase" }}>{t.haveProject}</h3>
        <p className="text-sm max-w-md mb-8" style={{ color: dim }}>{t.contactBody}</p>
        <div className="flex flex-col gap-2">
          <a href={`mailto:${settings?.email}`} className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: text }}>{settings?.email}</a>
          {settings?.phone && <a href={`tel:${settings.phone}`} className="text-sm underline hover:opacity-70 transition-opacity" style={{ color: text }}>{settings.phone}</a>}
        </div>
        <div className="mt-16 pt-6 border-t text-xs" style={{ borderColor: dark ? "#232323" : "#e2e2e2", color: dim }}>
          © {new Date().getFullYear()} ArchViz by {name}
        </div>
      </footer>
    </div>
  );
}
