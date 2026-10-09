'use client';

import React, { useState } from 'react';
import { COMMUNITY_REPORTS, CommunityReport } from '@/lib/data';
import { 
  ShieldCheck, AlertTriangle, PhoneCall, MessageSquare, PlusCircle, 
  CheckCircle, Copy, Check, ExternalLink, ShieldAlert, HeartHandshake, PhoneForwarded
} from 'lucide-react';

interface Hotline {
  id: string;
  title: string;
  numbers: string[];
  primaryNumber: string;
  note: string;
  desc: string;
  smsNumber?: string;
  whatsapp?: string;
  type: 'police' | 'tourist' | 'medical' | 'women';
  badgeColor: string;
}

const HOTLINES: Hotline[] = [
  {
    id: 'police',
    title: 'Police Emergency',
    numbers: ['112', '100'],
    primaryNumber: '112',
    note: 'Jaipur Central Control Room',
    desc: 'Immediate law enforcement, crowd control, and urgent city assistance dispatch.',
    smsNumber: '112',
    type: 'police',
    badgeColor: 'bg-red-600'
  },
  {
    id: 'tourist',
    title: 'Tourist Helpline',
    numbers: ['+911412822863'],
    primaryNumber: '+91 141 2822863',
    note: 'Rajasthan Tourism Assistance',
    desc: 'Multilingual assistance, tourist protection, scam reports, and certified guide validation.',
    smsNumber: '+911412822863',
    whatsapp: '911412822863',
    type: 'tourist',
    badgeColor: 'bg-[#B4533A]'
  },
  {
    id: 'medical',
    title: 'Medical Ambulance',
    numbers: ['108'],
    primaryNumber: '108',
    note: 'SMS Hospital Emergency Dispatch',
    desc: '24/7 National Ambulance Service connecting to Sawai Man Singh (SMS) Trauma Center.',
    smsNumber: '108',
    type: 'medical',
    badgeColor: 'bg-emerald-700'
  },
  {
    id: 'women',
    title: 'Women Helpline',
    numbers: ['1090'],
    primaryNumber: '1090',
    note: '24/7 Dedicated Assistance',
    desc: 'Round-the-clock priority response unit for women travelers, residents, and safety escorts.',
    smsNumber: '1090',
    type: 'women',
    badgeColor: 'bg-purple-700'
  }
];

