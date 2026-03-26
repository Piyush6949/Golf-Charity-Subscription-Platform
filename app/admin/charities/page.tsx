"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Charity {
    id: string;
    name: string;
    description: string;
    image: string | null;
    createdAt: string;
    _count?: { users: number };
}

export default function AdminCharitiesPage() {
    const [charities, setCharities] = useState<Charity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCharity, setEditingCharity] = useState<Charity | null>(null);

    // Form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCharities();
    }, []);

    async function fetchCharities() {
        // We can use the public endpoint to get charities, but we need the user counts ideally.
        // The public endpoint `GET /api/charities` probably returns `_count` too if configured.
        // Let's rely on the public endpoint for now.
        const r = await fetch("/api/charities");
        const data = await r.json();
        setCharities(data);
        setLoading(false);
    }

    function openModal(charity?: Charity) {
        if (charity) {
            setEditingCharity(charity);
            setName(charity.name);
            setDescription(charity.description);
            setImage(charity.image || "");
        } else {
            setEditingCharity(null);
            setName("");
            setDescription("");
            setImage("");
        }
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    async function saveCharity(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCharity) {
                await fetch(`/api/admin/charities/${editingCharity.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description, image: image || null })
                });
            } else {
                await fetch(`/api/admin/charities`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description, image: image || null })
                });
            }
            await fetchCharities();
            closeModal();
        } finally {
            setSaving(false);
        }
    }

    async function deleteCharity(id: string) {
        if (!confirm("Are you sure? Users linked to this charity will be reset to no charity.")) return;
        try {
            await fetch(`/api/admin/charities/${id}`, { method: "DELETE" });
            await fetchCharities();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Charities</h1>
                    <p className="text-text-secondary text-sm">Manage partner organizations available for users to support.</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary py-2 px-4 shadow-lg flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Add Charity</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-text-muted text-sm animate-pulse">Loading charities…</div>
                ) : charities.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-text-muted text-sm glass-card">No charities found. Add one to get started.</div>
                ) : (
                    charities.map(charity => (
                        <div key={charity.id} className="glass-card overflow-hidden flex flex-col group">
                            <div className="h-40 relative bg-surface border-b border-border overflow-hidden">
                                {charity.image ? (
                                    <Image src={charity.image} alt={charity.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted/30">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(charity)} className="w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:text-accent-teal hover:border-accent-teal transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button onClick={() => deleteCharity(charity.id)} className="w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:text-rose-400 hover:border-rose-400 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-2">{charity.name}</h3>
                                <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">{charity.description}</p>
                                <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border mt-auto">
                                    <span>Added {new Date(charity.createdAt).toLocaleDateString()}</span>
                                    {charity._count && <span>{charity._count.users} Users</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface">
                            <h2 className="text-lg font-bold">{editingCharity ? "Edit Charity" : "New Charity"}</h2>
                            <button onClick={closeModal} className="text-text-muted hover:text-foreground transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <form onSubmit={saveCharity} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-text-secondary mb-1">Name *</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-emerald transition-colors" placeholder="Healthy Kids Org" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-text-secondary mb-1">Description *</label>
                                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-emerald transition-colors resize-none" placeholder="Details about their mission..."></textarea>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-text-secondary mb-1">Image URL</label>
                                <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-emerald transition-colors" placeholder="https://example.com/logo.png" />
                                {image && (
                                    <div className="mt-3 relative h-24 w-full rounded-lg overflow-hidden border border-border bg-surface">
                                        <Image src={image} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary py-2 px-6">
                                    <span>{saving ? "Saving..." : "Save"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
