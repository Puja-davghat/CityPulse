'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close user menu on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileOpen(false);
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-ivory border-b border-forest border-opacity-10 z-50">
      <div className="container mx-auto max-w-5xl h-full flex justify-between items-center px-4 md:px-8">
        {/* Brand */}
        <Link href="/" className="font-serif text-2xl font-semibold text-terracotta flex items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-terracotta flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-terracotta"></span>
          </span>
          CityPulse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-5 text-sm font-medium items-center">
          <Link href="/explore" className="hover:text-terracotta transition">Explore</Link>
          <Link href="/map" className="hover:text-terracotta transition">Map</Link>
          <Link href="/favorites" className="hover:text-terracotta transition flex items-center gap-1 text-[#B4533A]">
            <span>Favorites</span>
          </Link>
          <Link href="/culture" className="hover:text-terracotta transition">Culture</Link>
          <Link href="/safety" className="hover:text-terracotta transition">Safety</Link>
          <Link href="/compare" className="hover:text-terracotta transition">Compare</Link>
          <Link href="/plan" className="hover:text-terracotta transition">Plan a Day</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && !user && (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-terracotta transition">
                  Log in
                </Link>
                <Link href="/register" className="bg-forest text-ivory px-4 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition">
                  Create account
                </Link>
              </>
            )}

            {!loading && user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-terracotta text-white flex items-center justify-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 focus:ring-offset-ivory"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  {user.avatar_path ? (
                    <img src={user.avatar_path} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-forest border-opacity-10 rounded-lg shadow-lg py-2 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-forest border-opacity-10">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs opacity-60 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile/details" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-sage hover:bg-opacity-30 transition" role="menuitem">
                      Profile
                    </Link>
                    <Link href="/profile/saved" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-sage hover:bg-opacity-30 transition" role="menuitem">
                      Saved places
                    </Link>
                    <Link href="/profile/trips" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-sage hover:bg-opacity-30 transition" role="menuitem">
                      My trips
                    </Link>
                    <Link href="/profile/settings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-sage hover:bg-opacity-30 transition" role="menuitem">
                      Settings
                    </Link>
                    <hr className="my-1 border-forest border-opacity-10" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-terracotta hover:bg-sage hover:bg-opacity-30 transition" role="menuitem">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-forest"
            aria-expanded={mobileOpen}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ivory border-b border-forest border-opacity-10 px-4 py-4 space-y-2">
          <Link href="/explore" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Explore</Link>
          <Link href="/map" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Map</Link>
          <Link href="/favorites" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-[#B4533A]">Favorites</Link>
          <Link href="/culture" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Culture</Link>
          <Link href="/safety" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Safety</Link>
          <Link href="/compare" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Compare</Link>
          <Link href="/plan" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Plan a Day</Link>
          <hr className="border-forest border-opacity-10" />
          {!loading && !user && (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-terracotta">Log in</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-terracotta">Create account</Link>
            </>
          )}
          {!loading && user && (
            <>
              <div className="flex items-center gap-3 py-2">
                <span className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center text-xs font-semibold">
                  {getInitials(user.name)}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Link href="/profile/details" onClick={() => setMobileOpen(false)} className="block py-2 text-sm hover:text-terracotta">Profile</Link>
              <Link href="/profile/saved" onClick={() => setMobileOpen(false)} className="block py-2 text-sm hover:text-terracotta">Saved places</Link>
              <Link href="/profile/trips" onClick={() => setMobileOpen(false)} className="block py-2 text-sm hover:text-terracotta">My trips</Link>
              <Link href="/profile/settings" onClick={() => setMobileOpen(false)} className="block py-2 text-sm hover:text-terracotta">Settings</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-terracotta">Log out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
