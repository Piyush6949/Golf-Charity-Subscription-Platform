"use client";

import { useReveal } from "../hooks/useReveal";

const steps = [
    {
        number: "01",
        title: "Subscribe",
        description: "Choose a monthly or yearly plan. A portion of your subscription goes directly to the charity of your choice.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Enter Scores",
        description: "Submit your latest 5 golf scores in Stableford format. Our system keeps your most recent scores rolling.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Monthly Draw",
        description: "Your scores become your numbers. Every month, our draw engine picks winning combinations — match to win.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M16 8l-4 4-4-4" /><path d="M12 12v4" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Win & Give",
        description: "Win from the prize pool — and know that every subscription makes a difference to real causes. Everyone wins.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    const sectionRef = useReveal();

    return (
        <section id="how-it-works" className="section-padding" style={{ position: "relative" }} ref={sectionRef}>
            <div className="bg-orb" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, background: "rgba(16,185,129,0.03)" }} />

            <div className="container-md" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header reveal">
                    <span className="section-label section-label-emerald">How It Works</span>
                    <h2 className="section-title">
                        Four Simple Steps to <span className="gradient-text">Making a Difference</span>
                    </h2>
                    <p className="section-desc">
                        From subscription to impact — here&apos;s how your love for golf transforms into real change.
                    </p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, i) => (
                        <div key={step.number} className={`reveal delay-${(i + 1) * 100}`}>
                            <div className="glass-card step-card">
                                <div className="step-bg-number">{step.number}</div>
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-label">STEP {step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.description}</p>
                                {i < steps.length - 1 && <div className="step-connector" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
