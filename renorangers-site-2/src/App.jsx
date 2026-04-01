import { useState, useEffect, useRef } from "react";
import CRM from "./CRM";

const C = { red: "#E63329", redDk: "#C42B22", black: "#0A0A0A", dark: "#141414", char: "#2A2A2A", gray: "#777", ltGray: "#E0E0E0", off: "#F5F5F5", white: "#FFF" };
const IMG = {
  bath1: "/bathroom.jpg",
  bath2: "/shower.jpg",
  kitchen1: "/kitchen.jpg",
  living1: "/livingroom.jpg",
  living2: "/livingroom.jpg",
  interior1: "/toiletantwerpen.jpg",
  floor1: "/toiletmerksem.jpg",
  team1: "/toilet.jpg",
  team2: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=800&q=80&auto=format&fit=crop",
  proj1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
  proj2: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80&auto=format&fit=crop",
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80&auto=format&fit=crop",
};
const VIDEO = "https://www.youtube.com/embed/cfiRq57YIW4";

function Video({ title }) {
  return (
    <div style={{ width: "100%", maxWidth: 960, margin: "0 auto", position: "relative", paddingBottom: "56.25%", border: `1px solid ${C.ltGray}`, boxShadow: "0 12px 32px rgba(0,0,0,.1)" }}>
      <iframe
        src={`${VIDEO}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}

function useInView(t = 0.1) {
  const r = useRef(null); const [v, s] = useState(false);
  useEffect(() => { const el = r.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { s(true); o.unobserve(el); } }, { threshold: t }); o.observe(el); return () => o.disconnect(); }, [t]);
  return [r, v];
}
function Reveal({ children, delay = 0, y = 40, style: st = {} }) {
  const [r, v] = useInView();
  return <div ref={r} style={{ ...st, opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s` }}>{children}</div>;
}

function Logo({ light = false, s = 1 }) {
  const col = light ? C.white : C.black;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, gap: 0 }}>
      <div style={{ width: 72 * s, height: 3.5 * s, background: col, marginBottom: 3 * s }} />
      <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22 * s, fontWeight: 700, color: col, letterSpacing: 1.5 * s, whiteSpace: "nowrap", display: "block" }}>RENO RANGERS</span>
      <div style={{ width: 58 * s, height: 3.5 * s, background: C.red, alignSelf: "flex-end", marginTop: 3 * s }} />
    </div>
  );
}

function Marquee({ items, reverse = false }) {
  const d = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: C.red, padding: "13px 0", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-flex", animation: `${reverse ? "mR" : "mL"} 28s linear infinite` }}>
        {d.map((t, i) => <span key={i} style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: C.white, letterSpacing: 3, padding: "0 20px" }}>{t} <span style={{ opacity: .4 }}>/</span></span>)}
      </div>
    </div>
  );
}

function Nav({ page, setPage }) {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ id: "home", l: "HOME" }, { id: "diensten", l: "SERVICES" }, { id: "over", l: "ABOUT" }, { id: "projecten", l: "PROJECTS" }, { id: "blog", l: "BLOG" }, { id: "contact", l: "CONTACT" }, { id: "crm", l: "CRM" }];
  const go = id => { setPage(id); setMo(false); window.scrollTo(0, 0); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: sc ? "rgba(10,10,10,.97)" : "rgba(10,10,10,.88)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "all .3s" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 70 }}>
        <div style={{ cursor: "pointer" }} onClick={() => go("home")}><Logo light s={.75} /></div>
        <div className="dn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map(l => <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 13px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, color: page === l.id ? C.red : "rgba(255,255,255,.6)", transition: "color .2s" }} onMouseEnter={e => { if (page !== l.id) e.target.style.color = C.white; }} onMouseLeave={e => { if (page !== l.id) e.target.style.color = "rgba(255,255,255,.6)"; }}>{l.l}</button>)}
          <button onClick={() => go("contact")} style={{ background: C.red, color: C.white, border: "none", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, padding: "10px 22px", marginLeft: 6, transition: "all .2s" }} onMouseEnter={e => { e.target.style.background = C.white; e.target.style.color = C.black; }} onMouseLeave={e => { e.target.style.background = C.red; e.target.style.color = C.white; }}>FREE QUOTE</button>
        </div>
        <button className="mb" onClick={() => setMo(!mo)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 26, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ height: 2, background: C.white, transition: "all .3s", transform: mo ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ height: 2, background: C.white, opacity: mo ? 0 : 1, transition: "all .3s" }} />
            <span style={{ height: 2, background: C.white, transition: "all .3s", transform: mo ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </div>
        </button>
      </div>
      {mo && <div style={{ background: C.black, padding: "14px 32px 20px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255,255,255,.05)" }}>{links.map(l => <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 3, color: page === l.id ? C.red : C.white, padding: "5px 0" }}>{l.l}</button>)}</div>}
    </nav>
  );
}

