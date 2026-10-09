'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_PLACES, CITIES, Place } from '@/lib/data';
import { 
  Heart, MapPin, Star, Navigation, Trash2, ArrowRight, 
  ExternalLink, Sparkles, Filter, Compass, Share2, Check
} from 'lucide-react';

export default function FavoritesPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCat, setSelectedCat] = useState<'all' | 'food' | 'heritage' | 'stay'>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tiltCoords, setTiltCoords] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Load saved places on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cp_saved_places') || '[]');
      // If user has none yet, pre-populate 2 default recommended places to give a beautiful first experience
      if (saved.length === 0) {
        const defaultSample = ['jp1', 'jp5', 'dl1'];
        setSavedIds(defaultSample);
        localStorage.setItem('cp_saved_places', JSON.stringify(defaultSample));
      } else {
        setSavedIds(saved);
      }
    } catch {
      setSavedIds(['jp1', 'jp5']);
    }
  }, []);

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedIds.filter(item => item !== id);
    setSavedIds(updated);
    try {
      localStorage.setItem('cp_saved_places', JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const clearAllFavorites = () => {
    if (confirm('Clear all saved favorites?')) {
      setSavedIds([]);
      try {
        localStorage.setItem('cp_saved_places', JSON.stringify([]));
      } catch { /* ignore */ }
    }
  };

  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20; // -10 to +10 deg
    setTiltCoords(prev => ({ ...prev, [id]: { x, y } }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredCard(null);
    setTiltCoords(prev => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filtered favorite places
  const favoritePlaces = useMemo(() => {
    return ALL_PLACES.filter(p => savedIds.includes(p.id))
      .filter(p => selectedCity === 'all' || p.city.toLowerCase() === selectedCity.toLowerCase())
      .filter(p => selectedCat === 'all' || p.cat === selectedCat);
  }, [savedIds, selectedCity, selectedCat]);

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── Header ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1E3A2F]/15 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#B4533A] uppercase inline-flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-[#B4533A]" /> Saved Travel Collection
              </span>
              <span className="text-[10px] bg-[#DCE4D2] text-[#1E3A2F] font-bold px-2 py-0.5 rounded-full">
                {savedIds.length} Places Bookmarked
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3A2F] mt-1">
              My Favorite Destinations
            </h1>
            <p className="text-xs sm:text-sm text-[#1E3A2F]/70 mt-1 max-w-xl">
              Your personal bookmark collection with 3D interactive preview cards and direct turn-by-turn navigation links.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#F6F0E1] hover:bg-[#DCE4D2] text-[#1E3A2F] text-xs font-bold rounded-xl border border-[#1E3A2F]/15 flex items-center justify-center gap-2 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#B4533A]" />}
              {copiedLink ? 'Link Copied!' : 'Share Favorites'}
            </button>

            <Link
              href="/explore"
              className="flex-1 md:flex-none px-5 py-2.5 bg-[#1E3A2F] hover:bg-[#1E3A2F]/90 text-[#F6F0E1] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Compass className="w-4 h-4" /> Discover More
            </Link>
          </div>
        </div>

        {/* ── Filters & Category Bar ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#1E3A2F]/10 shadow-md flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#1E3A2F]/60 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> City:
            </span>
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCity === 'all'
                  ? 'bg-[#1E3A2F] text-[#F6F0E1] shadow-sm'
                  : 'bg-[#F6F0E1] text-[#1E3A2F] hover:bg-[#DCE4D2]'
              }`}
            >
              All Cities
            </button>
            {CITIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCity.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-[#1E3A2F] text-[#F6F0E1] shadow-sm'
                    : 'bg-[#F6F0E1] text-[#1E3A2F] hover:bg-[#DCE4D2]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 shrink-0">
            {(['all', 'food', 'heritage', 'stay'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedCat === cat
                    ? 'bg-[#B4533A] text-white shadow-sm'
                    : 'bg-[#F6F0E1] text-[#1E3A2F] hover:bg-[#DCE4D2]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}

            {savedIds.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-2"
                title="Clear all favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── 3D Favorites Grid ── */}
        {favoritePlaces.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#1E3A2F]/15 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F6F0E1] flex items-center justify-center mx-auto text-[#B4533A]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#1E3A2F]">No Favorites in this Filter</h3>
            <p className="text-xs sm:text-sm text-[#1E3A2F]/60 max-w-md mx-auto">
              Save places while exploring Jaipur, Delhi, Mumbai, Udaipur, or Goa by clicking the heart icon on any card!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => { setSelectedCity('all'); setSelectedCat('all'); }}
                className="px-4 py-2 bg-[#F6F0E1] text-xs font-bold rounded-xl text-[#1E3A2F] hover:bg-[#DCE4D2]"
              >
                Reset Filters
              </button>
              <Link
                href="/explore"
                className="px-5 py-2 bg-[#B4533A] text-white text-xs font-bold rounded-xl hover:bg-[#B4533A]/90 shadow"
              >
                Browse All Places
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
            {favoritePlaces.map((place) => {
              const isHovered = hoveredCard === place.id;
              const tilt = tiltCoords[place.id] || { x: 0, y: 0 };

              return (
                <div
                  key={place.id}
                  onMouseEnter={() => setHoveredCard(place.id)}
                  onMouseMove={(e) => handleMouseMove(place.id, e)}
                  onMouseLeave={() => handleMouseLeave(place.id)}
                  className="transition-transform duration-200 ease-out cursor-pointer group"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered
                      ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-8px) scale(1.02)`
                      : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
                  }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#1E3A2F]/15 shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                    
                    {/* 3D Image Banner */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* City & Category Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                        <span className="px-2.5 py-1 bg-[#1E3A2F]/90 backdrop-blur-md text-[#F6F0E1] text-[10px] font-bold uppercase rounded-xl">
                          {place.city}
                        </span>
                        <span className="px-2.5 py-1 bg-[#B4533A]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-xl">
                          {place.cat}
                        </span>
                      </div>

                      {/* Remove from favorites button */}
                      <button
                        onClick={(e) => removeFavorite(place.id, e)}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-md z-10"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-[#1E3A2F] flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-[#B4533A] text-[#B4533A]" /> {place.rating}
                      </div>

                      {/* Cost */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-base font-bold">
                          {place.cost === 0 ? 'Free Entry' : `₹${place.cost.toLocaleString()}`}
                        </span>
                        {place.cost > 0 && <span className="text-[10px] opacity-80 ml-1">/{place.unit}</span>}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1E3A2F] group-hover:text-[#B4533A] transition-colors">
                          {place.name}
                        </h3>
                        <p className="text-xs text-[#1E3A2F]/60 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B4533A]" /> {place.area}, {place.city}
                        </p>
                        <p className="text-xs text-[#1E3A2F]/75 mt-3 line-clamp-2 leading-relaxed">
                          {place.desc}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-[#1E3A2F]/10 flex items-center gap-2">
                        {/* Map Directions Button */}
                        <Link
                          href={`/map?city=${encodeURIComponent(place.city)}&lat=${place.lat}&lng=${place.lng}&place=${encodeURIComponent(place.name)}`}
                          className="flex-1 py-2.5 px-3 bg-[#B4533A] text-white text-xs font-bold rounded-xl hover:bg-[#B4533A]/90 transition-all flex items-center justify-center gap-1.5 shadow"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Open in Map
                        </Link>

                        {/* View in Directory Button */}
                        <Link
                          href={`/explore?city=${encodeURIComponent(place.city)}`}
                          className="py-2.5 px-3 bg-[#F6F0E1] text-[#1E3A2F] text-xs font-bold rounded-xl hover:bg-[#DCE4D2] transition-all flex items-center justify-center gap-1 border border-[#1E3A2F]/15"
                        >
                          Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
