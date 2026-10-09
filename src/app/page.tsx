'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PLACES, INITIAL_CITY } from '@/lib/data';
import { Search, MapPin, Compass, ShieldCheck, Sun, Star, ArrowRight, Sparkles, Navigation } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/explore');
    }
  };

  const featuredPlaces = PLACES.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EFE8D5] border border-[#1E3A2F]/15 px-3 py-1.5 rounded-full text-xs font-semibold text-[#1E3A2F]">
              <span className="w-2 h-2 rounded-full bg-[#B4533A] animate-pulse"></span>
              <span>{INITIAL_CITY.name}, {INITIAL_CITY.country} — {INITIAL_CITY.tagline}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-tight text-[#1E3A2F]">
              Exploring, Experiencing & Navigating the City.
            </h1>

            <p className="text-base sm:text-lg text-[#1E3A2F]/80 max-w-2xl leading-relaxed">
              Where to eat, what to see, where to stay, and how to navigate—gathered into one plain-spoken, editorial guide for residents and travelers in Jaipur.
            </p>

            {/* Live Search Input */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E3A2F]/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Lassi, Hawa Mahal, Havelis, Bazaars..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#1E3A2F]/20 rounded-xl text-sm text-[#1E3A2F] placeholder-[#1E3A2F]/50 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#B4533A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#B4533A]/90 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#1E3A2F]/70 font-semibold">
              <span>Popular:</span>
              <Link href="/explore?cat=food" className="px-3 py-1 bg-white border border-[#1E3A2F]/15 rounded-lg hover:bg-[#DCE4D2]">
                Lassi & Kachori
              </Link>
              <Link href="/explore?cat=heritage" className="px-3 py-1 bg-white border border-[#1E3A2F]/15 rounded-lg hover:bg-[#DCE4D2]">
                Palaces & Observatories
              </Link>
              <Link href="/explore?cat=stay" className="px-3 py-1 bg-white border border-[#1E3A2F]/15 rounded-lg hover:bg-[#DCE4D2]">
                Haveli Stays
              </Link>
            </div>
          </div>

          {/* Hero Visual Banner (3D) */}
          <div 
            className="lg:col-span-5 relative group"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="bg-[#EFE8D5] rounded-3xl p-6 border border-[#1E3A2F]/20 shadow-xl transition-all duration-500 ease-out group-hover:shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-5deg) rotateX(2deg) translateZ(0)',
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15; // Max 15deg
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15; 
                e.currentTarget.style.transform = `rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02, 1.02, 1.02)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateY(-5deg) rotateX(2deg) translateZ(0)';
              }}
            >
              {/* Live Weather Widget Header */}
              <div 
                className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#1E3A2F]/15 mb-6 flex justify-between items-center shadow-lg transition-transform duration-300"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-8 h-8 text-[#D97706] animate-[spin_10s_linear_infinite]" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1E3A2F]">Jaipur Live Snapshot</h4>
                    <p className="text-[11px] text-[#1E3A2F]/70">{INITIAL_CITY.weather.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#1E3A2F] block">{INITIAL_CITY.weather.temp}</span>
                  <span className="text-[10px] text-[#1E3A2F]/60">AQI {INITIAL_CITY.weather.aqi}</span>
                </div>
              </div>

              {/* Main Featured Image */}
              <div 
                className="relative h-64 rounded-2xl overflow-hidden border border-[#1E3A2F]/15 shadow-2xl transition-transform duration-300"
                style={{ transform: 'translateZ(20px)' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80"
                  alt="Hawa Mahal Jaipur"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white" style={{ transform: 'translateZ(30px)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B4533A] px-2 py-0.5 rounded shadow-lg">
                      Featured Landmark
                    </span>
                    <h3 className="font-serif font-bold text-xl mt-2 drop-shadow-md">Hawa Mahal Façade</h3>
                    <p className="text-xs text-white/90 drop-shadow">953 windows facing Badi Choupad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
          {[
            {
              title: 'City Exploration',
              desc: 'Curated food counters, street snacks, heritage havelis, and budget hostels.',
              link: '/explore',
              icon: Compass,
              badge: '11 Places'
            },
            {
              title: 'Interactive Navigator',
              desc: 'Visual city map with pin markers, area alerts, and walking distances.',
              link: '/map',
              icon: Navigation,
              badge: 'Live Map'
            },
            {
              title: 'Route Comparison',
              desc: 'Compare fast direct bazaar paths vs. calm illuminated heritage alleyways.',
              link: '/compare',
              icon: MapPin,
              badge: 'Smart Routes'
            },
            {
              title: 'Safety & Notices',
              desc: 'Community lighting notices, emergency hotlines, and citizen reporting.',
              link: '/safety',
              icon: ShieldCheck,
              badge: 'Verified Feed'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.link}
                className="bg-white p-6 rounded-2xl border border-[#1E3A2F]/15 hover:border-[#B4533A] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
                  e.currentTarget.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(15px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
                }}
              >
                <div style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 rounded-xl bg-[#F6F0E1] text-[#1E3A2F] group-hover:bg-[#1E3A2F] group-hover:text-[#F6F0E1] transition-colors shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4533A] bg-[#FAF7EE] px-2 py-0.5 rounded border border-[#1E3A2F]/10 shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1E3A2F] group-hover:text-[#B4533A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1E3A2F]/70 mt-2 leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                    {item.desc}
                  </p>
                </div>
                <div 
                  className="mt-6 pt-3 border-t border-[#1E3A2F]/10 text-xs font-bold text-[#1E3A2F] flex items-center justify-between group-hover:text-[#B4533A]"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Places Showcase */}
      <section className="max-w-7xl mx-auto bg-white rounded-3xl p-8 border border-[#1E3A2F]/15 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E3A2F]/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B4533A]">Top Recommendations</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3A2F] mt-1">
              Curated Highlights in Jaipur
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-[#B4533A] hover:underline inline-flex items-center gap-1"
          >
            View All 11 Places →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPlaces.map((place) => (
            <Link
              key={place.id}
              href="/explore"
              className="bg-[#FAF7EE] rounded-2xl overflow-hidden border border-[#1E3A2F]/15 hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-[#DCE4D2]">
                  {place.image && (
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#1E3A2F] text-[#F6F0E1] text-[10px] font-bold uppercase tracking-wider rounded">
                    {place.cat}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-base text-[#1E3A2F] group-hover:text-[#B4533A]">
                      {place.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#1E3A2F]">
                      <Star className="w-3.5 h-3.5 text-[#B4533A] fill-current" /> {place.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E3A2F]/60 mt-1">{place.area}</p>
                  <p className="text-xs text-[#1E3A2F]/80 mt-2 line-clamp-2">{place.desc}</p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#1E3A2F]/10 bg-white flex justify-between items-center text-xs font-semibold">
                <span>₹{place.cost} ({place.unit})</span>
                <span className="text-[#B4533A] group-hover:underline">Inspect →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
