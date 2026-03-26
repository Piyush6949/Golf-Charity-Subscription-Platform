"use client";

import { useEffect, useState } from "react";

interface Winner {
    id: string;
    matchCount: number;
    prize: number | null;
    status: string;
    proof: string | null;
    createdAt: string;
    user: { name: string; email: string };
    draw: { createdAt: string; numbers: number[] };
}

const STATUS_STYLES: Record<string, string> = {
    pending:
        "text-amber-400 bg-[rgba(245,158,11,0.1)] border-amber-400/30",

    under_review:
        "text-blue-400 bg-[rgba(59,130,246,0.1)] border-blue-400/30",

    approved:
        "text-accent-teal bg-[rgba(6,182,212,0.1)] border-accent-teal/30",

    paid:
        "text-emerald-400 bg-[rgba(16,185,129,0.1)] border-emerald-400/30",

    rejected:
        "text-rose-400 bg-[rgba(244,63,94,0.1)] border-rose-400/30",
};

export default function AdminWinnersPage() {
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    async function fetchWinners() {
        const r = await fetch("/api/admin/winners", { credentials: "include" });
        setWinners(await r.json());
    }

    useEffect(() => {
        fetchWinners().finally(() => setLoading(false));
    }, []);

    async function updateStatus(id: string, status: string) {
        setUpdating(id);
        try {
            await fetch(`/api/admin/winners/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            await fetchWinners();
        } finally {
            setUpdating(null);
        }
    }

    const pending = winners.filter((w) => { if (w.status === "pending" || w.status === "under_review") return w });
    const rest = winners.filter((w) => { if (w.status !== "pending" && w.status !== "under_review") return w });

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Winners</h1>
                <p className="text-text-secondary text-sm">Review proof submissions and approve or reject payout claims.</p>
            </header>

            {/* Summary chips */}
            <div className="flex gap-3 flex-wrap mb-8">
                {(["pending", "under_review", "approved", "paid", "rejected"] as const).map((s) => (
                    <div key={s} className={`text-xs px-3 py-1.5 rounded-full border capitalize font-medium ${STATUS_STYLES[s]}`}>
                        {s}: {winners.filter((w) => w.status === s).length}
                    </div>
                ))}
            </div>

            <WinnersTable
                title="Pending Approvals"
                winners={pending}
                loading={loading}
                updating={updating}
                onStatus={updateStatus}
                emptyMsg="No pending approvals."
            />

            <div className="mt-8">
                <WinnersTable
                    title="All Winners"
                    winners={rest}
                    loading={false}
                    updating={updating}
                    onStatus={updateStatus}
                    emptyMsg="No other winner records."
                />
            </div>
        </div>
    );
}

function WinnersTable({
    title,
    winners,
    loading,
    updating,
    onStatus,
    emptyMsg,
}: {
    title: string;
    winners: Winner[];
    loading: boolean;
    updating: string | null;
    onStatus: (id: string, status: string) => void;
    emptyMsg: string;
}) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className="text-xs text-text-muted font-mono">{winners.length}</span>
            </div>

            {loading ? (
                <div className="p-10 text-center text-text-muted text-sm animate-pulse">Loading…</div>
            ) : winners.length === 0 ? (
                <div className="p-10 text-center text-text-muted text-sm">{emptyMsg}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-muted uppercase border-b border-border">
                            <tr>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Draw Date</th>
                                <th className="px-5 py-3 font-medium">Matches</th>
                                <th className="px-5 py-3 font-medium">Prize</th>
                                <th className="px-5 py-3 font-medium">Proof</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {winners.map((w) => (
                                <tr key={w.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-medium">{w.user.name}</div>
                                        <div className="text-xs text-text-muted">{w.user.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-text-secondary text-xs">
                                        {new Date(w.draw.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    <td className="px-5 py-4 font-bold text-accent-gold">{w.matchCount}</td>
                                    <td className="px-5 py-4 font-medium">₹{w.prize ?? "—"}</td>
                                    <td className="px-5 py-4">
                                        {w.proof ? (
                                            <a href={w.proof.startsWith("http") ? w.proof : `../uploads/${w.proof}`} target="_blank" rel="noreferrer" className="text-accent-teal underline text-xs">View</a>
                                        ) : (
                                            <span className="text-xs text-rose-400">Missing</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded border capitalize font-medium ${STATUS_STYLES[w.status] ?? ""}`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2 justify-end flex-wrap">
                                            {(w.status === "pending" || w.status === "under_review") && (
                                                <>
                                                    <button
                                                        disabled={updating === w.id}
                                                        onClick={() => onStatus(w.id, "approved")}
                                                        className="text-xs px-2.5 py-1 rounded bg-[rgba(6,182,212,0.1)] text-accent-teal border border-accent-teal/20 hover:bg-[rgba(6,182,212,0.2)] transition-colors disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={updating === w.id}
                                                        onClick={() => onStatus(w.id, "rejected")}
                                                        className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {w.status === "approved" && (
                                                <button
                                                    disabled={updating === w.id}
                                                    onClick={() => onStatus(w.id, "paid")}
                                                    className="text-xs px-2.5 py-1 rounded bg-[rgba(16,185,129,0.1)] text-accent-emerald border border-accent-emerald/20 hover:bg-[rgba(16,185,129,0.2)] transition-colors disabled:opacity-50"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