function STitle({ label, title, light = false }) {
  return <Reveal><div style={{ marginBottom: 48 }}><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red, display: "block", marginBottom: 10 }}>{label}</span><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(36px,4.5vw,68px)", color: light ? C.white : C.black, lineHeight: .93, letterSpacing: 1, margin: 0, whiteSpace: "pre-line" }}>{title}</h2><div style={{ width: 50, height: 3, background: C.red, marginTop: 18 }} /></div></Reveal>;
}

function Btn({ label, onClick, outline = false, light = false }) {
  const [h, sH] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)} style={{ background: outline ? "transparent" : (h ? C.white : C.red), color: outline ? (h ? C.red : (light ? C.white : C.black)) : (h ? C.black : C.white), border: `2px solid ${outline ? (light ? C.white : C.black) : (h ? C.white : C.red)}`, cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 3, padding: "16px 36px", minWidth: 280, textAlign: "center", justifyContent: "center", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 8 }}>{label} <span style={{ fontSize: 16, transition: "transform .2s", transform: h ? "translateX(3px)" : "none" }}>&rarr;</span></button>;
}

/* ═══ HOME ═══ */
function Home({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  return <>
    <section style={{ minHeight: "100vh", background: C.white, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "rgba(230,51,41,0.04)", filter: "blur(80px)" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "130px 32px 80px", position: "relative", zIndex: 2, width: "100%" }}>
        <div className="hg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <Reveal><div style={{ display: "inline-block", padding: "6px 16px", border: `2px solid ${C.red}`, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red, marginBottom: 32 }}>RENOVATION COMPANY — ANTWERP</div></Reveal>
            <Reveal delay={.08}><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,6.5vw,88px)", color: C.black, lineHeight: .92, letterSpacing: 1, margin: "0 0 12px" }}>YOUR RENOVATION,<br/>OUR <span style={{ color: C.red }}>CRAFT</span></h1></Reveal>
            <Reveal delay={.12}><div style={{ width: 60, height: 3, background: C.red, margin: "24px 0 28px" }} /></Reveal>
            <Reveal delay={.18}><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.8, color: C.gray, maxWidth: 460, margin: "0 0 44px" }}>One point of contact for full renovations, bathrooms, and interior finishing in Antwerp. Fixed price. Clear planning. On-time delivery.</p></Reveal>
            <Reveal delay={.25}><div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}><Btn label="FREE CONSULTATION" onClick={() => go("contact")} /><Btn label="SEE OUR PROJECTS" onClick={() => go("projecten")} outline /></div></Reveal>
            <Reveal delay={.4}><div style={{ display: "flex", gap: 48, marginTop: 56, paddingTop: 32, borderTop: `1px solid ${C.ltGray}` }}>
              {[{ n: "200+", l: "Projects" }, { n: "5.0", l: "Google Rating" }, { n: "100%", l: "Fixed Price" }].map(s => <div key={s.n}><div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: C.black, lineHeight: 1 }}>{s.n}</div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.gray, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.l}</div></div>)}
            </div></Reveal>
            <Reveal delay={.55}>
              <div style={{ marginTop: 48 }}>
                <Video title="Reno Rangers — promo video" />
              </div>
            </Reveal>
          </div>
          <Reveal delay={.15} y={0}>
            <div className="hi" style={{ position: "relative" }}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5" }}>
                <img src={IMG.hero} alt="Renovation Antwerp" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: -16, left: -16, background: C.red, padding: "20px 28px", zIndex: 3 }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: C.white, lineHeight: 1 }}>FIXED PRICE</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4 }}>No hidden extras</div>
              </div>
              <div style={{ position: "absolute", top: 20, right: -10, width: 80, height: 80, border: `3px solid ${C.red}`, zIndex: 1 }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <Marquee items={["FULL RENOVATION","BATHROOM","INTERIOR FINISH","PAINT","FLOORING","TILING","GYPROC","PLASTER"]} />

    {/* SERVICES */}
    <section style={{ padding: "110px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="WHAT WE DO" title="OUR SERVICES" />
        <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {[
            { t: "BATHROOM\nRENOVATION", img: IMG.bath1, d: "Complete bathroom renovations with durable materials and watertight finish." },
            { t: "FULL HOME\nRENOVATION", img: IMG.living1, d: "Apartments and houses renovated from A to Z with one point of contact." },
            { t: "INTERIOR\nFINISHING", img: IMG.interior1, d: "Painting, plastering, gyproc, floors, and tiling with clean execution." },
          ].map((s, i) => (
            <Reveal key={i} delay={i * .1}>
              <div onClick={() => go("diensten")} style={{ position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "3/4", background: C.black, borderRight: i < 2 ? "1px solid rgba(255,255,255,.08)" : "none" }}
                onMouseEnter={e => { const im = e.currentTarget.querySelector("img"); if (im) { im.style.transform = "scale(1.06)"; im.style.opacity = ".45"; } const ov = e.currentTarget.querySelector(".sov"); if (ov) ov.style.opacity = "1"; }}
                onMouseLeave={e => { const im = e.currentTarget.querySelector("img"); if (im) { im.style.transform = "none"; im.style.opacity = ".3"; } const ov = e.currentTarget.querySelector(".sov"); if (ov) ov.style.opacity = "0"; }}>
                <img src={s.img} alt={s.t} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .3, transition: "all .5s" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,rgba(10,10,10,.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 32, zIndex: 2 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(28px,3vw,44px)", color: C.white, lineHeight: .93, margin: "0 0 10px", whiteSpace: "pre-line" }}>{s.t}</h3>
                  <div className="sov" style={{ opacity: 0, transition: "opacity .35s" }}><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.65)", margin: 0 }}>{s.d}</p></div>
                  <div style={{ width: 36, height: 2, background: C.red, marginTop: 14 }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={.3}><div style={{ textAlign: "center", marginTop: 44 }}><Btn label="ALL SERVICES" onClick={() => go("diensten")} /></div></Reveal>
      </div>
    </section>

    {/* WHY */}
    <section style={{ padding: "110px 0", background: C.black }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="WHY RENO RANGERS" title="RENOVATE WITHOUT STRESS" light />
        <div className="wg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { n: "01", t: "ONE CONTACT", d: "No juggling contractors. One project lead for everything." },
            { n: "02", t: "FIXED PRICE", d: "What we agree is what you pay. No surprises." },
            { n: "03", t: "CLEAR PLANNING", d: "Transparent communication and timeline from start to finish." },
            { n: "04", t: "CRAFTSMANSHIP", d: "Experienced teams that deliver right the first time." },
            { n: "05", t: "LOCAL ANTWERP", d: "We are nearby, responsive, and know the area." },
            { n: "06", t: "5.0 GOOGLE REVIEWS", d: "Clients recommend us. See the reviews." },
          ].map((r, i) => (
            <Reveal key={i} delay={i * .07}><div style={{ padding: "32px 24px", border: "1px solid rgba(255,255,255,.07)", transition: "all .25s", height: "100%" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.background = "rgba(230,51,41,.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: C.red, lineHeight: 1 }}>{r.n}</span>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: C.white, letterSpacing: 2, margin: "14px 0 8px" }}>{r.t}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.45)", margin: 0 }}>{r.d}</p>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* PROCESS */}
    <section style={{ padding: "110px 0", background: C.off }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="HOW WE WORK" title={"5 STEPS TO A\nSMOOTH RENOVATION"} />
        <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0 }}>
          {[
            { n: "01", t: "INTRO CALL", d: "Free advice on your plans and budget." },
            { n: "02", t: "SITE MEASURE", d: "Measurements on site and clear quote." },
            { n: "03", t: "PLANNING", d: "Detailed schedule and materials ordered." },
            { n: "04", t: "EXECUTION", d: "Clean, safe work with attention to detail." },
            { n: "05", t: "HANDOVER", d: "We finish when you are 100% satisfied." },
          ].map((s, i) => (
            <Reveal key={i} delay={i * .08}><div style={{ padding: "28px 20px", borderLeft: i > 0 ? `1px solid ${C.ltGray}` : "none", height: "100%" }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 50, color: C.red, lineHeight: 1, display: "block" }}>{s.n}</span>
              <div style={{ width: 26, height: 2, background: C.black, margin: "14px 0" }} />
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2, color: C.black, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, lineHeight: 1.6, color: C.gray, margin: 0 }}>{s.d}</p>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* REVIEWS */}
    <section style={{ padding: "110px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="REVIEWS" title="WHAT CLIENTS SAY" />
        <div className="rg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { n: "Maja Buyle", t: "Total renovation of an apartment. Great follow-up, lots of communication, ready with solutions. Very satisfied!" },
            { n: "Eva Putteman", t: "Very happy with our bathroom renovation. Fast service and fair price. We could always reach someone." },
            { n: "Dennis V.", t: "Good quality work at fair prices! Renovation of bedrooms and bathroom. Fast, flexible, correct." },
            { n: "Frederik De Boeck", t: "Very reliable contractor, motivated and friendly. Works neatly with detailed finish." },
            { n: "Bart Pelczarski", t: "Professional, punctual, perfect finish. Highly recommended for renovation or construction." },
            { n: "Mohamed El Mahsini", t: "Top company, keeps agreements, always professional and cleans up after handover." },
          ].map((r, i) => (
            <Reveal key={i} delay={i * .06}><div style={{ padding: "28px 24px", border: `1px solid ${C.ltGray}`, height: "100%", display: "flex", flexDirection: "column", transition: "border-color .25s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.ltGray}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>{Array(5).fill(0).map((_, j) => <span key={j} style={{ color: C.red, fontSize: 14 }}>&#9733;</span>)}</div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: C.char, fontStyle: "italic", margin: "0 0 18px", flex: 1 }}>&quot;{r.t}&quot;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: C.white }}>{r.n.charAt(0)}</div>
                <div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: C.black }}>{r.n}</div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.gray, letterSpacing: 1 }}>GOOGLE REVIEW</div></div>
              </div>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "90px 0", background: C.red, textAlign: "center" }}>
      <div style={{ maxWidth: 750, margin: "0 auto", padding: "0 32px" }}>
        <Reveal><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(38px,5vw,60px)", color: C.white, lineHeight: .93, margin: "0 0 18px" }}>READY TO START?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.8)", margin: "0 0 32px", lineHeight: 1.7 }}>Request a free, no-obligation consultation.</p>
        <button onClick={() => go("contact")} style={{ background: C.white, color: C.black, border: "none", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 3, padding: "16px 44px", transition: "all .2s" }}
          onMouseEnter={e => { e.target.style.background = C.black; e.target.style.color = C.white; }}
          onMouseLeave={e => { e.target.style.background = C.white; e.target.style.color = C.black; }}>GET IN TOUCH &rarr;</button></Reveal>
      </div>
    </section>
  </>;
}

/* ═══ SERVICES PAGE ═══ */
function Diensten({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  const sv = [
    { id: "bad", t: "BATHROOM RENOVATION", img: IMG.bath1, img2: IMG.bath2, intro: "A bathroom renovation is one of the best investments in your home. We handle the full bathroom rebuild in Antwerp — demolition to tiling and installation.", items: ["Full demolition and removal", "Waterproof membrane and insulation", "Sanitary installations", "Floor and wall tiling", "Furniture and lighting", "Ventilation and finishing"], seo: "Looking for a reliable contractor for your bathroom renovation in Antwerp? Reno Rangers delivers modern, functional bathrooms that last. We use durable materials and provide watertight finishing with warranty." },
    { id: "tot", t: "FULL RENOVATION", img: IMG.living1, img2: IMG.kitchen1, intro: "Full-home renovations need coordination, craft, and a clear plan. We manage the entire process from A to Z.", items: ["Design and planning", "Demolition and structural work", "Electrical and plumbing", "Windows and doors", "Floors, walls, ceilings", "Kitchen and bathroom fit-out"], seo: "We offer a worry-free trajectory with one contact point, detailed quote without hidden costs, and a clear schedule. Houses, apartments, or investments — we deliver on budget and deadline." },
    { id: "bin", t: "INTERIOR FINISHING", img: IMG.interior1, img2: IMG.floor1, intro: "Interior finishing sets the feel of your home. We provide painting, plastering, gyproc, floors, and tiling.", items: ["Interior painting", "Plaster and gyproc", "Floors and tiling", "Ceiling finishing", "Decorative techniques", "Woodwork and joinery"], seo: "We finish interiors to a clean, modern standard. From smooth walls and ceilings to perfectly laid floors and tiles. For new builds and renovations alike." },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>OUR SERVICES</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>WHAT WE <span style={{ color: C.red }}>DO</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>From bathrooms to whole homes — all renovation services under one roof.</p></Reveal></div></div>
    <Marquee items={["BATHROOM","FULL RENOVATION","INTERIOR","PAINTING","FLOORING","TILING"]} />
    {sv.map((s, idx) => (
      <div key={s.id} style={{ padding: "90px 0", background: idx % 2 === 0 ? C.white : C.off }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <Reveal style={{ order: idx % 2 === 0 ? 0 : 1 }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>{`0${idx + 1}`}</span>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(34px,4vw,56px)", color: C.black, lineHeight: .93, margin: "6px 0 18px" }}>{s.t}</h2>
              <div style={{ width: 44, height: 3, background: C.red, marginBottom: 20 }} />
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 20px" }}>{s.intro}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", marginBottom: 24 }}>
                {s.items.map(it => <div key={it} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}><div style={{ width: 7, height: 7, background: C.red, flexShrink: 0 }} /><span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.char }}>{it}</span></div>)}
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.75, color: C.gray, margin: "0 0 28px" }}>{s.seo}</p>
              <Btn label="REQUEST A QUOTE" onClick={() => go("contact")} />
            </Reveal>
            <Reveal delay={.12} style={{ order: idx % 2 === 0 ? 1 : 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ overflow: "hidden", aspectRatio: "3/4" }}><img src={s.img} alt={s.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ overflow: "hidden", aspectRatio: "3/4", marginTop: 36 }}><img src={s.img2} alt={s.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    ))}
  </section>;
}

