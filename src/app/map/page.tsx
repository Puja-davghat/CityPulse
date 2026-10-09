'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ALL_PLACES, CITIES, NOTES, Place, CityInfo, Note 
} from '@/lib/data';
import { 
  MapPin, Navigation, Info, AlertTriangle, Layers, Star, 
  ExternalLink, Heart, Compass, RotateCw, ZoomIn, ZoomOut, 
  Sun, Moon, Sunset, Move, ShieldAlert, ArrowUpRight, Share2, Eye
} from 'lucide-react';

function MapContent() {
  const searchParams = useSearchParams();
  const queryLat = searchParams.get('lat');
  const queryLng = searchParams.get('lng');
  const queryPlace = searchParams.get('place');
  const queryCity = searchParams.get('city');

  // City state
  const [selectedCityName, setSelectedCityName] = useState<string>('Jaipur');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'heritage' | 'stay'>('all');
  const [activePin, setActivePin] = useState<Place | null>(null);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // 3D Movable Camera State
  const [pitch, setPitch] = useState<number>(45); // Tilt angle (0 to 60 deg)
  const [yaw, setYaw] = useState<number>(-12); // Rotation angle (-180 to 180 deg)
  const [zoom, setZoom] = useState<number>(1.15); // Zoom level (0.7 to 2.2)
  const [panX, setPanX] = useState<number>(0); // Horizontal translation in px
  const [panY, setPanY] = useState<number>(0); // Vertical translation in px
  const [lighting, setLighting] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Drag interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0
  });

  // Current City info
  const activeCity: CityInfo = useMemo(() => {
    return CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase()) || CITIES[0];
  }, [selectedCityName]);

  // Load saved places from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cp_saved_places') || '[]');
      setSavedIds(saved);
    } catch { /* ignore */ }
  }, []);

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter(item => item !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    try {
      localStorage.setItem('cp_saved_places', JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  // Sync URL search params on mount
  useEffect(() => {
    if (queryCity) {
      const matched = CITIES.find(c => c.name.toLowerCase() === queryCity.toLowerCase());
      if (matched) setSelectedCityName(matched.name);
    }

    if (queryPlace) {
      const found = ALL_PLACES.find(p => p.name.toLowerCase().includes(queryPlace.toLowerCase()));
      if (found) {
        setSelectedCityName(found.city);
        setActivePin(found);
      }
    } else if (queryLat && queryLng) {
      const targetLat = parseFloat(queryLat);
      const targetLng = parseFloat(queryLng);
      const found = ALL_PLACES.find(p => Math.abs(p.lat - targetLat) < 0.005 && Math.abs(p.lng - targetLng) < 0.005);
      if (found) {
        setSelectedCityName(found.city);
        setActivePin(found);
      }
    }
  }, [queryLat, queryLng, queryPlace, queryCity]);

  // Places for selected city
  const cityPlaces = useMemo(() => {
    return ALL_PLACES.filter(p => p.city.toLowerCase() === selectedCityName.toLowerCase());
  }, [selectedCityName]);

  const filteredPlaces = useMemo(() => {
    return cityPlaces.filter(p => selectedCategory === 'all' || p.cat === selectedCategory);
  }, [cityPlaces, selectedCategory]);

  const cityNotes = useMemo(() => {
    return NOTES.filter(n => n.city.toLowerCase() === selectedCityName.toLowerCase());
  }, [selectedCityName]);

  // Calculate bounding box for placing markers proportionally on map canvas
  const bounds = useMemo(() => {
    if (cityPlaces.length === 0) {
      return { minLat: 26.8, maxLat: 27.0, minLng: 75.7, maxLng: 75.9 };
    }
    const lats = cityPlaces.map(p => p.lat);
    const lngs = cityPlaces.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latPadding = Math.max((maxLat - minLat) * 0.25, 0.02);
    const lngPadding = Math.max((maxLng - minLng) * 0.25, 0.02);
    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding,
    };
  }, [cityPlaces]);

  // Convert lat/lng to percentage coordinates on the 2D plane (0% - 100%)
  const getCoordsPercent = (lat: number, lng: number) => {
    const latSpan = bounds.maxLat - bounds.minLat || 0.05;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.05;
    // Latitude increases northwards, so top % is 100 - relative position
    const top = 100 - ((lat - bounds.minLat) / latSpan) * 100;
    const left = ((lng - bounds.minLng) / lngSpan) * 100;
    return {
      top: Math.max(8, Math.min(92, top)),
      left: Math.max(8, Math.min(92, left))
    };
  };

  // Mouse drag handlers for 3D map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panX,
      startPanY: panY
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.startPanX + deltaX);
    setPanY(dragStartRef.current.startPanY + deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCamera = () => {
    setPitch(45);
    setYaw(-10);
    setZoom(1.15);
    setPanX(0);
    setPanY(0);
    setIs3DMode(true);
  };

  // Map Tile Theme styling
  const lightingTheme = useMemo(() => {
    if (lighting === 'night') {
      return {
        bg: 'bg-slate-950',
        canvasBg: 'bg-[#0f172a]',
        gridColor: 'rgba(56, 189, 248, 0.15)',
        roadColor: '#1e293b',
        roadBorder: '#334155',
        textColor: '#94a3b8',
        waterColor: '#0369a1',
        glow: 'rgba(56, 189, 248, 0.25)'
      };
    }
    if (lighting === 'sunset') {
      return {
        bg: 'bg-[#FBF6EE]',
        canvasBg: 'bg-[#faebd7]',
        gridColor: 'rgba(180, 83, 58, 0.12)',
        roadColor: '#eedac5',
        roadBorder: '#dfc2a6',
        textColor: '#1E3A2F',
        waterColor: '#7dd3fc',
        glow: 'rgba(234, 88, 12, 0.3)'
      };
    }
    return {
      bg: 'bg-[#F6F0E1]',
      canvasBg: 'bg-[#f4efe3]',
      gridColor: 'rgba(30, 58, 47, 0.1)',
      roadColor: '#e5ded0',
      roadBorder: '#d4ccbb',
      textColor: '#1E3A2F',
      waterColor: '#38bdf8',
      glow: 'rgba(30, 58, 47, 0.2)'
    };
  }, [lighting]);

  return (
    <div className={`min-h-screen ${lightingTheme.bg} text-[#1E3A2F] py-6 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Bar: Header & Multi-City Switcher ── */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#1E3A2F]/15 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#B4533A] uppercase inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 3D Interactive Navigator
              </span>
              <span className="text-[10px] bg-[#DCE4D2] text-[#1E3A2F] font-bold px-2 py-0.5 rounded-full">
                Multi-City 3D Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3A2F] mt-1 flex items-center gap-2">
              Explore {activeCity.name} in 3D
            </h1>
            <p className="text-xs sm:text-sm text-[#1E3A2F]/70 mt-1 max-w-xl">
              {activeCity.tagline} · {activeCity.state}, {activeCity.country} · {cityPlaces.length} curated destinations
            </p>
          </div>

          {/* City Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {CITIES.map((city) => {
              const isSelected = city.name.toLowerCase() === selectedCityName.toLowerCase();
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCityName(city.name);
                    setActivePin(null);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-sm ${
                    isSelected
                      ? 'bg-[#1E3A2F] text-[#F6F0E1] shadow-lg scale-105 ring-2 ring-[#B4533A]'
                      : 'bg-[#F6F0E1] text-[#1E3A2F] hover:bg-[#DCE4D2] hover:scale-102'
                  }`}
                  style={{
                    transform: isSelected ? 'perspective(500px) translateZ(10px)' : undefined
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isSelected ? '#B4533A' : '#1E3A2F' }} />
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Filter & 3D Controls Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#1E3A2F]/10 shadow-sm">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'food', 'heritage', 'stay'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#B4533A] text-white shadow-md'
                    : 'bg-white text-[#1E3A2F] border border-[#1E3A2F]/15 hover:bg-[#F6F0E1]'
                }`}
              >
                {cat === 'all' ? 'All Places' : cat === 'food' ? '🍽️ Food' : cat === 'heritage' ? '🏛️ Heritage' : '🏨 Stays'}
              </button>
            ))}

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1 ${
                showNotes ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-[#1E3A2F] border-[#1E3A2F]/20'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Notes ({cityNotes.length})
            </button>
          </div>

          {/* 3D Mode & Lighting Controls */}
          <div className="flex items-center gap-2">
            {/* 3D / 2D Toggle */}
            <button
              onClick={() => {
                if (is3DMode) {
                  setPitch(0);
                  setYaw(0);
                  setIs3DMode(false);
                } else {
                  setPitch(45);
                  setYaw(-12);
                  setIs3DMode(true);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                is3DMode ? 'bg-[#1E3A2F] text-[#F6F0E1] border-[#1E3A2F]' : 'bg-white text-[#1E3A2F] border-[#1E3A2F]/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#B4533A]" />
              {is3DMode ? '3D Drone View' : '2D Plan View'}
            </button>

            {/* Lighting Mode */}
            <div className="flex items-center bg-white rounded-xl border border-[#1E3A2F]/20 p-0.5">
              <button
                onClick={() => setLighting('day')}
                title="Noon Daylight"
                className={`p-1.5 rounded-lg text-xs ${lighting === 'day' ? 'bg-[#F6F0E1] text-[#1E3A2F] font-bold' : 'text-gray-400'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLighting('sunset')}
                title="Golden Sunset"
                className={`p-1.5 rounded-lg text-xs ${lighting === 'sunset' ? 'bg-[#B4533A] text-white font-bold' : 'text-gray-400'}`}
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLighting('night')}
                title="Cyber Night"
                className={`p-1.5 rounded-lg text-xs ${lighting === 'night' ? 'bg-slate-900 text-cyan-400 font-bold' : 'text-gray-400'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset Camera Button */}
            <button
              onClick={resetCamera}
              className="p-2 bg-white hover:bg-[#F6F0E1] text-[#1E3A2F] rounded-xl border border-[#1E3A2F]/20 transition-all"
              title="Reset 3D Camera"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Main Map Canvas & 3D Interactive Workspace ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 3D Map Viewport (2 Cols) */}
          <div className="lg:col-span-2 relative h-[580px] rounded-3xl overflow-hidden border-2 border-[#1E3A2F]/20 shadow-2xl bg-gradient-to-b from-[#dfd7c2] to-[#c7bfa9]">
            
            {/* Movable Helper Overlay Notification */}
            <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#1E3A2F]/15 shadow-md flex items-center gap-2 text-xs font-semibold text-[#1E3A2F] pointer-events-none">
              <Move className="w-3.5 h-3.5 text-[#B4533A] animate-pulse" />
              <span>Drag to move map · Scroll/Pinch to zoom</span>
            </div>

            {/* Weather & City Chip Overlay */}
            <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#1E3A2F]/15 shadow-md flex items-center gap-2 text-xs font-bold text-[#1E3A2F]">
              <span className="text-[#B4533A]">{activeCity.weather.temp}</span>
              <span className="text-[#1E3A2F]/50">·</span>
              <span className="text-[11px] text-[#1E3A2F]/70">{activeCity.weather.condition}</span>
            </div>

            {/* 3D Camera HUD Overlay Controls (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-[#1E3A2F]/15 shadow-lg">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom(prev => Math.min(2.2, prev + 0.15))}
                  className="p-1.5 bg-[#F6F0E1] hover:bg-[#DCE4D2] rounded-lg text-[#1E3A2F] transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
                  className="p-1.5 bg-[#F6F0E1] hover:bg-[#DCE4D2] rounded-lg text-[#1E3A2F] transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>

              {/* Pitch Tilt Adjuster */}
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-bold text-[#1E3A2F]/70">
                <span>Tilt:</span>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={pitch}
                  onChange={(e) => {
                    setPitch(Number(e.target.value));
                    setIs3DMode(Number(e.target.value) > 10);
                  }}
                  className="w-16 accent-[#B4533A] h-1"
                />
              </div>

              {/* Rotation Adjuster */}
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-bold text-[#1E3A2F]/70">
                <span>Rot:</span>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={yaw}
                  onChange={(e) => setYaw(Number(e.target.value))}
                  className="w-16 accent-[#1E3A2F] h-1"
                />
              </div>
            </div>

            {/* 3D Compass (Bottom Right) */}
            <div 
              className="absolute bottom-4 right-4 z-30 w-12 h-12 rounded-full bg-white/95 border-2 border-[#1E3A2F]/20 shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              onClick={resetCamera}
              title="Click to reset orientation"
            >
              <div 
                className="w-8 h-8 rounded-full border border-[#1E3A2F]/20 flex items-center justify-center relative transition-transform duration-300"
                style={{ transform: `rotate(${-yaw}deg)` }}
              >
                <span className="absolute top-0 text-[9px] font-black text-red-600">N</span>
                <div className="w-0.5 h-6 bg-gradient-to-b from-red-600 via-transparent to-blue-600"></div>
              </div>
            </div>

            {/* ── 3D TRANSFORM WORLD WRAPPER ── */}
            <div 
              className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                perspective: '1000px',
                perspectiveOrigin: '50% 50%'
              }}
            >
              {/* 3D Rotated Plane */}
              <div
                className={`w-[130%] h-[130%] -left-[15%] -top-[15%] absolute rounded-3xl transition-transform ${
                  isDragging ? 'duration-0' : 'duration-300 ease-out'
                } ${lightingTheme.canvasBg}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `
                    translate3d(${panX}px, ${panY}px, 0px)
                    scale(${zoom})
                    rotateX(${pitch}deg)
                    rotateZ(${yaw}deg)
                  `,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.35)'
                }}
              >
                {/* 3D Ground Base Layer (Sub-surface extrusion) */}
                <div 
                  className="absolute inset-0 rounded-3xl border-4 border-[#1E3A2F]/30"
                  style={{
                    transform: 'translateZ(-25px)',
                    backgroundColor: lighting === 'night' ? '#090d16' : '#c4bca7',
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                  }}
                />

                {/* Styled Vector Cartography Surface */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  {/* Subtle Grid Lines */}
                  <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={lightingTheme.gridColor} strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Curving River / Canal Water feature */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 0 180 Q 250 260 450 160 T 900 240 T 1400 120"
                      fill="none"
                      stroke={lightingTheme.waterColor}
                      strokeWidth="28"
                      strokeLinecap="round"
                      opacity={lighting === 'night' ? '0.6' : '0.4'}
                    />
                    <path
                      d="M 120 0 Q 300 350 480 600 T 800 1000"
                      fill="none"
                      stroke={lightingTheme.roadBorder}
                      strokeWidth="14"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M 0 420 Q 380 400 750 430 T 1400 380"
                      fill="none"
                      stroke={lightingTheme.roadColor}
                      strokeWidth="10"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>

                {/* Dynamic 3D Walking Route Path between places if pin is active */}
                {activePin && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${getCoordsPercent(activePin.lat, activePin.lng).left}%`}
                      y2={`${getCoordsPercent(activePin.lat, activePin.lng).top}%`}
                      stroke="#B4533A"
                      strokeWidth="4"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    {/* Animated Walking Pulse */}
                    <circle
                      cx={`${getCoordsPercent(activePin.lat, activePin.lng).left}%`}
                      cy={`${getCoordsPercent(activePin.lat, activePin.lng).top}%`}
                      r="24"
                      fill="none"
                      stroke="#B4533A"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  </svg>
                )}

                {/* ── 3D Markers on Ground Plane ── */}
                {filteredPlaces.map((place) => {
                  const { top, left } = getCoordsPercent(place.lat, place.lng);
                  const isSelected = activePin?.id === place.id;
                  const isSaved = savedIds.includes(place.id);

                  // Colors by category
                  const markerColor = place.cat === 'food' 
                    ? 'bg-emerald-700' 
                    : place.cat === 'heritage' 
                      ? 'bg-[#B4533A]' 
                      : 'bg-amber-700';

                  return (
                    <div
                      key={place.id}
                      style={{
                        position: 'absolute',
                        top: `${top}%`,
                        left: `${left}%`,
                        transform: 'translate(-50%, -50%)',
                        transformStyle: 'preserve-3d',
                        zIndex: isSelected ? 40 : 20
                      }}
                      className="group"
                    >
                      {/* Ground Base Footprint Shadow */}
                      <div 
                        className={`w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 blur-[2px] transition-all ${
                          isSelected ? 'bg-red-500/40 scale-150' : 'bg-black/25'
                        }`}
                        style={{ transform: 'rotateX(90deg)' }}
                      />

                      {/* 3D Elevated Pin Structure (Stands UPWARDS in 3D Z-axis) */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePin(place);
                        }}
                        className={`cursor-pointer transition-all duration-300 flex flex-col items-center ${
                          isSelected ? 'scale-125' : 'hover:scale-115'
                        }`}
                        style={{
                          transformStyle: 'preserve-3d',
                          // Billboarding effect: counteract the map's pitch and yaw so the pin faces the user camera
                          transform: `translateZ(30px) rotateX(${-pitch}deg) rotateZ(${-yaw}deg)`
                        }}
                      >
                        {/* 3D Floating Avatar Card */}
                        <div className={`p-1 rounded-2xl bg-white shadow-2xl border-2 transition-all ${
                          isSelected ? 'border-[#B4533A] ring-4 ring-[#B4533A]/30 scale-110' : 'border-[#1E3A2F]/20 hover:border-[#B4533A]'
                        }`}>
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                            <Image
                              src={place.image}
                              alt={place.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className={`absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[8px] font-bold text-white ${markerColor}`}>
                              {place.cat === 'food' ? 'Food' : place.cat === 'heritage' ? 'Heritage' : 'Stay'}
                            </span>
                          </div>
                        </div>

                        {/* Pin Stem / Pointer */}
                        <div className={`w-1 h-3 ${isSelected ? 'bg-[#B4533A]' : 'bg-[#1E3A2F]'} rounded-full shadow-md`} />
                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#B4533A]' : 'bg-[#1E3A2F]'}`} />

                        {/* Title Tooltip */}
                        <div className={`mt-1 px-2 py-0.5 rounded-lg bg-black/85 text-white text-[10px] font-bold whitespace-nowrap shadow-xl pointer-events-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {place.name} · ★ {place.rating}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ── 3D Community Notes Markers ── */}
                {showNotes && cityNotes.map((note) => {
                  const { top, left } = getCoordsPercent(note.lat, note.lng);
                  return (
                    <div
                      key={note.id}
                      style={{
                        position: 'absolute',
                        top: `${top}%`,
                        left: `${left}%`,
                        transform: 'translate(-50%, -50%)',
                        transformStyle: 'preserve-3d',
                        zIndex: 25
                      }}
                    >
                      <div
                        className="cursor-pointer group flex flex-col items-center"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: `translateZ(20px) rotateX(${-pitch}deg) rotateZ(${-yaw}deg)`
                        }}
                      >
                        <div className="p-1.5 rounded-full bg-amber-500 text-white shadow-xl animate-bounce">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-900 text-amber-100 text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap shadow-lg">
                          {note.label}: {note.area}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          {/* ── Right Column: 3D Place Detail Inspector ── */}
          <div className="bg-white rounded-3xl border border-[#1E3A2F]/15 p-6 shadow-xl flex flex-col justify-between space-y-6"
            style={{ transform: 'perspective(800px) rotateY(-1deg)' }}>
            
            {activePin ? (
              <div className="space-y-4">
                {/* Image Header with 3D overlay */}
                <div className="relative h-44 rounded-2xl overflow-hidden shadow-md group">
                  <Image
                    src={activePin.image}
                    alt={activePin.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 bg-[#1E3A2F]/90 backdrop-blur-md text-[#F6F0E1] text-[10px] font-bold rounded-lg uppercase">
                      {activePin.city}
                    </span>
                    <span className="px-2.5 py-1 bg-[#B4533A]/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                      {activePin.cat}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleSave(activePin.id, e)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full transition-all ${
                      savedIds.includes(activePin.id)
                        ? 'bg-[#B4533A] text-white shadow-lg'
                        : 'bg-white/90 text-[#1E3A2F] hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${savedIds.includes(activePin.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Price overlay on image */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-bold">
                      {activePin.cost === 0 ? 'Free Entry' : `₹${activePin.cost.toLocaleString()}`}
                      {activePin.cost > 0 && <span className="text-[10px] opacity-80 ml-1">/{activePin.unit}</span>}
                    </p>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/90 text-[#1E3A2F] px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 text-[#B4533A] fill-current" /> {activePin.rating}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#1E3A2F]">
                    {activePin.name}
                  </h2>
                  <p className="text-xs text-[#1E3A2F]/70 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B4533A]" /> {activePin.area}, {activePin.city}
                  </p>
                </div>

                <p className="text-xs text-[#1E3A2F]/80 leading-relaxed bg-[#F6F0E1] p-3.5 rounded-xl border border-[#1E3A2F]/10">
                  {activePin.desc}
                </p>

                {/* Tags */}
                {activePin.tags && (
                  <div className="flex flex-wrap gap-1">
                    {activePin.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-[#DCE4D2] text-[#1E3A2F] rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Coordinates & Navigation buttons */}
                <div className="pt-2 border-t border-[#1E3A2F]/10 space-y-2">
                  <div className="flex justify-between text-[11px] text-[#1E3A2F]/60">
                    <span>GPS Coordinates:</span>
                    <span className="font-mono font-bold text-[#1E3A2F]">{activePin.lat.toFixed(4)}, {activePin.lng.toFixed(4)}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activePin.lat},${activePin.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#B4533A] text-white text-xs font-bold rounded-xl hover:bg-[#B4533A]/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Navigation className="w-4 h-4" /> Open Turn-by-Turn Navigation <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/explore?city=${encodeURIComponent(activePin.city)}`}
                    className="w-full py-2 px-4 bg-[#F6F0E1] text-[#1E3A2F] text-xs font-semibold rounded-xl hover:bg-[#DCE4D2] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Directory for {activePin.city}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-[#F6F0E1] flex items-center justify-center mx-auto border-2 border-dashed border-[#1E3A2F]/30">
                  <MapPin className="w-8 h-8 text-[#B4533A] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1E3A2F]">Select Any 3D Pin</h3>
                  <p className="text-xs text-[#1E3A2F]/60 max-w-xs mx-auto mt-1 leading-relaxed">
                    Click any marker on the map to inspect real-time directions, price, heritage history, and add to your favorites.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Destination Strip */}
            <div className="pt-4 border-t border-[#1E3A2F]/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                  Nearby Spots in {selectedCityName}
                </span>
                <Link href="/favorites" className="text-[11px] font-bold text-[#B4533A] hover:underline flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current" /> Favorites ({savedIds.length})
                </Link>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {filteredPlaces.map((p) => {
                  const isActive = activePin?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePin(p)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex justify-between items-center transition-all ${
                        isActive
                          ? 'bg-[#1E3A2F] text-[#F6F0E1] font-bold shadow-sm'
                          : 'hover:bg-[#F6F0E1] text-[#1E3A2F]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          p.cat === 'food' ? 'bg-emerald-500' : p.cat === 'heritage' ? 'bg-[#B4533A]' : 'bg-amber-500'
                        }`} />
                        <span className="truncate">{p.name}</span>
                      </div>
                      <span className="text-[10px] opacity-70 shrink-0 ml-2">★ {p.rating}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F0E1] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#B4533A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#1E3A2F]">Loading 3D Map Environment...</p>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
