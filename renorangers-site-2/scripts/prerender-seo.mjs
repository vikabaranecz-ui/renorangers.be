import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error(`Missing Vite output: ${indexPath}`);

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const origin = 'https://www.renorangers.be';
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function stripUnverifiedSearchAction(html) {
  return html.replace(/\s*<!-- JSON-LD: WebSite \+ SearchAction -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?"potentialAction"[\s\S]*?<\/script>/i, '');
}

function stripUnverifiedBusinessFacts(html) {
  let out = html;
  out = out.replace(/\s*"address"\s*:\s*\{[\s\S]*?\}\s*,\s*"geo"\s*:\s*\{[\s\S]*?\}\s*,/i, '');
  out = out.replace(/\s*"aggregateRating"\s*:\s*\{[\s\S]*?\}\s*,/i, '');
  out = out.replace(/\s*"priceRange"\s*:\s*"[^"]*"\s*,/i, '');
  return out;
}

// Shared link sets
const mainLinks = [
  { href: '/', text: 'Home' },
  { href: '/diensten', text: 'Diensten' },
  { href: '/projecten', text: 'Projecten' },
  { href: '/over-ons', text: 'Over Ons' },
  { href: '/contact', text: 'Contact' },
  { href: '/blog', text: 'Blog' },
];

const projectLinks = [
  { href: '/projecten/badkamerrenovatie-antwerpen', text: 'Badkamerrenovatie Antwerpen' },
  { href: '/projecten/mortex-badkamer-merksem', text: 'Mortex Badkamer Merksem' },
  { href: '/projecten/mortex-badkamer-antwerpen', text: 'Mortex Badkamer Antwerpen' },
  { href: '/projecten/volledige-badkamer-antwerpen', text: 'Volledige Badkamerrenovatie Antwerpen' },
  { href: '/projecten/badkamer-paars-meubel-merksem', text: 'Badkamer Paars Meubel Merksem' },
  { href: '/projecten/keukenrenovatie-antwerpen', text: 'Keukenrenovatie Antwerpen' },
  { href: '/projecten/living-binnenafwerking-antwerpen', text: 'Living & Binnenafwerking Antwerpen' },
  { href: '/projecten/badkamerrenovatie-londerzeel', text: 'Badkamerrenovatie Londerzeel' },
];

const blogLinks = [
  { href: '/blog/wat-kost-badkamerrenovatie-antwerpen-2026', text: 'Wat kost een badkamerrenovatie in Antwerpen?' },
  { href: '/blog/totaalrenovatie-alles-wat-u-moet-weten', text: 'Totaalrenovatie: alles wat u moet weten' },
  { href: '/blog/trends-binnenafwerking-belgische-woningen-2026', text: 'Trends in binnenafwerking 2026' },
  { href: '/blog/hoe-juiste-renovatie-aannemer-kiezen', text: 'Hoe kiest u de juiste renovatie-aannemer?' },
];