export default function SafetyPage() {
  const [reports, setReports] = useState<CommunityReport[]>(COMMUNITY_REPORTS);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('Poor Lighting');
  const [newLoc, setNewLoc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Interactive Modal / Active Hotline for Call & Message
  const [activeHotline, setActiveHotline] = useState<Hotline | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleCopy = (num: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopiedNumber(num);
    showNotification(`Copied ${num} to clipboard`);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleCall = (num: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showNotification(`Connecting call to ${num}...`);
    window.location.href = `tel:${num.replace(/\s+/g, '')}`;
  };

  const handleSms = (num: string, note: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanNum = num.replace(/\s+/g, '');
    const prefilledText = encodeURIComponent(`Emergency Assistance Required in Jaipur (${note}). Please send help immediately.`);
    showNotification(`Opening messaging for ${num}...`);
    // Fallback for SMS across mobile / desktop browsers
    window.location.href = `sms:${cleanNum}?body=${prefilledText}`;
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc.trim()) return;

    const newReport: CommunityReport = {
      id: `r_${Date.now()}`,
      cat: newCat,
      loc: newLoc,
      when: 'Just now · User submission',
      source: 'Verified Resident',
      status: 'Under Review'
    };

    setReports([newReport, ...reports]);
    setNewLoc('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3A2F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#1E3A2F]/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#B4533A] uppercase inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Community Safety & Emergency Care
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3A2F] mt-1">
              Safety Guidelines & Emergency Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-[#1E3A2F]/70 mt-1 max-w-2xl">
              Direct-dial emergency hotlines, instant SMS alert triggers, and crowdsourced neighborhood safety notices across Jaipur.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-[#B4533A] text-white text-xs font-semibold rounded-xl hover:bg-[#B4533A]/90 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Report Local Concern
          </button>
        </div>

        {/* ── Emergency Hotlines Cards with 3D UI & Functional Call/Message ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-[#1E3A2F] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> 24/7 Verified Emergency Hotlines
            </h2>
            <span className="text-xs text-[#1E3A2F]/60">Click card or action buttons to call or message</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: '1000px' }}>
            {HOTLINES.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveHotline(item)}
                className="bg-white rounded-2xl p-5 border border-[#1E3A2F]/15 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5 relative overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Accent top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${item.badgeColor}`} />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-[#B4533A] uppercase tracking-wider line-clamp-1">
                      {item.note}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active 24/7"></span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#1E3A2F] group-hover:text-[#B4533A] transition-colors">
                    {item.title}
                  </h3>

                  <div className="my-3 p-2.5 bg-[#F6F0E1]/80 rounded-xl border border-[#1E3A2F]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#B4533A]" />
                      <span className="text-base font-bold text-[#1E3A2F] tracking-wide">
                        {item.primaryNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(item.primaryNumber, e)}
                      className="p-1 text-[#1E3A2F]/50 hover:text-[#1E3A2F] transition-colors rounded hover:bg-white"
                      title="Copy number"
                    >
                      {copiedNumber === item.primaryNumber ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#1E3A2F]/70 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Direct Action Buttons: Call & Message */}
                <div className="pt-3 border-t border-[#1E3A2F]/10 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleCall(item.primaryNumber, e)}
                    className="py-2 px-3 bg-[#1E3A2F] text-white text-xs font-bold rounded-xl hover:bg-[#1E3A2F]/90 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Call
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSms(item.smsNumber || item.primaryNumber, item.note, e)}
                    className="py-2 px-3 bg-[#B4533A] text-white text-xs font-bold rounded-xl hover:bg-[#B4533A]/90 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Hotline Dialog Modal ── */}
        {activeHotline && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveHotline(null)}
          >
            <div 
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#1E3A2F]/20 relative space-y-6"
              onClick={(e) => e.stopPropagation()}
              style={{ transform: 'perspective(1000px) rotateX(1deg)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B4533A]">
                    {activeHotline.note}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-1">
                    {activeHotline.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveHotline(null)}
                  className="w-8 h-8 rounded-full bg-[#F6F0E1] text-[#1E3A2F] font-bold text-sm flex items-center justify-center hover:bg-[#B4533A] hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#F6F0E1] rounded-2xl border border-[#1E3A2F]/10 space-y-2">
                <p className="text-xs text-[#1E3A2F]/70">Registered Emergency Contact:</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono text-[#1E3A2F]">
                    {activeHotline.primaryNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(activeHotline.primaryNumber)}
                    className="px-3 py-1.5 bg-white text-xs font-bold rounded-lg border border-[#1E3A2F]/15 flex items-center gap-1.5 hover:bg-[#DCE4D2]"
                  >
                    {copiedNumber === activeHotline.primaryNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedNumber === activeHotline.primaryNumber ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-[#1E3A2F]/60 pt-1">
                  {activeHotline.desc}
                </p>
              </div>

              {/* Action Buttons inside Modal */}
              <div className="space-y-3">
                <a
                  href={`tel:${activeHotline.primaryNumber.replace(/\s+/g, '')}`}
                  className="w-full py-3.5 px-4 bg-emerald-700 text-white font-bold text-sm rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <PhoneForwarded className="w-4 h-4" /> Call {activeHotline.primaryNumber} Now
                </a>

                <a
                  href={`sms:${(activeHotline.smsNumber || activeHotline.primaryNumber).replace(/\s+/g, '')}?body=${encodeURIComponent(`Urgent help needed in Jaipur: Emergency alert for ${activeHotline.title}`)}`}
                  className="w-full py-3.5 px-4 bg-[#B4533A] text-white font-bold text-sm rounded-xl hover:bg-[#B4533A]/90 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" /> Send Emergency SMS Alert
                </a>

                {activeHotline.whatsapp && (
                  <a
                    href={`https://wa.me/${activeHotline.whatsapp}?text=${encodeURIComponent('Hello, I need tourist assistance in Jaipur.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#25D366] text-white font-bold text-xs rounded-xl hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Chat via Tourism WhatsApp Desk
                  </a>
                )}
              </div>

              <div className="p-3 bg-[#EFE8D5] rounded-xl text-[11px] text-[#1E3A2F]/70 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#B4533A] shrink-0" />
                <span>Calls are logged and geo-routed to Jaipur Municipal Police & Emergency Response.</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Report Form Modal/Accordion */}
        {showForm && (
          <div className="bg-[#EFE8D5] rounded-2xl p-6 sm:p-8 border border-[#B4533A]/30 shadow-lg space-y-4 max-w-2xl mx-auto animate-in fade-in">
            <h3 className="font-serif font-bold text-xl text-[#1E3A2F] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#B4533A]" /> Submit a Community Safety Notice
            </h3>
            <p className="text-xs text-[#1E3A2F]/70">
              Help fellow citizens and travelers navigate Jaipur by sharing street lighting outages, unusual crowding, or road hazards.
            </p>
            {submitted ? (
              <div className="p-4 bg-[#DCE4D2] text-[#1E3A2F] rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" /> Thank you! Your report has been dispatched to community view.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1E3A2F] mb-1">Issue Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full p-3 bg-white border border-[#1E3A2F]/20 rounded-xl text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#B4533A]"
                  >
                    <option value="Poor Lighting">Poor Street Lighting</option>
                    <option value="Heavy Crowding">Extreme Crowding / Narrow Lane</option>
                    <option value="Pavement Issue">Damaged Footpath / Pothole</option>
                    <option value="Road Construction">Road Construction Detour</option>
                    <option value="Unattended Bag">Unattended Object</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1E3A2F] mb-1">Specific Location / Landmark</label>
                  <input
                    type="text"
                    required
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="e.g. Lane behind Johari Bazaar sweet shop"
                    className="w-full p-3 bg-white border border-[#1E3A2F]/20 rounded-xl text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#B4533A]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 bg-white border border-[#1E3A2F]/20 rounded-xl font-semibold text-[#1E3A2F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#B4533A] text-white rounded-xl font-bold hover:bg-[#B4533A]/90 transition"
                  >
                    Submit Notice
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Community Notices Feed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-xl text-[#1E3A2F] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1E3A2F]" /> Live Community Notices ({reports.length})
            </h3>
            <span className="text-xs text-[#1E3A2F]/60">Updated continuously by verified residents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-5 rounded-2xl border border-[#1E3A2F]/15 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 bg-[#F6F0E1] text-[#1E3A2F] text-[10px] font-bold rounded-lg border border-[#1E3A2F]/10">
                      {report.cat}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {report.status || 'Verified'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1E3A2F] mt-2">
                    {report.loc}
                  </h4>
                  <p className="text-[11px] text-[#1E3A2F]/60 mt-1">
                    {report.when}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1E3A2F]/10 flex items-center justify-between text-[10px] text-[#1E3A2F]/70">
                  <span>Source: {report.source}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active Alert
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips Cards */}
        <div className="bg-[#EFE8D5] rounded-3xl p-6 sm:p-8 border border-[#1E3A2F]/15 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1E3A2F]">
            Essential Traveler & Resident Safety Advisory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#1E3A2F]/10 space-y-1.5">
              <span className="font-bold text-[#B4533A] block">1. Walled City Night Walking</span>
              <p className="text-[#1E3A2F]/80 leading-relaxed">
                Stay along lit main thoroughfares like Johari Bazaar and MI Road after 9:30 PM. Use registered auto-rickshaws.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#1E3A2F]/10 space-y-1.5">
              <span className="font-bold text-[#B4533A] block">2. Gem & Tour Verification</span>
              <p className="text-[#1E3A2F]/80 leading-relaxed">
                Always verify government-licensed tourist guides and gem appraisal certificates before high-value purchases.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#1E3A2F]/10 space-y-1.5">
              <span className="font-bold text-[#B4533A] block">3. Medical Assistance</span>
              <p className="text-[#1E3A2F]/80 leading-relaxed">
                Sawai Man Singh (SMS) Hospital on JLN Marg provides 24/7 central emergency care and trauma dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
