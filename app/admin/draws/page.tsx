"use client";

import { useEffect, useState } from "react";

interface Draw {
    id: string;
    numbers: number[];
    isPublished: boolean;
    createdAt: string;
    _count: { winners: number };
}

export default function AdminDrawsPage() {
    const [draws, setDraws] = useState<Draw[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    async function fetchDraws() {
        const r = await fetch("/api/admin/draws", { credentials: "include" });
        setDraws(await r.json());
    }

    useEffect(() => {
        fetchDraws().finally(() => setLoading(false));
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/admin/draws", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchDraws();
            } else {
                const data = await res.json();
                alert(data.error ?? "Failed to create draw.");
            }
        } finally {
            setCreating(false);
        }
    }

    async function handlePublish(id: string) {
        if (!confirm("Publish this draw? This will run winner-matching for all subscribers and cannot be undone.")) return;
        setPublishingId(id);
        try {
            const res = await fetch(`/api/admin/draws/${id}/publish`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Draw published! ${data.winnersCreated} winner(s) matched.`);
                await fetchDraws();
            } else {
                alert(data.error ?? "Failed to publish.");
            }
        } finally {
            setPublishingId(null);
        }
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Draws</h1>
                <p className="text-text-secondary text-sm">Create draws, enter numbers, and publish to run winner matching.</p>
            </header>

            {/* Create form */}
            <div className="glass-card p-6 mb-8 border-accent-gold/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Create New Draw
                </h2>
                <form onSubmit={handleCreate}>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={creating}
                            className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
                        >
                            {creating ? "Creating…" : "Create Random Draw"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Draws list */}
            <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                    <h3 className="text-lg font-semibold">All Draws</h3>
                    <span className="text-xs text-text-muted font-mono">{draws.length} total</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-text-muted text-sm animate-pulse">Loading draws…</div>
                ) : draws.length === 0 ? (
                    <div className="p-12 text-center text-text-muted text-sm">No draws yet. Create your first one above.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-muted uppercase border-b border-border">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Numbers</th>
                                    <th className="px-5 py-3 font-medium text-center">Winners</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {draws.map((draw) => (
                                    <tr key={draw.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                                        <td className="px-5 py-4 text-text-secondary text-xs">
                                            {new Date(draw.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-1.5">
                                                {draw.numbers.map((n, i) => (
                                                    <span key={i} className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold">
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center font-mono">{draw._count.winners}</td>
                                        <td className="px-5 py-4">
                                            {draw.isPublished ? (
                                                <span className="text-xs px-2 py-0.5 rounded bg-[rgba(16,185,129,0.1)] text-accent-emerald">Published</span>
                                            ) : (
                                                <span className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-text-muted">Draft</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {!draw.isPublished && (
                                                <button
                                                    disabled={publishingId === draw.id}
                                                    onClick={() => handlePublish(draw.id)}
                                                    className="text-xs px-3 py-1.5 rounded bg-accent-gold/10 text-accent-gold border border-accent-gold/20 hover:bg-accent-gold/20 transition-colors disabled:opacity-50"
                                                >
                                                    {publishingId === draw.id ? "Publishing…" : "Publish & Match"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
