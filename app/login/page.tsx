"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaEnvelope, FaSpinner, FaRocket, FaLock, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (res?.error) {
                setError("Email sau parolă incorectă. Dacă ești nou, alege o parolă pe care să o reții.");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Login failed", error);
            setError("Ceva nu a mers bine. Încearcă din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 bg-gradient-to-br from-primary to-accent p-4 rounded-2xl rotate-12 shadow-lg hidden md:block opacity-20">
                    <FaRocket className="text-white text-4xl" />
                </div>

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                        Kidmy Club
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Loghează-te sau creează un cont rapid!
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4 relative z-10">
                    {/* Google Login - Always the best option */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-primary text-gray-700 dark:text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 group"
                    >
                        <FaGoogle className="text-primary group-hover:scale-110 transition-transform" />
                        Logare cu Google
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-bold tracking-widest">sau cu email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/50" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nume@exemplu.com"
                                    className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-2xl transition-all font-bold text-lg outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
                                Parolă (Cont Nou sau existent)
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/50" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-2xl transition-all font-bold text-lg outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {isLoading ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                "Intră în Cont"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-xs text-gray-400 font-bold px-8">
                        Dacă nu ai cont, acesta se va crea automat la prima logare cu parola aleasă.
                    </p>
                    <Link href="/" className="text-primary text-sm font-black hover:underline block pt-4">
                        ← Înapoi la Acasă
                    </Link>
                </div>
            </div>
        </div>
    );
}
