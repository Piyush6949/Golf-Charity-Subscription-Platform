"use client";

import { useReveal } from "../hooks/useReveal";
import { useEffect, useState } from "react";

const initialStats = [
    { value: "₹2.4M+", label: "Raised for Charities" },
    { value: "120+", label: "Partner Charities" },
    { value: "40K+", label: "Lives Impacted" },
    { value: "10%+", label: "Every Subscription" },
];

const charitiesList = [
    { name: "Green Future Foundation", category: "Environment", description: "Restoring natural habitats and promoting sustainable golf course management.", barColor: "linear-gradient(90deg, #10b981, #16a34a)" },
    { name: "Youth First Trust", category: "Education", description: "Providing sports scholarships and mentoring for underprivileged young people.", barColor: "linear-gradient(90deg, #3b82f6, #06b6d4)" },
    { name: "Hearts & Hopes", category: "Healthcare", description: "Funding medical care and mental health support in communities worldwide.", barColor: "linear-gradient(90deg, #f43f5e, #ec4899)" },
];

export default function CharityImpact() {
    const sectionRef = useReveal();
    const [displayStats, setDisplayStats] = useState(initialStats);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.totalCharityRaised !== undefined) {
                    setDisplayStats([
                        { value: `₹${(data.totalCharityRaised || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Raised for Charities" },
                        { value: "3", label: "Partner Charities" },
                        { value: `${(data.activeSubscribers * 2) || 0}+`, label: "Lives Impacted" },
                        { value: "10%+", label: "Every Subscription" },
                    ]);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <section id="charities" className="section-padding" style={{ position: "relative" }} ref={sectionRef}>
            <div className="bg-orb" style={{ top: 0, left: 0, width: 700, height: 700, background: "rgba(16,185,129,0.04)" }} />

            <div className="container-md" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header reveal">
                    <span className="section-label section-label-emerald">Charity Impact</span>
                    <h2 className="section-title">
                        Every Round You Play <span className="gradient-text">Changes a Life</span>
                    </h2>
                    <p className="section-desc">
                        A minimum of 10% of every subscription goes directly to your chosen charity. You can increase it, and even donate independently.
                    </p>
                </div>

                <div className="stats-grid">
                    {displayStats.map((stat, i) => (
                        <div key={stat.label} className={`reveal delay-${(i + 1) * 100}`}>
                            <div className="glass-card stat-card">
                                <div className="stat-value gradient-text">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal" style={{ marginBottom: 48 }}>
                    <h3 className="section-title" style={{ textAlign: "center", fontSize: 24 }}>Featured Charities</h3>
                </div>

                <div className="charities-grid">
                    {charitiesList.map((charity, i) => (
                        <div key={charity.name} className={`reveal delay-${(i + 1) * 100}`}>
                            <div className="glass-card charity-card">
                                <div className="charity-bar" style={{ background: charity.barColor }} />
                                <div className="charity-body">
                                    <span className="charity-category">{charity.category}</span>
                                    <h4 className="charity-name">{charity.name}</h4>
                                    <p className="charity-desc">{charity.description}</p>
                                    <a href="#" className="charity-link">
                                        Learn more
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
