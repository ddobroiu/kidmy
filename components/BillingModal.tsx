"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";
import countriesList from "../lib/countries.json";

interface BillingDetails {
    type: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    cui?: string;
    regCom?: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    zip?: string;
}

interface BillingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: BillingDetails | null;
}

export default function BillingModal({ isOpen, onClose, onSuccess, initialData }: BillingModalProps) {
    const [formData, setFormData] = useState<BillingDetails>({
        type: 'personal',
        firstName: '',
        lastName: '',
        companyName: '',
        cui: '',
        regCom: '',
        address: '',
        city: '',
        state: '',
        country: 'RO',
        zip: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                type: initialData.type || 'personal',
                country: initialData.country || 'RO'
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/user/billing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Eroare la salvarea datelor.');
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="bg-gray-900 border border-white/10 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative my-8">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <FaTimes />
                </button>

                <h3 className="text-3xl font-black mb-2 text-white">Date Facturare</h3>
                <p className="text-gray-400 mb-8 text-sm font-medium">
                    Introdu datele tale pentru a primi facturile automate prin Oblio.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Personal / Company Toggle */}
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 mb-6">
                        <button
                            type="button"
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.type === 'personal' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'personal' }))}
                        >
                            Persoană Fizică
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.type === 'company' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'company' }))}
                        >
                            Companie
                        </button>
                    </div>

                    {formData.type === 'personal' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Prenume *</label>
                                <input
                                    required
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nume *</label>
                                <input
                                    required
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nume Firmă *</label>
                                <input
                                    required
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">CUI / CIF *</label>
                                    <input
                                        required
                                        type="text"
                                        name="cui"
                                        value={formData.cui || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Reg. Com.</label>
                                    <input
                                        type="text"
                                        name="regCom"
                                        value={formData.regCom || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                                        placeholder="ex: J40/..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Adresă *</label>
                        <input
                            required
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                            placeholder="Strada, Număr, Bloc..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Oraș *</label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Țară *</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none cursor-pointer appearance-none"
                            >
                                {countriesList.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-primary to-accent hover:scale-[1.02] rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 mt-6 disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                        Salvează Datele
                    </button>

                    <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Datele tale sunt stocate în siguranță pentru facturare
                    </p>
                </form>
            </div>
        </div>
    );
}
