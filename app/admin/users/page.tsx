"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    isSubscribed: boolean;
    subscriptionEnd: string | null;
    country: string;
    charityContribution: number;
    createdAt: string;
    _count: { scores: number };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/admin/users", { credentials: "include" })
            .then((r) => r.json())
            .then(setUsers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Users</h1>
                    <p className="text-text-secondary text-sm">{users.length} registered users</p>
                </div>
                <input
                    type="text"
                    placeholder="Search name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-emerald transition-colors w-64"
                />
            </header>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-text-muted text-sm animate-pulse">Loading users…</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-muted uppercase border-b border-border bg-surface">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Subscription</th>
                                    <th className="px-5 py-3 font-medium">Country</th>
                                    <th className="px-5 py-3 font-medium text-center">Scores</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Joined</th>
                                    <th className="px-5 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-text-muted">No users found.</td>
                                    </tr>
                                ) : (
                                    filtered.map((user) => (
                                        <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                                            <td className="px-5 py-4 font-medium">{user.name}</td>
                                            <td className="px-5 py-4 text-text-secondary">{user.email}</td>
                                            <td className="px-5 py-4">
                                                {user.isSubscribed ? (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-[rgba(16,185,129,0.1)] text-accent-emerald">Active</span>
                                                ) : (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-surface text-text-muted border border-border">Inactive</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-text-secondary">{user.country}</td>
                                            <td className="px-5 py-4 text-center font-mono">{user._count.scores}</td>
                                            <td className="px-5 py-4">
                                                {user.role === "ADMIN" ? (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">Admin</span>
                                                ) : (
                                                    <span className="text-xs text-text-muted">User</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-text-secondary text-xs">
                                                {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link 
                                                    href={`/admin/users/${user.id}`}
                                                    className="inline-flex items-center text-xs px-3 py-1.5 rounded-md bg-surface border border-border hover:border-accent-emerald hover:text-accent-emerald transition-colors font-medium"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
