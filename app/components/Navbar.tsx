"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { href: "#how-it-works", label: "How It Works" },
        { href: "#prizes", label: "Prizes" },
        { href: "#charities", label: "Charities" },
        { href: "#pricing", label: "Pricing" },
    ];

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="navbar-inner">
                <a href="#" className="nav-logo">
                    <div className="nav-logo-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <span className="nav-logo-text">
                        Golf<span className="gradient-text">Charity</span>
                    </span>
                </a>

                <div className="nav-links">
                    {links.map((link) => (
                        <a key={link.href} href={link.href} className="nav-link">
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="nav-cta">
                    <a href="/login" className="nav-signin">Login</a>
                    <a href="#pricing" className="btn-primary btn-sm"><span>Get Started</span></a>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={`mobile-toggle ${mobileOpen ? "open" : ""}`}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>

            <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                <div className="mobile-menu-inner">
                    {links.map((link) => (
                        <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                            {link.label}
                        </a>
                    ))}
                    <a href="#pricing" className="btn-primary" onClick={() => setMobileOpen(false)}>
                        <span>Get Started</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
