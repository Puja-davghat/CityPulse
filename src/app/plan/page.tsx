'use client';

import React, { useState } from 'react';
import { PLACES, Place } from '@/lib/data';
import { Compass, Calendar, Sparkles, MapPin, Check, Clock, Plus, Trash2 } from 'lucide-react';

export default function PlanPage() {
  const [selectedDuration, setSelectedDuration] = useState<'half' | 'full' | '2day'>('full');
  const [selectedPace, setSelectedPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');
  const [userInterests, setUserInterests] = useState<string[]>(['food', 'heritage']);
  const [customPlan, setCustomPlan] = useState<Place[]>(() => PLACES.slice(0, 4));

  const toggleInterest = (interest: string) => {
    if (userInterests.includes(interest)) {
      setUserInterests(userInterests.filter((i) => i !== interest));
    } else {
      setUserInterests([...userInterests, interest]);
    }
  };

  const handleGeneratePlan = () => {
    const matched = PLACES.filter((p) => userInterests.includes(p.cat));
    setCustomPlan(matched.length > 0 ? matched : PLACES.slice(0, 5));
  };

  const removePlaceFromPlan = (id: string) => {
    setCustomPlan(customPlan.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#1E3A2F]/20 pb-6">
          <span className="text-xs font-semibold tracking-wider text-[#B4533A] uppercase inline-flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Personal Itinerary Builder
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3A2F] mt-1">
            Plan Your Jaipur Heritage Walk
          </h1>
          <p className="text-xs sm:text-sm text-[#1E3A2F]/70 mt-1 max-w-2xl">
            Customize a day plan based on your available time, walking pace, and interests (heritage, street food, stay).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-2xl border border-[#1E3A2F]/15 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1E3A2F] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B4533A]" /> Trip Preferences
            </h3>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] mb-2 uppercase tracking-wider">
                Trip Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'half', label: 'Half Day' },
                  { id: 'full', label: '1 Full Day' },
                  { id: '2day', label: '2 Days' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDuration(item.id as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                      selectedDuration === item.id
                        ? 'bg-[#1E3A2F] text-[#F6F0E1] border-[#1E3A2F]'
                        : 'bg-white border-[#1E3A2F]/20 text-[#1E3A2F] hover:bg-[#DCE4D2]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] mb-2 uppercase tracking-wider">
                Interests & Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'heritage', label: 'Heritage & Palaces' },
                  { id: 'food', label: 'Street Food & Thali' },
                  { id: 'stay', label: 'Haveli & Stays' }
                ].map((item) => {
                  const active = userInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors ${
                        active
                          ? 'bg-[#B4533A] text-white border-[#B4533A]'
                          : 'bg-white border-[#1E3A2F]/20 text-[#1E3A2F]'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGeneratePlan}
              className="w-full py-3 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A2F]/90 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#B4533A]" /> Generate Smart Itinerary
            </button>
          </div>

          {/* Generated Plan Overview */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#1E3A2F]/15 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#1E3A2F]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4533A] bg-[#F6F0E1] px-2 py-0.5 rounded">
                  Customized Route
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1E3A2F] mt-1">
                  Your Jaipur Day Schedule ({customPlan.length} Stops)
                </h3>
              </div>
              <span className="text-xs text-[#1E3A2F]/60 font-semibold">
                Estimated Walk: ~{customPlan.reduce((acc, curr) => acc + (curr.walk || 20), 0)} mins
              </span>
            </div>

            {/* Timeline Stops */}
            <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E3A2F]/20">
              {customPlan.map((place, index) => (
                <div key={place.id} className="relative pl-10 flex justify-between items-start group">
                  {/* Timeline Dot */}
                  <div className="absolute left-2 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1E3A2F] text-[#F6F0E1] text-[9px] font-bold flex items-center justify-center">
                    {index + 1}
                  </div>

                  <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#1E3A2F]/10 w-full flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1E3A2F] text-[#F6F0E1] rounded">
                          {place.cat}
                        </span>
                        <span className="text-xs text-[#1E3A2F]/60 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#B4533A]" /> {place.area}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1E3A2F] mt-1">{place.name}</h4>
                      <p className="text-xs text-[#1E3A2F]/80 mt-1">{place.desc}</p>
                    </div>

                    <button
                      onClick={() => removePlaceFromPlan(place.id)}
                      className="text-[#1E3A2F]/40 hover:text-[#B4533A] p-1 transition-colors"
                      title="Remove from itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
