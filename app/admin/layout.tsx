"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
    { href: "/admin", label: "Overview", icon: "grid" },
    { href: "/admin/users", label: "Users", icon: "users" },
    { href: "/admin/draws", label: "Draws", icon: "zap" },
    { href: "/admin/winners", label: "Winners", icon: "award" },
    { href: "/admin/charities", label: "Charities", icon: "heart" },
];

function Icon({ type }: { type: string }) {
    const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    switch (type) {
        case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
        case "users": return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
        case "zap": return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
        case "award": return <svg {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
        case "heart": return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
        default: return null;
    }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    // Client-side guard — redirect non-admins instantly
    useEffect(() => {
        async function check() {
            try {
                const res = await fetch("/api/admin/users", { credentials: "include" });
                if (res.status === 403 || res.status === 401) router.replace("/dashboard");
            } finally {
                setChecking(false);
            }
        }
        check();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent-emerald border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-60 border-r border-border bg-[rgba(5,5,5,0.9)] backdrop-blur-xl flex flex-col">
                <div className="h-16 flex items-center px-5 border-b border-border gap-3">
                    <div className="w-7 h-7 rounded bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xs font-bold">A</div>
                    <span className="font-semibold text-sm">Admin Panel</span>
                </div>

                <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                    {NAV.map((link) => {
                        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : "text-text-secondary hover:text-foreground hover:bg-surface"
                                    }`}
                            >
                                <Icon type={link.icon} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link href="/dashboard" className="flex items-center gap-2 text-xs text-text-muted hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-surface">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
