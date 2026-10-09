'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ALL_PLACES, Place } from '@/lib/data';
import { User, Heart, Compass, Shield, Download, LogOut, Key, Trash2, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, isAuthConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'saved' | 'trips' | 'security'>('details');
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem('cp_saved_places') || '[]');
        const matched = ALL_PLACES.filter((p) => savedIds.includes(p.id));
        setSavedPlaces(matched);
      } catch {
        setSavedPlaces([]);
      }
    }
  }, []);

  const removeSaved = (id: string) => {
    const updated = savedPlaces.filter((p) => p.id !== id);
    setSavedPlaces(updated);
    if (typeof window !== 'undefined') {
      const ids = updated.map((p) => p.id);
      localStorage.setItem('cp_saved_places', JSON.stringify(ids));
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const res = await fetch('/api/profile/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citypulse_profile_${user?.email || 'export'}.json`;
        a.click();
      } else {
        alert('Data export requires an active authenticated session.');
      }
    } catch {
      alert('Data export failed.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Banner Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#1E3A2F]/15 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1E3A2F] text-[#F6F0E1] text-2xl font-serif font-bold flex items-center justify-center border-2 border-[#B4533A]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1E3A2F]">
                {user?.name || 'Guest Explorer'}
              </h1>
              <p className="text-xs text-[#1E3A2F]/70">
                {user?.email || 'Local Visitor Mode'}
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#DCE4D2] text-[#1E3A2F] rounded">
                Jaipur Chapter Member
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-[#1E3A2F]/20 text-[#1E3A2F] text-xs font-semibold rounded-xl hover:bg-[#DCE4D2] flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#B4533A]" /> Export Data
            </button>
            <button
              onClick={logout}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-semibold rounded-xl hover:bg-[#1E3A2F]/90 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E3A2F]/20 gap-4 overflow-x-auto pb-1">
          {[
            { id: 'details', label: 'Account Details', icon: User },
            { id: 'saved', label: `Saved Places (${savedPlaces.length})`, icon: Heart },
            { id: 'trips', label: 'My Itineraries', icon: Compass },
            { id: 'security', label: 'Security & Sessions', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-2 transition-colors ${
                  active
                    ? 'border-[#B4533A] text-[#B4533A]'
                    : 'border-transparent text-[#1E3A2F]/70 hover:text-[#1E3A2F]'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#1E3A2F]/15 shadow-sm min-h-[300px]">
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif font-bold text-lg text-[#1E3A2F]">Personal Information</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1E3A2F]/60 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.name || 'Guest User'}
                    className="w-full p-2.5 bg-[#FAF7EE] border border-[#1E3A2F]/15 rounded-lg font-medium text-[#1E3A2F]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E3A2F]/60 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'guest@citypulse.local'}
                    className="w-full p-2.5 bg-[#FAF7EE] border border-[#1E3A2F]/15 rounded-lg font-medium text-[#1E3A2F]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-lg text-[#1E3A2F]">Saved Favorites ({savedPlaces.length})</h3>
                <Link
                  href="/favorites"
                  className="text-xs font-bold text-[#B4533A] hover:underline flex items-center gap-1"
                >
                  Open 3D Favorites Page <Heart className="w-3.5 h-3.5 fill-current" />
                </Link>
              </div>

              {savedPlaces.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-xs text-[#1E3A2F]/60">
                    No places saved yet. Browse the Explore section and click the heart icon to save places here!
                  </p>
                  <Link
                    href="/explore"
                    className="inline-block px-4 py-2 bg-[#1E3A2F] text-white text-xs font-bold rounded-xl"
                  >
                    Explore Places
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPlaces.map((place) => (
                    <div key={place.id} className="bg-[#FAF7EE] p-4 rounded-xl border border-[#1E3A2F]/15 flex flex-col justify-between space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1E3A2F] text-[#F6F0E1] rounded">
                              {place.city}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#B4533A] text-white rounded">
                              {place.cat}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-[#1E3A2F] mt-1.5">{place.name}</h4>
                          <p className="text-xs text-[#1E3A2F]/60">{place.area}, {place.city}</p>
                        </div>
                        <button
                          onClick={() => removeSaved(place.id)}
                          className="text-[#B4533A] p-1.5 hover:bg-[#F6F0E1] rounded-lg"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#1E3A2F]/10 flex justify-between items-center text-xs">
                        <span className="font-bold text-[#1E3A2F]">
                          {place.cost === 0 ? 'Free' : `₹${place.cost}`}
                        </span>
                        <Link
                          href={`/map?city=${encodeURIComponent(place.city)}&lat=${place.lat}&lng=${place.lng}&place=${encodeURIComponent(place.name)}`}
                          className="text-[#B4533A] font-bold flex items-center gap-1 hover:underline"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="py-6 text-center space-y-2">
              <Compass className="w-8 h-8 text-[#1E3A2F]/40 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#1E3A2F]">Personal Itineraries</h3>
              <p className="text-xs text-[#1E3A2F]/60 max-w-sm mx-auto">
                Your saved day plans from the Plan tool will synchronize automatically here.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif font-bold text-lg text-[#1E3A2F]">Security Settings</h3>
              <div className="p-4 bg-[#FAF7EE] rounded-xl border border-[#1E3A2F]/15 space-y-2 text-xs">
                <p className="font-bold text-[#1E3A2F] flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#B4533A]" /> Password Security
                </p>
                <p className="text-[#1E3A2F]/70">
                  Password changes require entering your existing password. Standard 10-character minimum policy applies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
