
export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    bonus?: number;
    popular?: boolean;
    features: string[];
    stripePriceId?: string;
    color?: string; // For UI theming
}

export const CREDIT_PACKAGES: CreditPackage[] = [
    {
        id: 'starter',
        name: 'Micul Explorator',
        credits: 50,
        price: 25,
        color: 'bg-blue-500',
        features: [
            '50 Credite Magice',
            'Aprox. 5 Jucării 3D',
            'Acces Atelierul Magic',
            'Galerie Privată'
        ],
        stripePriceId: 'price_kidmy_starter' // Placeholder, needs real Stripe ID
    },
    {
        id: 'creator',
        name: 'Super Creator',
        credits: 200,
        price: 80,
        popular: true,
        color: 'bg-purple-500',
        features: [
            '200 Credite Magice',
            'Aprox. 20 Jucării 3D',
            'Procesare Prioritară',
            'Modele Unicat',
            'Insignă "Creator"'
        ],
        stripePriceId: 'price_kidmy_creator'
    },
    {
        id: 'master',
        name: 'Maestrul 3D',
        credits: 500,
        price: 150,
        color: 'bg-yellow-500',
        bonus: 50,
        features: [
            '500 + 50 Credite',
            'Aprox. 55 Jucării 3D',
            'Viteză Maximă',
            'Suport Dedicat',
            'Toate Opțiunile Deblocate'
        ],
        stripePriceId: 'price_kidmy_master'
    }
];

export function getCreditPackageById(id: string): CreditPackage | undefined {
    return CREDIT_PACKAGES.find(pkg => pkg.id === id);
}
