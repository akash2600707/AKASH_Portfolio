import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Cursor from './components/Cursor.jsx';

const HeroGL = lazy(() => import('./components/HeroGL.jsx'));

/* ── Animation variants ── */
const fadeUp   = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4,0,0.2,1] } } };
const stagger  = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55 } } };

/* ── Scroll reveal wrapper ── */
function Reveal({ children, delay = 0, x = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4,0,0.2,1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tilt card ── */
function TiltCard({ children, style = {}, className = '' }) {
  const cardRef = useRef(null);
  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
    cardRef.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  };
  return (
    <div
      ref={cardRef}
      className={className}
      style={{ transition: 'transform .35s ease', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const SKILLS = {
  Frontend:  ['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Bootstrap', 'Responsive Design', 'Cross-browser Compat.'],
  Backend:   ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'EJS Templating', 'Authentication', 'CRUD', 'Web Security'],
  Ecommerce: ['Shopify Architecture', 'Theme Customisation', 'Shopify Integrations', 'Analytics Tracking', 'D2C Brand Ops', 'Fulfilment Workflows', 'Digital Marketing Ops', 'Git / GitHub'],
  Other:     ['IT Troubleshooting', 'Hardware Support', 'Network Diagnostics', 'Three.js', 'UX Optimisation', 'CAD (Beginner)', 'Data Science Basics', 'Digital Workflows'],
};

const REPOS = [
  { name: 'AKASH_Portfolio', desc: 'Personal portfolio — HTML, CSS, Vanilla JS, Three.js particle background, custom cursor.', lang: 'HTML', url: 'https://github.com/akash2600707/AKASH_Portfolio', tags: ['HTML5','CSS3','JavaScript','Three.js'] },
  { name: 'Blog-App',        desc: 'Full-stack blog with Node.js, Express, MongoDB. Create, read, update, delete posts with EJS templates.', lang: 'EJS', url: 'https://github.com/akash2600707/Blog-App', tags: ['Node.js','Express','MongoDB','EJS'] },
  { name: 'Weather-App',     desc: 'Real-time weather app built in React — city search, live API data, dynamic icons, responsive UI.', lang: 'JavaScript', url: 'https://github.com/akash2600707/Weather-App', tags: ['React','REST API','JavaScript'] },
  { name: 'TODO-LIST-APP',   desc: 'React task manager — add, edit, delete, filter, complete tasks with smooth state transitions.', lang: 'JavaScript', url: 'https://github.com/akash2600707/TODO-LIST-APP', tags: ['React','Hooks','CSS3'] },
  { name: 'Simon-Game',      desc: 'Classic Simon memory game with jQuery — colour sequences, sound feedback, difficulty scaling.', lang: 'JavaScript', url: 'https://github.com/akash2600707/Simon-Game', tags: ['JavaScript','jQuery','HTML5 Audio'] },
  { name: 'Dum-Kit',         desc: 'Interactive drum kit — play sounds via keyboard or click with animated button feedback.', lang: 'JavaScript', url: 'https://github.com/akash2600707/Dum-Kit', tags: ['JavaScript','DOM Events','CSS3'] },
  { name: 'spacex',          desc: 'SpaceX-inspired responsive landing page — clean layout, brand aesthetics, CSS composition.', lang: 'HTML', url: 'https://github.com/akash2600707/spacex', tags: ['HTML5','CSS3','Responsive'] },
];

const EXPERIENCE = [
  {
    role:    'Co-founder & Ecommerce Technical Specialist',
    company: 'SEISZN — Chennai',
    date:    'Sep 2025 — Present',
    current: true,
    bullets: [
      'Architected and manage Shopify ecommerce infrastructure from the ground up',
      'Developed custom themes and third-party integrations for the brand',
      'Built analytics pipelines and digital marketing workflows',
      'Managed fulfilment, content ops, and store performance optimisation',
    ],
    tags: ['Shopify','Theme Dev','Analytics','D2C','Digital Marketing','Operations'],
  },
  {
    role:    'Desktop Support Engineer',
    company: 'Progressive Infovision · IndusInd Bank — Chennai',
    date:    'Dec 2024 — Aug 2025',
    bullets: [
      'Hardware and software support for 100+ users in a banking environment',
      'Diagnosed and resolved complex system and network issues',
      'Collaborated with remote IT and vendor teams for escalated issues',
    ],
    tags: ['IT Support','Hardware','Networking','Troubleshooting'],
  },
  {
    role:    'Web Developer Intern',
    company: 'Abilitt — Bangalore (Remote)',
    date:    'Jul 2022 — Dec 2022',
    bullets: [
      'Delivered frontend features and UI improvements to production web apps',
      'Supported ongoing projects across multiple tech stacks',
    ],
    tags: ['HTML/CSS','JavaScript','Frontend','UI Dev'],
  },
];

/* ── Inline styles (CSS-in-JS) ── */
const S = {
  // layout
  si: { maxWidth: 1100, margin: '0 auto', padding: '110px 56px' },
  secLabel: {
    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase',
    color: 'var(--cyan)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12,
  },
  secTitle: {
    fontFamily: 'var(--font)', fontSize: 'clamp(26px,3.5vw,50px)', fontWeight: 800,
    lineHeight: 1.05, marginBottom: 60, color: '#fff', letterSpacing: '-.02em',
  },
  glass: {
    background: 'rgba(255,255,255,.022)', border: '1px solid var(--border)',
    padding: 38, backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden',
  },
  chip: {
    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 500,
    letterSpacing: '.12em', textTransform: 'uppercase',
    padding: '5px 14px', border: '1px solid var(--border)',
    background: 'rgba(255,255,255,.02)', color: 'var(--muted)',
    cursor: 'default', display: 'inline-block',
    transition: 'border-color .3s, color .3s',
  },
  btn: {
    padding: '12px 30px', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
    letterSpacing: '.14em', textTransform: 'uppercase',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
    border: '1px solid', cursor: 'pointer', background: 'transparent',
    transition: 'all .3s', position: 'relative', overflow: 'hidden',
  },
};

/* ═══════════════════════════
   NAV
═══════════════════════════ */
function Nav({ active }) {
  const links = ['about','experience','skills','projects','interests','contact'];
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 56px',
        background: 'rgba(4,8,16,.88)', backdropFilter: 'blur(32px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <a href="#hero" style={{ fontFamily: 'var(--mono)', fontSize: 15, color: '#fff', textDecoration: 'none' }}>
        AR<span style={{ color: 'var(--cyan)' }}>.</span>
      </a>
      <ul style={{ display: 'flex', gap: 32, listStyle: 'none' }}>
        {links.map(l => (
          <li key={l}>
            <a
              href={`#${l}`}
              style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500,
                letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none',
                color: active === l ? 'var(--cyan)' : 'var(--muted)',
                transition: 'color .3s',
              }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--green)' }}>
        <motion.div
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }}
          animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 0 0 rgba(0,229,160,.4)', '0 0 0 6px rgba(0,229,160,0)', '0 0 0 0 rgba(0,229,160,.4)'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        Available for work
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════
   HERO
═══════════════════════════ */
function Hero() {
  const chips = ['React', 'Node.js', 'MongoDB', 'Shopify', 'Express.js', 'SEISZN'];
  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', paddingTop: 88, overflow: 'hidden', zIndex: 1 }}>
      {/* 3D Background — lazy loaded */}
      <Suspense fallback={null}>
        <HeroGL />
      </Suspense>

      {/* Glow blobs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'var(--cyan)', filter: 'blur(130px)', opacity: .06, top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'var(--amber)', filter: 'blur(130px)', opacity: .05, bottom: -80, left: -60, pointerEvents: 'none' }} />

      {/* Left content */}
      <div style={{ padding: '80px 56px', position: 'relative', zIndex: 10 }}>
        <motion.div
          style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span style={{ display: 'inline-block', width: 28, height: 1, background: 'var(--cyan)' }} />
          Full Stack Developer & Co-Founder
        </motion.div>

        <motion.h1
          style={{ fontFamily: 'var(--font)', fontSize: 'clamp(42px,5.5vw,78px)', fontWeight: 800, lineHeight: .95, letterSpacing: '-.03em', color: '#fff', marginBottom: 16 }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
        >
          Akash<br /><span style={{ color: 'var(--cyan)' }}>Ramesh</span>
        </motion.h1>

        <motion.p
          style={{ fontSize: 'clamp(14px,1.6vw,19px)', fontWeight: 600, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.55, maxWidth: 460 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
        >
          Building <strong style={{ color: 'var(--text)' }}>production web systems</strong> and{' '}
          <strong style={{ color: 'var(--text)' }}>Shopify ecommerce infrastructure</strong> — MERN stack to digital-first brands.
        </motion.p>

        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.5 }}
        >
          {chips.map(c => (
            <motion.span key={c} style={S.chip} whileHover={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', transition: { duration: .2 } }}>
              {c}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.a
            href="#projects"
            style={{ ...S.btn, borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
            whileHover={{ backgroundColor: 'var(--cyan)', color: '#040810' }}
          >
            <span>View Projects</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </motion.a>
          <motion.a
            href="#contact"
            style={{ ...S.btn, borderColor: 'var(--border)', color: 'var(--muted)' }}
            whileHover={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
          >
            <span>Get In Touch</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Right: decorative floating tags */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        {[
          { text: 'MERN Stack', color: 'var(--cyan)', border: 'rgba(0,212,255,.3)', top: '22%', left: '10%', delay: 0 },
          { text: 'Shopify Expert', color: 'var(--amber)', border: 'rgba(255,171,64,.3)', top: '38%', right: '5%', delay: 1.5 },
          { text: 'Co-Founder · SEISZN', color: 'var(--green)', border: 'rgba(0,229,160,.3)', bottom: '32%', left: '8%', delay: 3 },
        ].map(({ text, color, border, delay, ...pos }) => (
          <motion.div
            key={text}
            style={{
              position: 'absolute', ...pos,
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase',
              padding: '7px 14px', border: `1px solid ${border}`,
              background: 'rgba(4,8,16,.8)', backdropFilter: 'blur(12px)',
              color, whiteSpace: 'nowrap', zIndex: 10,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {text}
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        style={{ position: 'absolute', bottom: 36, left: 56, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--dim)', zIndex: 10 }}
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg,var(--cyan),transparent)' }} />
        Scroll
      </motion.div>

      {/* Scanline */}
      <motion.div
        style={{ position: 'absolute', left: 0, width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,.15),transparent)', pointerEvents: 'none', zIndex: 999 }}
        animate={{ top: ['-2px', '100vh'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
    </section>
  );
}

/* ═══════════════════════════
   ABOUT
═══════════════════════════ */
function About() {
  const infoRows = [
    { ico: '📍', lbl: 'Location',  val: 'Chennai, Tamil Nadu, India' },
    { ico: '📧', lbl: 'Email',     val: 'akash2600707@gmail.com', href: 'mailto:akash2600707@gmail.com' },
    { ico: '🌐', lbl: 'Portfolio', val: 'akashr.is-a.dev', href: 'https://akashr.is-a.dev' },
    { ico: '💼', lbl: 'LinkedIn',  val: 'linkedin.com/in/akashr26', href: 'https://linkedin.com/in/akashr26' },
    { ico: '🐙', lbl: 'GitHub',    val: 'github.com/akash2600707', href: 'https://github.com/akash2600707' },
    { ico: '🌍', lbl: 'Languages', val: 'Tamil · English · Spanish (Beginner)' },
  ];
  const stats = [{ n: '3+', l: 'Years Building' }, { n: '8.8', l: 'MCA CGPA' }, { n: '7', l: 'GitHub Repos' }];

  return (
    <section id="about" style={{ background: 'linear-gradient(180deg,transparent,rgba(0,212,255,.018),transparent)', position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> About</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Who I Am</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 44, alignItems: 'start' }}>
          <div>
            <Reveal>
              <div style={{ ...S.glass, marginBottom: 24 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)' }} />
                {[
                  <>I'm a <span style={{ color: '#fff', fontWeight: 700 }}>Full Stack Web Developer and Ecommerce Technical Specialist</span> based in <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>Chennai, Tamil Nadu</span> — building and shipping real products on the MERN stack and Shopify ecosystem.</>,
                  <>As co-founder of <span style={{ color: '#fff', fontWeight: 700 }}>SEISZN</span>, I architect the entire ecommerce infrastructure — custom Shopify themes to analytics pipelines. Before that, I supported <span style={{ color: '#fff', fontWeight: 700 }}>100+ users</span> as a Desktop Support Engineer at IndusInd Bank.</>,
                  <>I care about <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>practical problem solving</span>, shipping things that work, and continuously improving user experience through hands-on implementation.</>,
                ].map((txt, i) => (
                  <p key={i} style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--muted)', marginBottom: 14 }}>{txt}</p>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 30 }}>
                  {stats.map(({ n, l }) => (
                    <motion.div key={l} style={{ textAlign: 'center', padding: '18px 8px', border: '1px solid var(--border)' }} whileHover={{ borderColor: 'var(--cyan)' }}>
                      <div style={{ fontFamily: 'var(--font)', fontSize: 26, fontWeight: 800, background: 'linear-gradient(135deg,var(--cyan),var(--amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 5 }}>{l}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ border: '1px solid rgba(0,229,160,.3)', background: 'rgba(0,229,160,.025)', padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--green),transparent)' }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 8 }}>★ Currently Active</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 7 }}>SEISZN</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 14 }}>Co-founded and built the full Shopify ecommerce infrastructure for SEISZN — a D2C brand launched from Chennai, handling everything from store architecture to fulfilment ops.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Shopify','D2C','Brand Strategy','Analytics','Operations'].map(t => (
                    <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 11px', border: '1px solid rgba(0,229,160,.4)', color: 'var(--green)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {infoRows.map(({ ico, lbl, val, href }, i) => (
              <Reveal key={lbl} delay={i * 0.07}>
                <motion.div
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 17px', border: '1px solid var(--border)', background: 'var(--panel)' }}
                  whileHover={{ borderColor: 'var(--cyan)', x: 5 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,212,255,.07)', fontSize: 14, flexShrink: 0 }}>{ico}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{lbl}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {href ? <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>{val}</a> : val}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   EXPERIENCE
═══════════════════════════ */
function Experience() {
  return (
    <section id="experience" style={{ background: 'linear-gradient(180deg,transparent,rgba(255,171,64,.015),transparent)', position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Experience</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Professional Journey</h2></Reveal>
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div style={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 1, background: 'linear-gradient(180deg,var(--cyan),rgba(255,171,64,.4),transparent)' }} />
          {EXPERIENCE.map(({ role, company, date, current, bullets, tags }, i) => (
            <Reveal key={role} delay={i * 0.1}>
              <div style={{ position: 'relative', marginBottom: 52, paddingLeft: 32 }}>
                <motion.div
                  style={{ position: 'absolute', left: -36, top: 8, width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--cyan)', background: current ? 'var(--cyan)' : 'var(--bg)', boxShadow: current ? '0 0 16px rgba(0,212,255,.6)' : '0 0 12px rgba(0,212,255,.4)' }}
                  whileHover={{ background: 'var(--cyan)', boxShadow: '0 0 20px rgba(0,212,255,.8)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: current ? 'var(--cyan)' : 'var(--amber)', padding: '3px 10px', border: `1px solid ${current ? 'rgba(0,212,255,.25)' : 'rgba(255,171,64,.25)'}` }}>{date}</span>
                  {current && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '3px 10px', background: 'rgba(0,229,160,.1)', color: 'var(--green)', border: '1px solid rgba(0,229,160,.25)' }}>Current</span>}
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{role}</div>
                <div style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, marginBottom: 14 }}>{company}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {bullets.map(b => (
                    <li key={b} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, paddingLeft: 18, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--cyan)', fontSize: 10 }}>▸</span>{b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {tags.map(t => (
                    <motion.span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 11px', border: '1px solid var(--border)', color: 'var(--dim)' }} whileHover={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   SKILLS
═══════════════════════════ */
function Skills() {
  return (
    <section id="skills" style={{ position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Skills</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Technical Stack</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 28 }}>
          {Object.entries(SKILLS).map(([group, items], gi) => (
            <Reveal key={group} delay={gi * 0.08}>
              <motion.div
                style={{ padding: '28px 32px', border: '1px solid var(--border)', background: 'var(--panel)', position: 'relative', overflow: 'hidden' }}
                whileHover={{ borderColor: 'rgba(0,212,255,.2)' }}
              >
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {group}
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(0,212,255,.25),transparent)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {items.map(skill => (
                    <motion.span
                      key={skill}
                      style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.09em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid var(--border)', color: 'var(--muted)', background: 'rgba(255,255,255,.015)', cursor: 'default' }}
                      whileHover={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   PROJECTS
═══════════════════════════ */
function Projects() {
  const [liveRepos, setLiveRepos] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch('/api/repos')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLiveRepos(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // merge live data into static repos
  const merged = REPOS.map(r => {
    const live = liveRepos.find(l => l.name === r.name);
    return { ...r, stars: live?.stargazers || 0, updated: live?.updated_at };
  });

  return (
    <section id="projects" style={{ background: 'linear-gradient(180deg,transparent,rgba(0,212,255,.018),transparent)', position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Projects</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Things I've Built</h2></Reveal>

        {loading && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)', letterSpacing: '.2em', marginBottom: 40 }}>Fetching repos...</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {merged.map(({ name, desc, url, tags, stars }, i) => (
            <Reveal key={name} delay={i * 0.07}>
              <TiltCard
                style={{
                  padding: '30px 32px', border: '1px solid var(--border)', background: 'var(--panel)',
                  position: 'relative', overflow: 'hidden', cursor: 'pointer', height: '100%',
                }}
              >
                <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--cyan),var(--amber)', scaleX: 0, transformOrigin: 'left' }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.25em', color: 'var(--dim)', marginBottom: 14 }}>
                  {String(i + 1).padStart(2, '0')}
                  {stars > 0 && <span style={{ marginLeft: 10, color: 'var(--amber)' }}>★ {stars}</span>}
                </div>
                <a href={url} target="_blank" rel="noreferrer" style={{ position: 'absolute', top: 28, right: 28, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dim)', textDecoration: 'none', display: 'block' }}>
                  <motion.span whileHover={{ color: 'var(--cyan)', x: 3, y: -3, display: 'inline-block' }} style={{ display: 'inline-block' }}>↗</motion.span>
                </a>
                <div style={{ fontFamily: 'var(--font)', fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{name.replace(/_/g,' ')}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 18 }}>{desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                  {tags.map(t => <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.09em', padding: '4px 11px', border: '1px solid var(--border)', color: 'var(--dim)' }}>{t}</span>)}
                </div>
                <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)', textDecoration: 'none', borderTop: '1px solid var(--border)', paddingTop: 14, width: '100%', transition: 'color .3s' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  github.com/akash2600707/{name}
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <motion.a
              href="https://github.com/akash2600707"
              target="_blank" rel="noreferrer"
              style={{ ...S.btn, borderColor: 'var(--border)', color: 'var(--muted)', textDecoration: 'none' }}
              whileHover={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              <span>View All on GitHub</span>
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   INTERESTS
═══════════════════════════ */
function Interests() {
  const pills = [
    { icon: '🔧', title: 'Maker Culture',   desc: 'DIY mindset — iterating on designs, calibration challenges, tinkering with hardware.' },
    { icon: '💡', title: 'IoT & Hardware',  desc: 'Exploring 3D printing connected to smart hardware and physical computing projects.' },
    { icon: '🎨', title: 'Design Thinking', desc: 'Overlap between digital product design and physical prototyping constraints.' },
    { icon: '🚀', title: 'Future Tech',     desc: 'AI-driven generative design, advanced materials, and where manufacturing is heading.' },
  ];
  return (
    <section id="interests" style={{ background: 'linear-gradient(180deg,transparent,rgba(255,171,64,.018),transparent)', position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Interests</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Beyond the Code</h2></Reveal>
        <Reveal delay={0.15}><p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, maxWidth: 680, marginBottom: 52 }}>
          Outside of web development, I'm fascinated by <strong style={{ color: 'var(--amber)' }}>additive manufacturing and the maker community</strong>. 3D printing sits at a perfect intersection of design, hardware, and software.
        </p></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28, alignItems: 'start' }}>
          <Reveal>
            <div style={{ padding: 36, border: '1px solid rgba(255,171,64,.2)', background: 'rgba(255,171,64,.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--amber),transparent)' }} />
              <span style={{ display: 'inline-block', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--amber)', padding: '4px 12px', border: '1px solid rgba(255,171,64,.35)', background: 'rgba(255,171,64,.05)', marginBottom: 16 }}>Personal Interest</span>
              <div style={{ fontFamily: 'var(--font)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>3D Printing & Additive Manufacturing</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 20 }}>Exploring FDM printing fundamentals, CAD modelling, and IoT integration — there's something endlessly satisfying about turning a digital model into a physical object.</p>
              {[
                { ico: '🖨️', lbl: 'Process',  val: 'FDM (Fused Deposition Modelling)' },
                { ico: '📐', lbl: 'CAD Tools', val: 'Tinkercad · Fusion 360 exploration' },
                { ico: '🤖', lbl: 'Interests', val: 'IoT Integration · AI-assisted design' },
              ].map(({ ico, lbl, val }) => (
                <motion.div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid rgba(255,171,64,.1)', background: 'rgba(255,171,64,.02)', marginBottom: 10 }} whileHover={{ borderColor: 'rgba(255,171,64,.35)' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{ico}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)' }}>{lbl}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{val}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pills.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <motion.div style={{ padding: '22px 24px', border: '1px solid var(--border)', background: 'var(--panel)' }} whileHover={{ borderColor: 'rgba(255,171,64,.3)', x: 5 }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{title}</div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   EDUCATION
═══════════════════════════ */
function Education() {
  const certs = ['Web Development Bootcamp — Dr. Angela Yu', 'Digital Marketing & Ecommerce Foundation', 'Responsive Web Design — freeCodeCamp', 'Hardware & Networking — NIIT Limited', 'Data Science for Beginners — Nasscom FutureSkills'];
  return (
    <section id="education" style={{ position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Education</div></Reveal>
        <Reveal delay={0.1}><h2 style={S.secTitle}>Academic Background</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { deg: 'Master of Computer Applications (MCA)', school: 'Gurunanak College, Chennai', year: '2021 — 2023', cgpa: '8.8' },
            { deg: 'Bachelor of Computer Applications (BCA)', school: 'Mohammed Sathak College of Arts and Science', year: '2018 — 2021', cgpa: '7.7' },
          ].map(({ deg, school, year, cgpa }) => (
            <Reveal key={deg}>
              <motion.div style={{ padding: '28px 32px', border: '1px solid var(--border)', background: 'var(--panel)', position: 'relative', overflow: 'hidden' }} whileHover={{ borderColor: 'rgba(0,212,255,.25)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,var(--cyan),transparent)' }} />
                <div style={{ fontFamily: 'var(--font)', fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{deg}</div>
                <div style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, marginBottom: 4 }}>{school}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)', letterSpacing: '.1em', marginBottom: 14 }}>{year}</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, padding: '5px 13px', border: '1px solid rgba(0,229,160,.3)', color: 'var(--green)', background: 'rgba(0,229,160,.04)' }}>⭐ CGPA: {cgpa} / 10</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: 52 }}>
          <Reveal><div style={{ ...S.secLabel, marginBottom: 28 }}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Certifications</div></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {certs.map((c, i) => {
              const [name, issuer] = c.split(' — ');
              return (
                <Reveal key={c} delay={i * 0.06}>
                  <motion.div style={{ padding: '16px 18px', border: '1px solid var(--border)', background: 'var(--panel)' }} whileHover={{ borderColor: 'rgba(0,212,255,.2)', y: -3 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{name}</div>
                    {issuer && <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dim)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{issuer}</div>}
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   CONTACT
═══════════════════════════ */
function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg('All fields are required.'); setStatus('error'); return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setErrMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrMsg('Network error. Please email directly.');
      setStatus('error');
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,.025)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13, padding: '12px 16px', outline: 'none', width: '100%', resize: 'none', transition: 'border-color .3s' };

  return (
    <section id="contact" style={{ background: 'linear-gradient(180deg,transparent,rgba(0,212,255,.025),rgba(4,8,16,1))', position: 'relative', zIndex: 2 }}>
      <div style={S.si}>
        <Reveal><div style={S.secLabel}><span style={{ width: 24, height: 1, background: 'var(--cyan)', display:'inline-block' }}/> Contact</div></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <Reveal><h2 style={{ ...S.secTitle, marginBottom: 20 }}>Let's build<br/>something <span style={{ color: 'var(--cyan)' }}>real</span></h2></Reveal>
            <Reveal delay={0.1}><p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 36 }}>Whether you need a full-stack developer, Shopify expertise, or want to talk ecommerce strategy — I'm open to projects, collaborations, and opportunities.</p></Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { ico: '📧', lbl: 'Email',    val: 'akash2600707@gmail.com', href: 'mailto:akash2600707@gmail.com' },
                { ico: '💼', lbl: 'LinkedIn', val: 'linkedin.com/in/akashr26', href: 'https://linkedin.com/in/akashr26' },
                { ico: '🐙', lbl: 'GitHub',   val: 'github.com/akash2600707', href: 'https://github.com/akash2600707' },
                { ico: '📞', lbl: 'Phone',    val: '+91 7200627262', href: 'tel:+917200627262' },
              ].map(({ ico, lbl, val, href }, i) => (
                <Reveal key={lbl} delay={i * 0.07}>
                  <motion.a href={href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border)', background: 'var(--panel)', textDecoration: 'none', color: 'var(--text)' }} whileHover={{ borderColor: 'var(--cyan)', x: 8 }}>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,212,255,.07)', fontSize: 16, flexShrink: 0 }}>{ico}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{lbl}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{val}</div>
                    </div>
                  </motion.a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { id: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your name' },
                { id: 'email',   label: 'Email',   type: 'email', placeholder: 'your@email.com' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</label>
                  <motion.input
                    type={type}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                    style={inputStyle}
                    whileFocus={{ borderColor: 'var(--cyan)' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Message</label>
                <motion.textarea
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={inputStyle}
                  whileFocus={{ borderColor: 'var(--cyan)' }}
                />
              </div>
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--rose)', padding: '10px 14px', border: '1px solid rgba(255,77,109,.3)', background: 'rgba(255,77,109,.04)' }}>
                    {errMsg}
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--green)', padding: '10px 14px', border: '1px solid rgba(0,229,160,.3)', background: 'rgba(0,229,160,.04)' }}>
                    ✓ Message sent! I'll get back to you soon.
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                style={{ ...S.btn, borderColor: status === 'success' ? 'var(--green)' : 'var(--cyan)', color: status === 'success' ? 'var(--green)' : 'var(--cyan)', width: '100%', justifyContent: 'center', cursor: status === 'loading' ? 'wait' : 'pointer' }}
                whileHover={{ backgroundColor: status !== 'loading' ? 'var(--cyan)' : undefined, color: '#040810' }}
              >
                <span>{status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent ✓' : 'Send Message'}</span>
                {status !== 'loading' && status !== 'success' && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12M9 3l5 5-5 5"/></svg>
                )}
                {status === 'loading' && (
                  <motion.div style={{ width: 14, height: 14, border: '2px solid rgba(0,212,255,.3)', borderTopColor: 'var(--cyan)', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                )}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════
   FOOTER
═══════════════════════════ */
function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, borderTop: '1px solid var(--border)', padding: '28px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,8,16,.9)' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dim)', letterSpacing: '.14em', textTransform: 'uppercase' }}>© 2025 Akash Ramesh — Chennai, India</span>
      <div style={{ display: 'flex', gap: 24 }}>
        {[['LinkedIn','https://linkedin.com/in/akashr26'],['GitHub','https://github.com/akash2600707'],['Email','mailto:akash2600707@gmail.com']].map(([label, href]) => (
          <motion.a key={label} href={href} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dim)', letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none' }} whileHover={{ color: 'var(--cyan)' }}>
            {label}
          </motion.a>
        ))}
      </div>
    </footer>
  );
}

/* ═══════════════════════════
   APP ROOT
═══════════════════════════ */
export default function App() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Cursor />
      <Nav active={activeSection} />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Interests />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}
