"use client";

import { useState, useEffect } from "react";
import { CREDIT_PACKAGES } from "@/lib/credit-packages";
import { FaCheck, FaSpinner, FaLock, FaCreditCard, FaCog, FaDownload, FaHistory, FaBuilding, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import BillingModal from "@/components/BillingModal";

export default function ParentsDashboard() {
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [billingDetails, setBillingDetails] = useState<any>(null);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [billRes, purchRes] = await Promise.all([
                fetch("/api/user/billing"),
                fetch("/api/user/purchased-history") // We'll create this or use existing
            ]);

            if (billRes.ok) {
                const bData = await billRes.json();
                setBillingDetails(bData.billingDetails);
            }

            if (purchRes.ok) {
                const pData = await purchRes.json();
                setPurchases(pData.purchases || []);
            }
        } catch (err) {
            console.error("Error fetching status:", err);
        } finally {
            setLoadingData(false);
        }
    };

    const handlePurchase = async (packageId: string) => {
        setPurchasing(packageId);

        try {
            const response = await fetch("/api/stripe/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ packageId }),
            });

            if (response.status === 401) {
                window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.href)}`;
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "A apărut o eroare la inițierea plății.");
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;

        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Eroare la procesarea cererii.");
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
                        <FaLock className="w-3 h-3" /> Zona Părinților
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
                        Investește în Imaginația Lor
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                        Cumpără "Credite Magice" pentru ca cel mic să își poată transforma desenele și ideile în jucării 3D reale. Fără abonamente ascunse.
                    </p>
                </div>

                {/* Billing Details Status */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                {billingDetails?.type === 'company' ? <FaBuilding className="w-6 h-6" /> : <FaUser className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Date de Facturare</h3>
                                <p className="text-gray-500 font-medium text-sm">
                                    {billingDetails
                                        ? `Setat pentru: ${billingDetails.type === 'company' ? billingDetails.companyName : `${billingDetails.firstName} ${billingDetails.lastName}`}`
                                        : "Nu ai setat încă datele de facturare pentru Oblio."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsBillingModalOpen(true)}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                        >
                            <FaCog className="w-4 h-4" />
                            {billingDetails ? "Modifică Datele" : "Configurează Facturarea"}
                        </button>
                    </div>
                </motion.div>

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
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-black text-xl mb-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
                                <FaCreditCard className="w-5 h-5" />
                            </div>
                            Plată Sigură
                        </h3>
                        <p className="text-gray-500 font-medium">
                            Procesăm toate plățile securizat prin Stripe. Nu stocăm datele cardului dumneavoastră. Primiți factură fiscală prin Oblio instant.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-black text-xl mb-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl">⏱️</span>
                            </div>
                            Creditele Nu Expiră
                        </h3>
                        <p className="text-gray-500 font-medium">
                            Cumpărați acum și folosiți oricând. Dacă cel mic face o pauză de creație, creditele îl așteaptă cuminți în cont.
                        </p>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="mt-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center">
                            <FaHistory className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Istoric Facturi</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500">Pachet</th>
                                    <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500">Dată</th>
                                    <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500 text-right">Sumă</th>
                                    <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500 text-right">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {purchases.length > 0 ? purchases.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 dark:text-white">
                                            {p.credits} Credite Magice
                                        </td>
                                        <td className="p-4 text-gray-500 font-medium">
                                            {new Date(p.createdAt).toLocaleDateString("ro-RO")}
                                        </td>
                                        <td className="p-4 text-right font-black text-gray-900 dark:text-white">
                                            {p.amount} {p.currency}
                                        </td>
                                        <td className="p-4 text-right">
                                            {p.invoiceUrl ? (
                                                <a
                                                    href={p.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black transition-all hover:scale-105 shadow-lg shadow-primary/20"
                                                >
                                                    <FaDownload className="w-3 h-3" /> Factură {p.invoiceSeries} {p.invoiceNumber}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs font-bold">Procesare Factură...</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-400 font-bold italic">
                                            Nu ai nicio achiziție înregistrată încă.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <BillingModal
                isOpen={isBillingModalOpen}
                onClose={() => setIsBillingModalOpen(false)}
                onSuccess={() => {
                    setIsBillingModalOpen(false);
                    fetchData();
                }}
                initialData={billingDetails}
            />
        </div>
    );
}

function PricingCard({ pkg, index, purchasing, onPurchase }: { pkg: any, index: number, purchasing: boolean, onPurchase: () => void }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-[2.5rem] flex flex-col transition-all duration-300 ${pkg.popular
                ? 'bg-white dark:bg-gray-800 border-2 border-primary shadow-2xl scale-105 z-10'
                : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl hover:translate-y-[-5px]'
                }`}
        >
            {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    Cel Mai Ales
                </div>
            )}

            <div className={`w-14 h-14 rounded-[1.25rem] ${pkg.color} flex items-center justify-center mb-6 shadow-lg text-white`}>
                <span className="text-3xl font-black">{pkg.name[0]}</span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{pkg.name}</h3>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{pkg.price}</span>
                    <span className="text-xl font-black text-gray-500">RON</span>
                </div>
                <div className="text-primary font-black mt-1 text-lg">
                    {pkg.credits} Credite
                    {pkg.bonus && <span className="text-green-500 ml-2">+{pkg.bonus} Bonus</span>}
                </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="bg-green-100 dark:bg-green-900/40 text-green-600 rounded-full p-1 mt-0.5">
                            <FaCheck className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-bold">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onPurchase}
                disabled={purchasing}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${pkg.popular
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]`}
            >
                {purchasing ? (
                    <FaSpinner className="animate-spin text-2xl" />
                ) : (
                    "Alege Pachetul"
                )}
            </button>
        </motion.div>
    );
}