/* ═══ ABOUT ═══ */
function Over({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>ABOUT US</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0" }}>WHO <span style={{ color: C.red }}>WE ARE</span></h1></Reveal></div></div>
    <Marquee items={["RELIABLE","PROFESSIONAL","TRANSPARENT","LOCAL","CRAFT","QUALITY"]} reverse />
    <div style={{ padding: "90px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <Reveal><div style={{ overflow: "hidden", aspectRatio: "4/5" }}><img src={IMG.team2} alt="Team" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></Reveal>
          <Reveal delay={.12}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(34px,4vw,52px)", color: C.black, lineHeight: .93, margin: "0 0 18px" }}>A RENOVATION TEAM CLIENTS <span style={{ color: C.red }}>TRUST</span></h2>
            <div style={{ width: 44, height: 3, background: C.red, marginBottom: 20 }} />
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>Renovations can be stressful: choosing the right contractor, materials, planning, and budget. We take it off your hands.</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>Whether you are renovating your first home, upgrading for comfort, or improving an investment property — we manage everything end-to-end.</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 28px" }}>What sets us apart? We do it right the first time. No surprises, no rework — professional, transparent, reliable.</p>
            <Btn label="CONTACT US" onClick={() => go("contact")} />
          </Reveal>
        </div>
      </div>
    </div>
    <div style={{ padding: "72px 0", background: C.black }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="SERVICE AREA" title="ACROSS ANTWERP" light />
        <Reveal delay={.15}><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Antwerp (all districts)","Mortsel","Hove","Edegem","Borsbeek","Boechout","Kontich","Lint","Aartselaar","Wommelgem","Wijnegem","Schoten","Deurne","Wilrijk","Hoboken","Kapellen","Brasschaat","Ekeren"].map(a => (
            <span key={a} style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.white, padding: "9px 18px", border: "1px solid rgba(255,255,255,.12)", transition: "all .2s", cursor: "default" }}
              onMouseEnter={e => { e.target.style.borderColor = C.red; e.target.style.background = "rgba(230,51,41,.08)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,.12)"; e.target.style.background = "transparent"; }}>{a}</span>
          ))}
        </div></Reveal>
      </div>
    </div>
  </section>;
}

