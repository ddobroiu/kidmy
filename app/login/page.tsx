
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaEnvelope, FaSpinner, FaRocket } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn("email", { email, redirect: false });
            setIsSent(true);
        } catch (error) {
            console.error("Login failed", error);
            alert("Ceva nu a mers bine. Încearcă din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl w-full max-w-md text-center shadow-2xl">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 mx-auto rounded-full flex items-center justify-center mb-6">
                        <FaEnvelope className="text-green-600 text-2xl" />
                    </div>
                    <h1 className="text-2xl font-black mb-4">Verifică Email-ul!</h1>
                    <p className="text-gray-500 mb-8">
                        Ți-am trimis un link magic pe <strong>{email}</strong>. <br />
                        Dă click pe el pentru a intra în cont.
                    </p>
                    <button
                        onClick={() => setIsSent(false)}
                        className="text-primary font-bold hover:underline"
                    >
                        Încearcă altă adresă
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">

                {/* Decorative Rocket */}
                <div className="absolute -top-10 -right-10 bg-gradient-to-br from-primary to-accent p-4 rounded-2xl rotate-12 shadow-lg hidden md:block">
                    <FaRocket className="text-white text-3xl" />
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                        Intră în Club!
                    </h1>
                    <p className="text-gray-400">
                        Salvează-ți modelele și devino un creator 3D.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Email-ul Părinților
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplu@email.com"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-0 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Se trimite...
                            </>
                        ) : (
                            "Trimite Link Magic"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-8">
                    Prin logare, accepți Termenii și Condițiile noastre.
                </p>
            </div>
        </div>
    );
}
