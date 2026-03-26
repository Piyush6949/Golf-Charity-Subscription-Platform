"use client";

import Link from "next/link";
import { useReveal } from "../hooks/useReveal";

export default function RegisterPage() {
    const revealRef = useReveal();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden" ref={revealRef}>

            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-teal/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-emerald/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 text-text-muted hover:text-foreground flex items-center gap-2 transition-colors reveal delay-100 z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Home
            </Link>

            <div className="w-full max-w-md mt-16 lg:mt-0 reveal delay-200">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="nav-logo hover:scale-105 transition-transform">
                        <div className="nav-logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <span className="nav-logo-text text-2xl">Golf<span className="gradient-text">Charity</span></span>
                    </Link>
                </div>

                {/* Auth Card */}
                <div className="glass-card p-8 sm:p-10 shadow-[0_0_40px_rgba(6,182,212,0.05)] border-accent-teal/20 relative overflow-hidden">
                    {/* Subtle glow border at the top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-teal to-accent-emerald" />

                    <h1 className="text-2xl font-bold mb-2">Join the Club</h1>
                    <p className="text-text-secondary text-sm mb-8">Play golf, win big, and support the charities you care about.</p>

                    <form className="space-y-5" method="post" action="/api/register">
                        <div>
                            <label className="block text-sm text-text-muted mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                name="name"
                                className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-text-muted mb-2 font-medium">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-text-muted mb-2 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all"
                                required
                            />
                            <p className="text-xs text-text-muted mt-2">Must be at least 8 characters.</p>
                        </div>

                        <div className="flex items-start gap-3 mt-6">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-4 h-4 rounded border-border bg-surface text-accent-teal focus:ring-accent-teal"
                                required
                            />
                            <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed">
                                I agree to the <Link href="#" className="text-accent-teal hover:underline text-foreground">Terms of Service</Link> and <Link href="#" className="text-accent-teal hover:underline text-foreground">Privacy Policy</Link>, and consent to the charity donation terms.
                            </label>
                        </div>

                        <button type="submit" className="w-full btn-primary py-3.5 mt-6 group bg-gradient-to-r from-accent-teal to-accent-emerald hover:from-accent-teal/90 hover:to-accent-emerald/90">
                            <span className="flex items-center justify-center gap-2">
                                Create Account
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 text-center text-sm text-text-secondary">
                        Already have an account? <Link href="/login" className="text-foreground font-semibold hover:text-accent-emerald transition-colors">Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
