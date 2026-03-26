"use client";

import { useState, useEffect } from "react";
import { useReveal } from "../../hooks/useReveal";

interface ScoreEntry {
    id: string;
    value: number;
    date: string;
    createdAt: string;
    userId: string;
}

export default function ScoresPage() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const revealRef = useReveal([scores]);

    const [newScore, setNewScore] = useState("");
    const [newDate, setNewDate] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchScoresAndUser() {
        try {
            const [scoresRes, userRes] = await Promise.all([
                fetch("/api/score", { method: "GET", credentials: "include" }),
                fetch("/api/user", { method: "GET", credentials: "include" })
            ]);
            
            const scoresData = await scoresRes.json();
            const userData = await userRes.json();
            
            setScores(scoresData);
            setIsSubscribed(userData?.isSubscribed || false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchScoresAndUser();
    }, []);

    const handleAddScore = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!newScore || !newDate) return;

        const value = parseInt(newScore);

        if (value < 1 || value > 45) {
            alert("Score must be between 1 and 45");
            return;
        }

        try {
            const res = await fetch("/api/score", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    value,
                    date: newDate,
                }),
            });

            if (!res.ok) {
                alert("Failed to add score");
                return;
            }

            const newEntry = await res.json();

            //  Update UI instantly
            setScores(prev => {
                const updated = [newEntry, ...prev].slice(0, 5);
                return updated.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            });
            setNewScore("");
            setNewDate("");
        } catch (err) {
            console.error(err);
        }

    };

    return (
        <div ref={revealRef}>
            <header className="mb-8 reveal delay-100">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">My Scores</h1>
                <p className="text-text-secondary text-sm">Enter your latest Stableford scores. The system stores your 5 most recent rounds.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 reveal delay-200">
                    <form onSubmit={handleAddScore} className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20V10M18 20V4M6 20v-4" />
                            </svg>
                            Enter New Score
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-muted mb-2 font-mono uppercase tracking-wider">Stableford value</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        max="45"
                                        name="score"
                                        value={newScore}
                                        onChange={(e) => setNewScore(e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:border-accent-emerald transition-colors"
                                        placeholder="e.g. 36"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-semibold pointer-events-none">Pts</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-text-muted mb-2 font-mono uppercase tracking-wider">Date Played</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent-emerald transition-colors appearance-none"
                                    style={{ colorScheme: "dark" }}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-primary mt-8 py-3">
                            <span>Submit Score</span>
                        </button>
                        <p className="text-xs text-text-muted mt-4 text-center">
                            New scores will automatically replace your oldest entry.
                        </p>
                    </form>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2 reveal delay-300">
                        <h3 className="text-lg font-semibold">Your Active Numbers</h3>
                        {(scores.length >= 5 && isSubscribed) ? <span className="text-xs font-mono bg-surface border border-border px-2 py-1 rounded text-accent-emerald">Rolling 5</span> : <span className="text-xs font-mono bg-surface border border-border px-2 py-1 rounded text-red-500">Add 5 scores and Subscribe to be eligible for the draw</span>}
                    </div>

                    <div className="grid gap-4">
                        {scores.map((score, index) => {
                            const isActive = scores.length >= 5 && isSubscribed;
                            return (
                                <div
                                    key={score.id}
                                    className={`glass-card p-4 flex items-center justify-between reveal delay-${(index + 3) * 100} transition-all duration-300 ${isActive ? "hover:border-accent-emerald/30 group" : ""}`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Position Badge */}
                                        <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-xs font-mono text-text-muted">
                                            #{index + 1}
                                        </div>

                                        {/* Score */}
                                        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${isActive ? "bg-gradient-to-br from-[rgba(16,185,129,0.1)] to-[rgba(6,182,212,0.1)] border border-accent-emerald/20 group-hover:from-accent-emerald group-hover:to-accent-teal shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-surface border border-border"}`}>
                                            <span className={`text-xl font-bold ${isActive ? "group-hover:text-black" : "text-text-muted"}`}>{score.value}</span>
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <div className="font-semibold text-lg">Stableford Round</div>
                                            <div className="text-sm text-text-secondary flex items-center gap-2">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                {new Date(score.date).toDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        {isActive ? <span className="w-2 h-2 rounded-full bg-accent-emerald"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                        {isActive ? <span className="text-xs text-text-muted">Active for Draw</span> : <span className="text-xs text-text-muted">Inactive for Draw</span>}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty slots if less than 5 */}
                        {Array.from({ length: 5 - scores.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="glass-card border-dashed p-4 flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-xs font-mono text-text-muted">
                                        #{scores.length + idx + 1}
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-surface border border-dashed border-border flex items-center justify-center">
                                        <span className="text-sm text-text-muted">-</span>
                                    </div>
                                    <div className="text-sm text-text-muted italic">Empty Slot</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