const routes = [
  {
    route: '/',
    title: 'Reno Rangers | Renovatiebedrijf & Aannemer Antwerpen',
    description: 'Renovatiebedrijf en aannemer in Antwerpen voor totaalrenovatie, badkamerrenovatie & binnenafwerking. Vaste prijs, één aanspreekpunt. Gratis offerte aanvragen.',
    h1: 'Renovatiebedrijf en Aannemer in Antwerpen',
    bodyText: 'Reno Rangers is uw betrouwbare renovatiebedrijf in Antwerpen en omgeving. Wij zijn gespecialiseerd in badkamerrenovatie, totaalrenovatie en kwalitatieve binnenafwerking. Met één aanspreekpunt, een vaste prijs en een duidelijke planning bezorgen wij u een zorgeloze renovatie-ervaring. Onze vakmensen werken nauwkeurig en respecteren altijd de afgesproken deadline. Of u nu een badkamer wilt vernieuwen, een volledige woning wilt aanpakken of enkel de binnenafwerking wilt verbeteren — Reno Rangers staat voor u klaar. Vraag vandaag nog gratis een offerte aan.',
    links: [...mainLinks, ...projectLinks.slice(0, 3), ...blogLinks.slice(0, 2),
      { href: 'https://www.antwerpen.be', text: 'Stad Antwerpen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie aanvragen' },
    ],
  },
  {
    route: '/badkamerrenovatie-antwerpen',
    title: 'Badkamerrenovatie Antwerpen | Reno Rangers',
    description: 'Badkamerrenovatie in Antwerpen door Reno Rangers. Eén aanspreekpunt, vaste prijs en duidelijke planning. Vraag vandaag een gratis offerte aan voor uw nieuwe badkamer.',
    h1: 'Badkamerrenovatie in Antwerpen',
    bodyText: 'Reno Rangers verzorgt volledige badkamerrenovaties in Antwerpen en omgeving. Van de sloop van uw oude badkamer tot de oplevering van een nieuwe, strakke ruimte — wij regelen alles. U heeft één aanspreekpunt, betaalt een vaste prijs en weet vooraf precies wat de planning is. Wij plaatsen nieuwe tegels, sanitair, douches, wastafels en meubels. Onze aanpak is efficiënt, netjes en kwalitatief. Vraag gratis een offerte aan voor uw badkamerrenovatie.',
    links: [...mainLinks, ...projectLinks.slice(0, 4),
      { href: 'https://www.mijnverbouwpremie.be', text: 'Premie aanvragen' },
      { href: 'https://energiesparen.be', text: 'Energiepremies' },
    ],
  },
  {
    route: '/diensten',
    title: 'Diensten | Reno Rangers Antwerpen',
    description: 'Bekijk alle renovatiediensten van Reno Rangers in Antwerpen: badkamerrenovatie, totaalrenovatie, keukenrenovatie en binnenafwerking. Vaste prijs, één aanspreekpunt.',
    h1: 'Renovatiediensten van Reno Rangers',
    bodyText: 'Reno Rangers biedt een breed aanbod aan renovatiediensten in Antwerpen en omgeving. Onze hoofddiensten zijn badkamerrenovatie, totaalrenovatie, keukenrenovatie en binnenafwerking. Bij elke opdracht werken wij met een vaste prijs, één aanspreekpunt en een transparante planning. Wij nemen de volledige coördinatie op ons, van ontwerp tot oplevering. Onze specialiteiten zijn mortex afwerking, tegelwerk, sanitair, loodgieterij en schilderwerk. Neem contact op voor een gratis offerte.',
    links: [...mainLinks, ...projectLinks.slice(0, 3),
      { href: 'https://energiesparen.be', text: 'Energiebesparende renovatie' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie' },
    ],
  },
  {
    route: '/projecten',
    title: 'Projecten | Reno Rangers Antwerpen',
    description: 'Bekijk gerealiseerde renovatieprojecten van Reno Rangers in Antwerpen en omgeving: badkamerrenovaties, keukenrenovaties, mortex afwerkingen en totaalrenovaties.',
    h1: 'Gerealiseerde Renovatieprojecten van Reno Rangers',
    bodyText: 'Reno Rangers heeft in Antwerpen en omgeving talrijke renovatieprojecten succesvol afgerond. Bekijk onze portfolio van badkamerrenovaties, keukenrenovaties, mortex afwerkingen en binnenafwerking. Elk project toont ons vakmanschap en onze nette uitvoering. Van kleine badkamerverbouwingen in Merksem tot volledige appartementsrenovaties in Antwerpen. Laat u inspireren door onze voor-en-na foto\'s en neem contact op voor uw eigen renovatieproject.',
    links: [...mainLinks, ...projectLinks,
      { href: 'https://www.antwerpen.be', text: 'Stad Antwerpen' },
    ],
  },
  {
    route: '/contact',
    title: 'Contact | Reno Rangers Antwerpen',
    description: 'Neem contact op met Reno Rangers voor een gratis offerte of advies over uw renovatieproject in Antwerpen. Wij reageren binnen 24 uur op uw aanvraag.',
    h1: 'Neem Contact op met Reno Rangers',
    bodyText: 'Heeft u een renovatieproject gepland in Antwerpen of omgeving? Neem contact op met Reno Rangers voor een gratis en vrijblijvende offerte. Wij zijn bereikbaar via ons contactformulier, per telefoon of e-mail. Onze adviseurs luisteren naar uw wensen en bezorgen u een duidelijke offerte op maat. Wij reageren altijd binnen 24 uur. Reno Rangers werkt in Antwerpen, Merksem, Berchem, Wilrijk, Borgerhout, Londerzeel en omgeving.',
    links: [...mainLinks,
      { href: 'https://www.antwerpen.be', text: 'Stad Antwerpen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie aanvragen' },
    ],
  },
  {
    route: '/over-ons',
    title: 'Over Ons | Reno Rangers Renovatiebedrijf Antwerpen',
    description: 'Leer Reno Rangers kennen: ervaren renovatieaannemer in Antwerpen met focus op vakmanschap, eerlijkheid en klanttevredenheid. Eén aanspreekpunt voor uw hele renovatie.',
    h1: 'Over Reno Rangers — Uw Renovatieaannemer in Antwerpen',
    bodyText: 'Reno Rangers is een gedreven renovatiebedrijf gevestigd in Antwerpen. Ons team bestaat uit ervaren vakmensen met passie voor kwaliteit en afwerking. Wij geloven in eerlijke communicatie, een vaste prijs en een efficiënte aanpak. Bij elke renovatie is er één aanspreekpunt dat verantwoordelijkheid neemt van begin tot einde. Onze klanten waarderen onze proactieve communicatie, netheid op de werf en de kwaliteit van het eindresultaat. Vertrouw op Reno Rangers voor uw volgende renovatieproject.',
    links: [...mainLinks, ...projectLinks.slice(0, 3),
      { href: 'https://kbopub.economie.fgov.be', text: 'KBO Bedrijfsinformatie' },
    ],
  },
  {
    route: '/blog',
    title: 'Blog | Reno Rangers Renovatietips',
    description: 'Lees praktische renovatietips van Reno Rangers over badkamerrenovatie, totaalrenovatie, binnenafwerking en het kiezen van de juiste aannemer in Antwerpen en omgeving.',
    h1: 'Renovatietips en Informatie van Reno Rangers',
    bodyText: 'De blog van Reno Rangers staat vol met nuttige informatie voor iedereen die een renovatie plant. Lees over de kostprijs van een badkamerrenovatie in Antwerpen, ontdek de nieuwste trends in binnenafwerking en leer hoe u de juiste renovatie-aannemer kiest. Wij delen onze expertise om u te helpen de juiste keuzes te maken voor uw renovatieproject. Bekijk onze artikelen en neem contact op als u vragen heeft.',
    links: [...mainLinks, ...blogLinks,
      { href: 'https://energiesparen.be', text: 'Energiepremies' },
    ],
  },
  {
    route: '/privacybeleid',
    title: 'Privacybeleid | Reno Rangers',
    description: 'Lees het privacybeleid van Reno Rangers. Wij verwerken uw persoonsgegevens veilig en conform de Belgische en Europese privacywetgeving (AVG/GDPR).',
    h1: 'Privacybeleid van Reno Rangers',
    bodyText: 'Reno Rangers respecteert uw privacy en verwerkt uw persoonsgegevens zorgvuldig conform de Belgische en Europese wetgeving, inclusief de Algemene Verordening Gegevensbescherming (AVG of GDPR). Wij verzamelen enkel de gegevens die noodzakelijk zijn voor het verwerken van uw offerteaanvraag of contactopname. Uw gegevens worden niet gedeeld met derden zonder uw toestemming. U heeft het recht op inzage, correctie en verwijdering van uw persoonsgegevens. Neem contact op voor vragen over uw privacy.',
    links: [{ href: '/', text: 'Home' }, { href: '/contact', text: 'Contact' }, { href: '/diensten', text: 'Diensten' }],
  },
  // ── PROJECT DETAIL PAGES ──
  {
    route: '/projecten/badkamerrenovatie-antwerpen',
    title: 'Badkamerrenovatie Antwerpen | Reno Rangers Project',
    description: 'Bekijk dit badkamerrenovatieproject in Antwerpen door Reno Rangers: van verouderde badkamer naar een moderne, strakke ruimte met nieuw sanitair en tijdloze tegels.',
    h1: 'Badkamerrenovatie in Antwerpen — Project door Reno Rangers',
    bodyText: 'Bij dit project in Antwerpen renoveerde Reno Rangers een verouderde badkamer volledig. De bestaande tegels, sanitair en leidingwerk werden vervangen door nieuwe, kwalitatieve materialen. De klant kreeg een strakke, lichte badkamer met modern sanitair, een nieuwe douche en verbeterde ventilatie. Reno Rangers verzorgde de volledige uitvoering van sloop tot sleuteloverdracht. Bekijk de voor-en-na foto\'s en vraag een offerte aan voor uw eigen badkamerrenovatie.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/badkamerrenovatie-antwerpen'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie' },
    ],
  },
  {
    route: '/projecten/mortex-badkamer-merksem',
    title: 'Mortex Badkamer Merksem | Reno Rangers Project',
    description: 'Donkere mortex badkamer in Merksem door Reno Rangers: van verouderde witte badkamer naar luxueuze designbadkamer met zwarte accenten en inloopdouche. Bekijk voor en na.',
    h1: 'Mortex Badkamer in Merksem — Project door Reno Rangers',
    bodyText: 'In Merksem transformeerde Reno Rangers een gewone witte badkamer naar een sfeervolle mortex designbadkamer. De klant koos voor donkergrijs mortex op wanden en vloer, gecombineerd met een inloopdouche, zwart sanitair en een ronde LED spiegel. Ook de aparte toiletruimte werd volledig afgewerkt in mortex met zwarte accenten. Een complete transformatie naar een luxueuze, hotelachtige badkamer. Vraag een offerte aan voor uw mortex badkamer.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/mortex-badkamer-merksem'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://energiesparen.be', text: 'Energiepremies' },
    ],
  },
  {
    route: '/projecten/mortex-badkamer-antwerpen',
    title: 'Mortex Badkamer Antwerpen | Reno Rangers Project',
    description: 'Lichte mortex badkamer in Antwerpen met vrijstaand bad en organische LED spiegel. Reno Rangers realiseerde een tijdloze badkamer in warme beige tint met zwarte mat accenten.',
    h1: 'Mortex Badkamer in Antwerpen — Project door Reno Rangers',
    bodyText: 'Voor een klant in Antwerpen realiseerde Reno Rangers een tijdloze mortex badkamer in warme beige tinten. Wanden en vloer zijn volledig bekleed met mortex, gecombineerd met een vrijstaand bad en mat zwart sanitair. Een organisch gevormde LED spiegel en ingebouwde verlichtingsniche maken de afwerking af. Een badkamer die rust, warmte en luxe uitstraalt. Neem contact op voor uw eigen mortex renovatie in Antwerpen.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/mortex-badkamer-antwerpen'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://www.antwerpen.be', text: 'Stad Antwerpen' },
    ],
  },
  {
    route: '/projecten/volledige-badkamer-antwerpen',
    title: 'Volledige Badkamerrenovatie Antwerpen | Reno Rangers',
    description: 'Totaalrenovatie van een badkamer in Antwerpen met donkere tegels in visgraatpatroon en maatwerk meubilair. Reno Rangers leverde een luxueuze, tijdloze afwerking.',
    h1: 'Volledige Badkamerrenovatie in Antwerpen — Project door Reno Rangers',
    bodyText: 'Reno Rangers realiseerde een volledige badkamerrenovatie in Antwerpen met donkere wandtegels en vloertegels in visgraatpatroon. Maatwerk meubilair, een ruime inloopdouche met regensproeier en op maat gemaakte spiegels completeren de luxueuze afwerking. De verouderde badkamer werd volledig gesloopt en heropgebouwd. Het resultaat is een tijdloze, elegante badkamer die het dagelijkse comfort aanzienlijk verhoogt.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/volledige-badkamer-antwerpen'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie aanvragen' },
    ],
  },
  {
    route: '/projecten/badkamer-paars-meubel-merksem',
    title: 'Badkamer met Paars Meubel Merksem | Reno Rangers',
    description: 'Badkamerrenovatie in Merksem met een uniek paars meubel als blikvanger. Reno Rangers realiseerde een persoonlijke, karaktervolle badkamer volledig op maat van de klant.',
    h1: 'Badkamer met Paars Meubel in Merksem — Project door Reno Rangers',
    bodyText: 'Voor een klant in Merksem renoveerde Reno Rangers een badkamer met een uniek en persoonlijk karakter. Het paarse badkamermeubel is de absolute blikvanger en geeft de ruimte een eigen identiteit. Bijpassende wandtegels, vloer en verlichting werden zorgvuldig afgestemd op de gekozen stijl. Reno Rangers toont dat een badkamer niet standaard hoeft te zijn — karakter en kwaliteit gaan perfect samen. Bekijk ons project en vraag uw eigen offerte aan.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/badkamer-paars-meubel-merksem'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://energiesparen.be', text: 'Energiepremies' },
    ],
  },
  {
    route: '/projecten/keukenrenovatie-antwerpen',
    title: 'Keukenrenovatie Antwerpen | Reno Rangers Project',
    description: 'Volledige keukenrenovatie in Antwerpen door Reno Rangers: maatwerk kasten, nieuwe indeling en moderne afwerking. Van gedateerde keuken naar functionele kookruimte.',
    h1: 'Keukenrenovatie in Antwerpen — Project door Reno Rangers',
    bodyText: 'Reno Rangers renoveerde een volledige keuken in Antwerpen voor een klant die meer functionaliteit en een frisse uitstraling wou. De bestaande keuken werd volledig gesloopt en heropgebouwd met maatwerk kasten, een nieuw werkblad, moderne inbouwapparatuur en vernieuwd tegelwerk. De nieuwe indeling biedt meer werkruimte en betere opberging. Het resultaat is een moderne, praktische keuken die perfect aansluit bij de levensstijl van de klant.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/keukenrenovatie-antwerpen'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie' },
    ],
  },
  {
    route: '/projecten/living-binnenafwerking-antwerpen',
    title: 'Living & Binnenafwerking Antwerpen | Reno Rangers',
    description: 'Living en binnenafwerking gerenoveerd in Antwerpen door Reno Rangers: gladde muren, nieuwe vloer, plinten en frisse afwerking. Strakke woonruimte van hoge kwaliteit.',
    h1: 'Living & Binnenafwerking in Antwerpen — Project door Reno Rangers',
    bodyText: 'Bij een volledig appartement in Antwerpen verzorgde Reno Rangers ook de renovatie van de living en binnenafwerking. Muren werden gladgepleisterd en geschilderd, een nieuwe vloer werd gelegd over de volledige woonruimte en plinten, deuromlijstingen en binnendeuren werden vernieuwd. Plafondafwerking en ingebouwde verlichting zorgen voor een afgewerkt geheel. Het resultaat is een frisse, strakke woonruimte die rust en kwaliteit uitstraalt.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/living-binnenafwerking-antwerpen'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://www.antwerpen.be', text: 'Stad Antwerpen' },
    ],
  },
  {
    route: '/projecten/badkamerrenovatie-londerzeel',
    title: 'Badkamerrenovatie Londerzeel | Reno Rangers Project',
    description: 'Badkamerrenovatie in Londerzeel door Reno Rangers: van verouderde donkere badkamer naar lichte, moderne ruimte met nieuw sanitair en kwaliteitsvolle tijdloze afwerking.',
    h1: 'Badkamerrenovatie in Londerzeel — Project door Reno Rangers',
    bodyText: 'In Londerzeel renoveerde Reno Rangers een badkamer die toe was aan een volledige make-over. De verouderde indeling werd volledig aangepakt met nieuwe leidingen, lichte wandtegels en vloertegels en modern sanitair. Een nieuwe douche, wasmeubel en toilet werden geplaatst met aandacht voor waterdichtheid en duurzaamheid. Het resultaat is een heldere, ruimtevoelende badkamer die de klant dagelijks met plezier gebruikt en nog jaren meegaat.',
    links: [
      ...mainLinks,
      ...projectLinks.filter(l => l.href !== '/projecten/badkamerrenovatie-londerzeel'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://energiesparen.be', text: 'Energiepremies' },
    ],
  },
  // ── BLOG POSTS ──
  {
    route: '/blog/wat-kost-badkamerrenovatie-antwerpen-2026',
    title: 'Wat kost een badkamerrenovatie in Antwerpen in 2026? | Reno Rangers',
    description: 'Ontdek de kostprijs van een badkamerrenovatie in Antwerpen in 2026: welke factoren bepalen de prijs, wat zijn gemiddelde kosten en hoe vraagt u een offerte aan bij Reno Rangers.',
    h1: 'Wat kost een badkamerrenovatie in Antwerpen in 2026?',
    bodyText: 'De kostprijs van een badkamerrenovatie in Antwerpen hangt af van meerdere factoren: de grootte van de badkamer, de kwaliteit van de materialen, de complexiteit van de leidingen en de gewenste afwerking. Reno Rangers biedt transparante, vaste prijzen zonder verrassingen achteraf. In dit artikel leest u alles over de gemiddelde prijzen voor badkamerrenovaties in Antwerpen in 2026 en vraagt u vrijblijvend een offerte aan.',
    links: [
      ...mainLinks,
      ...blogLinks.filter(l => l.href !== '/blog/wat-kost-badkamerrenovatie-antwerpen-2026'),
      { href: '/contact', text: 'Gratis offerte aanvragen' },
      { href: 'https://www.mijnverbouwpremie.be', text: 'Verbouwpremie aanvragen' },
    ],
  },
  {
    route: '/blog/totaalrenovatie-alles-wat-u-moet-weten',
    title: 'Totaalrenovatie: alles wat u moet weten | Reno Rangers Antwerpen',
    description: 'Alles over planning en aanpak van een totaalrenovatie: van budget en vergunningen tot de volgorde van werken. De complete gids van Reno Rangers voor een geslaagde renovatie.',
    h1: 'Totaalrenovatie: alles wat u moet weten',
    bodyText: 'Een totaalrenovatie is een grote investering die vraagt om een goede planning. Reno Rangers helpt u van begin tot einde: van het bepalen van het budget en het aanvragen van vergunningen tot de coördinatie van alle aannemers en de uiteindelijke oplevering. In dit artikel leest u alles over het aanpakken van een totaalrenovatie in België, inclusief tips over de volgorde van werken en het vermijden van veelgemaakte fouten.',
    links: [
      ...mainLinks,
      ...blogLinks.filter(l => l.href !== '/blog/totaalrenovatie-alles-wat-u-moet-weten'),
      { href: '/contact', text: 'Offerte aanvragen' },
      { href: 'https://energiesparen.be', text: 'Energiepremies bekijken' },
    ],
  },
  {
    route: '/blog/trends-binnenafwerking-belgische-woningen-2026',
    title: 'Trends in binnenafwerking voor Belgische woningen 2026 | Reno Rangers',
    description: 'Ontdek de populairste trends in binnenafwerking voor Belgische woningen in 2026: mortex, microcement, warme natuurtinten en duurzame materialen. Inspiratie van Reno Rangers.',
    h1: 'Trends in binnenafwerking voor Belgische woningen 2026',
    bodyText: 'De wereld van binnenafwerking evolueert snel. In 2026 zijn mortex, microcement en warme natuurtinten bijzonder populair in Belgische woningen. Reno Rangers volgt alle trends op de voet en past ze toe in onze projecten. Van minimalistische badkamers met mortex afwerking tot warme livings met houten accenten — wij realiseren het. Lees in dit artikel welke trends dit jaar domineren en hoe u ze kunt toepassen in uw eigen woning.',
    links: [
      ...mainLinks,
      ...blogLinks.filter(l => l.href !== '/blog/trends-binnenafwerking-belgische-woningen-2026'),
      { href: '/diensten', text: 'Onze diensten bekijken' },
      { href: '/contact', text: 'Offerte aanvragen' },
    ],
  },
  {
    route: '/blog/hoe-juiste-renovatie-aannemer-kiezen',
    title: 'Hoe kiest u de juiste renovatie-aannemer? | Reno Rangers',
    description: 'Leer waar u op moet letten bij het kiezen van een renovatie-aannemer in Antwerpen: vaste prijzen, referenties, communicatie en kwaliteit. Eerlijke tips van Reno Rangers.',
    h1: 'Hoe kiest u de juiste renovatie-aannemer?',
    bodyText: 'Het kiezen van de juiste renovatie-aannemer is een van de belangrijkste beslissingen bij uw renovatie. Reno Rangers geeft eerlijk advies: let op vaste prijzen zonder verborgen kosten, vraag referenties op en bekijk afgewerkte projecten. Een goede aannemer communiceert proactief, respecteert de planning en garandeert de kwaliteit van de afwerking. In dit artikel vindt u alle tips om de beste keuze te maken voor uw renovatieproject in Antwerpen en omgeving.',
    links: [
      ...mainLinks,
      ...blogLinks.filter(l => l.href !== '/blog/hoe-juiste-renovatie-aannemer-kiezen'),
      { href: '/contact', text: 'Reno Rangers contacteren' },
      { href: 'https://kbopub.economie.fgov.be', text: 'Aannemer controleren via KBO' },
    ],
  },
];

