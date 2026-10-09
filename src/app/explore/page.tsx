'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_PLACES, CITIES, getPlacesForCity, getCityInfo, Place, CityInfo } from '@/lib/data';
import { Search, Filter, MapPin, Star, Heart, Clock, Navigation, ExternalLink, Globe, ChevronDown } from 'lucide-react';

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'heritage' | 'stay'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Load saved from localStorage on client
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cp_saved_places') || '[]');
      setSavedIds(saved);
    } catch { /* ignore */ }
  }, []);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter((item) => item !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    localStorage.setItem('cp_saved_places', JSON.stringify(updated));
  };

  const activeCityInfo = selectedCity === 'all' ? null : getCityInfo(selectedCity);

  const filteredPlaces = useMemo(() => {
    const cityPlaces = selectedCity === 'all' ? ALL_PLACES : getPlacesForCity(selectedCity);
    return cityPlaces.filter((place) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        place.name.toLowerCase().includes(q) ||
        place.area.toLowerCase().includes(q) ||
        place.desc.toLowerCase().includes(q) ||
        place.city.toLowerCase().includes(q) ||
        (place.tags && place.tags.some(t => t.toLowerCase().includes(q)));
      const matchesCat = selectedCategory === 'all' || place.cat === selectedCategory;
      const matchesPrice = place.cost <= maxPrice;
      return matchesSearch && matchesCat && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.cost - b.cost;
      if (sortBy === 'price-desc') return b.cost - a.cost;
      return 0;
    });
  }, [searchQuery, selectedCategory, maxPrice, sortBy, selectedCity]);

  const priceLabel = (p: number) => p === 1 ? '₹' : p === 2 ? '₹₹' : '₹₹₹';

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F]">
      {/* ── 3D City Selector Hero ── */}
      <section className="relative overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-[#1E3A2F]/20 pb-6">
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#B4533A] uppercase">
                {selectedCity === 'all' ? 'All Cities · India' : `${activeCityInfo?.name || selectedCity} · ${activeCityInfo?.state || ''}`}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1E3A2F] mt-1">
                {selectedCity === 'all' ? 'Discover Places Across India' : `Explore ${activeCityInfo?.name || selectedCity}`}
              </h1>
              <p className="mt-1 text-sm text-[#1E3A2F]/70 max-w-2xl">
                {activeCityInfo ? activeCityInfo.tagline : 'Curated food, heritage, and stay recommendations across 5 Indian cities.'}
              </p>
            </div>

            {/* Saved Count Badge */}
            <Link
              href="/favorites"
              className="px-5 py-2.5 bg-[#B4533A] text-white rounded-2xl text-xs font-bold hover:bg-[#B4533A]/90 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ transform: 'perspective(600px) rotateX(2deg)' }}
            >
              <Heart className="w-4 h-4 fill-current" /> My Favorites ({savedIds.length})
            </Link>
          </div>

          {/* ── 3D City Cards Row ── */}
          <div className="flex gap-4 overflow-x-auto py-6 px-1 snap-x snap-mandatory scrollbar-hide -mx-1">
            {/* All Cities card */}
            <button
              onClick={() => setSelectedCity('all')}
              className={`snap-start shrink-0 w-36 h-44 rounded-2xl border-2 overflow-hidden relative group transition-all duration-300 ${
                selectedCity === 'all'
                  ? 'border-[#B4533A] shadow-xl ring-2 ring-[#B4533A]/30 scale-105'
                  : 'border-[#1E3A2F]/15 hover:border-[#B4533A]/50 hover:shadow-lg'
              }`}
              style={{
                transform: selectedCity === 'all'
                  ? 'perspective(600px) rotateY(-5deg) rotateX(3deg) scale(1.05)'
                  : 'perspective(600px) rotateY(0deg)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s ease, box-shadow 0.3s ease'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A2F] to-[#2B5443]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
                <Globe className="w-8 h-8 mb-2 opacity-80" />
                <span className="text-sm font-bold">All Cities</span>
                <span className="text-[10px] opacity-70">{ALL_PLACES.length} places</span>
              </div>
            </button>

            {CITIES.map((city) => {
              const count = getPlacesForCity(city.name).length;
              const isActive = selectedCity === city.name;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.name)}
                  className={`snap-start shrink-0 w-36 h-44 rounded-2xl border-2 overflow-hidden relative group transition-all duration-300 ${
                    isActive
                      ? 'border-[#B4533A] shadow-xl ring-2 ring-[#B4533A]/30'
                      : 'border-[#1E3A2F]/15 hover:border-[#B4533A]/50 hover:shadow-lg'
                  }`}
                  style={{
                    transform: isActive
                      ? 'perspective(600px) rotateY(-5deg) rotateX(3deg) scale(1.05)'
                      : 'perspective(600px) rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.4s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.transform = 'perspective(600px) rotateY(-8deg) rotateX(5deg) scale(1.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.transform = 'perspective(600px) rotateY(0deg) scale(1)';
                    }
                  }}
                >
                  <Image src={city.image} alt={city.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10 text-white">
                    <span className="text-sm font-bold block">{city.name}</span>
                    <span className="text-[10px] opacity-80">{city.tagline} · {count} spots</span>
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-[#B4533A] rounded-full z-10 shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* ── Filter Controls ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-8 border border-[#1E3A2F]/10 shadow-lg space-y-4"
          style={{ transform: 'perspective(800px) rotateX(1deg)', transformStyle: 'preserve-3d' }}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E3A2F]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, monuments, havelis, cities, areas..."
                className="w-full pl-10 pr-4 py-3 bg-[#F6F0E1] border border-[#1E3A2F]/15 rounded-xl text-sm text-[#1E3A2F] placeholder-[#1E3A2F]/40 focus:outline-none focus:ring-2 focus:ring-[#B4533A] focus:border-transparent transition-all"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'food', 'heritage', 'stay'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl capitalize transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A2F] text-[#F6F0E1] shadow-md -translate-y-0.5'
                      : 'bg-[#F6F0E1] text-[#1E3A2F] border border-[#1E3A2F]/15 hover:bg-[#DCE4D2] hover:-translate-y-0.5'
                  }`}
                  style={{ transform: selectedCategory === cat ? 'perspective(400px) rotateX(-3deg) translateY(-2px)' : undefined }}
                >
                  {cat === 'all' ? '🌍 All' : cat === 'food' ? '🍽️ Food' : cat === 'heritage' ? '🏛️ Heritage' : '🏨 Stay'}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#1E3A2F]/10 text-xs font-medium">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#B4533A]" />
              <span className="whitespace-nowrap">Max: ₹{maxPrice.toLocaleString()}</span>
              <input type="range" min={0} max={30000} step={100} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-32 sm:w-48 accent-[#B4533A]" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F6F0E1] border border-[#1E3A2F]/15 rounded-xl px-3 py-2 text-xs text-[#1E3A2F] focus:outline-none">
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* ── Result Counter ── */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-[#1E3A2F]/70">
            Showing <span className="font-bold text-[#1E3A2F]">{filteredPlaces.length}</span> places
            {selectedCity !== 'all' && <span> in <span className="font-bold text-[#B4533A]">{selectedCity}</span></span>}
          </p>
          <Link href="/map" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B4533A] hover:underline">
            <MapPin className="w-3.5 h-3.5" /> View on Map
          </Link>
        </div>

        {/* ── 3D Place Cards Grid ── */}
        {filteredPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-[#1E3A2F]/10 shadow-inner">
            <h3 className="text-xl font-serif font-bold text-[#1E3A2F]">No places found</h3>
            <p className="text-sm text-[#1E3A2F]/60 mt-2">Try a different city, category, or search term.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMaxPrice(30000); setSelectedCity('all'); }}
              className="mt-4 px-5 py-2.5 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-bold rounded-xl hover:bg-[#1E3A2F]/90">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
            {filteredPlaces.map((place) => {
              const isSaved = savedIds.includes(place.id);
              const isHovered = hoveredCard === place.id;
              return (
                <div
                  key={place.id}
                  className="group cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered
                      ? 'perspective(800px) rotateY(-4deg) rotateX(3deg) translateY(-8px) scale(1.02)'
                      : 'perspective(800px) rotateY(0deg) rotateX(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredCard(place.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                    isHovered ? 'border-[#B4533A]/40 shadow-2xl' : 'border-[#1E3A2F]/10 shadow-md'
                  }`}>
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image src={place.image} alt={place.name} fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* City + Category badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                        <span className="px-2 py-1 bg-[#1E3A2F]/90 text-[#F6F0E1] text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-md">
                          {place.city}
                        </span>
                        <span className="px-2 py-1 bg-[#B4533A]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-md">
                          {place.cat}
                        </span>
                      </div>

                      {/* Save Heart */}
                      <button onClick={(e) => toggleSave(place.id, e)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all z-10 ${
                          isSaved ? 'bg-[#B4533A] text-white shadow-lg scale-110' : 'bg-white/90 text-[#1E3A2F] hover:bg-white hover:scale-110 shadow-md'
                        }`}>
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      {/* Direction Button (overlay, bottom-right) */}
                      <Link href={`/map?lat=${place.lat}&lng=${place.lng}&place=${encodeURIComponent(place.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 text-[#1E3A2F] text-[10px] font-bold rounded-lg inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1E3A2F] hover:text-white z-10 shadow-lg backdrop-blur-sm"
                        style={{ transform: 'translateZ(20px)' }}>
                        <Navigation className="w-3 h-3" /> Directions
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif font-bold text-base text-[#1E3A2F] group-hover:text-[#B4533A] transition-colors leading-tight">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-[#F6F0E1] px-2 py-0.5 rounded-lg text-xs font-bold text-[#1E3A2F] shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#B4533A] text-[#B4533A]" /> {place.rating}
                        </div>
                      </div>

                      <p className="flex items-center gap-1 text-[11px] text-[#1E3A2F]/60 mt-1">
                        <MapPin className="w-3 h-3 text-[#B4533A]" /> {place.area}, {place.city}
                      </p>

                      <p className="text-xs text-[#1E3A2F]/75 mt-2 line-clamp-2 leading-relaxed flex-1">
                        {place.desc}
                      </p>

                      {place.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {place.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] font-bold bg-[#F6F0E1] text-[#1E3A2F]/80 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-3 border-t border-[#1E3A2F]/10 bg-[#FAF7EE] flex justify-between items-center text-xs font-bold">
                      <span className="text-[#1E3A2F]">
                        {place.cost === 0 ? 'Free Entry' : `₹${place.cost.toLocaleString()}`}
                        {place.cost > 0 && <span className="text-[10px] text-[#1E3A2F]/50 font-normal ml-1">/{place.unit}</span>}
                      </span>
                      <div className="flex items-center gap-3">
                        {place.walk && (
                          <span className="text-[#B4533A] flex items-center gap-1 text-[10px]">
                            <Clock className="w-3 h-3" /> {place.walk}m
                          </span>
                        )}
                        <span className="text-[#1E3A2F]/50 group-hover:text-[#B4533A] flex items-center gap-0.5 text-[10px]">
                          Details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Place Detail Modal (3D) ── */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPlace(null)}>
          <div className="bg-[#F6F0E1] border border-[#1E3A2F]/20 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'perspective(800px) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
            <button onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 text-[#1E3A2F]/60 hover:text-[#1E3A2F] font-bold text-xl z-10">✕</button>

            <div className="flex gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1E3A2F] text-[#F6F0E1] rounded-lg">{selectedPlace.city}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#B4533A] text-white rounded-lg">{selectedPlace.cat}</span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#1E3A2F]">{selectedPlace.name}</h2>
            <p className="text-xs text-[#1E3A2F]/60 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#B4533A]" /> {selectedPlace.area}, {selectedPlace.city}
            </p>

            <div className="relative h-56 w-full rounded-2xl overflow-hidden my-4 shadow-lg"
              style={{ transform: 'perspective(600px) rotateX(2deg) rotateY(-2deg)', transformStyle: 'preserve-3d' }}>
              <Image src={selectedPlace.image} alt={selectedPlace.name} fill className="object-cover" />
            </div>

            <p className="text-sm text-[#1E3A2F]/85 leading-relaxed">{selectedPlace.desc}</p>

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-[#1E3A2F]/15 mt-4 text-xs">
              <div><span className="text-[#1E3A2F]/50 block">Rating</span><span className="font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#B4533A] fill-current" /> {selectedPlace.rating}/5</span></div>
              <div><span className="text-[#1E3A2F]/50 block">Cost</span><span className="font-bold">{selectedPlace.cost === 0 ? 'Free' : `₹${selectedPlace.cost}`} ({selectedPlace.unit})</span></div>
              {selectedPlace.walk && <div><span className="text-[#1E3A2F]/50 block">Walk Time</span><span className="font-bold">{selectedPlace.walk} minutes</span></div>}
              <div><span className="text-[#1E3A2F]/50 block">Location</span><span className="font-bold">{selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}</span></div>
            </div>

            {selectedPlace.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedPlace.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold bg-[#EFE8D5] text-[#1E3A2F] px-2 py-1 rounded-lg">#{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Link href={`/map?lat=${selectedPlace.lat}&lng=${selectedPlace.lng}&place=${encodeURIComponent(selectedPlace.name)}`}
                className="flex-1 px-4 py-2.5 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-bold rounded-xl hover:bg-[#1E3A2F]/90 inline-flex items-center justify-center gap-2 shadow-md">
                <Navigation className="w-4 h-4" /> Open on Map
              </Link>
              <button onClick={(e) => toggleSave(selectedPlace.id, e)}
                className="flex-1 px-4 py-2.5 bg-white border border-[#1E3A2F]/20 text-[#1E3A2F] text-xs font-bold rounded-xl hover:bg-[#DCE4D2] inline-flex items-center justify-center gap-2">
                <Heart className={`w-4 h-4 ${savedIds.includes(selectedPlace.id) ? 'fill-[#B4533A] text-[#B4533A]' : ''}`} />
                {savedIds.includes(selectedPlace.id) ? 'Saved ♥' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
