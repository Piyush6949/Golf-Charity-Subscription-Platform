"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();
    const navLinks = [
        { href: "/dashboard", label: "Overview", icon: "grid" },
        { href: "/dashboard/scores", label: "My Scores", icon: "activity" },
        { href: "/dashboard/winnings", label: "Winnings & Draws", icon: "award" },
        { href: "/dashboard/settings", label: "Settings", icon: "settings" },
    ];

    type UserData = {
        name: string;
        email: string;
        isSubscribed: boolean;
        subscriptionEnd: Date;
        charityId: string;
        charityContribution: number;
        role: string;
    }

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include",
            })
            if (!res.ok) {
                router.push("/");
            }
            const data = await res.json();
            setUserData(data);
        }
        getUser();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });
        router.push("/");
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "grid":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                );
            case "activity":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                );
            case "award":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                );
            case "settings":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-[rgba(5,5,5,0.8)] backdrop-blur-xl">
                <div className="h-20 flex items-center px-6 border-b border-border">
                    <Link href="/" className="nav-logo">
                        <div className="nav-logo-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <span className="nav-logo-text">Golf<span className="gradient-text">Charity</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                    ? "bg-[rgba(16,185,129,0.1)] text-accent-emerald border border-accent-emerald/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                    : "text-text-secondary hover:text-foreground hover:bg-surface-hover hover:scale-[1.02]"
                                    }`}
                            >
                                {getIcon(link.icon)}
                                <span className="font-medium text-sm">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-emerald to-accent-teal flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            {userData?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-semibold truncate">{userData?.name}</div>
                            <div className="text-xs text-text-muted truncate">{userData?.role}</div>
                        </div>
                    </div>
                    <button className="w-full mt-2 text-left px-4 py-2 text-sm text-text-muted hover:text-rose-400 transition-colors" onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Background glow for the content area */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-emerald/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* Header - Mobile & Desktop Top Bar */}
                <header className="h-16 md:h-20 border-b border-border bg-[rgba(5,5,5,0.8)] backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center md:hidden">
                        <Link href="/" className="nav-logo">
                            <div className="nav-logo-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 justify-end items-center gap-4">
                            <div className="text-sm text-text-secondary flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                            {userData?.isSubscribed ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                                    Subscription Active
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                                    Subscription Inactive
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        className="md:hidden mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : '' }} />
                        <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
                        <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : '' }} />
                    </button>
                </header>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-[rgba(5,5,5,0.95)] backdrop-blur-xl border-b border-border z-50 p-4">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-[rgba(16,185,129,0.1)] text-accent-emerald" : "text-text-secondary"
                                            }`}
                                    >
                                        {getIcon(link.icon)}
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="h-px bg-border my-2" />
                            <button className="flex items-center gap-3 px-4 py-3 text-rose-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span className="font-medium">Sign out</span>
                            </button>
                        </nav>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto reveal animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
