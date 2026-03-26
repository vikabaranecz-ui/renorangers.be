import { useState, useEffect, useRef } from "react";

/* ── BRAND COLORS ── */
const C = {
  red: "#E63329",
  black: "#0A0A0A",
  dark: "#141414",
  char: "#2A2A2A",
  gray: "#777777",
  ltGray: "#E0E0E0",
  off: "#F5F5F5",
  white: "#FFFFFF",
};

/* ── IMAGES ── */
const IMG = {
  bath1: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80&auto=format&fit=crop",
  bath2: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80&auto=format&fit=crop",
  kitchen1: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop",
  living1: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&auto=format&fit=crop",
  interior1: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80&auto=format&fit=crop",
  floor1: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80&auto=format&fit=crop",
  team2: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=800&q=80&auto=format&fit=crop",
  proj1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80&auto=format&fit=crop",
};

/* ── GLOBAL STYLES ── */
const globalCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; font-family: 'Inter', sans-serif; }
  ::selection { background: #E6332930; color: #0A0A0A; }
  @keyframes mL { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes mR { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
  @media (max-width: 900px) {
    .hg, .svg2, .sg, .wg, .rg, .pg, .fg, .bg { grid-template-columns: 1fr !important; }
    .stg { grid-template-columns: 1fr 1fr !important; }
    .hi { display: none !important; }
    .dn { display: none !important; }
    .mb { display: block !important; }
  }
  @media (min-width: 901px) {
    .mb { display: none !important; }
  }
`;

/* ── HOOKS ── */
function useInView(threshold) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: threshold || 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay, y, style: extraStyle }) {
  const [ref, visible] = useInView();
  const offset = y || 40;
  const d = delay || 0;
  return (
    <div
      ref={ref}
      style={{
        ...extraStyle,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(" + offset + "px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "s, transform 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "s",
      }}
    >
      {children}
    </div>
  );
}

/* ── LOGO ── */
function Logo() {
  return (
    <img 
      src="/logo.png" 
      alt="Reno Rangers" 
      style={{ 
        height: 44, 
        width: "auto", 
        display: "block",
        objectFit: "contain"
      }} 
    />
  );
}

/* ── MARQUEE ── */
function Marquee({ items, reverse }) {
  var doubled = items.concat(items).concat(items).concat(items);
  var animName = reverse ? "mR" : "mL";
  return (
    <div style={{ overflow: "hidden", background: C.red, padding: "13px 0", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-flex", animation: animName + " 28s linear infinite" }}>
        {doubled.map(function (text, i) {
          return (
            <span
              key={i}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 15,
                color: C.white,
                letterSpacing: 3,
                padding: "0 20px",
              }}
            >
              {text} <span style={{ opacity: 0.4 }}>/</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── BUTTON ── */
function Btn({ label, onClick, outline, light }) {
  var _useState = useState(false);
  var hov = _useState[0];
  var setHov = _useState[1];

  var bg, fg, bdr;
  if (outline) {
    bg = "transparent";
    fg = hov ? C.red : (light ? C.white : C.black);
    bdr = light ? C.white : C.black;
  } else {
    bg = hov ? C.white : C.red;
    fg = hov ? C.black : C.white;
    bdr = hov ? C.white : C.red;
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={function () { setHov(true); }}
      onMouseLeave={function () { setHov(false); }}
      style={{
        background: bg,
        color: fg,
        border: "2px solid " + bdr,
        cursor: "pointer",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 15,
        letterSpacing: 3,
        padding: "16px 36px",
        minWidth: 280,
        textAlign: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {label} <span style={{ fontSize: 16 }}>{"\u2192"}</span>
    </button>
  );
}

/* ── SECTION TITLE ── */
function STitle({ label, title, light }) {
  return (
    <Reveal>
      <div style={{ marginBottom: 48 }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13,
            letterSpacing: 4,
            color: C.red,
            display: "block",
            marginBottom: 10,
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 4.5vw, 68px)",
            color: light ? C.white : C.black,
            lineHeight: 0.93,
            letterSpacing: 1,
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </h2>
        <div style={{ width: 50, height: 3, background: C.red, marginTop: 18 }} />
      </div>
    </Reveal>
  );
}

/* ── NAV ── */
function Nav({ page, setPage }) {
  var _useState2 = useState(false);
  var scrolled = _useState2[0];
  var setScrolled = _useState2[1];
  var _useState3 = useState(false);
  var menuOpen = _useState3[0];
  var setMenuOpen = _useState3[1];

  useEffect(function () {
    var handler = function () { setScrolled(window.scrollY > 40); };
    window.addEventListener("scroll", handler);
    return function () { window.removeEventListener("scroll", handler); };
  }, []);

  var links = [
    { id: "home", l: "HOME" },
    { id: "diensten", l: "DIENSTEN" },
    { id: "over", l: "OVER ONS" },
    { id: "projecten", l: "PROJECTEN" },
    { id: "blog", l: "BLOG" },
    { id: "contact", l: "CONTACT" },
  ];

  var go = function (id) {
    setPage(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: scrolled ? "rgba(10,10,10,0.97)" : "rgba(10,10,10,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 70,
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={function () { go("home"); }}>
          <Logo light size={0.75} />
        </div>

        <div className="dn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map(function (link) {
            return (
              <button
                key={link.id}
                onClick={function () { go(link.id); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 13px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 14,
                  letterSpacing: 2,
                  color: page === link.id ? C.red : "rgba(255,255,255,0.6)",
                  transition: "color 0.2s",
                }}
              >
                {link.l}
              </button>
            );
          })}
          <button
            onClick={function () { go("contact"); }}
            style={{
              background: C.red,
              color: C.white,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: 2,
              padding: "10px 22px",
              marginLeft: 6,
              transition: "all 0.2s",
            }}
          >
            GRATIS OFFERTE
          </button>
        </div>

        <button
          className="mb"
          onClick={function () { setMenuOpen(!menuOpen); }}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
        >
          <div style={{ width: 26, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ height: 2, background: C.white, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ height: 2, background: C.white, opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <span style={{ height: 2, background: C.white, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: C.black, padding: "14px 32px 20px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {links.map(function (link) {
            return (
              <button
                key={link.id}
                onClick={function () { go(link.id); }}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20,
                  letterSpacing: 3,
                  color: page === link.id ? C.red : C.white,
                  padding: "5px 0",
                }}
              >
                {link.l}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════
   HOME PAGE
   ══════════════════════════════════ */
function Home({ setPage }) {
  var go = function (id) { setPage(id); window.scrollTo(0, 0); };

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "100vh", background: C.black, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={IMG.hero} alt="Renovatie Antwerpen" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.92), rgba(10,10,10,0.55))" }} />
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "140px 32px 80px", position: "relative", zIndex: 2, width: "100%" }}>
<div className="hg" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>            <div>
              <Reveal>
                <div style={{ display: "inline-block", padding: "5px 14px", border: "1px solid " + C.red, fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 4, color: C.red, marginBottom: 24 }}>
                  RENOVATIEBEDRIJF ANTWERPEN
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(50px, 7vw, 96px)", color: C.white, lineHeight: 0.9, letterSpacing: 1, margin: "0 0 10px" }}>
                  UW RENOVATIE,<br />ONS <span style={{ color: C.red }}>VAKMANSCHAP</span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <div style={{ width: 70, height: 3, background: C.red, margin: "18px 0 24px" }} />
              </Reveal>

              <Reveal delay={0.18}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 460, margin: "0 0 36px" }}>
                  {"E\u00E9n aanspreekpunt voor totaalrenovatie, badkamerrenovatie en binnenafwerking in Antwerpen. Vaste prijs. Duidelijke planning. Correcte oplevering."}
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <Btn label="GRATIS ADVIESGESPREK" onClick={function () { go("contact"); }} />
                  <Btn label="ONZE PROJECTEN" onClick={function () { go("projecten"); }} outline light />
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div style={{ display: "flex", gap: 44, marginTop: 52 }}>
                  {[
                    { n: "200+", l: "Projecten" },
                    { n: "5.0", l: "Google Score" },
                    { n: "100%", l: "Vaste Prijs" },
                  ].map(function (stat) {
                    return (
                      <div key={stat.n}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: C.white, lineHeight: 1 }}>{stat.n}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>{stat.l}</div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
 <Reveal delay={0.15} y={0}>
  {/* Ми прибираємо фіксовані 550px і додаємо закруглені кути для краси */}
  <div className="hi" style={{ 
  overflow: "hidden", 
  borderRadius: "15px", 
  width: "75%",          // Оберіть масштаб тут: 70% або 80% (як вам більше подобається)
  margin: "0 auto",      // Це вирівняє відео по центру вашої правої колонки
  position: 'relative',
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)" // Додамо легку тінь, щоб виглядало як преміум-дизайн
}}>
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{ 
      width: "100%",      // Відео заповнить 100% від зменшеного контейнера (75%)
      height: "auto",     // Висота підлаштується автоматично, щоб не було деформації
      display: "block"
    }}
  >
    <source src="/hero.mp4" type="video/mp4" />
  </video>
</div>
  }}>
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover" // Відео заповнить простір, не деформуючись
      }}
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  </div>
</Reveal>
          </div>
        </div>
      </section>

      <Marquee items={["TOTAALRENOVATIE", "BADKAMERRENOVATIE", "BINNENAFWERKING", "SCHILDERWERKEN", "VLOEREN", "TEGELWERK", "GYPROC", "PLEISTERWERK"]} />

      {/* DIENSTEN */}
      <section style={{ padding: "110px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <STitle label="WAT WIJ DOEN" title="ONZE DIENSTEN" />
          <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {[
              { t: "BADKAMER-\nRENOVATIE", img: IMG.bath1, d: "Complete badkamerrenovaties met duurzame materialen en waterdichte afwerking." },
              { t: "TOTAAL-\nRENOVATIE", img: IMG.living1, d: "Professionele renovatie van woningen en appartementen van A tot Z." },
              { t: "BINNEN-\nAFWERKING", img: IMG.interior1, d: "Schilderwerken, pleisterwerken, gyproc, vloeren en tegelwerk." },
            ].map(function (service, i) {
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div
                    onClick={function () { go("diensten"); }}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      aspectRatio: "3/4",
                      background: C.black,
                      borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    <img
                      src={service.img}
                      alt={service.t}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, transition: "all 0.5s" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.85) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 32, zIndex: 2 }}>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3vw, 44px)", color: C.white, lineHeight: 0.93, margin: "0 0 10px", whiteSpace: "pre-line" }}>
                        {service.t}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", margin: 0 }}>{service.d}</p>
                      <div style={{ width: 36, height: 2, background: C.red, marginTop: 14 }} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 44 }}>
              <Btn label="ALLE DIENSTEN" onClick={function () { go("diensten"); }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WAAROM */}
      <section style={{ padding: "110px 0", background: C.black }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <STitle label="WAAROM RENO RANGERS" title="RENOVEREN ZONDER STRESS" light />
          <div className="wg" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { n: "01", t: "EEN AANSPREEKPUNT", d: "Geen gedoe met meerdere aannemers. Eén contactpersoon voor al uw werken." },
              { n: "02", t: "VASTE PRIJS", d: "Wat we afspreken, betaalt u. Geen verborgen kosten of verrassingen." },
              { n: "03", t: "DUIDELIJKE PLANNING", d: "Transparante communicatie en heldere tijdslijn van begin tot eind." },
              { n: "04", t: "VAKMANSCHAP", d: "Ervaren vakmensen die het goed doen vanaf de eerste keer." },
              { n: "05", t: "LOKAAL ANTWERPEN", d: "Uw buren kennen ons. Snel ter plaatse, altijd bereikbaar." },
              { n: "06", t: "5.0 GOOGLE REVIEWS", d: "Onze klanten bevelen ons aan. Bekijk de reviews." },
            ].map(function (reason, i) {
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <div style={{ padding: "32px 24px", border: "1px solid rgba(255,255,255,0.07)", height: "100%" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: C.red, lineHeight: 1 }}>{reason.n}</span>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: C.white, letterSpacing: 2, margin: "14px 0 8px" }}>{reason.t}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>{reason.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WERKWIJZE */}
      <section style={{ padding: "110px 0", background: C.off }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <STitle label="HOE WIJ WERKEN" title={"5 STAPPEN NAAR EEN\nZORGELOZE RENOVATIE"} />
          <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
            {[
              { n: "01", t: "KENNISMAKING", d: "Gratis advies over uw plannen en budget." },
              { n: "02", t: "OPMETING", d: "Opmeting ter plaatse en duidelijke offerte." },
              { n: "03", t: "PLANNING", d: "Gedetailleerde planning en materiaalbestelling." },
              { n: "04", t: "UITVOERING", d: "Werken proper, veilig en met oog voor detail." },
              { n: "05", t: "OPLEVERING", d: "Pas als u 100% tevreden bent, ronden we af." },
            ].map(function (step, i) {
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{ padding: "28px 20px", borderLeft: i > 0 ? "1px solid " + C.ltGray : "none", height: "100%" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 50, color: C.red, lineHeight: 1, display: "block" }}>{step.n}</span>
                    <div style={{ width: 26, height: 2, background: C.black, margin: "14px 0" }} />
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, color: C.black, margin: "0 0 8px" }}>{step.t}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, lineHeight: 1.6, color: C.gray, margin: 0 }}>{step.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "110px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <STitle label="REVIEWS" title="WAT ONZE KLANTEN ZEGGEN" />
          <div className="rg" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { n: "Maja Buyle", t: "Totale renovatie van een appartement. Zeer goede opvolging, veel overleg, bereid om mee te denken en oplossingen voor te stellen. Heel tevreden!" },
              { n: "Eva Putteman", t: "Zeer tevreden met onze badkamerrenovatie. Snelle service en correcte prijs. Bij vragen konden we steeds iemand bereiken." },
              { n: "Dennis V.", t: "Goed en kwalitatief werk voor democratische prijzen! Renovatie van slaapkamers en badkamer. Snel, flexibel en correct." },
              { n: "Frederik De Boeck", t: "Zeer correcte aannemer, gemotiveerd en vriendelijk. Werkt heel netjes en tot in detail afgewerkt." },
              { n: "Bart Pelczarski", t: "Professioneel, stipt en perfect afgewerkt. Absolute aanrader voor renovatie- of bouwwerken." },
              { n: "Mohamed El Mahsini", t: "Top bedrijf, komt afspraken na, werkt steeds professioneel en ruimt alle rommel op na oplevering." },
            ].map(function (review, i) {
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{ padding: "28px 24px", border: "1px solid " + C.ltGray, height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                      {[1, 2, 3, 4, 5].map(function (star) {
                        return <span key={star} style={{ color: C.red, fontSize: 14 }}>{"\u2605"}</span>;
                      })}
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7, color: C.char, fontStyle: "italic", margin: "0 0 18px", flex: 1 }}>
                      {'"' + review.t + '"'}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: C.white }}>
                        {review.n.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: C.black }}>{review.n}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.gray, letterSpacing: 1 }}>GOOGLE REVIEW</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "90px 0", background: C.red, textAlign: "center" }}>
        <div style={{ maxWidth: 750, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(38px, 5vw, 60px)", color: C.white, lineHeight: 0.93, margin: "0 0 18px" }}>
              KLAAR OM TE STARTEN?
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.8)", margin: "0 0 32px", lineHeight: 1.7 }}>
              Vraag een gratis en vrijblijvend adviesgesprek aan.
            </p>
            <button
              onClick={function () { go("contact"); }}
              style={{ background: C.white, color: C.black, border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, padding: "16px 44px", transition: "all 0.2s" }}
            >
              {"NEEM CONTACT OP \u2192"}
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════
   DIENSTEN PAGE
   ══════════════════════════════════ */
function Diensten({ setPage }) {
  var go = function (id) { setPage(id); window.scrollTo(0, 0); };

  var services = [
    {
      t: "BADKAMERRENOVATIE",
      img: IMG.bath1,
      img2: IMG.bath2,
      intro: "Een badkamerrenovatie is een van de meest waardevolle investeringen in uw woning. Bij Reno Rangers zorgen wij voor een complete badkamerrenovatie in Antwerpen.",
      items: ["Volledige afbraak en afvoer", "Waterdichte membraan en isolatie", "Sanitaire installaties", "Tegelwerken vloer en muur", "Meubelen en verlichting", "Ventilatie en afwerking"],
      seo: "Bent u op zoek naar een betrouwbare aannemer voor uw badkamerrenovatie in Antwerpen? Reno Rangers realiseert moderne, functionele badkamers die jarenlang meegaan. Wij werken uitsluitend met duurzame materialen en bieden waterdichte afwerking met garantie.",
    },
    {
      t: "TOTAALRENOVATIE",
      img: IMG.living1,
      img2: IMG.kitchen1,
      intro: "Een totaalrenovatie vraagt om coordinatie, vakmanschap en een duidelijk plan. Reno Rangers is uw totaalrenovatie aannemer in Antwerpen.",
      items: ["Ontwerp en planning", "Afbraak en structurele werken", "Elektriciteit en loodgieterij", "Ramen en deuren", "Vloeren, muren en plafonds", "Keuken- en badkamerinrichting"],
      seo: "Als renovatie aannemer in Antwerpen begrijpen wij dat een totaalrenovatie een grote stap is. Daarom bieden wij een zorgeloos traject met een vast aanspreekpunt, een gedetailleerde offerte zonder verborgen kosten, en een duidelijke planning.",
    },
    {
      t: "BINNENAFWERKING",
      img: IMG.interior1,
      img2: IMG.floor1,
      intro: "De binnenafwerking bepaalt hoe uw woning aanvoelt. Reno Rangers verzorgt hoogwaardige binnenafwerking in Antwerpen.",
      items: ["Schilderwerken interieur", "Pleisterwerken en gyproc", "Vloeren en tegelwerk", "Plafondafwerking", "Decoratieve technieken", "Houtwerk en schrijnwerkerij"],
      seo: "Wilt u uw interieur strak, modern en professioneel afgewerkt hebben? Onze binnenafwerking dienst in Antwerpen omvat alles: van gladde muren en geschilderde plafonds tot perfect gelegde vloeren en tegels.",
    },
  ];

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ background: C.black, padding: "76px 0 56px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>ONZE DIENSTEN</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(46px, 6vw, 84px)", color: C.white, lineHeight: 0.9, margin: "10px 0 18px" }}>
              WAT WIJ <span style={{ color: C.red }}>DOEN</span>
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7 }}>
              Van badkamerrenovatie tot totaalrenovatie — alle renovatiediensten onder een dak.
            </p>
          </Reveal>
        </div>
      </div>
      <Marquee items={["BADKAMERRENOVATIE", "TOTAALRENOVATIE", "BINNENAFWERKING", "SCHILDERWERKEN", "VLOEREN", "TEGELWERK"]} />

      {services.map(function (s, idx) {
        return (
          <div key={idx} style={{ padding: "90px 0", background: idx % 2 === 0 ? C.white : C.off }}>
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
              <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
                <Reveal style={{ order: idx % 2 === 0 ? 0 : 1 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>{"0" + (idx + 1)}</span>
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(34px, 4vw, 56px)", color: C.black, lineHeight: 0.93, margin: "6px 0 18px" }}>{s.t}</h2>
                  <div style={{ width: 44, height: 3, background: C.red, marginBottom: 20 }} />
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 20px" }}>{s.intro}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", marginBottom: 24 }}>
                    {s.items.map(function (item) {
                      return (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                          <div style={{ width: 7, height: 7, background: C.red, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.char }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.75, color: C.gray, margin: "0 0 28px" }}>{s.seo}</p>
                  <Btn label="GRATIS OFFERTE" onClick={function () { go("contact"); }} />
                </Reveal>
                <Reveal delay={0.12} style={{ order: idx % 2 === 0 ? 1 : 0 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ overflow: "hidden", aspectRatio: "3/4", background: C.dark }}>
                      <img src={s.img} alt={s.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ overflow: "hidden", aspectRatio: "3/4", background: C.dark, marginTop: 36 }}>
                      <img src={s.img2} alt={s.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ══════════════════════════════════
   OVER ONS PAGE
   ══════════════════════════════════ */
function Over({ setPage }) {
  var go = function (id) { setPage(id); window.scrollTo(0, 0); };
  var areas = ["Antwerpen (alle districten)", "Mortsel", "Hove", "Edegem", "Borsbeek", "Boechout", "Kontich", "Lint", "Aartselaar", "Wommelgem", "Wijnegem", "Schoten", "Deurne", "Wilrijk", "Hoboken", "Kapellen", "Brasschaat", "Ekeren"];

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ background: C.black, padding: "76px 0 56px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>OVER ONS</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(46px, 6vw, 84px)", color: C.white, lineHeight: 0.9, margin: "10px 0" }}>
              WIE ZIJN <span style={{ color: C.red }}>WIJ?</span>
            </h1>
          </Reveal>
        </div>
      </div>
      <Marquee items={["BETROUWBAAR", "PROFESSIONEEL", "TRANSPARANT", "LOKAAL", "VAKMANSCHAP", "KWALITEIT"]} reverse />
      <div style={{ padding: "90px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <Reveal>
              <div style={{ overflow: "hidden", aspectRatio: "4/5", background: C.dark }}>
                <img src={IMG.team2} alt="Reno Rangers Team" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(34px, 4vw, 52px)", color: C.black, lineHeight: 0.93, margin: "0 0 18px" }}>
                EEN RENOVATIEBEDRIJF DAT KLANTEN <span style={{ color: C.red }}>VERTROUWEN</span>
              </h2>
              <div style={{ width: 44, height: 3, background: C.red, marginBottom: 20 }} />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>
                We begrijpen hoe stressvol een renovatie kan zijn: van het kiezen van de juiste aannemer tot beslissingen over materialen, planning en budget. Daarom nemen wij alles uit handen.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>
                Of u nu een huiseigenaar bent die zijn eerste woning verbouwt, een gezin dat meer comfort zoekt, of een investeerder die efficiëntie verwacht — wij zorgen voor een zorgeloze aanpak van A tot Z.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 28px" }}>
                Wat ons onderscheidt? We doen het goed vanaf de eerste keer. Geen fouten, geen herstellingen, geen verrassingen.
              </p>
              <Btn label="NEEM CONTACT OP" onClick={function () { go("contact"); }} />
            </Reveal>
          </div>
        </div>
      </div>
      <div style={{ padding: "72px 0", background: C.black }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <STitle label="WERKGEBIED" title="ACTIEF IN HEEL ANTWERPEN" light />
          <Reveal delay={0.15}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {areas.map(function (area) {
                return (
                  <span key={area} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.white, padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)" }}>
                    {area}
                  </span>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   PROJECTEN PAGE
   ══════════════════════════════════ */
function Projecten() {
  var projects = [
    { t: "KEUKENRENOVATIE", loc: "Antwerpen-Zuid", img: IMG.kitchen1, c: "Totaalrenovatie" },
    { t: "BADKAMERRENOVATIE", loc: "Mortsel", img: IMG.bath1, c: "Badkamerrenovatie" },
    { t: "APPARTEMENT RENOVATIE", loc: "Deurne", img: IMG.proj1, c: "Totaalrenovatie" },
    { t: "SLAAPKAMER AFWERKING", loc: "Edegem", img: IMG.interior1, c: "Binnenafwerking" },
    { t: "WOONKAMER RENOVATIE", loc: "Wilrijk", img: IMG.living1, c: "Totaalrenovatie" },
    { t: "VLOER & TEGELWERK", loc: "Kontich", img: IMG.floor1, c: "Binnenafwerking" },
  ];

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ background: C.black, padding: "76px 0 56px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>PORTFOLIO</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(46px, 6vw, 84px)", color: C.white, lineHeight: 0.9, margin: "10px 0 18px" }}>
              ONZE <span style={{ color: C.red }}>PROJECTEN</span>
            </h1>
          </Reveal>
        </div>
      </div>
      <Marquee items={["VOOR & NA", "KWALITEITSWERK", "VAKMANSCHAP", "TEVREDEN KLANTEN"]} />
      <div style={{ padding: "72px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {projects.map(function (p, i) {
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <div style={{ background: C.off, overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ overflow: "hidden", aspectRatio: "16/10", background: C.dark }}>
                      <img src={p.img} alt={p.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "22px 24px" }}>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: 3, color: C.red }}>{p.c}</span>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: C.black, margin: "4px 0 3px", letterSpacing: 0.5 }}>{p.t}</h3>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.gray }}>{p.loc}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   BLOG PAGE
   ══════════════════════════════════ */
function Blog() {
  var posts = [
    { t: "WAT KOST EEN BADKAMERRENOVATIE IN ANTWERPEN IN 2026?", img: IMG.bath1, d: "15 MAART 2026", c: "BADKAMER", ex: "Een badkamerrenovatie in Antwerpen kost gemiddeld tussen 5.000 en 15.000 euro, afhankelijk van grootte, materialen en complexiteit." },
    { t: "TOTAALRENOVATIE: ALLES WAT U MOET WETEN", img: IMG.living1, d: "8 MAART 2026", c: "RENOVATIE", ex: "Een totaalrenovatie is een grote investering die uw woningwaarde aanzienlijk kan verhogen. Van vergunningen tot het kiezen van de juiste aannemer." },
    { t: "5 TRENDS IN BINNENAFWERKING VOOR BELGISCHE WONINGEN", img: IMG.interior1, d: "1 MAART 2026", c: "INTERIEUR", ex: "Van warme aardetinten tot minimalistische afwerking — de trends in binnenafwerking evolueren snel." },
    { t: "HOE KIEST U DE JUISTE RENOVATIE AANNEMER?", img: IMG.team2, d: "22 FEB 2026", c: "TIPS", ex: "Het kiezen van een betrouwbare aannemer is de belangrijkste beslissing bij elke renovatie." },
  ];

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ background: C.black, padding: "76px 0 56px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>BLOG</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(46px, 6vw, 84px)", color: C.white, lineHeight: 0.9, margin: "10px 0 18px" }}>
              RENOVATIE <span style={{ color: C.red }}>TIPS</span>
            </h1>
          </Reveal>
        </div>
      </div>
      <div style={{ padding: "72px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {posts.map(function (post, i) {
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bg" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 36, alignItems: "center", borderBottom: "1px solid " + C.ltGray, paddingBottom: 40, cursor: "pointer" }}>
                    <div style={{ overflow: "hidden", aspectRatio: "16/10", background: C.dark }}>
                      <img src={post.img} alt={post.t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: 3, color: C.red }}>{post.c}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.gray }}>{post.d}</span>
                      </div>
                      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: C.black, lineHeight: 1.05, margin: "0 0 14px" }}>{post.t}</h2>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7, color: C.gray, margin: 0 }}>{post.ex}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   CONTACT PAGE
   ══════════════════════════════════ */
function Contact() {
  var _form = useState({ name: "", email: "", phone: "", service: "", msg: "" });
  var form = _form[0];
  var setForm = _form[1];
  var _sent = useState(false);
  var sent = _sent[0];
  var setSent = _sent[1];

  var inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1px solid " + C.ltGray,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: C.black,
    outline: "none",
    background: C.white,
    boxSizing: "border-box",
  };

  return (
    <section style={{ paddingTop: 72 }}>
      <div style={{ background: C.black, padding: "76px 0 56px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>CONTACT</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(46px, 6vw, 84px)", color: C.white, lineHeight: 0.9, margin: "10px 0" }}>
              NEEM <span style={{ color: C.red }}>CONTACT</span> OP
            </h1>
          </Reveal>
        </div>
      </div>
      <div style={{ padding: "72px 0", background: C.white }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56 }}>
            <Reveal>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: C.black, margin: "0 0 20px" }}>CONTACTGEGEVENS</h2>
              <div style={{ width: 44, height: 3, background: C.red, marginBottom: 28 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
                <a href="tel:+32465883919" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: C.red }}>T</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: C.gray }}>TELEFOON</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: C.black }}>+32 465 88 39 19</div>
                  </div>
                </a>
                <a href="mailto:info@renorangers.be" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: C.red }}>E</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: C.gray }}>E-MAIL</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: C.black }}>info@renorangers.be</div>
                  </div>
                </a>
                <a href="https://wa.me/32465883919" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: C.red }}>W</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: C.gray }}>WHATSAPP</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: C.black }}>Stuur een bericht</div>
                  </div>
                </a>
              </div>
              <div style={{ padding: 22, background: C.off, border: "1px solid " + C.ltGray }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, color: C.black, margin: "0 0 10px" }}>OPENINGSUREN</h3>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.gray, lineHeight: 1.8 }}>
                  {"Maandag \u2014 Vrijdag: 07:00 \u2014 17:30"}<br />
                  {"Zaterdag: 08:30 \u2014 16:00"}<br />
                  Zondag: Gesloten
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div style={{ padding: 36, background: C.off, border: "1px solid " + C.ltGray }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "44px 0" }}>
                    <div style={{ width: 52, height: 52, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                      <span style={{ color: C.white, fontSize: 26 }}>{"\u2713"}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: C.black }}>BERICHT VERZONDEN</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.gray, marginTop: 6 }}>We nemen zo snel mogelijk contact met u op.</p>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: C.black, margin: "0 0 4px" }}>GRATIS OFFERTE AANVRAGEN</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.gray, margin: "0 0 24px" }}>Vul het formulier in — we contacteren u binnen 24 uur.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input style={inputStyle} placeholder="Uw naam *" value={form.name} onChange={function (e) { setForm(Object.assign({}, form, { name: e.target.value })); }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <input style={inputStyle} placeholder="E-mailadres *" type="email" value={form.email} onChange={function (e) { setForm(Object.assign({}, form, { email: e.target.value })); }} />
                        <input style={inputStyle} placeholder="Telefoonnummer" type="tel" value={form.phone} onChange={function (e) { setForm(Object.assign({}, form, { phone: e.target.value })); }} />
                      </div>
                      <select style={Object.assign({}, inputStyle, { color: form.service ? C.black : C.gray })} value={form.service} onChange={function (e) { setForm(Object.assign({}, form, { service: e.target.value })); }}>
                        <option value="">Selecteer dienst</option>
                        <option>Badkamerrenovatie</option>
                        <option>Totaalrenovatie</option>
                        <option>Binnenafwerking</option>
                        <option>Andere</option>
                      </select>
                      <textarea style={Object.assign({}, inputStyle, { minHeight: 110, resize: "vertical" })} placeholder="Beschrijf uw renovatieproject..." value={form.msg} onChange={function (e) { setForm(Object.assign({}, form, { msg: e.target.value })); }} />
                      <button
                        onClick={function () { setSent(true); }}
                        style={{ width: "100%", padding: 15, background: C.red, color: C.white, border: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, cursor: "pointer" }}
                      >
                        VERSTUUR AANVRAAG
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   FOOTER
   ══════════════════════════════════ */
function Foot({ setPage }) {
  var go = function (id) { setPage(id); window.scrollTo(0, 0); };
  var pageLinks = [
    { l: "Home", id: "home" },
    { l: "Diensten", id: "diensten" },
    { l: "Over ons", id: "over" },
    { l: "Projecten", id: "projecten" },
    { l: "Blog", id: "blog" },
    { l: "Contact", id: "contact" },
  ];
  var serviceLinks = ["Totaalrenovatie", "Badkamerrenovatie", "Binnenafwerking", "Schilderwerken", "Vloeren & tegels"];

  return (
    <footer style={{ background: C.black, borderTop: "3px solid " + C.red }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 28px" }}>
        <div className="fg" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <Logo light size={0.85} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.35)", marginTop: 18, maxWidth: 260 }}>
              Renovatiebedrijf in Antwerpen. Vaste prijs, geen verrassingen.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>{"PAGINA'S"}</h4>
            {pageLinks.map(function (link) {
              return (
                <button key={link.id} onClick={function () { go(link.id); }} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                  {link.l}
                </button>
              );
            })}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>DIENSTEN</h4>
            {serviceLinks.map(function (link) {
              return (
                <button key={link} onClick={function () { go("diensten"); }} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                  {link}
                </button>
              );
            })}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>CONTACT</h4>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.9 }}>
              <a href="tel:+32465883919" style={{ color: "inherit", textDecoration: "none", display: "block" }}>+32 465 88 39 19</a>
              <a href="mailto:info@renorangers.be" style={{ color: "inherit", textDecoration: "none", display: "block" }}>info@renorangers.be</a>
              <span style={{ display: "block" }}>{"Antwerpen, Belgi\u00EB"}</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{"© 2026 Reno Rangers BV. Alle rechten voorbehouden."}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Privacybeleid</span>
        </div>
      </div>
    </footer>
  );
}

/* ── FLOATING BUTTONS ── */
function FloatBtns() {
  var _state = useState(false);
  var show = _state[0];
  var setShow = _state[1];

  useEffect(function () {
    var handler = function () { setShow(window.scrollY > 400); };
    window.addEventListener("scroll", handler);
    return function () { window.removeEventListener("scroll", handler); };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 9998, display: "flex", flexDirection: "column", gap: 10, opacity: show ? 1 : 0, transform: show ? "none" : "translateY(16px)", transition: "all 0.35s", pointerEvents: show ? "auto" : "none" }}>
      <a href="https://wa.me/32465883919" target="_blank" rel="noopener noreferrer" style={{ width: 50, height: 50, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,211,102,0.35)", textDecoration: "none" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.636-1.467A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.183-.588-5.927-1.606l-.424-.252-2.75.87.884-2.684-.277-.44A9.77 9.77 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z" /></svg>
      </a>
      <a href="tel:+32465883919" style={{ width: 50, height: 50, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(230,51,41,0.35)", textDecoration: "none" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
      </a>
    </div>
  );
}

/* ══════════════════════════════════
   APP ROOT
   ══════════════════════════════════ */
export default function App() {
  var _page = useState("home");
  var page = _page[0];
  var setPage = _page[1];

  var pages = {
    home: <Home setPage={setPage} />,
    diensten: <Diensten setPage={setPage} />,
    over: <Over setPage={setPage} />,
    projecten: <Projecten setPage={setPage} />,
    blog: <Blog setPage={setPage} />,
    contact: <Contact />,
  };

  return (
    <div style={{ background: C.white, minHeight: "100vh" }}>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Foot setPage={setPage} />
      <FloatBtns />
    </div>
  );
}
