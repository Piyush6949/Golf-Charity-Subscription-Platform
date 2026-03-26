"use client";

import { useReveal } from "../../hooks/useReveal";
import { useEffect, useState } from "react";

interface Winner {
    id: string;
    matchCount: number;
    prize: number | null;
    status: string;
    proof: string | null;
    createdAt: string;
}

interface Draw {
    id: string;
    numbers: number[];
    isPublished: boolean;
    createdAt: string;
    winners: Winner[];
}

// PRIZE_MAP will be dynamically calculated
// 3 matches = 25% of pool
// 4 matches = 35% of pool
// 5 matches = 40% of pool

const STATUS_COLORS: Record<string, string> = {
    pending: "text-accent-gold bg-[rgba(245,158,11,0.1)]",
    approved: "text-accent-emerald bg-[rgba(16,185,129,0.1)]",
    paid: "text-accent-teal bg-[rgba(6,182,212,0.1)]",
    rejected: "text-rose-400 bg-rose-400/10",
};

export default function WinningsPage() {
    const [latestDraw, setLatestDraw] = useState<Draw | null>(null);
    const [history, setHistory] = useState<Draw[]>([]);
    const [jackpot, setJackpot] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const revealRef = useReveal([history]);

    useEffect(() => {
        async function fetchDrawsAndJackpot() {
            try {
                const [drawRes, jackpotRes] = await Promise.all([
                    fetch("/api/draw", { method: "GET", credentials: "include" }),
                    fetch("/api/jackpot")
                ]);
                const drawData = await drawRes.json();
                const jackpotData = await jackpotRes.json();
                
                setLatestDraw(drawData.latestDraw ?? null);
                setHistory(drawData.history ?? []);
                if (jackpotData.totalJackpot !== undefined) {
                    setJackpot(jackpotData.totalJackpot);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDrawsAndJackpot();
    }, []);

    const dynamicPrizeMap: Record<number, string> = {
        3: `₹${(jackpot * 0.25).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        4: `₹${(jackpot * 0.35).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        5: `₹${(jackpot * 0.40).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    };

    const userWin = latestDraw?.winners?.[0] ?? null;
    const totalWinnings = history
        .flatMap((d) => d.winners)
        .filter((w) => w.status === "paid")
        .reduce((sum, w) => sum + (w.prize ?? 0), 0);

    const pendingAction = history
        .flatMap((d) => d.winners)
        .some((w) => w.status === "pending" && !w.proof);

    return (
        <div ref={revealRef}>
            <header className="mb-8 reveal delay-100">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Winnings &amp; Draws</h1>
                <p className="text-text-secondary text-sm">
                    View your draw history, winnings, and upload proof for pending payouts.
                </p>
            </header>

            {/* ── Top stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Lifetime winnings */}
                <div className="glass-card p-6 reveal delay-200">
                    <div className="text-sm text-text-muted mb-2">Total Lifetime Winnings</div>
                    <div className="text-5xl font-bold gradient-text-gold mb-6">
                        ₹{totalWinnings.toFixed(2)}
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Pending Payouts:</span>
                            {pendingAction ? (
                                <span className="font-semibold text-accent-gold">Action Required</span>
                            ) : (
                                <span className="text-text-muted">None</span>
                            )}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Total Draws Entered:</span>
                            <span className="font-semibold">{history.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Draws Won:</span>
                            <span className="font-semibold">
                                {history.filter((d) => d.winners.length > 0).length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Latest draw numbers */}
                <div className="lg:col-span-2 glass-card p-6 reveal delay-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Latest Draw</h3>
                        {latestDraw && (
                            <span className="text-xs font-mono text-text-muted">
                                {new Date(latestDraw.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex gap-3">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-14 h-14 rounded-full bg-surface border border-border animate-pulse"
                                />
                            ))}
                        </div>
                    ) : latestDraw ? (
                        <>
                            <div className="flex flex-wrap gap-3 mb-5">
                                {latestDraw.numbers.map((n, i) => (
                                    <div
                                        key={i}
                                        className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(16,185,129,0.15)] to-[rgba(6,182,212,0.15)] border border-accent-emerald/30 flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                    >
                                        {n}
                                    </div>
                                ))}
                            </div>

                            {/* User result banner */}
                            {userWin ? (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(245,158,11,0.08)] border border-accent-gold/20">
                                    <span className="text-2xl">🏆</span>
                                    <div>
                                        <div className="font-bold text-accent-gold">
                                            You matched {userWin.matchCount} numbers!
                                        </div>
                                        <div className="text-sm text-text-secondary">
                                            Prize: {userWin.prize ? `₹${userWin.prize.toFixed(2)}` : (dynamicPrizeMap[userWin.matchCount] ?? "TBD")} &mdash;
                                            Status:{" "}
                                            <span
                                                className={`capitalize px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[userWin.status] ?? ""}`}
                                            >
                                                {userWin.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border text-text-muted text-sm">
                                    <span className="text-lg">🎱</span>
                                    No match this round. Better luck next draw!
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-text-muted text-sm py-6 text-center">
                            No draws have been published yet. Check back soon!
                        </div>
                    )}
                </div>
            </div>

            {/* ── Proof upload (if pending + no proof) ── */}
            {history.some((d) => d.winners.some((w) => w.status === "pending" && !w.proof)) && (
                <div className="glass-card p-6 reveal delay-400 mb-8 border-accent-gold/30 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[rgba(245,158,11,0.1)] text-accent-gold flex items-center justify-center flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Action Required: Upload Proof</h3>
                            <p className="text-sm text-text-secondary">
                                You have a pending win! Upload a screenshot of your verified golf scorecard to claim your prize.
                            </p>
                        </div>
                    </div>
                    <form action="/api/user/upload-proof" method="POST" encType="multipart/form-data">
                    <label className="border-2 border-dashed border-border hover:border-accent-gold/50 transition-colors rounded-xl p-8 text-center cursor-pointer bg-surface flex flex-col items-center gap-3">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <div className="font-semibold text-sm">Click to upload or drag and drop</div>
                        <div className="text-xs text-text-muted">JPG, PNG, PDF (max 5MB)</div>
                        <input type="file" name="proof" accept="image/*,.pdf" />
                    </label>
                        <button className="btn-primary px-6 py-2 text-sm" type="submit">Upload</button>
                    </form>
                </div>
            )}

            {/* ── Prize tiers reference ── */}
            <div className="grid grid-cols-3 gap-4 mb-8 reveal delay-400">
                {[
                    { match: 3, prize: dynamicPrizeMap[3], color: "from-[rgba(16,185,129,0.1)] to-[rgba(6,182,212,0.1)]", border: "border-accent-emerald/20" },
                    { match: 4, prize: dynamicPrizeMap[4], color: "from-[rgba(245,158,11,0.1)] to-[rgba(251,191,36,0.05)]", border: "border-accent-gold/30" },
                    { match: 5, prize: dynamicPrizeMap[5], color: "from-[rgba(139,92,246,0.1)] to-[rgba(99,102,241,0.05)]", border: "border-violet-500/30" },
                ].map(({ match, prize, color, border }) => (
                    <div key={match} className={`glass-card p-4 text-center bg-gradient-to-br ${color} border ${border}`}>
                        <div className="text-3xl font-bold mb-1">{match}</div>
                        <div className="text-xs text-text-muted uppercase tracking-widest mb-2">Matches</div>
                        <div className="text-lg font-bold gradient-text">{prize}</div>
                    </div>
                ))}
            </div>

            {/* ── Draw history table ── */}
            <div className="glass-card reveal delay-500 overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Draw History</h3>
                    <span className="text-xs text-text-muted font-mono">{history.length} draws</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-text-muted text-sm animate-pulse">Loading history…</div>
                ) : history.length === 0 ? (
                    <div className="p-12 text-center text-text-muted text-sm">
                        No draws have been published yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-muted uppercase border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Draw Date</th>
                                    <th className="px-6 py-4 font-medium">Numbers</th>
                                    <th className="px-6 py-4 font-medium">Your Result</th>
                                    <th className="px-6 py-4 font-medium">Prize</th>
                                    <th className="px-6 py-4 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((draw) => {
                                    const win = draw.winners[0] ?? null;
                                    return (
                                        <tr key={draw.id} className="border-b border-border hover:bg-surface transition-colors last:border-0">
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                {new Date(draw.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1.5">
                                                    {draw.numbers.map((n, i) => (
                                                        <span
                                                            key={i}
                                                            className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold"
                                                        >
                                                            {n}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {win ? (
                                                    <span className="flex items-center gap-1.5 text-accent-gold font-semibold">
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                        </svg>
                                                        {win.matchCount}-Match Win
                                                    </span>
                                                ) : (
                                                    <span className="text-text-muted">No match</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {win ? (win.prize ? `₹${win.prize.toFixed(2)}` : (dynamicPrizeMap[win.matchCount] ?? "TBD")) : <span className="text-text-muted">—</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {win ? (
                                                    <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[win.status] ?? ""}`}>
                                                        {win.status}
                                                    </span>
                                                ) : (
                                                    <span className="text-text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
