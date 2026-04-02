export interface Animal {
    id: string;
    name: string;
    description: string;
    modelUrl: string;
    facts: string[];
    color: string;
}

export const animals: Animal[] = [
    {
        id: "fox",
        name: "Vulpea Șireată",
        description: "Vulpile sunt creaturi inteligente și agile care trăiesc în păduri din întreaga lume.",
        modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb",
        facts: [
            "Vulpile pot auzi un ceas ticăind de la 40 de metri distanță!",
            "Sunt animale solitare, spre deosebire de lupi care trăiesc în haite.",
            "Vulpile folosesc câmpul magnetic al Pământului pentru a vâna."
        ],
        color: "bg-orange-500"
    },
    {
        id: "duck",
        name: "Rățușca Veselă",
        description: "Rațele sunt păsări acvatice care se simt la fel de bine pe lacuri ca și pe pământ.",
        modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
        facts: [
            "Rațele au trei pleoape la fiecare ochi!",
            "Penele lor sunt atât de impermeabile încât, chiar și când se scufundă, stratul de lângă piele rămâne uscat.",
            "Puii de rață se atașează de prima ființă pe care o văd când ies din ou."
        ],
        color: "bg-yellow-400"
    },
    {
        id: "parrot",
        name: "Papagalul Colorat",
        description: "Papagalii sunt cele mai colorate și mai vorbărețe păsări din junglă.",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb",
        facts: [
            "Papagalii sunt singurele păsări care pot mânca folosindu-și picioarele pentru a ridica hrana la cioc.",
            "Unii papagali pot trăi peste 80 de ani!",
            "Ei nu au corzi vocale, ci își folosesc mușchii gâtului pentru a imita sunete."
        ],
        color: "bg-green-500"
    },
    {
        id: "flamingo",
        name: "Flamingo Roz",
        description: "Flamingo sunt păsări exotice renumite pentru culoarea lor roz vibrantă și eleganță.",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb",
        facts: [
            "Sunt roz pentru că mănâncă foarte mulți creveți și alge bogate în beta-caroten.",
            "Pot dormi stând într-un singur picior!",
            "Genunchiul unui flamingo se îndoaie în aceeași direcție ca al nostru, ceea ce vedem noi îndoindu-se 'invers' este de fapt glezna."
        ],
        color: "bg-pink-400"
    },
    {
        id: "stork",
        name: "Barza Călătoare",
        description: "Berzele sunt păsări mari, migratoare, care se întorc mereu la același cuib în fiecare primăvară.",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Stork.glb",
        facts: [
            "Berzele nu pot cânta, ele comunică prin clăpănitul ciocului.",
            "Cuiburile lor pot deveni uriașe, cântărind uneori sute de kilograme.",
            "Migrează mii de kilometri în fiecare an spre Africa pentru a scăpa de iarnă."
        ],
        color: "bg-blue-400"
    }
];
