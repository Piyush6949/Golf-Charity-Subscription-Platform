"use client";

import Link from "next/link";
import { useReveal } from "../hooks/useReveal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
    const revealRef = useReveal();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [jackpot, setJackpot] = useState<number>(0);
    const router = useRouter();

    type UserData = {
        name: string;
        email: string;
        isSubscribed: boolean;
        subscriptionEnd: Date;
        charityId: string;
        charityContribution: number;
        role: string;
        scores: { id: string; value: number; date: string; createdAt: string; userId: string; }[];
        charity: { name: string; description: string; image: string | null } | null;
        winners: { id: string; prize: number; status: string; draw: { createdAt: string | Date } }[];
    }

    const totalWinnings = userData?.winners?.reduce((sum, w) => sum + (w.prize || 0), 0) || 0;
    const userCharityAmount = userData?.isSubscribed ? ((userData.charityContribution || 15) / 100) * 8999 : 0;

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include",
            })
            if (!res.ok) {
                router.push("/");
            }
            const data = await res.json();
            setUserData(data);
            console.log("userData", userData);
        }

        async function getJackpot() {
            try {
                const res = await fetch("/api/jackpot");
                const data = await res.json();
                if (data.totalJackpot !== undefined) setJackpot(data.totalJackpot);
            } catch (e) {
                console.error(e);
            }
        }
        getUser();
        getJackpot();
    }, []);

    return (
        <div ref={revealRef}>
            <header className="mb-8 reveal delay-100">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, {userData?.name}!</h1>
                <p className="text-text-secondary text-sm">Here's your subscription and performance overview.</p>
            </header>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Subscription Card */}
                <div className="glass-card p-6 reveal delay-200 group hover:border-accent-emerald/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.1)] text-accent-emerald flex items-center justify-center group-hover:bg-[rgba(16,185,129,0.2)] transition-colors">
                            {userData?.isSubscribed ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>}
                        </div>
                        {userData?.isSubscribed && <span className="text-xs font-mono px-2 py-1 rounded bg-surface border border-border text-text-muted">Pro Plan</span>}
                    </div>
                    <div className="text-sm text-text-muted mb-1">Subscription</div>
                    <div className="text-xl font-bold mb-2 flex items-center gap-2">
                        {userData?.isSubscribed ? "Active" : "Inactive"}
                        {userData?.isSubscribed ? <span className="w-2 h-2 rounded-full bg-accent-emerald"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    </div>
                    {userData?.isSubscribed && <div className="text-xs text-text-secondary">Renews on {userData?.subscriptionEnd ? new Date(userData.subscriptionEnd).toDateString() : "—"}</div>}
                </div>

                {/* Charity Card */}
                <div className="glass-card p-6 reveal delay-300 group hover:border-accent-teal/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.1)] text-accent-teal flex items-center justify-center group-hover:bg-[rgba(6,182,212,0.2)] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </div>
                        <Link href="/dashboard/settings" className="text-xs text-accent-teal hover:underline">Edit</Link>
                    </div>
                    <div className="text-sm text-text-muted mb-1">Total Contribution</div>
                    <div className="text-xl font-bold mb-2 gradient-text">₹{userCharityAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs text-text-secondary">Next month: {userData?.charityContribution || 15}% goes to <span className="text-foreground">{userData?.charity?.name || "Charity"}</span></div>
                </div>

                {/* Next Draw Card */}
                <div className="glass-card p-6 reveal delay-400 group hover:border-accent-gold/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.1)] text-accent-gold flex items-center justify-center group-hover:bg-[rgba(245,158,11,0.2)] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-sm text-text-muted mb-1">Next Draw</div>
                    <div className="text-xl font-bold mb-2">14 Days</div>
                    <div className="text-xs text-text-secondary text-accent-gold">Current Jackpot: ₹{jackpot.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                </div>

                {/* Upcoming Status / Scores */}
                <div className="glass-card p-6 reveal delay-400 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20V10M18 20V4M6 20v-4" />
                            </svg>
                        </div>
                        <Link href="/dashboard/scores" className="text-xs text-text-secondary hover:text-foreground border border-border px-2 py-1 rounded">Update</Link>
                    </div>
                    <div className="text-sm text-text-muted mb-1">Your Numbers</div>
                    <div className="flex gap-2">
                        {userData?.scores.map((score, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-bold text-text-secondary bg-[rgba(255,255,255,0.02)]">
                                {score.value}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity / Total Winnings */}
                <div className="lg:col-span-2 glass-card p-6 reveal delay-500">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Total Winnings</h3>
                        <Link href="/dashboard/winnings" className="btn-secondary !py-2 !px-4 !text-xs">View History</Link>
                    </div>
                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-5xl font-bold gradient-text-gold">₹{totalWinnings.toFixed(2)}</span>
                        <span className="text-sm text-text-secondary mb-2">Lifetime earnings</span>
                    </div>

                    <div className="space-y-4">
                        <div className="text-sm font-medium mb-2 border-b border-border pb-2">Recent Payouts</div>
                        {userData?.winners && userData.winners.length > 0 ? (
                            userData.winners.map((payout, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-[rgba(245,158,11,0.1)] text-accent-gold flex items-center justify-center text-lg">
                                            ⭐
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">Draw Winner</div>
                                            <div className="text-xs text-text-secondary">{new Date(payout.draw.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm">₹{payout.prize?.toFixed(2) || "0.00"}</div>
                                        <div className="text-xs font-medium text-accent-emerald capitalize">{payout.status}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-text-secondary py-4 text-center">No payouts yet. Keep playing!</div>
                        )}
                    </div>
                </div>

                {/* Charity Spotlight */}
                <div className="glass-card p-0 overflow-hidden reveal delay-600 group">
                    <div className="h-32 bg-cover bg-center rounded-t-2xl relative" style={{ backgroundImage: `url('${userData?.charity?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}')` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        <div className="absolute top-4 right-4 text-xs font-mono px-2 py-1 rounded bg-black/50 backdrop-blur border border-white/10 text-white">Your Charity</div>
                    </div>
                    <div className="p-6 relative">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg border-4 border-background absolute -top-12 overflow-hidden">
                            {userData?.charity?.image ? <img src={userData.charity.image} alt={userData.charity.name} className="w-full h-full object-cover" /> : "❤️"}
                        </div>
                        <h3 className="text-lg font-bold mt-4 mb-2">{userData?.charity?.name || "Select a Charity"}</h3>
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed line-clamp-3">
                            {userData?.charity?.description || "In Settings, you can choose which charity your contribution goes to. Your support makes a real difference!"}
                        </p>
                        <div className="w-full bg-surface rounded-full h-2 mb-2 overflow-hidden border border-border">
                            <div className="bg-gradient-to-r from-accent-teal to-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-text-secondary font-mono">
                            <span>Goal: ₹10,000</span>
                            <span>45% Funded</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
