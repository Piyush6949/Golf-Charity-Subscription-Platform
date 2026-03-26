"use client";

import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";

const plans = [
    {
        name: "Pro Subscription", price: "₹8,999", period: "/year",
        description: "Best value — join the platform, win prizes, and support charities all year long.",
        features: ["Enter your Stableford scores", "Monthly prize draw entry", "Choose your charity", "10% to charity (minimum)", "Live jackpot tracking", "Full dashboard access"],
        cta: "Subscribe Now", highlighted: true, badge: "All Access",
    },
];

export default function Pricing() {
    const sectionRef = useReveal();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch("/api/user")
            .then(res => {
                if (res.ok) setIsLoggedIn(true);
            })
            .catch(() => {});
    }, []);

    const ctaLink = isLoggedIn ? "/dashboard/settings" : "/login";

    return (
        <section id="pricing" className="section-padding" style={{ position: "relative" }} ref={sectionRef}>
            <div className="bg-orb" style={{ bottom: 0, right: "25%", width: 600, height: 600, background: "rgba(6,182,212,0.03)" }} />

            <div className="container-md" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header reveal">
                    <span className="section-label section-label-emerald">Pricing</span>
                    <h2 className="section-title">
                        Simple Plans, <span className="gradient-text">Extraordinary Impact</span>
                    </h2>
                    <p className="section-desc">
                        Choose your plan and start making a difference today. Every subscriber grows the prize pool and supports real charities.
                    </p>
                </div>

                <div className="plans-grid">
                    {plans.map((plan, i) => (
                        <div key={plan.name} className={`reveal delay-${(i + 1) * 100}`}>
                            <div className={`plan-card ${plan.highlighted ? "highlighted" : "glass-card"}`} style={{ position: "relative" }}>
                                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                                <div className="plan-name">{plan.name}</div>
                                <div className="plan-price">
                                    <span className="plan-amount">{plan.price}</span>
                                    <span className="plan-period">{plan.period}</span>
                                </div>
                                <p className="plan-desc">{plan.description}</p>
                                <a href={ctaLink} className={`plan-cta ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}>
                                    <span>{plan.cta}</span>
                                </a>
                                <ul className="plan-features">
                                    {plan.features.map((feature) => (
                                        <li key={feature}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="trust-bar reveal delay-300">
                    <div className="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Secure Payments
                    </div>
                    <div className="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        PCI Compliant
                    </div>
                    <div className="trust-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Cancel Anytime
                    </div>
                </div>
            </div>
        </section>
    );
}