function buildLinksHtml(links) {
  return links.map(l =>
    l.href.startsWith('http')
      ? `<a href="${esc(l.href)}" rel="noopener noreferrer">${esc(l.text)}</a>`
      : `<a href="${esc(l.href)}">${esc(l.text)}</a>`
  ).join(' | ');
}

function buildHtml(routeData) {
  const { route, title, description, h1, bodyText, links } = routeData;
  const canonical = route === '/' ? `${origin}/` : `${origin}${route}`;
  let html = stripUnverifiedBusinessFacts(stripUnverifiedSearchAction(baseHtml));

  // Update meta tags
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${esc(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${esc(description)}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${esc(description)}" />`);
  html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="robots" content="index, follow" />');

  // Inject SEO prerender block: H1, descriptive text, and internal/external links.
  // Uses sr-only positioning so it doesn't affect visual layout once React hydrates.
  const seoBlock = `<div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"><h1>${esc(h1)}</h1><p>${esc(bodyText)}</p><nav>${buildLinksHtml(links)}</nav></div>`;
  html = html.replace('<div id="root">', seoBlock + '\n<div id="root">');

  return html;
}

for (const routeData of routes) {
  const html = buildHtml(routeData);
  if (routeData.route === '/') {
    fs.writeFileSync(indexPath, html);
  } else {
    const outDir = path.join(dist, routeData.route.slice(1));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
  }
}

console.log(`Generated SEO shells for ${routes.length} indexable routes.`);
