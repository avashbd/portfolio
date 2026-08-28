import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Facebook, Linkedin, Instagram, Github, Dribbble, Moon, Sun, Globe, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
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

function getThumb(url) {
  if (!url) return "";
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('youtu.be/')[1]?.split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return url;
}

function MediaViewer({ url }) {
  if (!url) return null;
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('youtu.be/')[1]?.split('?')[0];
    return <iframe className="w-full aspect-video rounded-xl" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen></iframe>;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return <iframe className="w-full aspect-video rounded-xl" src={`https://player.vimeo.com/video/${videoId}?autoplay=1`} allow="autoplay; fullscreen" allowFullScreen></iframe>;
  }
  if (url.includes('drive.google.com/uc') || url.match(/\.(mp4|webm|ogg)$/i)) {
    return <video className="w-full aspect-video rounded-xl" controls autoPlay src={url}></video>;
  }
  if (url.includes('drive.google.com') && url.includes('/view')) {
    const embedUrl = url.replace('/view', '/preview').replace('?usp=sharing', '');
    return <iframe className="w-full aspect-video rounded-xl" src={embedUrl} allowFullScreen></iframe>;
  }
  
  return <img src={url} className="w-full h-auto object-contain rounded-xl" alt="Project media" />;
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
    <section className="max-w-6xl mx-auto px-6 md:px-16 pt-20 avash-reveal avash-delay-300">
      <p className="text-xs tracking-[0.25em] mb-6 font-medium" style={{ color: purple }}>{label}</p>
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: "60vh", minHeight: 320, background: dark ? "#14161f" : "#eaeaea" }}>
        {slides.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === index ? 1 : 0,
              backgroundImage: `url('${getThumb(p.images[0])}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: dark ? "linear-gradient(0deg, rgba(8,9,13,0.95) 0%, rgba(8,9,13,0.3) 50%, rgba(8,9,13,0) 80%)" : "linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 80%)" }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
          <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: text, textTransform: "uppercase" }}>
            {current.title}
          </h3>
          <p className="text-xs md:text-sm mt-1" style={{ color: dim }}>
            {current.tags?.join(", ")} {current.tags?.length ? "·" : ""} {current.year}
          </p>
        </div>

        {slides.length > 1 && (
          <>
            <button onClick={goPrev} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform" style={{ background: dark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)", color: text, border: "1px solid rgba(255,255,255,0.1)" }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={goNext} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform" style={{ background: dark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)", color: text, border: "1px solid rgba(255,255,255,0.1)" }}>
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 right-4 flex gap-1.5 pointer-events-auto">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, background: i === index ? purple : "rgba(150,150,150,0.4)", border: "none", transition: "width 0.3s" }}
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
  
  const [activeSegment, setActiveSegment] = useState(0); 
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(true);
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const cursorRef = useRef(null);

  const t = COPY[lang];
  const bdTime = useBdClock();

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    Promise.all([
      api.getSettings().catch(() => ({ settings: {} })), 
      api.listProjects().catch(() => ({ projects: [] }))
    ]).then(([s, p]) => {
        setSettings(s.settings || {});
        setProjects(p.projects || []);
        if (s.settings?.defaultTheme) setDark(s.settings.defaultTheme === "dark");
    }).finally(() => setLoading(false));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProject]);

  const bg = dark ? "#08090d" : "#f7f7f4";
  const text = dark ? "#f3f4f6" : "#111827";
  const dim = dark ? "#9ca3af" : "#4b5563";
  const purple = "#8b5cf6";
  const accentGold = "#d4af37";

  const segDef = SEGMENT_DEFS[activeSegment ?? 0]; 
  const segProjects = projects.filter((p) => p.segment === segDef.id);

  const name = settings?.name || "Avash";
  const tagline = settings?.tagline || "";
  const photo = settings?.profilePhoto;
  const socials = settings?.socials || {};
  const stats = settings?.stats || {};
  const marquee = settings?.marqueeText || "";

  return (
    <div className={isMounted ? "opacity-100" : "opacity-0"} style={{ background: bg, color: text, fontFamily: "'Inter', sans-serif", minHeight: "100vh", transition: "opacity 0.8s ease" }}>
      
      <style>{`
        @media (pointer: fine) {
          body { cursor: none; }
          a, button, select, input, textarea { cursor: none !important; }
        }
        @keyframes fadeUpReveal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .avash-reveal {
          animation: fadeUpReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .avash-delay-100 { animation-delay: 100ms; }
        .avash-delay-200 { animation-delay: 200ms; }
        .avash-delay-300 { animation-delay: 300ms; }
        .avash-delay-400 { animation-delay: 400ms; }
      `}</style>

      {/* ===== CUSTOM ANIMATED CURSOR ===== */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out mix-blend-difference"
        style={{
          width: isHoveringProject ? 70 : 32,
          height: isHoveringProject ? 70 : 32,
          marginLeft: isHoveringProject ? -35 : -16,
          marginTop: isHoveringProject ? -35 : -16,
          border: isHoveringProject ? "none" : "2px solid #fff",
          background: isHoveringProject ? "#fff" : "transparent",
        }}
      >
        {isHoveringProject && <span className="text-black text-[11px] font-bold tracking-widest">VIEW</span>}
      </div>

      {/* ===== PROJECT MODAL POPUP ===== */}
      {selectedProject && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6" style={{ background: dark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}>
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-10 shadow-2xl avash-reveal" 
            style={{ background: dark ? "#11141d" : "#ffffff", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}
          >
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10" 
              style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "0.5rem", paddingRight: "40px" }}>
              {selectedProject.title}
            </h2>
            <p className="text-sm md:text-base mb-6" style={{ color: purple, fontWeight: 600 }}>
              {selectedProject.tags?.join(", ")} {selectedProject.tags?.length ? "·" : ""} {selectedProject.year}
            </p>
            
            {selectedProject.description && (
              <p className="text-sm md:text-base leading-relaxed mb-10 whitespace-pre-wrap" style={{ color: dim }}>
                {selectedProject.description}
              </p>
            )}

            <div className="flex flex-col gap-8">
              {selectedProject.images?.map((url, idx) => (
                <div key={idx} className="w-full rounded-xl overflow-hidden border shadow-lg" style={{ borderColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", background: dark ? "#0a0c12" : "#f3f4f6" }}>
                  <MediaViewer url={url} />
                </div>
              ))}
            </div>
            
            {selectedProject.pdfUrl && (
              <a href={selectedProject.pdfUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105" style={{ background: purple, color: "#fff" }}>
                 View Attached PDF <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ===== HERO (ID="ABOUT") ===== */}
      <div id="about" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        
        {/* Background Gradient */}
        <div
          className="avash-reveal"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "45vw",
            height: "75vh",
            background: `radial-gradient(circle, ${purple}25 0%, rgba(139, 92, 246, 0) 70%)`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-16 py-8 flex flex-col" style={{ minHeight: "100vh" }}>
          
          <header className="flex justify-between items-start mb-8 avash-reveal">
            <div className="flex items-center gap-2.5 text-lg font-bold tracking-wider">
              <div style={{ width: 24, height: 24, background: purple, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              {name.toUpperCase()}
            </div>
            <div className="flex items-center gap-3 hover:[&_button]:scale-105">
              <button onClick={() => setLang(lang === "en" ? "bn" : "en")} className="hidden sm:flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition hover:opacity-80" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
                <Globe size={12} style={{ color: purple }} /> {lang === "en" ? "বাংলা" : "English"}
              </button>
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-medium px-4 py-2 rounded-full border" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} /> {bdTime} • BD
              </div>
              <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:scale-105" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: text }}>
                {dark ? <Moon size={14} style={{ color: purple }} /> : <Sun size={14} style={{ color: accentGold }} />}
              </button>
            </div>
          </header>

          <div className="hidden md:flex flex-col gap-6 text-right absolute avash-reveal avash-delay-100" style={{ right: "4rem", top: "15%" }}>
            {t.nav.map((l, i) => (
              <a key={l} href={i === 0 ? "#about" : i === 1 ? "#work" : "#contact"} className="text-xs font-semibold tracking-[0.2em] hover:text-purple-400 transition hover:scale-110 origin-right" style={{ color: dim, textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>

          {/* MOBILE RESPONSIVE FIX: flex-col on mobile, stacked properly */}
          <main className="flex-1 relative flex flex-col md:flex-row items-center justify-center md:justify-between py-10 md:py-16">
            
            {/* 1. HELLO section (Top on mobile, Left on desktop) */}
            <div className="flex flex-col z-20 avash-reveal avash-delay-100 items-center md:items-start text-center md:text-left w-full md:w-auto md:flex-1 mb-10 md:mb-0" style={{ gap: "1.5rem" }}>
              <div className="text-sm md:text-base font-medium tracking-widest leading-relaxed" style={{ color: dim }}>
                {t.hello}
                <br />
                {t.imLabel} <span style={{ fontWeight: 700, color: text }}>{name.toUpperCase()}</span>
              </div>
              <a
                href="#contact"
                className="flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 group shadow-lg w-[70px] h-[70px] md:w-[110px] md:h-[110px]"
                style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`, textDecoration: "none", color: text, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", backdropFilter: "blur(10px)" }}
              >
                <ArrowUpRight strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-45 transition-transform duration-500" style={{ color: purple }} />
              </a>
            </div>

            {/* 2. CENTER IMAGE section (Relative on mobile, Absolute on desktop) */}
            <div className="relative md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 text-center w-full flex flex-col items-center justify-center pointer-events-none z-10 my-4 md:my-0">
              <h1
                className="avash-reveal"
                style={{
                  transform: `translateY(${scrollY * 0.25}px)`,
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(3rem, 11vw, 11rem)",
                  lineHeight: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"}`,
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  marginLeft: "-2%",
                }}
              >
                STRUCTURE
              </h1>

              <div className="relative flex items-center justify-center pointer-events-auto avash-reveal avash-delay-100" style={{ height: "min(45vh, 400px)", zIndex: 15, margin: "1rem 0", transform: `translateY(${scrollY * 0.05}px)` }}>
                {photo ? (
                  <img 
                    src={photo} 
                    alt={name} 
                    className="transition-transform duration-700 hover:scale-[1.02]"
                    style={{ 
                      width: "min(70vw, 290px)", 
                      height: "100%", 
                      borderRadius: "140px 140px 20px 20px", 
                      objectFit: "cover", 
                      boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`
                    }} 
                  />
                ) : (
                  <div style={{ height: "100%", width: "min(70vw, 180px)", borderRadius: "90px 90px 0 0", background: `linear-gradient(180deg, ${purple}44, ${purple}00)`, border: `1px dashed ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: dim, textAlign: "center" }}>YOUR PHOTO<br/>(PNG)</div>
                )}
              </div>

              <h1
                className="avash-reveal avash-delay-200"
                style={{
                  transform: `translateY(${scrollY * -0.1}px)`,
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(3rem, 11vw, 11rem)",
                  lineHeight: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: text,
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  marginRight: "-2%",
                  textShadow: dark ? "0 10px 30px rgba(139, 92, 246, 0.3)" : "none",
                }}
              >
                VISUALIZED
              </h1>
            </div>

            {/* 3. RIGHT section - Socials (Bottom on mobile, Right on desktop) */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right z-10 avash-reveal avash-delay-200 mt-12 md:mt-0 w-full md:w-auto md:flex-1" style={{ gap: "2rem", height: "100%", justifyContent: "flex-end", paddingBottom: "2rem" }}>
              <p className="hidden md:block" style={{ maxWidth: 280, fontSize: "0.85rem", lineHeight: 1.7, color: dim, fontWeight: 300 }}>{tagline.toUpperCase()}</p>
              
              <div className="flex flex-col gap-3 md:gap-2.5 items-center md:items-end">
                {stats.projectsCount && (
                  <div className="flex items-baseline justify-center md:justify-end gap-2.5" style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Anton', sans-serif" }}>
                    {stats.projectsCount} <span style={{ color: purple, fontSize: "1rem", letterSpacing: 1 }}>{t.projectsLabel}</span>
                  </div>
                )}
                <div className="flex items-center justify-center md:justify-end gap-4 md:gap-3.5 pt-1">
                  {socials.facebook && <a href={socials.facebook} className="p-2 md:p-2 rounded-full border border-white/10 hover:border-purple-500 hover:scale-110 transition-all" target="_blank" rel="noreferrer"><Facebook size={16} style={{ color: dim }} /></a>}
                  {socials.linkedin && <a href={socials.linkedin} className="p-2 md:p-2 rounded-full border border-white/10 hover:border-purple-500 hover:scale-110 transition-all" target="_blank" rel="noreferrer"><Linkedin size={16} style={{ color: dim }} /></a>}
                  {socials.instagram && <a href={socials.instagram} className="p-2 md:p-2 rounded-full border border-white/10 hover:border-purple-500 hover:scale-110 transition-all" target="_blank" rel="noreferrer"><Instagram size={16} style={{ color: dim }} /></a>}
                  {socials.github && <a href={socials.github} className="p-2 md:p-2 rounded-full border border-white/10 hover:border-purple-500 hover:scale-110 transition-all" target="_blank" rel="noreferrer"><Github size={16} style={{ color: dim }} /></a>}
                  {socials.dribbble && <a href={socials.dribbble} className="p-2 md:p-2 rounded-full border border-white/10 hover:border-purple-500 hover:scale-110 transition-all" target="_blank" rel="noreferrer"><Dribbble size={16} style={{ color: dim }} /></a>}
                </div>
              </div>
            </div>

          </main>
        </div>

        {marquee && (
          <div className="absolute bottom-0 left-0 w-full flex overflow-hidden backdrop-blur-md avash-reveal avash-delay-300" style={{ background: dark ? "rgba(139, 92, 246, 0.03)" : "rgba(0,0,0,0.02)", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, padding: "14px 0", zIndex: 20 }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.1rem", color: dim, letterSpacing: "1px", whiteSpace: "nowrap", animation: "avash-marquee 25s linear infinite" }}>
              {(marquee + " ✦ ").repeat(3)}
            </div>
            <style>{`@keyframes avash-marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}
      </div>

      {!loading && <FeaturedSlideshow projects={projects} dark={dark} dim={dim} text={text} purple={purple} label={t.featuredLabel} />}

      {/* ===== WORK ===== */}
      <section id="work" className="max-w-6xl mx-auto px-6 md:px-16 py-24">
        <p className="text-xs tracking-[0.25em] mb-8 font-semibold avash-reveal" style={{ color: purple }}>{t.whatIDo}</p>

        <div className="flex flex-wrap gap-2.5 mb-12 avash-reveal">
          {SEGMENT_DEFS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSegment(i)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-300 hover:scale-105"
              style={{
                borderColor: activeSegment === i ? purple : dark ? "rgba(255,255,255,0.1)" : "#dcdcdc",
                background: activeSegment === i ? purple : "transparent",
                color: activeSegment === i ? "#fff" : dim,
                boxShadow: activeSegment === i ? "0 10px 20px -5px rgba(139, 92, 246, 0.4)" : "none",
              }}
            >
              {s.label[lang]}
            </button>
          ))}
        </div>

        <h2 className="mb-12 avash-reveal" style={{ fontFamily: "'Anton', sans-serif", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: 1 }}>
          {segDef.label[lang]}
        </h2>

        {loading ? (
          <p className="text-sm" style={{ color: dim }}>{t.loading}</p>
        ) : segProjects.length === 0 ? (
          <p className="text-sm" style={{ color: dim }}>{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {segProjects.map((p, idx) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProject(p)}
                onMouseEnter={() => setIsHoveringProject(true)}
                onMouseLeave={() => setIsHoveringProject(false)}
                className="cursor-none group rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-purple-500/40 relative avash-reveal" 
                style={{ animationDelay: `${(idx % 3) * 100}ms`, borderColor: dark ? "rgba(255,255,255,0.08)" : "#e2e2e2", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}
              >
                <div
                  className="relative rounded-xl h-48 mb-5 flex items-center justify-center text-xs overflow-hidden border border-white/5"
                  style={{ background: p.images?.[0] ? `url('${getThumb(p.images[0])}') center/cover` : dark ? "#14161f" : "#eaeaea", color: dim }}
                >
                  {!p.images?.[0] && "IMAGE"}
                  {p.images?.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                      <Images size={12} /> <span className="text-[10px] font-bold">{p.images.length}</span>
                    </div>
                  )}
                </div>
                
                <h4 className="text-base font-bold tracking-wide transition-colors group-hover:text-purple-400" style={{ color: text }}>{p.title}</h4>
                <p className="text-xs mt-1.5 font-semibold" style={{ color: purple }}>
                  {p.tags?.join(", ")} {p.tags?.length ? "·" : ""} {p.year}
                </p>
                
                {p.description && (
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: dim, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CONTACT ===== */}
      <footer id="contact" className="max-w-6xl mx-auto px-6 md:px-16 py-24 border-t avash-reveal" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "#e2e2e2" }}>
        <p className="text-xs tracking-[0.25em] mb-4 font-semibold" style={{ color: purple }}>{t.getInTouch}</p>
        <h3 className="mb-4" style={{ fontFamily: "'Anton', sans-serif", fontSize: "2.2rem", textTransform: "uppercase", letterSpacing: 1 }}>{t.haveProject}</h3>
        <p className="text-sm max-w-md mb-8 leading-relaxed" style={{ color: dim }}>{t.contactBody}</p>
        <div className="flex flex-col gap-2.5">
          <a href={`mailto:${settings?.email}`} className="text-sm font-medium underline underline-offset-4 hover:text-purple-400 transition-colors" style={{ color: text }}>{settings?.email}</a>
          {settings?.phone && <a href={`tel:${settings.phone}`} className="text-sm font-medium underline underline-offset-4 hover:text-purple-400 transition-colors" style={{ color: text }}>{settings.phone}</a>}
        </div>
        <div className="mt-16 pt-6 border-t text-xs flex justify-between items-center" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "#e2e2e2", color: dim }}>
          <span>© {new Date().getFullYear()} ArchViz by {name}</span>
          <span className="tracking-widest uppercase text-[10px]">Structural & Architectural Design</span>
        </div>
      </footer>
    </div>
  );
}
