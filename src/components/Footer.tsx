import Link from 'next/link';
import { Compass, ShieldCheck, MapPin, Heart, BookOpen, Crown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A2F] text-[#F6F0E1] py-12 border-t border-[#1E3A2F]/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="font-serif text-2xl font-bold text-[#F6F0E1] tracking-tight block">
            CityPulse <span className="text-[#B4533A] font-sans text-xs">Jaipur</span>
          </Link>
          <p className="text-xs text-[#F6F0E1]/70 leading-relaxed">
            Exploring, experiencing, and navigating Jaipur, India. Sourced facts, community notices, and curated places.
          </p>
          <p className="text-[10px] text-[#F6F0E1]/50 pt-2">
            © {new Date().getFullYear()} CityPulse. All rights reserved.
          </p>
        </div>

        {/* Column 2: Exploration */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-sm text-[#F6F0E1] uppercase tracking-wider mb-3">
            Exploration
          </h4>
          <ul className="space-y-2 text-[#F6F0E1]/80">
            <li>
              <Link href="/explore" className="hover:text-[#B4533A] transition-colors">
                Directory & Places
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-[#B4533A] transition-colors">
                Interactive City Map
              </Link>
            </li>
            <li>
              <Link href="/culture" className="hover:text-[#B4533A] transition-colors">
                Heritage & Traditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Navigation & Tools */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-sm text-[#F6F0E1] uppercase tracking-wider mb-3">
            City Tools
          </h4>
          <ul className="space-y-2 text-[#F6F0E1]/80">
            <li>
              <Link href="/compare" className="hover:text-[#B4533A] transition-colors">
                Route Comparator
              </Link>
            </li>
            <li>
              <Link href="/plan" className="hover:text-[#B4533A] transition-colors">
                Personal Itinerary Builder
              </Link>
            </li>
            <li>
              <Link href="/safety" className="hover:text-[#B4533A] transition-colors">
                Safety & Emergency Hotlines
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Account & Member */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-sm text-[#F6F0E1] uppercase tracking-wider mb-3">
            Account & Support
          </h4>
          <ul className="space-y-2 text-[#F6F0E1]/80">
            <li>
              <Link href="/profile" className="hover:text-[#B4533A] transition-colors">
                My Profile & Saved Places
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#B4533A] transition-colors">
                Sign In / Register
              </Link>
            </li>
            <li>
              <Link href="/forgot-password" className="hover:text-[#B4533A] transition-colors">
                Password Recovery
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
