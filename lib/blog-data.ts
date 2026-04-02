export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "tehnologia-3d-creativitate-copii",
    title: "Cum tehnologia 3D stimulează creativitatea și gândirea spațială a copiilor",
    excerpt: "Descoperă de ce transformarea ideilor în obiecte 3D este mai mult decât o joacă – este un exercițiu esențial de dezvoltare cognitivă.",
    date: "2024-03-20",
    author: "Echipa Kidmy",
    category: "Educație",
    image: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=1200",
    keywords: ["educatie 3d", "creativitate copii", "gandire spatiala", "tehnologie educationala"],
    content: `
      Tehnologia 3D nu mai este doar un instrument pentru ingineri sau designeri profesioniști. Astăzi, ea devine o componentă vitală în arsenalul educațional pentru copii. Dar cum anume ajută acest lucru la dezvoltarea lor?

      ### 1. Vizualizarea Gândirii Spațiale
      Atunci când un copil creează un personaj 3D pe Kidmy, el nu doar desenează; el trebuie să înțeleagă volumul, proporțiile și modul în care obiectele ocupă spațiul. Această „navigare mentală” este baza gândirii logice și a matematicii avansate.

      ### 2. De la Consumator la Creator
      Trăim într-o lume saturată de ecrane unde copiii tind să consume conținut pasiv (YouTube, TikTok). Platformele precum Kidmy schimbă paradigma: copilul devine cel care impune regulile, cel care proiectează și cel care dă viață unor lumi noi.

      ### 3. Feedback Imediat și Învățare prin Experiment
      Spre deosebire de desenele pe hârtie, modelele 3D pot fi rotite, modificate și văzute în AR (Realitate Augmentată) în câteva secunde. Acest ciclu rapid de feedback îi învață pe copii că „greșeala” este doar un pas în procesul creativ.

      Kidmy își propune să facă acest proces cât mai simplu și magic, transformând orele petrecute în fața ecranului într-o aventură constructivă.
    `
  },
  {
    id: "2",
    slug: "realitate-augmentata-animale-3d",
    title: "Realitatea Augmentată: Cum aducem grădina zoologică direct în camera copilului",
    excerpt: "Învățarea despre animale devine fascinantă atunci când un leu sau un flamingo pot fi plasați chiar pe covorul din sufragerie.",
    date: "2024-03-21",
    author: "Echipa Kidmy",
    category: "Tehnologie",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1200",
    keywords: ["realitate augmentata", "animale 3d", "invatare interactiva", "ar copii"],
    content: `
      Realitatea Augmentată (AR) a încetat de mult să fie doar Science Fiction. Pentru un copil din ziua de azi, AR este o fereastră către o lume unde informația prinde viață.

      ### De ce funcționează AR în educație?
      Spre deosebire de o poză într-o carte, un model 3D în Realitate Augmentată păstrează proporțiile reale. Pe Kidmy, când un copil se uită la o barză sau o vulpe prin telefon, el vede cât de mari sunt acestea în raport cu mobila din camera lui.

      ### Învățarea Multisenzorială
      Combinarea impactului vizual al AR cu sunetul (naratorul nostru AI) și cu posibilitatea de a se mișca în jurul animalului creează o amintire mult mai puternică decât simpla citire a unui text. 

      Este dovedit științific că învățarea prin experiență directă crește rata de retenție a informațiilor cu până la 70%. Prin Kidmy, transformăm sufrageria într-un muzeu interactiv și viu.
    `
  },
  {
    id: "3",
    slug: "ai-pentru-copii-viitor",
    title: "Inteligența Artificială pentru Copii: Un instrument pentru micii exploratori ai viitorului",
    excerpt: "Demistificăm AI-ul și arătăm cum acesta poate fi un partener de joacă inteligent care ajută la transformarea viselor în modele 3D.",
    date: "2024-03-22",
    author: "Echipa Kidmy",
    category: "AI",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    keywords: ["ai copii", "inteligenta artificiala", "viitorul educatiei", "generative ai"],
    content: `
      Mulți părinți privesc AI-ul cu scepticism, dar adevărul este că AI va face parte din viața profesională a oricărui copil de astăzi. Cheia este să-i învățăm să-l folosească pentru a-și crește propriile capacități.

      ### AI pe înțelesul tuturor
      La Kidmy, folosim AI-ul pentru a face munca „grea”. Copilul oferă viziunea (un desen sau o descriere), iar AI-ul se ocupă de transformarea geometrică complexă în 3D. Acest lucru elimină bariera tehnică și îi permite copilului să rămână în „starea de flux” creativă.

      ### Etică și Pregătire
      Expunerea timpurie la un AI „prietenos” și util, cum este cel de la Kidmy, îi ajută pe copii să înțeleagă că tehnologia este un instrument, nu o entitate magică. Ei învață să dea comenzi precise („prompts”) și să vadă cum gândirea lor este interpretată de o mașină.

      Viitorul nu înseamnă să fim înlocuiți de roboți, ci să fim oamenii care știu să colaboreze cel mai bine cu tehnologia.
    `
  },
  {
    id: "4",
    slug: "timpul-fata-ecranului-calitate",
    title: "Timpul în fața ecranului: Calitate peste Cantitate în educația digitală",
    excerpt: "Nu tot timpul petrecut pe tabletă este egal. Învață cum să transformi consumul pasiv în explorare creativă activă.",
    date: "2024-03-24",
    author: "Echipa Kidmy",
    category: "Parenting",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
    keywords: ["screen time", "educatie digitala", "parenting tech", "timp calitate"],
    content: `
      Dezbaterea despre timpul petrecut în fața ecranului este adesea greșit înțeleasă. Nu numărul de minute contează cel mai mult, ci ce face copilul în acele minute.

      ### Consum Pasiv vs. Creație Activă
      Există o diferență uriașă între a privi desene animate ore în șir și a petrece 30 de minute construind un animal în 3D. Prima activitate este pasivă, în timp ce a doua stimulează cortexul prefrontal, responsabil pentru planificare și rezolvarea de probleme.

      ### Regulile unei diete digitale sănătoase
      1. **Scop clar:** Întreabă copilul: „Ce vrei să creezi azi?” în loc de „Vrei la tabletă?”.
      2. **Interacțiune:** Folosește AR-ul din Kidmy împreună cu el. Puneți vulpea pe masa din bucătărie și discutați despre ce mănâncă ea.
      3. **Creația ca recompensă:** Folosește timpul pe Kidmy ca pe o activitate specială care necesită concentrare și imaginație.

      La Kidmy, ne-am asigurat că fiecare minut petrecut pe platformă este unul de câștig cognitiv.
    `
  },
  {
    id: "5",
    slug: "proiecte-scolare-kidmy-3d",
    title: "Proiecte școlare de nota 10: Cum să folosești modelele 3D Kidmy la școală",
    excerpt: "Transformă referatele plictisitoare în prezentări interactive uimitoare folosind Realitatea Augmentată și modelele 3D.",
    date: "2024-03-25",
    author: "Echipa Kidmy",
    category: "Școală",
    image: "https://images.unsplash.com/photo-1497633762265-9a177c809852?q=80&w=1200",
    keywords: ["proiecte scolare", "invatare vizuala", "prezentari 3d", "scola viitorului"],
    content: `
      Cum ar fi dacă, la ora de biologie, un elev ar putea arăta întregii clase un model 3D al unei berze care zboară deasupra băncii sale? Cu Kidmy, acest lucru este posibil.

      ### Biologie și Zoologie Interactivă
      În loc să deseneze o pasăre pe hârtie, elevul poate genera un model 3D precis. Folosind funcția AR pe telefon sau tabletă, el poate prezenta detaliile anatomice într-un mod imersiv care captează atenția tuturor colegilor.

      ### Geografie și Istorie
      Fie că este vorba despre un animal exotic dintr-o anumită regiune sau despre un personaj din poveștile istorice, transformarea lor în 3D oferă o ancoră vizuală puternică. 

      ### Beneficiul pentru profesori
      Profesorii caută mereu metode de a face materia mai captivantă. Un proiect care include componente de Realitate Augmentată demonstrează nu doar cunoștințe de specialitate, ci și competențe digitale avansate. Kidmy este partenerul ideal pentru elevul modern.
    `
  },
  {
    id: "6",
    slug: "psihologia-jocului-constructiv-3d",
    title: "De ce copiii iubesc să construiască: Psihologia din spatele creației 3D",
    excerpt: "De la cuburile de lemn la modelele 3D digitale, nevoia de a construi este înscrisă în ADN-ul nostru creativ.",
    date: "2024-03-26",
    author: "Echipa Kidmy",
    category: "Psihologie",
    image: "https://images.unsplash.com/photo-1516627145497-ae6b52479875?q=80&w=1200",
    keywords: ["psihologia jocului", "constructivism", "dezvoltare copil", "invatare prin joaca"],
    content: `
      De ce ne fascinează ideea de a crea ceva de la zero? Psihologii numesc acest fenomen „Efectul IKEA”, unde prețuim mai mult lucrurile la care am lucrat noi înșine.

      ### Dezvoltarea Stimei de Sine
      Când un copil vede că un desen simplu a devenit, prin magia Kidmy, un obiect 3D care stă pe masa lui în AR, sentimentul de realizare este uriaș. Acest lucru îi crește încrederea în propriile capacități creative.

      ### Învățarea prin Constructivism
      Teoria constructivistă spune că noi învățăm cel mai bine construind modele mentale ale lumii. Crearea în 3D forțează creierul să facă conexiuni între abstract (idee) și concret (formă), un proces esențial pentru dezvoltarea inteligenței logico-matematice.

      ### Jocul ca Muncă a Copilului
      Maria Montessori spunea că „jocul este munca copilului”. Kidmy oferă un „atelier de lucru” digital infinit, unde riscurile sunt zero, dar recompensa intelectuală este maximă.
    `
  }
];
