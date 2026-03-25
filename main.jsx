import { useState, useEffect, useRef } from "react";

const C = { red: "#E63329", redDk: "#C42B22", black: "#0A0A0A", dark: "#141414", char: "#2A2A2A", gray: "#777", ltGray: "#E0E0E0", off: "#F5F5F5", white: "#FFF" };
const IMG = {
  bath1: "https://picsum.photos/seed/bath1/800/600",
  bath2: "https://picsum.photos/seed/bath2/800/600",
  kitchen1: "https://picsum.photos/seed/kitchen1/800/600",
  living1: "https://picsum.photos/seed/living1/800/600",
  living2: "https://picsum.photos/seed/living2/800/600",
  interior1: "https://picsum.photos/seed/interior1/800/600",
  floor1: "https://picsum.photos/seed/floor1/800/600",
  team1: "https://picsum.photos/seed/team1/800/600",
  team2: "https://picsum.photos/seed/team2/800/600",
  proj1: "https://picsum.photos/seed/proj1/800/600",
  proj2: "https://picsum.photos/seed/proj2/800/600",
  hero: "https://picsum.photos/seed/heromain/1400/900",
};

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
  const links = [{ id: "home", l: "HOME" }, { id: "diensten", l: "DIENSTEN" }, { id: "over", l: "OVER ONS" }, { id: "projecten", l: "PROJECTEN" }, { id: "blog", l: "BLOG" }, { id: "contact", l: "CONTACT" }];
  const go = id => { setPage(id); setMo(false); window.scrollTo(0, 0); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: sc ? "rgba(10,10,10,.97)" : "rgba(10,10,10,.88)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "all .3s" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 70 }}>
        <div style={{ cursor: "pointer" }} onClick={() => go("home")}><Logo light s={.75} /></div>
        <div className="dn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {links.map(l => <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 13px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, color: page === l.id ? C.red : "rgba(255,255,255,.6)", transition: "color .2s" }} onMouseEnter={e => { if (page !== l.id) e.target.style.color = C.white; }} onMouseLeave={e => { if (page !== l.id) e.target.style.color = "rgba(255,255,255,.6)"; }}>{l.l}</button>)}
          <button onClick={() => go("contact")} style={{ background: C.red, color: C.white, border: "none", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, padding: "10px 22px", marginLeft: 6, transition: "all .2s" }} onMouseEnter={e => { e.target.style.background = C.white; e.target.style.color = C.black; }} onMouseLeave={e => { e.target.style.background = C.red; e.target.style.color = C.white; }}>GRATIS OFFERTE</button>
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
            <Reveal><div style={{ display: "inline-block", padding: "6px 16px", border: `2px solid ${C.red}`, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red, marginBottom: 32 }}>RENOVATIEBEDRIJF ANTWERPEN</div></Reveal>
            <Reveal delay={.08}><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,6.5vw,88px)", color: C.black, lineHeight: .92, letterSpacing: 1, margin: "0 0 12px" }}>UW RENOVATIE,<br/>ONS <span style={{ color: C.red }}>VAKMANSCHAP</span></h1></Reveal>
            <Reveal delay={.12}><div style={{ width: 60, height: 3, background: C.red, margin: "24px 0 28px" }} /></Reveal>
            <Reveal delay={.18}><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.8, color: C.gray, maxWidth: 460, margin: "0 0 44px" }}>Eén aanspreekpunt voor totaalrenovatie, badkamerrenovatie en binnenafwerking in Antwerpen. Vaste prijs. Duidelijke planning. Correcte oplevering.</p></Reveal>
            <Reveal delay={.25}><div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}><Btn label="GRATIS ADVIESGESPREK" onClick={() => go("contact")} /><Btn label="ONZE PROJECTEN" onClick={() => go("projecten")} outline /></div></Reveal>
            <Reveal delay={.4}><div style={{ display: "flex", gap: 48, marginTop: 56, paddingTop: 32, borderTop: `1px solid ${C.ltGray}` }}>
              {[{ n: "200+", l: "Projecten" }, { n: "5.0", l: "Google Score" }, { n: "100%", l: "Vaste Prijs" }].map(s => <div key={s.n}><div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: C.black, lineHeight: 1 }}>{s.n}</div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.gray, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.l}</div></div>)}
            </div></Reveal>
          </div>
          <Reveal delay={.15} y={0}>
            <div className="hi" style={{ position: "relative" }}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5" }}>
                <img src={IMG.hero} alt="Renovatie Antwerpen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: -16, left: -16, background: C.red, padding: "20px 28px", zIndex: 3 }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: C.white, lineHeight: 1 }}>VASTE PRIJS</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4 }}>Geen verborgen kosten</div>
              </div>
              <div style={{ position: "absolute", top: 20, right: -10, width: 80, height: 80, border: `3px solid ${C.red}`, zIndex: 1 }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <Marquee items={["TOTAALRENOVATIE","BADKAMERRENOVATIE","BINNENAFWERKING","SCHILDERWERKEN","VLOEREN","TEGELWERK","GYPROC","PLEISTERWERK"]} />

    {/* DIENSTEN */}
    <section style={{ padding: "110px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="WAT WIJ DOEN" title="ONZE DIENSTEN" />
        <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {[
            { t: "BADKAMER\nRENOVATIE", img: IMG.bath1, d: "Complete badkamerrenovaties met duurzame materialen en waterdichte afwerking." },
            { t: "TOTAAL\nRENOVATIE", img: IMG.living1, d: "Professionele renovatie van woningen en appartementen van A tot Z." },
            { t: "BINNEN\nAFWERKING", img: IMG.interior1, d: "Schilderwerken, pleisterwerken, gyproc, vloeren en tegelwerk." },
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
        <Reveal delay={.3}><div style={{ textAlign: "center", marginTop: 44 }}><Btn label="ALLE DIENSTEN" onClick={() => go("diensten")} /></div></Reveal>
      </div>
    </section>

    {/* WAAROM */}
    <section style={{ padding: "110px 0", background: C.black }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="WAAROM RENO RANGERS" title="RENOVEREN ZONDER STRESS" light />
        <div className="wg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { n: "01", t: "EEN AANSPREEKPUNT", d: "Geen gedoe met meerdere aannemers. Eén contactpersoon voor al uw werken." },
            { n: "02", t: "VASTE PRIJS", d: "Wat we afspreken, betaalt u. Geen verborgen kosten of verrassingen." },
            { n: "03", t: "DUIDELIJKE PLANNING", d: "Transparante communicatie en heldere tijdslijn van begin tot eind." },
            { n: "04", t: "VAKMANSCHAP", d: "Ervaren vakmensen die het goed doen vanaf de eerste keer." },
            { n: "05", t: "LOKAAL ANTWERPEN", d: "Uw buren kennen ons. Snel ter plaatse, altijd bereikbaar." },
            { n: "06", t: "5.0 GOOGLE REVIEWS", d: "Onze klanten bevelen ons aan. Bekijk de reviews." },
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

    {/* WERKWIJZE */}
    <section style={{ padding: "110px 0", background: C.off }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="HOE WIJ WERKEN" title={"5 STAPPEN NAAR EEN\nZORGELOZE RENOVATIE"} />
        <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0 }}>
          {[
            { n: "01", t: "KENNIS\u00ADMAKING", d: "Gratis advies over uw plannen en budget." },
            { n: "02", t: "OPMETING", d: "Opmeting ter plaatse en duidelijke offerte." },
            { n: "03", t: "PLANNING", d: "Gedetailleerde planning en materiaalbestelling." },
            { n: "04", t: "UITVOERING", d: "Werken proper, veilig en met oog voor detail." },
            { n: "05", t: "OPLEVERING", d: "Pas als u 100% tevreden bent, ronden we af." },
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
        <STitle label="REVIEWS" title="WAT ONZE KLANTEN ZEGGEN" />
        <div className="rg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { n: "Maja Buyle", t: "Totale renovatie van een appartement. Zeer goede opvolging, veel overleg, bereid om mee te denken en oplossingen voor te stellen. Heel tevreden!" },
            { n: "Eva Putteman", t: "Zeer tevreden met onze badkamerrenovatie. Snelle service en correcte prijs. Bij vragen konden we steeds iemand bereiken." },
            { n: "Dennis V.", t: "Goed en kwalitatief werk voor democratische prijzen! Renovatie van slaapkamers en badkamer. Snel, flexibel en correct." },
            { n: "Frederik De Boeck", t: "Zeer correcte aannemer, gemotiveerd en vriendelijk. Werkt heel netjes en tot in detail afgewerkt." },
            { n: "Bart Pelczarski", t: "Professioneel, stipt en perfect afgewerkt. Absolute aanrader voor renovatie- of bouwwerken." },
            { n: "Mohamed El Mahsini", t: "Top bedrijf, komt afspraken na, werkt steeds professioneel en ruimt alle rommel op na oplevering." },
          ].map((r, i) => (
            <Reveal key={i} delay={i * .06}><div style={{ padding: "28px 24px", border: `1px solid ${C.ltGray}`, height: "100%", display: "flex", flexDirection: "column", transition: "border-color .25s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.ltGray}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>{Array(5).fill(0).map((_, j) => <span key={j} style={{ color: C.red, fontSize: 14 }}>&#9733;</span>)}</div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: C.char, fontStyle: "italic", margin: "0 0 18px", flex: 1 }}>"{r.t}"</p>
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
        <Reveal><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(38px,5vw,60px)", color: C.white, lineHeight: .93, margin: "0 0 18px" }}>KLAAR OM TE STARTEN?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.8)", margin: "0 0 32px", lineHeight: 1.7 }}>Vraag een gratis en vrijblijvend adviesgesprek aan.</p>
        <button onClick={() => go("contact")} style={{ background: C.white, color: C.black, border: "none", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 3, padding: "16px 44px", transition: "all .2s" }}
          onMouseEnter={e => { e.target.style.background = C.black; e.target.style.color = C.white; }}
          onMouseLeave={e => { e.target.style.background = C.white; e.target.style.color = C.black; }}>NEEM CONTACT OP &rarr;</button></Reveal>
      </div>
    </section>
  </>;
}

/* ═══ DIENSTEN ═══ */
function Diensten({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  const sv = [
    { id: "bad", t: "BADKAMERRENOVATIE", img: IMG.bath1, img2: IMG.bath2, intro: "Een badkamerrenovatie is een van de meest waardevolle investeringen in uw woning. Bij Reno Rangers zorgen wij voor een complete badkamerrenovatie in Antwerpen — van afbraak tot betegeling en installatie.", items: ["Volledige afbraak en afvoer", "Waterdichte membraan en isolatie", "Sanitaire installaties", "Tegelwerken vloer en muur", "Meubelen en verlichting", "Ventilatie en afwerking"], seo: "Bent u op zoek naar een betrouwbare aannemer voor uw badkamerrenovatie in Antwerpen? Reno Rangers realiseert moderne, functionele badkamers die jarenlang meegaan. Wij werken uitsluitend met duurzame materialen en bieden waterdichte afwerking met garantie. Van kleine badkamers in appartementen tot ruime master bathrooms — wij pakken elk project professioneel aan met een vaste prijs en duidelijke planning." },
    { id: "tot", t: "TOTAALRENOVATIE", img: IMG.living1, img2: IMG.kitchen1, intro: "Een totaalrenovatie vraagt om coördinatie, vakmanschap en een duidelijk plan. Reno Rangers is uw totaalrenovatie aannemer in Antwerpen — wij beheren het volledige renovatieproces van A tot Z.", items: ["Ontwerp en planning", "Afbraak en structurele werken", "Elektriciteit en loodgieterij", "Ramen en deuren", "Vloeren, muren en plafonds", "Keuken- en badkamerinrichting"], seo: "Als renovatie aannemer in Antwerpen begrijpen wij dat een totaalrenovatie een grote stap is. Daarom bieden wij een zorgeloos traject met één vast aanspreekpunt, een gedetailleerde offerte zonder verborgen kosten, en een duidelijke planning. Of u nu een woning, appartement of investeringspand laat renoveren — Reno Rangers levert kwaliteit binnen budget en deadline." },
    { id: "bin", t: "BINNENAFWERKING", img: IMG.interior1, img2: IMG.floor1, intro: "De binnenafwerking bepaalt hoe uw woning aanvoelt. Reno Rangers verzorgt hoogwaardige binnenafwerking in Antwerpen — van schilderwerken en pleisterwerk tot vloeren en tegelwerk.", items: ["Schilderwerken interieur", "Pleisterwerken en gyproc", "Vloeren en tegelwerk", "Plafondafwerking", "Decoratieve technieken", "Houtwerk en schrijnwerkerij"], seo: "Wilt u uw interieur strak, modern en professioneel afgewerkt hebben? Onze binnenafwerking dienst in Antwerpen omvat alles: van gladde muren en geschilderde plafonds tot perfect gelegde vloeren en tegels. Wij werken met oog voor detail en gebruiken duurzame materialen. Ideaal voor zowel nieuwbouw als renovatieprojecten." },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>ONZE DIENSTEN</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>WAT WIJ <span style={{ color: C.red }}>DOEN</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>Van badkamerrenovatie tot totaalrenovatie — alle renovatiediensten onder één dak.</p></Reveal></div></div>
    <Marquee items={["BADKAMERRENOVATIE","TOTAALRENOVATIE","BINNENAFWERKING","SCHILDERWERKEN","VLOEREN","TEGELWERK"]} />
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
              <Btn label="GRATIS OFFERTE" onClick={() => go("contact")} />
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

/* ═══ OVER ═══ */
function Over({ setPage }) {
  const go = id => { setPage(id); window.scrollTo(0, 0); };
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>OVER ONS</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0" }}>WIE ZIJN <span style={{ color: C.red }}>WIJ?</span></h1></Reveal></div></div>
    <Marquee items={["BETROUWBAAR","PROFESSIONEEL","TRANSPARANT","LOKAAL","VAKMANSCHAP","KWALITEIT"]} reverse />
    <div style={{ padding: "90px 0", background: C.white }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <Reveal><div style={{ overflow: "hidden", aspectRatio: "4/5" }}><img src={IMG.team2} alt="Team" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></Reveal>
          <Reveal delay={.12}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(34px,4vw,52px)", color: C.black, lineHeight: .93, margin: "0 0 18px" }}>EEN RENOVATIEBEDRIJF DAT KLANTEN <span style={{ color: C.red }}>VERTROUWEN</span></h2>
            <div style={{ width: 44, height: 3, background: C.red, marginBottom: 20 }} />
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>We begrijpen hoe stressvol een renovatie kan zijn: van het kiezen van de juiste aannemer tot beslissingen over materialen, planning en budget. Daarom nemen wij alles uit handen.</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 16px" }}>Of je nu een huiseigenaar bent die zijn eerste woning verbouwt, een gezin dat meer comfort zoekt, of een investeerder die efficiëntie verwacht — wij zorgen voor een zorgeloze aanpak van A tot Z.</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.gray, margin: "0 0 28px" }}>Wat ons onderscheidt? We doen het goed vanaf de eerste keer. Geen fouten, geen herstellingen, geen verrassingen. Professioneel, transparant en betrouwbaar.</p>
            <Btn label="NEEM CONTACT OP" onClick={() => go("contact")} />
          </Reveal>
        </div>
      </div>
    </div>
    <div style={{ padding: "72px 0", background: C.black }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <STitle label="WERKGEBIED" title="ACTIEF IN HEEL ANTWERPEN" light />
        <Reveal delay={.15}><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Antwerpen (alle districten)","Mortsel","Hove","Edegem","Borsbeek","Boechout","Kontich","Lint","Aartselaar","Wommelgem","Wijnegem","Schoten","Deurne","Wilrijk","Hoboken","Kapellen","Brasschaat","Ekeren"].map(a => (
            <span key={a} style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.white, padding: "9px 18px", border: "1px solid rgba(255,255,255,.12)", transition: "all .2s", cursor: "default" }}
              onMouseEnter={e => { e.target.style.borderColor = C.red; e.target.style.background = "rgba(230,51,41,.08)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,.12)"; e.target.style.background = "transparent"; }}>{a}</span>
          ))}
        </div></Reveal>
      </div>
    </div>
  </section>;
}

/* ═══ PROJECTEN ═══ */
function Projecten({ setPage }) {
  const pj = [
    { t: "KEUKENRENOVATIE", loc: "Antwerpen-Zuid", img: IMG.kitchen1, c: "Totaalrenovatie" },
    { t: "BADKAMERRENOVATIE", loc: "Mortsel", img: IMG.bath1, c: "Badkamerrenovatie" },
    { t: "APPARTEMENT RENOVATIE", loc: "Deurne", img: IMG.proj1, c: "Totaalrenovatie" },
    { t: "SLAAPKAMER AFWERKING", loc: "Edegem", img: IMG.interior1, c: "Binnenafwerking" },
    { t: "WOONKAMER RENOVATIE", loc: "Wilrijk", img: IMG.living1, c: "Totaalrenovatie" },
    { t: "VLOER & TEGELWERK", loc: "Kontich", img: IMG.floor1, c: "Binnenafwerking" },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>PORTFOLIO</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>ONZE <span style={{ color: C.red }}>PROJECTEN</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>Bekijk ons recente werk. Elke renovatie wordt vakkundig uitgevoerd met oog voor detail.</p></Reveal></div></div>
    <Marquee items={["VOOR & NA","KWALITEITSWERK","VAKMANSCHAP","TEVREDEN KLANTEN"]} />
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
    { t: "WAT KOST EEN BADKAMERRENOVATIE IN ANTWERPEN IN 2026?", img: IMG.bath1, d: "15 MAART 2026", c: "BADKAMER", ex: "Een badkamerrenovatie in Antwerpen kost gemiddeld tussen €5.000 en €15.000, afhankelijk van grootte, materialen en complexiteit. Wij bespreken de belangrijkste kostenfactoren en hoe u kunt besparen zonder in te boeten op kwaliteit." },
    { t: "TOTAALRENOVATIE: ALLES WAT U MOET WETEN", img: IMG.living1, d: "8 MAART 2026", c: "RENOVATIE", ex: "Een totaalrenovatie is een grote investering die uw woningwaarde aanzienlijk kan verhogen. Van vergunningen tot het kiezen van de juiste aannemer — wij begeleiden u door het volledige proces." },
    { t: "5 TRENDS IN BINNENAFWERKING VOOR BELGISCHE WONINGEN", img: IMG.interior1, d: "1 MAART 2026", c: "INTERIEUR", ex: "Van warme aardetinten tot minimalistische afwerking — de trends in binnenafwerking evolueren snel. Ontdek welke stijlen het populairst zijn in Belgische woningen." },
    { t: "HOE KIEST U DE JUISTE RENOVATIE AANNEMER?", img: IMG.team2, d: "22 FEB 2026", c: "TIPS", ex: "Het kiezen van een betrouwbare aannemer is de belangrijkste beslissing bij elke renovatie. Wij delen onze checklist met de vragen die u moet stellen." },
  ];
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>BLOG</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0 18px" }}>RENOVATIE <span style={{ color: C.red }}>TIPS</span></h1><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,.55)", maxWidth: 520, lineHeight: 1.7 }}>Praktische tips, trends en adviezen over renovatie in Antwerpen.</p></Reveal></div></div>
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
  const inp = { width: "100%", padding: "13px 16px", border: `1px solid ${C.ltGray}`, fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.black, outline: "none", background: C.white, transition: "border-color .2s", boxSizing: "border-box" };
  return <section style={{ paddingTop: 72 }}>
    <div style={{ background: C.black, padding: "76px 0 56px" }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}><Reveal><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: C.red }}>CONTACT</span><h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(46px,6vw,84px)", color: C.white, lineHeight: .9, margin: "10px 0" }}>NEEM <span style={{ color: C.red }}>CONTACT</span> OP</h1></Reveal></div></div>
    <div style={{ padding: "72px 0", background: C.white }}><div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
      <div className="svg2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56 }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: C.black, margin: "0 0 20px" }}>CONTACTGEGEVENS</h2>
          <div style={{ width: 44, height: 3, background: C.red, marginBottom: 28 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
            {[{ l: "TELEFOON", v: "+32 465 88 39 19", h: "tel:+32465883919" }, { l: "E-MAIL", v: "info@renorangers.be", h: "mailto:info@renorangers.be" }, { l: "WHATSAPP", v: "Stuur een bericht", h: "https://wa.me/32465883919" }].map(c => (
              <a key={c.l} href={c.h} target={c.l === "WHATSAPP" ? "_blank" : undefined} rel="noopener" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: C.red }}>{c.l.charAt(0)}</span></div>
                <div><div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 2, color: C.gray }}>{c.l}</div><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, color: C.black }}>{c.v}</div></div>
              </a>))}
          </div>
          <div style={{ padding: 22, background: C.off, border: `1px solid ${C.ltGray}` }}>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2, color: C.black, margin: "0 0 10px" }}>OPENINGSUREN</h3>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.gray, lineHeight: 1.8 }}>Maandag — Vrijdag: 07:00 — 17:30<br/>Zaterdag: 08:30 — 16:00<br/>Zondag: Gesloten</div>
          </div>
        </Reveal>
        <Reveal delay={.12}>
          <div style={{ padding: 36, background: C.off, border: `1px solid ${C.ltGray}` }}>
            {sent ? <div style={{ textAlign: "center", padding: "44px 0" }}>
              <div style={{ width: 52, height: 52, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><span style={{ color: C.white, fontSize: 26 }}>&#10003;</span></div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: C.black }}>BERICHT VERZONDEN</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.gray, marginTop: 6 }}>We nemen zo snel mogelijk contact met u op.</p>
            </div> : <>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: C.black, margin: "0 0 4px" }}>GRATIS OFFERTE AANVRAGEN</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.gray, margin: "0 0 24px" }}>Vul het formulier in — we contacteren u binnen 24 uur.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input style={inp} placeholder="Uw naam *" value={f.name} onChange={e => sF({ ...f, name: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input style={inp} placeholder="E-mailadres *" type="email" value={f.email} onChange={e => sF({ ...f, email: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                  <input style={inp} placeholder="Telefoonnummer" type="tel" value={f.phone} onChange={e => sF({ ...f, phone: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                </div>
                <select style={{ ...inp, color: f.service ? C.black : C.gray, appearance: "none" }} value={f.service} onChange={e => sF({ ...f, service: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray}>
                  <option value="">Selecteer dienst</option><option>Badkamerrenovatie</option><option>Totaalrenovatie</option><option>Binnenafwerking</option><option>Andere</option>
                </select>
                <textarea style={{ ...inp, minHeight: 110, resize: "vertical" }} placeholder="Beschrijf uw renovatieproject..." value={f.msg} onChange={e => sF({ ...f, msg: e.target.value })} onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.ltGray} />
                <button onClick={() => sSent(true)} style={{ width: "100%", padding: 15, background: C.red, color: C.white, border: "none", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 3, cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.target.style.background = C.black; }} onMouseLeave={e => { e.target.style.background = C.red; }}>VERSTUUR AANVRAAG</button>
              </div>
            </>}
          </div>
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
        <div><Logo light s={.85} /><p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.35)", marginTop: 18, maxWidth: 260 }}>Renovatiebedrijf in Antwerpen. Vaste prijs, geen verrassingen.</p></div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>PAGINA'S</h4>{[{ l: "Home", id: "home" }, { l: "Diensten", id: "diensten" }, { l: "Over ons", id: "over" }, { l: "Projecten", id: "projecten" }, { l: "Blog", id: "blog" }, { l: "Contact", id: "contact" }].map(l => <button key={l.id} onClick={() => go(l.id)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.white} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{l.l}</button>)}</div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>DIENSTEN</h4>{["Totaalrenovatie","Badkamerrenovatie","Binnenafwerking","Schilderwerken","Vloeren & tegels"].map(l => <button key={l} onClick={() => go("diensten")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.white} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{l}</button>)}</div>
        <div><h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3, color: C.red, margin: "0 0 16px" }}>CONTACT</h4><div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.9 }}><a href="tel:+32465883919" style={{ color: "inherit", textDecoration: "none", display: "block" }}>+32 465 88 39 19</a><a href="mailto:info@renorangers.be" style={{ color: "inherit", textDecoration: "none", display: "block" }}>info@renorangers.be</a><span style={{ display: "block" }}>Antwerpen, België</span></div></div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,.2)" }}>© 2026 Reno Rangers BV. Alle rechten voorbehouden.</span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,.2)" }}>Privacybeleid</span>
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
  const pg = { home: <Home setPage={sP} />, diensten: <Diensten setPage={sP} />, over: <Over setPage={sP} />, projecten: <Projecten setPage={sP} />, blog: <Blog setPage={sP} />, contact: <Contact /> };
  return <div style={{ background: C.white, minHeight: "100vh" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Oswald:wght@700&display=swap');
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
