"use client";

import { useReveal } from "../../hooks/useReveal";
import Script from "next/script";
import { useState, useEffect } from "react";

// Need to define Razorpay globally for TS
declare global {
    interface Window {
        Razorpay: any;
    }
}

type UserData = {
    name: string;
    email: string;
    isSubscribed: boolean;
    subscriptionEnd: string | null;
    charityId: string;
    charityContribution: number;
};

type Charity = {
    id: string;
    name: string;
};

export default function SettingsPage() {
    const revealRef = useReveal();
    const [user, setUser] = useState<UserData | null>(null);
    const [charities, setCharities] = useState<Charity[]>([]);
    
    // Form states
    const [name, setName] = useState("");
    const [charityId, setCharityId] = useState("");
    const [charityContribution, setCharityContribution] = useState(15);
    
    const [loadingSub, setLoadingSub] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Fetch user
        fetch("/api/user")
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setName(data.name || "");
                setCharityId(data.charityId || "");
                setCharityContribution(data.charityContribution || 15);
            })
            .catch(console.error);

        // Fetch charities
        fetch("/api/charities")
            .then(res => res.json())
            .then(data => setCharities(data))
            .catch(console.error);
    }, []);

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.ok) alert("Profile saved!");
            else alert("Failed to save profile.");
        } catch (e) {
            console.error(e);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSavePreferences = async () => {
        setSavingPrefs(true);
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ charityId, charityContribution }),
            });
            if (res.ok) alert("Charity preferences saved!");
            else alert("Failed to save preferences.");
        } catch (e) {
            console.error(e);
        } finally {
            setSavingPrefs(false);
        }
    };

    const handleSubscribe = async () => {
        setLoadingSub(true);
        try {
            // 1. Create order on backend
            const orderRes = await fetch("/api/subscription/create", { method: "POST" });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                alert(orderData.error || "Failed to create order");
                return;
            }

            // 2. Initialize Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Golf Charity",
                description: "Pro Plan (Yearly)",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 3. Verify payment on backend
                    const verifyRes = await fetch("/api/subscription/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok) {
                        alert("Subscription successful!");
                        // Refresh user data
                        setUser(prev => prev ? { ...prev, isSubscribed: true } : null);
                    } else {
                        alert("Verification failed: " + (verifyData.error || "Unknown error"));
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#f43f5e", // rose-500
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                alert("Payment failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Subscription Error", error);
            alert("Something went wrong");
        } finally {
            setLoadingSub(false);
        }
    };

    return (
        <div ref={revealRef} className="max-w-4xl mx-auto">
            {/* Load Razorpay SDK */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <header className="mb-8 reveal delay-100">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
                <p className="text-text-secondary text-sm">Manage your profile, charity preferences, and subscription.</p>
            </header>

            <div className="space-y-8">
                {/* Profile Settings */}
                <section className="glass-card p-6 reveal delay-200">
                    <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-border">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-text-muted mb-2">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-emerald transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">Email Address</label>
                            <input type="email" defaultValue={user?.email || ""} disabled className="w-full bg-[rgba(255,255,255,0.02)] border border-border rounded-lg px-4 py-3 text-text-muted cursor-not-allowed" />
                        </div>
                        <div className="md:col-span-2">
                            <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-secondary !py-2.5 !px-5 !text-sm mt-2">{savingProfile ? "Saving..." : "Save Profile Changes"}</button>
                        </div>
                    </div>
                </section>

                {/* Charity Preferences */}
                <section className="glass-card p-6 reveal delay-300">
                    <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-border flex items-center justify-between">
                        Charity Preferences
                        <span className="text-xs font-mono bg-[rgba(16,185,129,0.1)] text-accent-emerald px-2 py-1 rounded">Min: 10%</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-text-muted mb-3">Selected Charity</label>
                            <select value={charityId} onChange={e => setCharityId(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-emerald transition-colors appearance-none cursor-pointer">
                                <option value="" disabled>Select a charity</option>
                                {charities.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-text-muted mb-3 flex items-center justify-between">
                                Contribution Percentage
                                <span className="font-bold text-lg text-foreground">{charityContribution}%</span>
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                value={charityContribution}
                                onChange={e => setCharityContribution(Number(e.target.value))}
                                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-2 font-mono">
                                <span>10%</span>
                                <span>30%</span>
                                <span>50%</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-4 leading-relaxed bg-[rgba(6,182,212,0.1)] border border-border p-3 rounded-lg flex gap-3 items-start">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-accent-teal flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                Increasing your percentage directly reduces the prize pool contribution but maximizes your impact on the chosen charity.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button onClick={handleSavePreferences} disabled={savingPrefs} className="btn-primary !py-2.5 !px-5 !text-sm">{savingPrefs ? "Saving..." : "Save Preferences"}</button>
                        </div>
                    </div>
                </section>

                {/* Subscription Management */}
                <section className={`glass-card p-6 reveal delay-400 ${user?.isSubscribed ? "border-accent-emerald/20" : "border-rose-900/20"}`}>
                    <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-border text-text-secondary">Subscription Status</h2>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="font-bold text-lg mb-1 flex items-center gap-2">
                                {user?.isSubscribed ? "Pro Plan (Active)" : "No Active Subscription"}
                                {user?.isSubscribed && (
                                    <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                                )}
                            </div>
                            <div className="text-sm text-text-secondary">
                                {user?.isSubscribed
                                    ? "You have access to all prize draws."
                                    : "Subscribe to enter the prize draws and support charities."}
                            </div>
                        </div>

                        {user?.isSubscribed ? (
                            <button className="text-sm text-text-muted hover:text-foreground hover:underline px-4 py-2 border border-border hover:border-border/80 rounded-lg transition-colors bg-surface">
                                Manage via Razorpay
                            </button>
                        ) : (
                            <button
                                onClick={handleSubscribe}
                                disabled={!mounted ? undefined : (loadingSub || !user)}
                                className="btn-primary px-6 py-2 text-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {loadingSub ? "Processing..." : "Subscribe Now (₹89.99/yr)"}
                            </button>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}
