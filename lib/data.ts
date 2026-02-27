export type CategoryInfo = {
    id: string;
    name: string;
    icon: string;
};

export const categories: CategoryInfo[] = [
    { id: "all", name: "Toate", icon: "✨" },
    { id: "animals", name: "Animale", icon: "🐾" },
    { id: "birds", name: "Păsări", icon: "🪶" },
    { id: "space", name: "Spațiu Cosmos", icon: "🛸" },
    { id: "vehicles", name: "Vehicule", icon: "🏎️" },
    { id: "history", name: "Istorie & Artă", icon: "🏛️" },
];

export interface ModelItem {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    modelUrl: string;
    facts: string[];
    color: string;
    emoji: string;
}

export const modelsData: ModelItem[] = [
    {
        id: "porsche-911",
        categoryId: "vehicles",
        name: "Porsche 911 Carrera",
        description: "Un model detaliat al legendarei mașini sport Porsche 911 Carrera 4S, recunoscută pentru designul său iconic clasic și performanțele ridicate.",
        modelUrl: "https://pub-718687a71676443c97e5967ee3895315.r2.dev/models/d01b254483794de3819786d93e0e1ebf.glb",
        facts: [
            "Porsche 911 păstrează aceleași linii de design curbe și distinctive de peste 50 de ani.",
            "Motorul acestui model este amplasat în partea din spate a mașinii, fiind un detaliu reprezentativ pentru linia 911.",
            "Litera 'S' provine de la 'Sport' și definește spiritul mașinii."
        ],
        color: "bg-slate-700",
        emoji: "🏎️"
    },
    {
        id: "baby-animals",
        categoryId: "animals",
        name: "Pui de Animale",
        description: "Descoperă o colecție adorabilă de pui de animale: un cățeluș, un ursuleț, un iepuraș și un pui de cerb.",
        modelUrl: "https://pub-718687a71676443c97e5967ee3895315.r2.dev/models/cadc2617612d47468e92360960583dc9.glb",
        facts: [
            "Puii de animale au ochii mari și rotunzi pentru a stârni instinctul de protecție al adulților.",
            "Un pui de cerb se mai numește 'ied' și se naște cu pete albe pentru camuflaj în pădure.",
            "Iepurașii sunt extrem de rapizi chiar și la câteva ore după naștere pentru a scăpa de prădători."
        ],
        color: "bg-emerald-600",
        emoji: "🐾"
    }
];
