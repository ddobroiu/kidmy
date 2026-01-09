export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black/50 border-t border-gray-100 dark:border-gray-800 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                        Kidmy
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Locul magic unde imaginația prinde viață în 3D!
                    </p>
                </div>

                <div className="flex gap-8 text-sm font-bold text-gray-600 dark:text-gray-400">
                    <a href="#" className="hover:text-primary transition-colors">Despre Noi</a>
                    <a href="#" className="hover:text-primary transition-colors">Siguranță</a>
                    <a href="#" className="hover:text-primary transition-colors">Termeni</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>

                <div className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Kidmy. Toate drepturile rezervate.
                </div>
            </div>
        </footer>
    );
}

