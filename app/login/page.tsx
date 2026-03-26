"use client";

import Link from "next/link";
import { useReveal } from "../hooks/useReveal";

export default function LoginPage() {
    const revealRef = useReveal();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden" ref={revealRef}>

            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-emerald/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-teal/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />

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
                <div className="glass-card p-8 sm:p-10 shadow-[0_0_40px_rgba(16,185,129,0.05)] border-accent-emerald/20 relative overflow-hidden">
                    {/* Subtle glow border at the top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-emerald to-accent-teal" />

                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-text-secondary text-sm mb-8">Sign in to manage your scores and see your winnings.</p>

                    <form className="space-y-5" method="post" action="/api/login">
                        <div>
                            <label className="block text-sm text-text-muted mb-2 font-medium">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald transition-all"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm text-text-muted font-medium">Password</label>
                                <Link href="#" className="text-xs text-accent-emerald hover:underline font-medium">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald transition-all"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary py-3.5 mt-4 group">
                            <span className="flex items-center justify-center gap-2">
                                Sign In
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border" />
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">New to GolfCharity?</div>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/register" className="btn-secondary w-full justify-center">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
