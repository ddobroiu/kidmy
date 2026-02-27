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
    }
];
