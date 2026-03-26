"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Score {
    id: string;
    value: number;
    date: string;
}

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    isSubscribed: boolean;
    subscriptionEnd: string | null;
    charityContribution: number;
    charity: { name: string } | null;
    scores: Score[];
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subEnd, setSubEnd] = useState("");
    const [contribution, setContribution] = useState(10);

    // Score states
    const [newScoreVal, setNewScoreVal] = useState("");
    const [newScoreDate, setNewScoreDate] = useState("");
    const [actingScore, setActingScore] = useState<string | null>(null);

    useEffect(() => {
        fetchUser();
    }, [id]);

    async function fetchUser() {
        const res = await fetch(`/api/admin/users/${id}`, { credentials: "include" });
        if (!res.ok) {
            if (res.status === 404) router.push("/admin/users");
            return;
        }
        const data = await res.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setIsSubscribed(data.isSubscribed);
        setSubEnd(data.subscriptionEnd ? data.subscriptionEnd.split("T")[0] : "");
        setContribution(data.charityContribution);
        setLoading(false);
    }

    async function saveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    isSubscribed,
                    subscriptionEnd: subEnd || null,
                    charityContribution: contribution,
                }),
            });
            await fetchUser();
        } finally {
            setSaving(false);
        }
    }

    async function deleteScore(scoreId: string) {
        if (!confirm("Delete this score?")) return;
        setActingScore(scoreId);
        try {
            await fetch(`/api/admin/users/${id}/scores/${scoreId}`, { method: "DELETE" });
            fetchUser();
        } finally {
            setActingScore(null);
        }
    }

    async function addScore(e: React.FormEvent) {
        e.preventDefault();
        setActingScore("new");
        try {
            await fetch(`/api/admin/users/${id}/scores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: parseInt(newScoreVal), date: newScoreDate })
            });
            setNewScoreVal("");
            setNewScoreDate("");
            fetchUser();
        } finally {
            setActingScore(null);
        }
    }

    if (loading) return <div className="p-10 text-center animate-pulse">Loading User...</div>;
    if (!user) return <div className="p-10 text-center text-rose-400">User not found.</div>;

    return (
        <div>
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-2 text-sm text-text-muted">
                    <Link href="/admin/users" className="hover:text-foreground">Users</Link>
                    <span>/</span>
                    <span className="text-foreground">{user.name}</span>
                </div>
                <h1 className="text-2xl font-bold mb-1">Manage User</h1>
                <p className="text-text-secondary text-sm">Edit profile details, manage active subscriptions, and manually intervene with scores.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <form onSubmit={saveProfile} className="glass-card p-6 flex flex-col gap-5">
                    <h3 className="font-semibold text-lg border-b border-border pb-3">Profile & Subscription</h3>
                    
                    <div>
                        <label className="block text-xs text-text-secondary mb-1 uppercase tracking-widest font-semibold">Name</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-emerald transition-colors" />
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1 uppercase tracking-widest font-semibold">Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-emerald transition-colors" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-widest font-semibold">Charity Split (%)</label>
                            <input type="number" min="0" max="50" value={contribution} onChange={e => setContribution(parseInt(e.target.value))} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-widest font-semibold">Supported Charity</label>
                            <div className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-text-muted cursor-not-allowed">
                                {user.charity?.name || "None Selected"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(6,182,212,0.03)] border border-accent-teal/20 rounded-xl p-5 mt-2">
                        <h4 className="text-sm font-semibold text-accent-teal mb-4">Subscription Override</h4>
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${isSubscribed ? "bg-accent-emerald" : "bg-surface border border-border"}`} onClick={() => setIsSubscribed(!isSubscribed)}>
                                <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${isSubscribed ? "translate-x-7" : "translate-x-1"}`} />
                            </div>
                            <span className="text-sm font-medium">Force Active Subscription</span>
                        </label>
                        
                        <div>
                            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-widest font-semibold">Expiration Date (Optional)</label>
                            <input type="date" value={subEnd} onChange={e => setSubEnd(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-teal transition-colors" />
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary mt-2">
                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                </form>

                {/* Score Management */}
                <div className="glass-card p-6 flex flex-col gap-6">
                    <h3 className="font-semibold text-lg border-b border-border pb-3">Stableford Scores ({user.scores.length})</h3>
                    
                    {user.scores.length === 0 ? (
                        <div className="text-sm text-text-muted text-center py-6 bg-surface rounded-lg">No scores plotted yet.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {user.scores.map(s => (
                                <div key={s.id} className="flex items-center justify-between bg-surface border border-border rounded-lg p-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-accent-gold/10 text-accent-gold font-bold flex items-center justify-center text-lg">{s.value}</div>
                                        <div>
                                            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Score Date</div>
                                            <div className="text-sm font-medium">{new Date(s.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <button 
                                        disabled={actingScore === s.id}
                                        onClick={() => deleteScore(s.id)} 
                                        className="text-rose-400 hover:text-rose-300 text-xs px-3 py-1.5 rounded hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={addScore} className="bg-surface border border-border rounded-xl p-5 mt-auto">
                        <h4 className="text-sm font-semibold mb-3">Admin Over-ride: Add Score</h4>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <label className="block text-xs text-text-secondary mb-1">Value (1-45)</label>
                                <input required type="number" min="1" max="45" value={newScoreVal} onChange={e => setNewScoreVal(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent-gold" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-text-secondary mb-1">Date</label>
                                <input required type="date" value={newScoreDate} onChange={e => setNewScoreDate(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent-gold" />
                            </div>
                            <button type="submit" disabled={actingScore === "new"} className="btn-secondary h-[38px] px-4 font-medium !min-w-0">
                                <span>{actingScore === "new" ? "..." : "Add"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
