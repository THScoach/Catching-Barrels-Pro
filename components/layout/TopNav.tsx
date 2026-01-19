"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface TopNavProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function TopNav({ user }: TopNavProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`);
    };

    const NavButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${active
                        ? "bg-cb-gold text-cb-dark shadow-lg"
                        : "bg-cb-dark-card text-gray-300 hover:bg-cb-dark-accent hover:text-white"
                    }`}
            >
                {children}
            </Link>
        );
    };

    const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => {
        return (
            <Link
                href={href}
                onClick={onClick}
                className="px-4 py-3 text-gray-300 hover:bg-cb-dark-accent hover:text-white rounded-lg transition-colors"
            >
                {children}
            </Link>
        );
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-cb-dark border-b border-cb-dark-accent shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo */}
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="text-3xl">⚾</div>
                            <span className="font-bold text-xl text-white hidden sm:block">
                                CatchBarrels
                            </span>
                        </Link>

                        {/* Center: Desktop Nav Links */}
                        <nav className="hidden md:flex gap-2">
                            <NavButton href="/dashboard">🏠 Dashboard</NavButton>
                            <NavButton href="/new-lesson">➕ New Lesson</NavButton>
                            <NavButton href="/history">📊 History</NavButton>
                        </nav>

                        {/* Right: User Menu */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <span className="text-gray-300 text-sm hidden md:block">
                                        {user.name}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-cb-gold text-cb-dark font-bold flex items-center justify-center">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    {/* Mobile Menu Button */}
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="md:hidden text-white p-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-cb-gold hover:text-cb-gold-light"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                    <div className="bg-cb-dark w-64 h-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-white font-bold text-lg">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                🏠 Dashboard
                            </MobileNavLink>
                            <MobileNavLink href="/new-lesson" onClick={() => setMobileMenuOpen(false)}>
                                ➕ New Lesson
                            </MobileNavLink>
                            <MobileNavLink href="/history" onClick={() => setMobileMenuOpen(false)}>
                                📊 History
                            </MobileNavLink>
                            <div className="border-t border-cb-dark-accent my-4" />
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-cb-dark-accent rounded-lg"
                            >
                                🚪 Sign Out
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
