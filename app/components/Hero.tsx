"use client";

import { useEffect, useState } from "react";

export default function Hero() {
    const [dynamicStats, setDynamicStats] = useState({
        monthlyPrizes: "₹50K+",
        activeSubscribers: "5K+",
    });

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.monthlyPrizes !== undefined) {
                    setDynamicStats({
                        monthlyPrizes: `₹${(data.monthlyPrizes || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                        activeSubscribers: `${data.activeSubscribers || 0}`
                    });
                }
            })
            .catch(console.error);
    }, []);

    return (
        <section className="hero">
            <div className="hero-bg">
                <div className="hero-orb hero-orb-1 animate-pulse-glow" />
                <div className="hero-orb hero-orb-2 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
                <div className="hero-orb hero-orb-3 animate-pulse-glow" style={{ animationDelay: "3s" }} />
                <div className="hero-grid" />
            </div>

            <div className="hero-dot animate-float" style={{ top: "80px", right: "15%", width: 12, height: 12, background: "rgba(16,185,129,0.5)" }} />
            <div className="hero-dot animate-float" style={{ top: "160px", left: "10%", width: 8, height: 8, background: "rgba(6,182,212,0.5)", animationDelay: "2s" }} />
            <div className="hero-dot animate-float-slow" style={{ bottom: "128px", right: "25%", width: 16, height: 16, background: "rgba(245,158,11,0.3)", animationDelay: "1s" }} />
            <div className="hero-dot animate-float" style={{ bottom: "192px", left: "20%", width: 10, height: 10, background: "rgba(16,185,129,0.4)", animationDelay: "3s" }} />

            <div className="hero-content">
                <div className="hero-badge animate-fade-in">
                    <span className="hero-badge-dot" />
                    <span className="hero-badge-text">A New Way to Play &amp; Give</span>
                </div>

                <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
                    Play Golf.<br />
                    <span className="gradient-text">Win Prizes.</span><br />
                    Change Lives.
                </h1>

                <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    Subscribe, enter your Stableford scores, and compete in monthly prize
                    draws — all while supporting the charities that matter most to you.
                </p>

                <div className="hero-cta animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
                    <a href="#pricing" className="btn-primary btn-lg">
                        <span>Start Winning &amp; Giving</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a href="#how-it-works" className="btn-secondary btn-lg">
                        See How It Works
                    </a>
                </div>

                <div className="hero-stats animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                    {[
                        { value: dynamicStats.monthlyPrizes, label: "In Monthly Prizes" },
                        { value: "10%+", label: "To Charity Always" },
                        { value: dynamicStats.activeSubscribers, label: "Active Subscribers" },
                    ].map((stat) => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                            <div className="hero-stat-value gradient-text">{stat.value}</div>
                            <div className="hero-stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hero-fade" />
        </section>
    );
}
