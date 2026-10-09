'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, BookOpen, Crown, Palette, Sparkles, MapPin } from 'lucide-react';

export default function CulturePage() {
  const heritageHighlights = [
    {
      title: 'Pink Sandstone & Grid Planning',
      category: 'Architecture',
      desc: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was India’s first planned city, constructed according to Shilpa Shastra principles across nine grid squares.',
      image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Block Printing & Blue Pottery',
      category: 'Artisanal Crafts',
      desc: 'From natural indigo block printing in Sanganer to quartz-glazed turquoise ceramics, Jaipur’s artisan guilds have preserved centuries-old techniques.',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Historic Bazaars & Jewelry',
      category: 'Markets',
      desc: 'Johari Bazaar is world-renowned for Kundan and Meenakari jewelry, while Bapu Bazaar yields handcrafted Mojari leather footwear and bandhani textiles.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Hero Header */}
        <div className="border-b border-[#1E3A2F]/20 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-[#B4533A] uppercase inline-flex items-center gap-1.5">
            <Crown className="w-4 h-4" /> Heritage & Royal Traditions
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1E3A2F] mt-2">
            The Cultural Fabric of Jaipur
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#1E3A2F]/80 leading-relaxed font-sans">
            Exploring 300 years of royal architecture, vibrant bazaar corridors, astronomical engineering, and living craft traditions in the heart of Rajasthan.
          </p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heritageHighlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-[#1E3A2F]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-[#DCE4D2]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#1E3A2F] text-[#F6F0E1] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl text-[#1E3A2F]">{item.title}</h3>
                  <p className="text-xs text-[#1E3A2F]/80 leading-relaxed mt-3">{item.desc}</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#1E3A2F]/10 bg-[#FAF7EE]">
                <Link
                  href="/explore"
                  className="text-xs font-bold text-[#B4533A] hover:underline inline-flex items-center gap-1"
                >
                  Explore Related Places →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Dive Section: Why Pink? */}
        <div className="bg-[#EFE8D5] rounded-3xl p-8 sm:p-12 border border-[#1E3A2F]/20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B4533A]">Historical Context</span>
            <h2 className="text-3xl font-serif font-bold text-[#1E3A2F]">
              Why is Jaipur Called the Pink City?
            </h2>
            <p className="text-xs sm:text-sm text-[#1E3A2F]/80 leading-relaxed">
              In 1876, Maharaja Sawai Ram Singh ordered the entire city to be painted in terracotta pink (traditionally symbolizing hospitality) to welcome Albert Edward, Prince of Wales. To this day, local municipal laws preserve the pink hue across all old city avenues.
            </p>
            <div className="pt-2">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-semibold rounded-xl hover:bg-[#1E3A2F]/90 transition-colors"
              >
                <Compass className="w-4 h-4" /> Plan a Heritage Walk
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#1E3A2F]/15 space-y-4 shadow-sm">
            <h4 className="font-serif font-bold text-lg text-[#1E3A2F] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B4533A]" /> Cultural Etiquette & Tips
            </h4>
            <ul className="text-xs text-[#1E3A2F]/80 space-y-2.5 divide-y divide-[#1E3A2F]/10">
              <li className="pt-2"><strong>Temple & Palace Dress Code:</strong> Modest attire covering shoulders and knees is appreciated when visiting holy sites.</li>
              <li className="pt-2"><strong>Bazaar Bargaining:</strong> Polite haggles in local markets are standard, especially for handicrafts and textiles.</li>
              <li className="pt-2"><strong>Morning Exploration:</strong> Heritage gateways and Hawa Mahal are best photographed between 6:30 AM and 8:30 AM before peak traffic.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