/* ═══ PROJECTS ═══ */
function Projecten({ setPage }) {
  const pj = [
    { t: "KITCHEN RENOVATION", loc: "Antwerp South", img: IMG.kitchen1, c: "Full renovation" },
    { t: "BATHROOM RENOVATION", loc: "Mortsel", img: IMG.bath1, c: "Bathroom" },
    { t: "APARTMENT RENOVATION", loc: "Deurne", img: IMG.proj1, c: "Full renovation" },
    { t: "BEDROOM FINISHING", loc: "Edegem", img: IMG.interior1, c: "Interior" },
    { t: "LIVING ROOM", loc: "Wilrijk", img: IMG.living1, c: "Full renovation" },
    { t: "FLOOR & TILEWORK", loc: "Kontich", img: IMG.floor1, c: "Interior" },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>PORTFOLIO</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>OUR <span style={{ color: C.red }}>PROJECTS</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>See our recent work. Every renovation delivered with attention to detail.</p></Reveal></div></div>
    <Marquee items={["BEFORE & AFTER","QUALITY WORK","CRAFT","HAPPY CLIENTS"]} />
    <div style={{ padding: "60px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <Reveal><Video title="Reno Rangers — project reel" /></Reveal>
      </div>
    </div>
    <div style={{ padding: "72px 0", background: C.white }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
      <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
        {pj.map((p, i) => <Reveal key={i} delay={i * .07}><div style={{ background: C.off, overflow: "hidden", cursor: "pointer", transition: "all .3s" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 36px rgba(0,0,0,.08)"; const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "none"; }}>
          <div style={{ overflow: "hidden", aspectRatio: "16/10" }}><img src={p.img} alt={p.t} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} /></div>
          <div style={{ padding: "22px 24px" }}><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3, color: C.red }}>{p.c}</span><h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: C.black, margin: "4px 0 3px", letterSpacing: .5 }}>{p.t}</h3><span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.gray }}>{p.loc}</span></div>
        </div></Reveal>)}
      </div>
    </div></div>
  </section>;
}

