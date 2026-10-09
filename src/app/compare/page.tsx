'use client';

import React, { useState } from 'react';
import { ROUTES } from '@/lib/data';
import { GitCompare, Clock, Footprints, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

export default function ComparePage() {
  const [selectedRoute, setSelectedRoute] = useState<'fast' | 'calm'>('calm');

  const routeDetails = {
    fast: {
      title: 'Bazaar Direct Arterial Route',
      duration: '14 minutes',
      distance: '1.2 km',
      crowdLevel: 'High (Heavy bazaar traffic)',
      lighting: 'Bright shopfront lights until 9 PM',
      pavements: 'Narrow, occupied by stalls',
      safetyNote: 'Fastest route, but watch for auto-rickshaws and dense crowds.',
      highlights: ['Johari Bazaar Crossing', 'Tripolia Gate', 'Badi Choupad']
    },
    calm: {
      title: 'Heritage Alleyways & Wide Footpath Route',
      duration: '19 minutes',
      distance: '1.5 km',
      crowdLevel: 'Moderate / Peaceful',
      lighting: 'Consistent municipal streetlamps',
      pavements: 'Wider pedestrian plazas',
      safetyNote: 'Skirts around congested vehicle chokepoints. Recommended for dusk walking.',
      highlights: ['Ram Niwas Garden Edge', 'Albert Hall Vista', 'Old City Residential Arch']
    }
  };

  const active = routeDetails[selectedRoute];

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#1E3A2F]/20 pb-6">
          <span className="text-xs font-semibold tracking-wider text-[#B4533A] uppercase inline-flex items-center gap-1.5">
            <GitCompare className="w-4 h-4" /> Route & Area Comparator
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3A2F] mt-1">
            Compare Navigation Routes
          </h1>
          <p className="text-xs sm:text-sm text-[#1E3A2F]/70 mt-1 max-w-2xl">
            Evaluate direct versus quiet heritage pedestrian routes across Jaipur with live crowd level and lighting estimates.
          </p>
        </div>

        {/* Toggle Selector */}
        <div className="flex justify-center my-4">
          <div className="bg-[#EFE8D5] p-1.5 rounded-2xl border border-[#1E3A2F]/15 inline-flex gap-2">
            <button
              onClick={() => setSelectedRoute('fast')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'fast'
                  ? 'bg-[#1E3A2F] text-[#F6F0E1] shadow-md'
                  : 'text-[#1E3A2F]/70 hover:bg-white/50'
              }`}
            >
              Direct Arterial Route (14 min)
            </button>
            <button
              onClick={() => setSelectedRoute('calm')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'calm'
                  ? 'bg-[#B4533A] text-white shadow-md'
                  : 'text-[#1E3A2F]/70 hover:bg-white/50'
              }`}
            >
              Calm Heritage Route (19 min)
            </button>
          </div>
        </div>

        {/* Detailed Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct Route Card */}
          <div className={`bg-white rounded-2xl p-6 border transition-all ${
            selectedRoute === 'fast' ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F]/20 shadow-md' : 'border-[#1E3A2F]/15 opacity-80'
          }`}>
            <div className="flex justify-between items-start border-b border-[#1E3A2F]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A2F] bg-[#DCE4D2] px-2 py-0.5 rounded">
                  Fastest Option
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1E3A2F] mt-2">Direct Bazaar Route</h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#1E3A2F] block">14 min</span>
                <span className="text-[10px] text-[#1E3A2F]/60">1.2 km</span>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Crowd Level:</span>
                <span className="font-bold text-[#B4533A]">High (Peak trading hours)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Lighting:</span>
                <span className="font-bold">Bright Bazaar Shopfronts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Footpaths:</span>
                <span className="font-bold">Narrow & Busy</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7EE] rounded-xl border border-[#1E3A2F]/10 text-xs text-[#1E3A2F]/80 leading-relaxed">
              <strong>Assessment:</strong> Recommended when traveling in a rush before 7 PM. Footpaths can be congested with shoppers and vendors.
            </div>
          </div>

          {/* Calm Heritage Route Card */}
          <div className={`bg-white rounded-2xl p-6 border transition-all ${
            selectedRoute === 'calm' ? 'border-[#B4533A] ring-2 ring-[#B4533A]/20 shadow-md' : 'border-[#1E3A2F]/15 opacity-80'
          }`}>
            <div className="flex justify-between items-start border-b border-[#1E3A2F]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#B4533A] px-2 py-0.5 rounded">
                  Recommended Walk
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1E3A2F] mt-2">Calm Heritage Alleyways</h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#B4533A] block">19 min</span>
                <span className="text-[10px] text-[#1E3A2F]/60">1.5 km</span>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Crowd Level:</span>
                <span className="font-bold text-[#1E3A2F]">Moderate / Peaceful</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Lighting:</span>
                <span className="font-bold">Steady Municipal Lamps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E3A2F]/60">Footpaths:</span>
                <span className="font-bold">Wide Pedestrian Corridors</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFFBEB] rounded-xl border border-[#D97706]/20 text-xs text-[#1E3A2F]/80 leading-relaxed">
              <strong>Assessment:</strong> Avoids major traffic junctions and vehicle chokepoints. Recommended for dusk strolls and photography.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
