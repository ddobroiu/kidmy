"use client";

import { useState } from "react";
import { CREDIT_PACKAGES } from "@/lib/credit-packages";
import { FaCheck, FaSpinner, FaLock, FaCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ParentsDashboard() {
    const [purchasing, setPurchasing] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        // Here we will implement the Stripe Checkout redirect logic
        // Need to ensure user is logged in first
        setPurchasing(packageId);

        try {
            // Simulated delay for now
            await new Promise(r => setTimeout(r, 1000));
            alert(`Inițiem plata pentru pachetul ${packageId}... (Backend de plăți în lucru)`);
        } catch (err) {
            console.error(err);
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
                        <FaLock className="w-3 h-3" /> Zona Părinților
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
                        Investește în Imaginația Lor
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Cumpără "Credite Magice" pentru ca cel mic să își poată transforma desenele și ideile în jucării 3D reale. Fără abonamente ascunse.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {CREDIT_PACKAGES.map((pkg, index) => (
                        <PricingCard
                            key={pkg.id}
                            pkg={pkg}
                            index={index}
                            purchasing={purchasing === pkg.id}
                            onPurchase={() => handlePurchase(pkg.id)}
                        />
                    ))}
                </div>

                {/* FAQ / Trust */}
                <div className="mt-20 grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-green-500" />
                            Plată Sigură
                        </h3>
                        <p className="text-gray-500">
                            Procesăm toate plățile securizat prin Stripe. Nu stocăm datele cardului dumneavoastră. Primiți factură fiscală pe email instant.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                            ⏱️ Creditele Nu Expiră
                        </h3>
                        <p className="text-gray-500">
                            Cumpărați acum și folosiți oricând. Dacă cel mic face o pauză de creație, creditele îl așteaptă cuminți în cont.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function PricingCard({ pkg, index, purchasing, onPurchase }: { pkg: any, index: number, purchasing: boolean, onPurchase: () => void }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-3xl flex flex-col transition-all duration-300 ${pkg.popular
                    ? 'bg-white dark:bg-gray-800 border-2 border-primary shadow-2xl scale-105 z-10'
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl hover:translate-y-[-5px]'
                }`}
        >
            {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Cel Mai Ales
                </div>
            )}

            <div className={`w-12 h-12 rounded-2xl ${pkg.color} flex items-center justify-center mb-6 shadow-lg text-white`}>
                <span className="text-2xl font-black">{pkg.name[0]}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{pkg.price}</span>
                    <span className="text-lg font-bold text-gray-500">RON</span>
                </div>
                <div className="text-primary font-bold mt-1">
                    {pkg.credits} Credite
                    {pkg.bonus && <span className="text-green-500 ml-1">+{pkg.bonus} Bonus</span>}
                </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full p-0.5 mt-0.5">
                            <FaCheck className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-medium">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onPurchase}
                disabled={purchasing}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${pkg.popular
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {purchasing ? (
                    <FaSpinner className="animate-spin" />
                ) : (
                    "Alege Pachetul"
                )}
            </button>
        </motion.div>
    );
}
