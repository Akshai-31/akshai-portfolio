import React, { useEffect, useRef, useState } from "react";
import {
  Menu, X, ArrowRight, ArrowUpRight, Mail, Phone, MapPin, Link,
  TerminalSquare, Database, Code2, Bug, Workflow, Briefcase,
  GraduationCap, CheckCircle2, Copy, Check, Sun, Moon,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens — deep indigo dark theme, periwinkle + amber
   accents. Space Grotesk for display type, IBM Plex Sans body.

   Responsive breakpoints (real CSS, no Tailwind compiler here):
     > 860px  desktop nav visible, mobile nav hidden
     <= 860px mobile nav (hamburger) visible, desktop links hidden
     <= 600px  phone-tight spacing / stacked stat grid
--------------------------------------------------------- */
const styleSheet = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

  /* Override Vite's default starter CSS (body{display:flex;place-items:center}
     and #root{max-width:1280px;margin:0 auto;text-align:center}) — that combo
     is what causes the lopsided white gap on wide/laptop screens, because the
     app shrink-wraps instead of filling the viewport. */
  html, body{
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-width: 0 !important;
    display: block !important;
    place-items: unset !important;
  }
  #root{
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
  }

  .av-root{
    --bg: #0B0D1A;
    --surface: #141830;
    --surface-2: #1C2142;
    --edge: #2A2F5C;
    --text: #EDEFFA;
    --text-dim: #9AA0C7;
    --text-faint: #676D9C;
    --accent: #7C9CFF;
    --amber: #FFB86B;
    --mint: #6EE7B7;
    background: var(--bg);
    color: var(--text);
    font-family: 'IBM Plex Sans', system-ui, sans-serif;
    min-height: 100vh;
    width: 100%;
    transition: background .25s ease, color .25s ease;
  }
  .av-root.light-theme{
    --bg: #F6F7FC;
    --surface: #FFFFFF;
    --surface-2: #EEF0FA;
    --edge: #DEE1F2;
    --text: #14162B;
    --text-dim: #4A4F72;
    --text-faint: #7A7FA0;
    --accent: #4C63E0;
    --amber: #C97A2B;
    --mint: #1E9E70;
  }
  .av-root .display{ font-family:'Space Grotesk', system-ui, sans-serif; }
  .av-root ::selection{ background: var(--accent); color: #FFFFFF; }
  .av-root *{ box-sizing: border-box; }

  .av-theme-toggle{
    display:flex; align-items:center; justify-content:center;
    width:34px; height:34px; border-radius:9px; flex-shrink:0;
    background: var(--surface-2); border:1px solid var(--edge);
    color: var(--text-dim); cursor:pointer; transition: color .15s ease, border-color .15s ease;
  }
  .av-theme-toggle:hover{ color: var(--accent); border-color: var(--accent); }

  .av-glow{
    position:absolute; inset:0; pointer-events:none;
    background: radial-gradient(560px 320px at 50% 0%, rgba(124,156,255,0.16), transparent 70%);
  }
  .av-root.light-theme .av-glow{
    background: radial-gradient(560px 320px at 50% 0%, rgba(76,99,224,0.10), transparent 70%);
  }

  .av-bar{ background: var(--surface-2); border-radius: 999px; overflow:hidden; height:6px; }
  .av-bar-fill{ height:100%; border-radius:999px; background: linear-gradient(90deg, var(--accent), var(--amber)); transition: width 1.1s cubic-bezier(.16,1,.3,1); }

  .av-navlink{ position:relative; color: var(--text-dim); transition: color .15s ease; }
  .av-navlink:hover{ color: var(--text); }
  .av-navlink.active{ color: var(--text); }
  .av-navlink.active::after{
    content:''; position:absolute; left:0; right:0; bottom:-6px; height:2px;
    background: var(--accent); border-radius:2px;
  }

  .av-card{ background: var(--surface); border:1px solid var(--edge); border-radius:14px; }
  .av-card-hover{ transition: border-color .2s ease, transform .2s ease; }
  .av-card-hover:hover{ border-color: rgba(124,156,255,0.45); transform: translateY(-2px); }

  .av-num{ font-family:'Space Grotesk',sans-serif; font-weight:700; color: var(--text-faint); }

  /* ---- Real responsive nav (replaces broken hidden/md:flex Tailwind classes) ---- */
  .av-nav-desktop{ display:none; }
  .av-nav-mobile-controls{ display:flex; }
  .av-hero-stats{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:24px; max-width:420px; }

  @media (min-width: 861px){
    .av-nav-desktop{ display:flex; }
    .av-nav-mobile-controls{ display:none; }
  }

  @media (max-width: 860px){
    .av-section-inner{ padding-left:0; padding-right:0; }
  }

  @media (max-width: 600px){
    .av-hero-stats{ grid-template-columns: repeat(3, minmax(0,1fr)); gap:14px; }
    .av-hero-actions{ flex-direction:column; align-items:stretch; }
    .av-hero-actions button{ width:100%; justify-content:center; }
  }

  @media (prefers-reduced-motion: reduce){
    .av-bar-fill{ transition:none; }
    .av-card-hover{ transition:none; }
  }
`;

const skills = [
  { icon: Code2, name: "Python & Backend", level: "Advanced", pct: 90, tags: ["Python", "FastAPI", "Django"] },
  { icon: Bug, name: "Test Automation", level: "Expert", pct: 92, tags: ["Playwright", "Pytest", "API Testing"] },
  { icon: TerminalSquare, name: "Full Stack Dev", level: "Advanced", pct: 85, tags: ["React", "FastAPI", "MERN"] },
  { icon: Database, name: "Databases", level: "Advanced", pct: 84, tags: ["PostgreSQL", "MySQL", "MongoDB", "SQLAlchemy"] },
  { icon: Workflow, name: "Debugging & Ops", level: "Advanced", pct: 82, tags: ["Linux", "JIRA", "Log Analysis"] },
];

const projects = [
  {
    n: "01", status: "In progress", name: "Smart Bug & Test Intelligence System",
    desc: "A full-stack bug and test-case management platform for defect tracking, test execution and quality analytics.",
    tags: ["FastAPI", "React", "PostgreSQL"],
    details: "A platform built to bring bug tracking and test management into one place. The backend exposes RESTful APIs in FastAPI, with SQLAlchemy models mapped onto PostgreSQL for storing bugs, test cases and execution history. The React + Tailwind CSS frontend gives dashboards for the full bug lifecycle — severity, priority and status tracking — plus test case management with defect traceability, so every reported bug links back to the test that caught it. Authentication and secure user management are built into the app.",
    stack: [
      { label: "Frontend", value: "React.js, Tailwind CSS" },
      { label: "Backend", value: "FastAPI (Python)" },
      { label: "Database", value: "PostgreSQL, SQLAlchemy" },
      { label: "Other", value: "Authentication & user management" },
    ],
  },
  {
    n: "02", status: "Completed", name: "Malware Detection in Memory Dump Systems",
    desc: "ML models (Random Forest, Multinomial Naive Bayes) for malware detection at 96% accuracy, with a Django monitoring app.",
    tags: ["Python", "Django", "ML"],
    details: "A machine-learning system for detecting malware from memory dump data. Random Forest and Multinomial Naive Bayes models were trained and compared, reaching 96% detection accuracy. The models are served through a Django web application that handles threat monitoring, reporting and data visualization, so results are readable rather than raw model output.",
    stack: [
      { label: "Language", value: "Python" },
      { label: "ML models", value: "Random Forest, Multinomial Naive Bayes" },
      { label: "Web app", value: "Django" },
      { label: "Accuracy", value: "96%" },
    ],
  },
  {
    n: "03", status: "Completed", name: "Recommendation System for Buyers & Sellers",
    desc: "Applied spectral clustering to group sellers for a buyer-seller recommendation engine.",
    tags: ["Python", "Clustering"],
    details: "A recommendation system that groups sellers using spectral clustering, so buyers can be matched to clusters of sellers with similar characteristics rather than searching one by one. Built in Python as an applied machine-learning project focused on unsupervised grouping techniques.",
    stack: [
      { label: "Language", value: "Python" },
      { label: "Technique", value: "Spectral Clustering" },
      { label: "Domain", value: "Buyer–seller recommendation" },
    ],
  },
  {
    n: "04", status: "Completed", name: "Library Management System",
    desc: "Administrative MERN application for managing book and customer records.",
    tags: ["MongoDB", "Express", "React", "Node"],
    details: "An administrative application for a library, built on the MERN stack, to manage book inventory and customer records in one place — adding, updating and tracking records through a React frontend backed by an Express/Node API and a MongoDB database.",
    stack: [
      { label: "Frontend", value: "React.js" },
      { label: "Backend", value: "Node.js, Express.js" },
      { label: "Database", value: "MongoDB" },
    ],
  },
];

const journey = [
  {
    icon: Briefcase, role: "Associate Quality Assurance Engineer", org: "Amazon",
    meta: "Chennai · Mar 2025 – Present",
    points: [
      "Functional, regression, exploratory, performance and API testing across Kindle, Fire TV and Amazon web apps.",
      "Python-based automation with Playwright and Pytest; regression point analysis in JIRA.",
      "Recognized as Best Performer for collaboration and leadership.",
    ],
  },
  {
    icon: Code2, role: "MERN Stack Developer Intern", org: "NullClass",
    meta: "Chennai · Apr 2025 – Nov 2025",
    points: [
      "Built a Twitter-like social app — auth, tweets, likes, retweets, comments.",
      "Real-time feed with Redux and WebSockets; REST APIs integrated with MongoDB.",
    ],
  },
  {
    icon: GraduationCap, role: "B.Tech, Computer Science Engineering", org: "SRM Institute of Science and Technology",
    meta: "2020 – 2024",
    points: [],
  },
];

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Experience grows automatically every month — calculated live from the
   Amazon start date against today's date, instead of a number typed in by hand. */
function getExperience(startDateStr) {
  const start = new Date(startDateStr);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const decimalYears = Math.round((months / 12) * 10) / 10;
  return { months, years, remMonths, decimalYears };
}

function StatCounter({ target, suffix = "", label, decimals = 0 }) {
  const [ref, inView] = useInView(0.5);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = target * (1 - Math.pow(1 - p, 3));
      const mult = Math.pow(10, decimals);
      setVal(decimals ? Math.round(eased * mult) / mult : Math.round(eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, decimals]);
  return (
    <div ref={ref}>
      <div className="display" style={{ fontSize: "clamp(24px,5vw,38px)", fontWeight: 700, color: "var(--text)" }}>
        {decimals ? val.toFixed(decimals) : val}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SkillBar({ skill }) {
  const [ref, inView] = useInView(0.4);
  const Icon = skill.icon;
  return (
    <div ref={ref} className="av-card av-card-hover" style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={17} color="var(--accent)" />
          </div>
          <span className="display" style={{ fontWeight: 600, fontSize: 15 }}>{skill.name}</span>
        </div>
        <span style={{ fontSize: 11.5, color: "var(--amber)", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, flexShrink: 0 }}>
          {skill.level}
        </span>
      </div>
      <div className="av-bar">
        <div className="av-bar-fill" style={{ width: inView ? `${skill.pct}%` : "0%" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {skill.tags.map((t) => (
          <span key={t} style={{ fontSize: 11.5, color: "var(--text-dim)", border: "1px solid var(--edge)", borderRadius: 999, padding: "3px 9px" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function CopyField({ value, children }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch (e) {}
      }}
      style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 0, fontSize: 14 }}
    >
      {children}
      {copied ? <Check size={14} color="var(--mint)" /> : <Copy size={14} />}
    </button>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,6,14,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="av-card"
        style={{ maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "26px 26px 24px", position: "relative" }}
      >
        <button
          onClick={onClose}
          className="av-theme-toggle"
          style={{ position: "absolute", top: 18, right: 18 }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span className="av-num" style={{ fontSize: 20 }}>{project.n}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: project.status === "Completed" ? "var(--mint)" : "var(--amber)" }}>
            <CheckCircle2 size={13} /> {project.status}
          </span>
        </div>

        <h3 className="display" style={{ fontWeight: 700, fontSize: 20, marginBottom: 14, paddingRight: 30 }}>{project.name}</h3>

        <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.75, marginBottom: 22 }}>{project.details}</p>

        <div style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Tech stack
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
          {project.stack.map((s) => (
            <div key={s.label} style={{ display: "flex", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: "var(--text-faint)", minWidth: 78 }}>{s.label}</span>
              <span style={{ color: "var(--text)" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function AkshaiPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [theme, setTheme] = useState("dark");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const exp = getExperience("2025-03-01");
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <div className={`av-root ${theme === "light" ? "light-theme" : ""}`}>
      <style>{styleSheet}</style>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)", background: theme === "light" ? "rgba(246,247,252,0.85)" : "rgba(11,13,26,0.85)", borderBottom: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <a onClick={() => goTo("hero")} className="display" style={{ fontWeight: 700, cursor: "pointer", fontSize: 17, color: "var(--text)" }}>
            AV<span style={{ color: "var(--accent)" }}>.</span>
          </a>

          {/* Desktop nav — shown only above 860px via real media query */}
          <nav className="av-nav-desktop" style={{ gap: 28, alignItems: "center" }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => goTo(s.id)} className={`av-navlink ${active === s.id ? "active" : ""}`} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer" }}>
                {s.label}
              </button>
            ))}
            <button
              className="av-theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile/tablet controls — shown only at 860px and below */}
          <div className="av-nav-mobile-controls" style={{ alignItems: "center", gap: 10 }}>
            <button
              className="av-theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} style={{ background: "none", border: "none", color: "var(--text)" }} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="av-nav-mobile-controls" style={{ padding: "8px 24px 18px", flexDirection: "column", gap: 14, borderTop: "1px solid var(--edge)" }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => goTo(s.id)} style={{ background: "none", border: "none", color: active === s.id ? "var(--text)" : "var(--text-dim)", textAlign: "left", fontSize: 15, cursor: "pointer" }}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* HERO */}
      <section id="hero" style={{ position: "relative", padding: "72px 20px 56px", maxWidth: 1040, margin: "0 auto", overflow: "hidden" }}>
        <div className="av-glow" />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 14, color: "var(--accent)", fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Hi, I'm</div>
          <h1 className="display" style={{ fontSize: "clamp(34px,8vw,58px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 14, color: "var(--text)" }}>
            Akshai V
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-dim)", maxWidth: 560, marginBottom: 10 }}>
            Quality Assurance Engineer at Amazon · Targeting SDET, Backend & FastAPI roles
          </p>
          <p style={{ fontSize: 15, color: "var(--text-faint)", maxWidth: 560, marginBottom: 30, lineHeight: 1.7 }}>
            I work in Quality Assurance at Amazon, building test automation with Python, Playwright and Pytest.
            On the side I build backend services with FastAPI and PostgreSQL — and I'm actively looking to move
            into SDET, Python backend, or automation-focused developer roles.
          </p>
          <div className="av-hero-actions" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 48 }}>
            <button onClick={() => goTo("projects")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--accent)", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              View projects <ArrowRight size={16} />
            </button>
            <button onClick={() => goTo("contact")} style={{ background: "none", color: "var(--text)", border: "1px solid var(--edge)", borderRadius: 10, padding: "11px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Get in touch
            </button>
          </div>
          <div className="av-hero-stats">
            <StatCounter target={exp.decimalYears} decimals={1} suffix="+ yrs" label="Professional experience" />
            <StatCounter target={completedCount} suffix="" label="Projects completed" />
            <StatCounter target={skills.length} suffix="" label="Core skill areas" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "56px 20px", borderTop: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
            <span className="av-num" style={{ fontSize: 15 }}>01</span>
            <h2 className="display" style={{ fontSize: 24, fontWeight: 700 }}>About Me</h2>
          </div>
          <div style={{ maxWidth: 660 }}>
            <p style={{ color: "var(--text-dim)", fontSize: 15.5, lineHeight: 1.8, marginBottom: 16 }}>
              I'm a <strong style={{ color: "var(--text)" }}>Quality Assurance Engineer at Amazon</strong>, where I
              build automated test suites in Python with Playwright and Pytest, run API-level testing, and trace
              regressions back to root cause across Kindle, Fire TV and their companion web apps.
            </p>
            <p style={{ color: "var(--text-dim)", fontSize: 15.5, lineHeight: 1.8 }}>
              Alongside that, I build backend services and REST APIs with <strong style={{ color: "var(--text)" }}>FastAPI</strong>,
              SQLAlchemy and PostgreSQL. I'm currently looking to move from QA into an <strong style={{ color: "var(--text)" }}>SDET,
              Python backend, or automation-focused developer role</strong> — my test-automation background is the
              foundation, backend development is where I'm headed.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "56px 20px", borderTop: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <span className="av-num" style={{ fontSize: 15 }}>02</span>
            <h2 className="display" style={{ fontSize: 24, fontWeight: 700 }}>Skills</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {skills.map((s) => <SkillBar key={s.name} skill={s} />)}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "56px 20px", borderTop: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <span className="av-num" style={{ fontSize: 15 }}>03</span>
            <h2 className="display" style={{ fontSize: 24, fontWeight: 700 }}>Projects</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {projects.map((p) => (
              <div
                key={p.n}
                className="av-card av-card-hover"
                onClick={() => setSelectedProject(p)}
                style={{ padding: "22px 22px 20px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span className="av-num" style={{ fontSize: 22 }}>{p.n}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: p.status === "Completed" ? "var(--mint)" : "var(--amber)" }}>
                    <CheckCircle2 size={13} /> {p.status}
                  </span>
                </div>
                <h3 className="display" style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{p.name}</h3>
                <p style={{ color: "var(--text-dim)", fontSize: 13.5, lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11, color: "var(--text-faint)", border: "1px solid var(--edge)", borderRadius: 6, padding: "3px 8px" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--accent)", fontWeight: 600 }}>
                  View details <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding: "56px 20px", borderTop: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 30 }}>
            <span className="av-num" style={{ fontSize: 15 }}>04</span>
            <h2 className="display" style={{ fontSize: 24, fontWeight: 700 }}>Experience</h2>
          </div>
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div style={{ position: "absolute", left: 9, top: 6, bottom: 6, width: 1, background: "var(--edge)" }} />
            {journey.map((j, i) => {
              const Icon = j.icon;
              return (
                <div key={i} style={{ position: "relative", marginBottom: i === journey.length - 1 ? 0 : 34 }}>
                  <div style={{ position: "absolute", left: -28, top: 2, width: 22, height: 22, borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={11} color="var(--accent)" />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span className="display" style={{ fontWeight: 600, fontSize: 16 }}>{j.role}</span>
                    <span style={{ color: "var(--accent)", fontSize: 14 }}>{j.org}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: j.points.length ? 10 : 0 }}>{j.meta}</div>
                  {j.points.map((pt, k) => (
                    <div key={k} style={{ display: "flex", gap: 8, color: "var(--text-dim)", fontSize: 14, marginBottom: 6 }}>
                      <span style={{ color: "var(--accent)" }}>–</span> {pt}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "56px 20px 80px", borderTop: "1px solid var(--edge)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <span className="av-num" style={{ fontSize: 15 }}>05</span>
            <h2 className="display" style={{ fontSize: 24, fontWeight: 700 }}>Get in Touch</h2>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: 15, maxWidth: 480, marginBottom: 26 }}>
            Currently in QA at Amazon, looking to move into SDET, Python backend or FastAPI developer roles — feel free to reach out.
          </p>
          <div className="av-card" style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
            <CopyField value="akshaivenkatesh3105@gmail.com">
              <Mail size={16} color="var(--accent)" /> akshaivenkatesh3105@gmail.com
            </CopyField>
            <CopyField value="+919150914731">
              <Phone size={16} color="var(--accent)" /> +91 9150914731
            </CopyField>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontSize: 14 }}>
              <MapPin size={16} color="var(--accent)" /> Chennai, India
            </div>
            <a href="https://linkedin.com/in/akshai-v-91463a248" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontSize: 14, textDecoration: "none" }}>
              <Link size={16} color="var(--accent)" /> linkedin.com/in/akshai-v <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid var(--edge)", fontSize: 12, color: "var(--text-faint)" }}>
        © Akshai V — built with React
      </footer>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}