/* ═══ BLOG ═══ */
function Blog({ setPage }) {
  const ps = [
    { t: "WHAT DOES A BATHROOM RENOVATION COST IN ANTWERP IN 2026?", img: IMG.bath1, d: "15 MAR 2026", c: "BATHROOM", ex: "A bathroom renovation in Antwerp averages between €5,000 and €15,000 depending on size, materials, and complexity. We outline key cost drivers and how to save without sacrificing quality." },
    { t: "FULL RENOVATION: WHAT YOU NEED TO KNOW", img: IMG.living1, d: "8 MAR 2026", c: "RENOVATION", ex: "A full-home renovation is a big investment that can raise your property value. From permits to choosing the right contractor — we guide you through the process." },
    { t: "5 INTERIOR FINISHING TRENDS FOR BELGIAN HOMES", img: IMG.interior1, d: "1 MAR 2026", c: "INTERIOR", ex: "From warm earth tones to minimalist finishes — here are the trends we see in Belgian homes." },
    { t: "HOW TO CHOOSE THE RIGHT RENOVATION CONTRACTOR", img: IMG.team2, d: "22 FEB 2026", c: "TIPS", ex: "Choosing a reliable contractor is the most important decision. We share the questions you should ask." },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>BLOG</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>RENOVATION <span style={{ color: C.red }}>TIPS</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>Practical advice, trends, and tips about renovating in Antwerp.</p></Reveal></div></div>
    <div style={{ padding: "72px 0", background: C.white }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {ps.map((p, i) => <Reveal key={i} delay={i * .08}><div className="bg" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 36, alignItems: "center", borderBottom: `1px solid ${C.ltGray}`, paddingBottom: 40, cursor: "pointer" }}
          onMouseEnter={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { const im = e.currentTarget.querySelector("img"); if (im) im.style.transform = "none"; }}>
          <div style={{ overflow: "hidden", aspectRatio: "16/10" }}><img src={p.img} alt={p.t} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} /></div>
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 10 }}><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3, color: C.red }}>{p.c}</span><span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.gray }}>{p.d}</span></div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: C.black, lineHeight: 1.05, margin: "0 0 14px" }}>{p.t}</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: C.gray, margin: 0 }}>{p.ex}</p>
          </div>
        </div></Reveal>)}
      </div>
    </div></div>
  </section>;
}

