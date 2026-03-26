"use client";

import { useReveal } from "../hooks/useReveal";

const tiers = [
    { match: "5-Number Match", share: 40, rollover: true, label: "Jackpot", icon: "👑", glowBg: "rgba(245,158,11,0.1)" },
    { match: "4-Number Match", share: 35, rollover: false, label: "Second Tier", icon: "🏆", glowBg: "rgba(16,185,129,0.1)" },
    { match: "3-Number Match", share: 25, rollover: false, label: "Third Tier", icon: "⭐", glowBg: "rgba(6,182,212,0.1)" },
];

export default function PrizePool() {
    const sectionRef = useReveal();

    return (
        <section id="prizes" className="section-padding" style={{ position: "relative" }} ref={sectionRef}>
            <div className="bg-orb" style={{ top: "50%", right: 0, width: 600, height: 600, background: "rgba(245,158,11,0.03)" }} />

            <div className="container-md" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header reveal">
                    <span className="section-label section-label-gold">Prize Pool</span>
                    <h2 className="section-title">
                        Bigger Scores, <span className="gradient-text-gold">Bigger Rewards</span>
                    </h2>
                    <p className="section-desc">
                        Every subscription feeds the prize pool. Match your scores to the monthly draw numbers and win big — with jackpot rollovers that keep growing.
                    </p>
                </div>

                <div className="prize-grid">
                    {tiers.map((tier, i) => (
                        <div key={tier.match} className={`reveal delay-${(i + 1) * 100}`}>
                            <div className="glass-card prize-card">
                                <div className="prize-glow" style={{ background: tier.glowBg }} />
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div className="prize-icon">{tier.icon}</div>
                                    <div className="prize-label">{tier.label}</div>
                                    <h3 className="prize-match">{tier.match}</h3>

                                    <div className="prize-ring">
                                        <svg viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(tier.share / 100) * 327} 327`} />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="var(--accent-emerald)" />
                                                    <stop offset="100%" stopColor="var(--accent-teal)" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="prize-ring-value">{tier.share}%</div>
                                    </div>

                                    <p className="prize-share-text">of the total pool</p>

                                    {tier.rollover && (
                                        <div className="rollover-badge">
                                            <span className="rollover-dot" />
                                            <span className="rollover-text">Jackpot Rollover</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal delay-400">
                    <div className="glass-card" style={{ padding: "32px" }}>
                        <div className="draw-info-grid">
                            <div>
                                <h3 className="draw-info-title">Monthly Draws</h3>
                                <p className="draw-info-desc">Draws run once per month. Results are verified and published by our admin team before prizes are awarded.</p>
                            </div>
                            <div>
                                <h3 className="draw-info-title">Split Prizes</h3>
                                <p className="draw-info-desc">Multiple winners in the same tier? Prizes are split equally among all matching participants. Fair play, always.</p>
                            </div>
                            <div>
                                <h3 className="draw-info-title">Growing Jackpot</h3>
                                <p className="draw-info-desc">No 5-number winner this month? The jackpot rolls over, building into a life-changing prize pool.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
