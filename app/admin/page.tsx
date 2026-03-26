"use client";

import { useEffect, useState } from "react";

type Stats = {
    totalUsers: number;
    activeSubscribers: number;
    totalDraws: number;
    pendingWinners: number;
};

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch("/api/admin/stats", { credentials: "include" })
            .then((r) => r.json())
            .then(setStats)
            .catch(console.error);
    }, []);

    const cards = [
        { label: "Total Users", value: stats?.totalUsers ?? "—", color: "from-[rgba(16,185,129,0.1)] to-transparent", border: "border-accent-emerald/20", text: "text-accent-emerald" },
        { label: "Active Subscribers", value: stats?.activeSubscribers ?? "—", color: "from-[rgba(6,182,212,0.1)] to-transparent", border: "border-accent-teal/20", text: "text-accent-teal" },
        { label: "Total Draws", value: stats?.totalDraws ?? "—", color: "from-[rgba(245,158,11,0.1)] to-transparent", border: "border-accent-gold/20", text: "text-accent-gold" },
        { label: "Pending Approvals", value: stats?.pendingWinners ?? "—", color: "from-[rgba(239,68,68,0.1)] to-transparent", border: "border-rose-500/20", text: "text-rose-400" },
    ];

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Admin Overview</h1>
                <p className="text-text-secondary text-sm">Platform statistics at a glance.</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {cards.map(({ label, value, color, border, text }) => (
                    <div key={label} className={`glass-card p-6 bg-gradient-to-br ${color} border ${border}`}>
                        <div className={`text-4xl font-bold mb-2 ${text}`}>{value}</div>
                        <div className="text-sm text-text-muted">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <a href="/admin/users" className="glass-card p-6 hover:border-accent-emerald/30 transition-colors group cursor-pointer">
                    <div className="text-lg font-semibold mb-1 group-hover:text-accent-emerald transition-colors">Manage Users →</div>
                    <p className="text-sm text-text-muted">View all registered users, subscription status and score history.</p>
                </a>
                <a href="/admin/draws" className="glass-card p-6 hover:border-accent-gold/30 transition-colors group cursor-pointer">
                    <div className="text-lg font-semibold mb-1 group-hover:text-accent-gold transition-colors">Manage Draws →</div>
                    <p className="text-sm text-text-muted">Create new draws, enter numbers, publish and run winner matching.</p>
                </a>
                <a href="/admin/winners" className="glass-card p-6 hover:border-rose-500/30 transition-colors group cursor-pointer">
                    <div className="text-lg font-semibold mb-1 group-hover:text-rose-400 transition-colors">Approve Winners →</div>
                    <p className="text-sm text-text-muted">Review proof submissions and approve or reject payout claims.</p>
                </a>
            </div>
        </div>
    );
}