/* ═══ CONTACT ═══ */
function Contact() {
  const [f, sF] = useState({ name: "", email: "", phone: "", service: "", msg: "" });
  const [sent, sSent] = useState(false);
  const [status, sStatus] = useState("idle");
  const handleSubmit = async e => {
    e.preventDefault();
    sStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xgopeqeb", {
        method: "POST",
        body: new FormData(e.target),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        sSent(true);
        sF({ name: "", email: "", phone: "", service: "", msg: "" });
        sStatus("ok");
      } else {
        sStatus("error");
      }
    } catch (err) {
      console.error("Form submit failed", err);
      sStatus("error");
    }
  };
  const inp = { width: "100%", padding: "13px 16px", border: `1px solid ${C.ltGray}`, fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.black, outline: "none", background: C.white, transition: "border-color .2s", boxSizing: "border-box" };
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>CONTACT</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0" }}>GET IN <span style={{ color: C.red }}>TOUCH</span></h1></Reveal></div></div>
    <div style={{ padding: "72px 0", background: C.white }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
      <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56 }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: C.black, margin: "0 0 20px" }}>CONTACT DETAILS</h2>
          <div style={{ width: 44, height: 3, background: C.red, marginBottom: 28 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
            {[{ l: "PHONE", v: "+32 465 88 39 19", h: "tel:+32465883919" }, { l: "EMAIL", v: "info@renorangers.be", h: "mailto:info@renorangers.be" }, { l: "WHATSAPP", v: "Send a message", h: "https://wa.me/32465883919" }].map(c => (
              <a key={c.l} href={c.h} target={c.l === "WHATSAPP" ? "_blank" : undefined} rel="noopener" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: C.red }}>{c.l.charAt(0)}</span></div>
                <div><div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 2, color: C.gray }}>{c.l}</div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: C.black }}>{c.v}</div></div>
              </a>))}
          </div>
          <div style={{ padding: 22, background: C.off, border: `1px solid ${C.ltGray}` }}>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2, color: C.black, margin: "0 0 10px" }}>OPENING HOURS</h3>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.gray, lineHeight: 1.8 }}>Mon — Fri: 07:00 — 17:30<br/>Saturday: 08:30 — 16:00<br/>Sunday: Closed</div>
          </div>
        </Reveal>
        <Reveal delay={.12}>
          <form onSubmit={handleSubmit} action="https://formspree.io/f/xgopeqeb" method="POST" style={{ padding: 36, background: C.off, border: `1px solid ${C.ltGray}` }}>
            {sent ? <div style={{ textAlign: "center", padding: "44px 0" }}>
              <div style={{ width: 52, height: 52, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><span style={{ color: C.white, fontSize: 26 }}>&#10003;</span></div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: C.black }}>MESSAGE SENT</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.gray, marginTop: 6 }}>We will contact you as soon as possible.</p>
            </div> : <>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: C.black, margin: "0 0 4px" }}>REQUEST A FREE QUOTE</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.gray, margin: "0 0 24px" }}>Fill in the form — we respond within 24 hours.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input name="name" style={inp} placeholder="Your name *" value={f.name} onChange={e => sF({ ...f, name: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input name="email" style={inp} placeholder="Email address *" type="email" value={f.email} onChange={e => sF({ ...f, email: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} required />
                  <input name="phone" style={inp} placeholder="Phone number" type="tel" value={f.phone} onChange={e => sF({ ...f, phone: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                </div>
                <select name="service" style={{ ...inp, color: f.service ? C.black : C.gray, appearance: "none" }} value={f.service} onChange={e => sF({ ...f, service: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray}>
                  <option value="">Select service</option><option>Bathroom renovation</option><option>Full renovation</option><option>Interior finishing</option><option>Other</option>
                </select>
                <textarea name="message" style={{ ...inp, minHeight: 110, resize: "vertical" }} placeholder="Describe your renovation project..." value={f.msg} onChange={e => sF({ ...f, msg: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                <button type="submit" disabled={status === "sending"} style={{ width: "100%", padding: 15, background: status === "sending" ? C.black : C.red, color: C.white, border: "none", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 3, cursor: status === "sending" ? "wait" : "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { if (status !== "sending") e.target.style.background = C.black; }} onMouseLeave={e => { if (status !== "sending") e.target.style.background = C.red; }}>{status === "sending" ? "SENDING..." : "SEND REQUEST"}</button>
                {status === "error" && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.red, margin: "6px 0 0" }}>Send failed. Try again or email info@renorangers.be.</p>}
              </div>
            </>}
          </form>
        </Reveal>
      </div>
    </div></div>
  </section>;
}

/* ═══ FOOTER ═══ */
function Foot({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  return <footer style={{ background: C.black, borderTop: `3px solid ${C.red}` }}>
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 28px" }}>
      <div className="fg" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
        <div><Logo light s={.85} /><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.35)", marginTop: 18, maxWidth: 260 }}>Renovation company in Antwerp. Fixed price, no surprises.</p></div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>PAGES</h4>{[{ l: "Home", id: "home" }, { l: "Services", id: "diensten" }, { l: "About", id: "over" }, { l: "Projects", id: "projecten" }, { l: "Blog", id: "blog" }, { l: "Contact", id: "contact" }, { l: "CRM", id: "crm" }].map(l => <button key={l.id} onClick={() => go(l.id)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.white} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{l.l}</button>)}</div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>SERVICES</h4>{["Full renovation","Bathroom renovation","Interior finishing","Painting","Floors & tiles"].map(l => <button key={l} onClick={() => go("diensten")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.white} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{l}</button>)}</div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>CONTACT</h4><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.9 }}><a href="tel:+32465883919" style={{ color: "inherit", textDecoration: "none", display: "block" }}>+32 465 88 39 19</a><a href="mailto:info@renorangers.be" style={{ color: "inherit", textDecoration: "none", display: "block" }}>info@renorangers.be</a><span style={{ display: "block" }}>Antwerp, Belgium</span></div></div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,.2)" }}>© 2026 Reno Rangers BV. All rights reserved.</span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,.2)" }}>Privacy policy</span>
      </div>
    </div>
  </footer>;
}

/* ═══ FLOATING ═══ */
function Float() {
  const [sh, sSh] = useState(false);
  useEffect(() => { const h = () => sSh(window.scrollY > 400); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 9998, display: "flex", flexDirection: "column", gap: 10, opacity: sh ? 1 : 0, transform: sh ? "none" : "translateY(16px)", transition: "all .35s", pointerEvents: sh ? "auto" : "none" }}>
    <a href="https://wa.me/32465883919" target="_blank" rel="noopener" style={{ width: 50, height: 50, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,211,102,.35)", textDecoration: "none", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.636-1.467A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.183-.588-5.927-1.606l-.424-.252-2.75.87.884-2.684-.277-.44A9.77 9.77 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/></svg>
    </a>
    <a href="tel:+32465883919" style={{ width: 50, height: 50, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(230,51,41,.35)", textDecoration: "none", transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
    </a>
  </div>;
}

/* ═══ APP ═══ */
export default function App() {
  const [p, sP] = useState("home");
  const pg = { home: <Home setPage={sP} />, diensten: <Diensten setPage={sP} />, over: <Over setPage={sP} />, projecten: <Projecten setPage={sP} />, blog: <Blog setPage={sP} />, contact: <Contact />, crm: <CRM /> };
  return <div style={{ background: C.white, minHeight: "100vh" }}>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden}::selection{background:${C.red}30;color:${C.black}}
      @keyframes mL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes mR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
      @media(max-width:900px){.hg,.svg2,.sg,.wg,.rg,.pg,.fg,.bg{grid-template-columns:1fr!important}.stg{grid-template-columns:1fr 1fr!important}.hi{display:none!important}.dn{display:none!important}.mb{display:block!important}}
      @media(min-width:901px){.mb{display:none!important}}
    `}</style>
    <Nav page={p} setPage={sP} />
    {pg[p]}
    <Foot setPage={sP} />
    <Float />
  </div>;
}
