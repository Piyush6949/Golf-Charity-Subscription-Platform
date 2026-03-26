"use client";

export default function Footer() {
    const links = {
        Platform: [
            { label: "How It Works", href: "#how-it-works" },
            { label: "Prize Draws", href: "#prizes" },
            { label: "Charities", href: "#charities" },
            { label: "Pricing", href: "#pricing" },
        ],
        Support: [
            { label: "Help Centre", href: "#" },
            { label: "Contact Us", href: "#" },
            { label: "FAQs", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
        Company: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" },
            { label: "Privacy Policy", href: "#" },
        ],
    };

    return (
        <footer className="footer">
            {/* Newsletter */}
            <div className="section-padding" style={{ paddingBottom: 0 }}>
                <div className="container-md">
                    <div className="glass-card newsletter" style={{ marginBottom: 64 }}>
                        <div className="newsletter-bg" />
                        <div className="newsletter-inner">
                            <div>
                                <h3>Stay in the Game</h3>
                                <p>Get draw results, winner stories, and charity updates delivered to your inbox.</p>
                            </div>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                                <button className="btn-primary btn-sm"><span>Subscribe</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="container-md">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="#" className="nav-logo">
                            <div className="nav-logo-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <span className="nav-logo-text">Golf<span className="gradient-text">Charity</span></span>
                        </a>
                        <p>Play golf, win prizes, and make a real difference in the world. Every subscription counts.</p>
                    </div>

                    {Object.entries(links).map(([category, items]) => (
                        <div key={category} className="footer-col">
                            <h4>{category}</h4>
                            <ul>
                                {items.map((item) => (
                                    <li key={item.label}><a href={item.href}>{item.label}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} GolfCharity. All rights reserved.</p>
                <div className="footer-socials">
                    {[
                        { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                        { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" },
                        { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                    ].map((social) => (
                        <a key={social.label} href="#" className="social-icon" aria-label={social.label}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={social.path} />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
