export interface Place {
  id: string;
  name: string;
  city: string;
  cat: 'food' | 'heritage' | 'stay';
  area: string;
  desc: string;
  rating: number;
  price: 1 | 2 | 3;
  cost: number;
  unit: string;
  lat: number;
  lng: number;
  image: string;
  walk?: number;
  tags?: string[];
}

export interface CityInfo {
  id: string;
  name: string;
  country: string;
  state: string;
  tagline: string;
  center: [number, number];
  zoom: number;
  image: string;
  weather: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
    aqi: string;
  };
}

export interface Note {
  id: string;
  name: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  label: string;
  source: 'sample' | 'community' | 'official';
}

export interface CommunityReport {
  id: string;
  cat: string;
  loc: string;
  when: string;
  source: string;
  status?: 'Verified' | 'Under Review' | 'Resolved';
}

export interface RouteOption {
  type: 'fast' | 'calm';
  title: string;
  desc: string;
  duration: string;
  distance: string;
}

// ─── Cities ────────────────────────────────────────────────────
export const CITIES: CityInfo[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    tagline: 'The Pink City',
    center: [26.9124, 75.7873],
    zoom: 14,
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80',
    weather: { temp: '28°C', condition: 'Sunny & Warm', humidity: '42%', wind: '12 km/h', aqi: 'Moderate (115)' }
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    state: 'Delhi NCR',
    tagline: 'The Heart of India',
    center: [28.6139, 77.2090],
    zoom: 13,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    weather: { temp: '32°C', condition: 'Partly Cloudy', humidity: '55%', wind: '15 km/h', aqi: 'Poor (185)' }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    state: 'Maharashtra',
    tagline: 'City of Dreams',
    center: [19.0760, 72.8777],
    zoom: 13,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    weather: { temp: '30°C', condition: 'Humid & Warm', humidity: '78%', wind: '20 km/h', aqi: 'Moderate (130)' }
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'India',
    state: 'Rajasthan',
    tagline: 'City of Lakes',
    center: [24.5854, 73.7125],
    zoom: 14,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
    weather: { temp: '26°C', condition: 'Clear Skies', humidity: '38%', wind: '8 km/h', aqi: 'Good (65)' }
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    tagline: 'Pearl of the Orient',
    center: [15.2993, 74.1240],
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    weather: { temp: '29°C', condition: 'Tropical Breeze', humidity: '82%', wind: '18 km/h', aqi: 'Good (55)' }
  }
];

// ─── All Places (multi-city) ──────────────────────────────────
export const ALL_PLACES: Place[] = [
  // ── JAIPUR ──
  { id: 'jp1', city: 'Jaipur', name: 'Lassi Counter on MI Road', cat: 'food', area: 'MI Road', desc: 'Thick creamy lassi served in traditional kulhads, made fresh in small batches throughout the morning.', rating: 4.6, price: 1, cost: 120, unit: 'per person', lat: 26.9157, lng: 75.8006, tags: ['Traditional', 'Famous', 'Beverage'], image: 'https://images.unsplash.com/photo-1571006682858-a4c8d5152897?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp2', city: 'Jaipur', name: 'Old-City Kachori Shop', cat: 'food', area: 'Station Road', desc: 'Crisp spicy onion and sweet mawa kachoris, fried fresh daily and usually sold out by mid-afternoon.', rating: 4.4, price: 1, cost: 150, unit: 'per person', lat: 26.9200, lng: 75.7938, tags: ['Street Food', 'Snacks'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp3', city: 'Jaipur', name: 'Lane-Side Chai Counter', cat: 'food', area: 'Tripolia Lanes', desc: 'Sweet aromatic masala chai boiled over charcoal, paired with crunchy buttered rusks.', rating: 4.3, price: 1, cost: 40, unit: 'per person', lat: 26.9180, lng: 75.8160, tags: ['Chai', 'Quick Bite'], image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp4', city: 'Jaipur', name: 'Rooftop Thali House', cat: 'food', area: 'Chandpole', desc: 'Authentic Rajasthani thali featuring Dal Baati Churma with sunset views over the old city walls.', rating: 4.2, price: 2, cost: 650, unit: 'per person', lat: 26.9220, lng: 75.7920, tags: ['Rajasthani', 'Thali', 'Sunset View'], image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp5', city: 'Jaipur', name: 'Hawa Mahal (Palace of Winds)', cat: 'heritage', area: 'Badi Choupad', desc: 'Iconic 5-story honeycomb sandstone façade with 953 Jharokha windows, designed for royal ladies to watch city life.', rating: 4.5, price: 2, cost: 200, unit: 'entry', lat: 26.9239, lng: 75.8267, walk: 25, tags: ['Landmark', 'Must Visit'], image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp6', city: 'Jaipur', name: 'Royal City Palace Complex', cat: 'heritage', area: 'Old City', desc: 'Sprawling courtyards, grand pavilions, textile archives, and armories. Partly still the royal family residence.', rating: 4.6, price: 3, cost: 700, unit: 'entry', lat: 26.9258, lng: 75.8237, walk: 90, tags: ['Palace', 'Museum'], image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp7', city: 'Jaipur', name: 'Jantar Mantar Observatory', cat: 'heritage', area: 'Old City', desc: 'UNESCO World Heritage site featuring 19 monumental astronomical instruments from the 18th century.', rating: 4.5, price: 2, cost: 200, unit: 'entry', lat: 26.9248, lng: 75.8246, walk: 45, tags: ['UNESCO', 'Science'], image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp8', city: 'Jaipur', name: 'Albert Hall Museum', cat: 'heritage', area: 'Ram Niwas Garden', desc: 'Indo-Saracenic masterpiece from 1876 — royal paintings, carpet weaving, armor, and an Egyptian mummy.', rating: 4.4, price: 2, cost: 300, unit: 'entry', lat: 26.9115, lng: 75.8093, walk: 60, tags: ['Museum', 'Night Lighting'], image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp9', city: 'Jaipur', name: 'Courtyard Haveli Stay', cat: 'stay', area: 'Old City', desc: 'A restored 150-year-old merchant haveli with a peaceful marble courtyard and rooftop breakfast.', rating: 4.5, price: 3, cost: 5500, unit: 'per night', lat: 26.9280, lng: 75.7900, tags: ['Heritage Hotel', 'Boutique'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp10', city: 'Jaipur', name: 'Station-Side Backpacker Hostel', cat: 'stay', area: 'Railway Station', desc: 'Clean dorm beds, vibrant common room, high-speed WiFi — ideal for solo travelers and early trains.', rating: 4.2, price: 1, cost: 700, unit: 'per night', lat: 26.9050, lng: 75.7870, tags: ['Budget', 'Solo Friendly'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80' },
  { id: 'jp11', city: 'Jaipur', name: 'Bani Park Garden Guesthouse', cat: 'stay', area: 'Bani Park', desc: 'Serene family-run guesthouse set around a green lawn, a short rickshaw ride from the bazaars.', rating: 4.3, price: 2, cost: 2200, unit: 'per night', lat: 26.9300, lng: 75.7820, tags: ['Garden', 'Family'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80' },

  // ── DELHI ──
  { id: 'dl1', city: 'Delhi', name: 'Paranthe Wali Gali', cat: 'food', area: 'Chandni Chowk', desc: 'Legendary 150-year-old lane serving 30+ varieties of stuffed paranthas deep-fried in ghee.', rating: 4.5, price: 1, cost: 200, unit: 'per person', lat: 28.6562, lng: 77.2301, tags: ['Legendary', 'Street Food', 'Heritage'], image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl2', city: 'Delhi', name: 'Karim\'s Near Jama Masjid', cat: 'food', area: 'Old Delhi', desc: 'Mughlai cuisine perfected since 1913. Famous for seekh kebabs, nihari, and butter chicken.', rating: 4.7, price: 2, cost: 500, unit: 'per person', lat: 28.6505, lng: 77.2347, tags: ['Mughlai', 'Historic', 'Non-Veg'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl3', city: 'Delhi', name: 'Dilli Haat Chaat Corner', cat: 'food', area: 'INA', desc: 'Multi-cuisine open-air food court serving regional specialties from all 28 Indian states.', rating: 4.3, price: 1, cost: 300, unit: 'per person', lat: 28.5733, lng: 77.2095, tags: ['Chaat', 'Multi-cuisine', 'Open Air'], image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl4', city: 'Delhi', name: 'Red Fort (Lal Qila)', cat: 'heritage', area: 'Old Delhi', desc: 'UNESCO World Heritage red sandstone citadel built by Mughal Emperor Shah Jahan in 1639.', rating: 4.6, price: 2, cost: 350, unit: 'entry', lat: 28.6562, lng: 77.2410, walk: 120, tags: ['UNESCO', 'Mughal', 'Must Visit'], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl5', city: 'Delhi', name: 'Qutub Minar Complex', cat: 'heritage', area: 'Mehrauli', desc: '73-meter UNESCO minaret from the 12th century with stunning Indo-Islamic architecture and iron pillar.', rating: 4.5, price: 2, cost: 300, unit: 'entry', lat: 28.5245, lng: 77.1855, walk: 60, tags: ['UNESCO', 'Ancient', 'Tower'], image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl6', city: 'Delhi', name: 'Humayun\'s Tomb', cat: 'heritage', area: 'Nizamuddin', desc: 'Magnificent 16th-century Mughal garden tomb — the architectural inspiration for the Taj Mahal.', rating: 4.7, price: 2, cost: 500, unit: 'entry', lat: 28.5933, lng: 77.2507, walk: 90, tags: ['UNESCO', 'Garden', 'Mughal'], image: 'https://images.unsplash.com/photo-1572782252655-9c8771392601?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl7', city: 'Delhi', name: 'The Imperial Hotel', cat: 'stay', area: 'Janpath', desc: 'Art deco heritage luxury hotel from 1931 with museum-quality art collection and colonial grandeur.', rating: 4.8, price: 3, cost: 15000, unit: 'per night', lat: 28.6257, lng: 77.2171, tags: ['Luxury', 'Heritage', 'Art Deco'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80' },
  { id: 'dl8', city: 'Delhi', name: 'Zostel Old Delhi', cat: 'stay', area: 'Chandni Chowk', desc: 'Vibrant backpacker hostel steps from Jama Masjid with rooftop terrace overlooking Old Delhi skyline.', rating: 4.1, price: 1, cost: 800, unit: 'per night', lat: 28.6510, lng: 77.2300, tags: ['Backpacker', 'Rooftop', 'Budget'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80' },

  // ── MUMBAI ──
  { id: 'mb1', city: 'Mumbai', name: 'Vada Pav at Ashok Vada Pav', cat: 'food', area: 'Dadar', desc: 'Mumbai\'s iconic spicy potato fritter sandwich — the king of street food, perfected over decades.', rating: 4.5, price: 1, cost: 50, unit: 'per person', lat: 19.0178, lng: 72.8478, tags: ['Iconic', 'Street Food', 'Budget'], image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&auto=format&fit=crop&q=80' },
  { id: 'mb2', city: 'Mumbai', name: 'Leopold Cafe', cat: 'food', area: 'Colaba', desc: 'Historic 1871 café and bar — a Bombay institution for travelers, writers, and locals alike.', rating: 4.3, price: 2, cost: 800, unit: 'per person', lat: 18.9228, lng: 72.8317, tags: ['Historic', 'Café', 'Nightlife'], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80' },
  { id: 'mb3', city: 'Mumbai', name: 'Gateway of India', cat: 'heritage', area: 'Apollo Bunder', desc: 'Iconic 26-meter triumphal arch built in 1924, overlooking Mumbai Harbor with Indo-Saracenic grandeur.', rating: 4.6, price: 1, cost: 0, unit: 'free', lat: 18.9220, lng: 72.8347, walk: 30, tags: ['Landmark', 'Harbor', 'Free Entry'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80' },
  { id: 'mb4', city: 'Mumbai', name: 'Chhatrapati Shivaji Terminus', cat: 'heritage', area: 'Fort', desc: 'UNESCO Gothic-Victorian railway station (1888) — a breathtaking fusion of Indian and British architecture.', rating: 4.7, price: 1, cost: 0, unit: 'free', lat: 18.9398, lng: 72.8355, walk: 45, tags: ['UNESCO', 'Victorian', 'Railway'], image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&auto=format&fit=crop&q=80' },
  { id: 'mb5', city: 'Mumbai', name: 'Elephanta Caves', cat: 'heritage', area: 'Elephanta Island', desc: 'UNESCO rock-cut cave temples from 5th-8th century with stunning Shiva sculptures, reached by ferry.', rating: 4.4, price: 2, cost: 600, unit: 'entry+ferry', lat: 18.9633, lng: 72.9315, walk: 120, tags: ['UNESCO', 'Caves', 'Boat Trip'], image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80' },
  { id: 'mb6', city: 'Mumbai', name: 'Taj Mahal Palace Hotel', cat: 'stay', area: 'Colaba', desc: 'Legendary 1903 luxury waterfront hotel — an icon of Indian hospitality with unmatched sea views.', rating: 4.9, price: 3, cost: 25000, unit: 'per night', lat: 18.9217, lng: 72.8332, tags: ['Luxury', 'Iconic', 'Waterfront'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80' },

  // ── UDAIPUR ──
  { id: 'ud1', city: 'Udaipur', name: 'Millets of Mewar', cat: 'food', area: 'Gangaur Ghat', desc: 'Farm-to-table Rajasthani cuisine with organic millets, served at lakeside terraces near Gangaur Ghat.', rating: 4.4, price: 2, cost: 500, unit: 'per person', lat: 24.5779, lng: 73.6831, tags: ['Organic', 'Lakeside', 'Healthy'], image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' },
  { id: 'ud2', city: 'Udaipur', name: 'Natraj Dining Hall', cat: 'food', area: 'Bapu Bazaar', desc: 'Iconic 1940s Rajasthani thali restaurant known for unlimited dal baati churma and gatte ki sabzi.', rating: 4.5, price: 1, cost: 250, unit: 'per person', lat: 24.5795, lng: 73.6862, tags: ['Thali', 'Unlimited', 'Classic'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { id: 'ud3', city: 'Udaipur', name: 'City Palace Udaipur', cat: 'heritage', area: 'Pichola Lake', desc: 'Sprawling palace complex built over 400 years overlooking Lake Pichola — the crown jewel of Mewar.', rating: 4.7, price: 3, cost: 500, unit: 'entry', lat: 24.5764, lng: 73.6844, walk: 120, tags: ['Palace', 'Lakeside', 'Royal'], image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80' },
  { id: 'ud4', city: 'Udaipur', name: 'Jagdish Temple', cat: 'heritage', area: 'Old City', desc: 'Grand 17th-century Indo-Aryan carved temple dedicated to Lord Vishnu with elaborate stone artwork.', rating: 4.4, price: 1, cost: 0, unit: 'free', lat: 24.5782, lng: 73.6848, walk: 30, tags: ['Temple', 'Free Entry', 'Carved'], image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80' },
  { id: 'ud5', city: 'Udaipur', name: 'Lake Pichola Boat Ride', cat: 'heritage', area: 'Pichola Lake', desc: 'Serene sunset boat cruise past Jag Mandir and Lake Palace — the most romantic experience in Rajasthan.', rating: 4.6, price: 2, cost: 400, unit: 'per person', lat: 24.5720, lng: 73.6790, walk: 60, tags: ['Boat Ride', 'Sunset', 'Romantic'], image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80' },
  { id: 'ud6', city: 'Udaipur', name: 'Amet Haveli', cat: 'stay', area: 'Lake Pichola', desc: 'Heritage lakefront haveli converted to a boutique hotel with private ghats and candlelit dining.', rating: 4.6, price: 3, cost: 6500, unit: 'per night', lat: 24.5755, lng: 73.6810, tags: ['Lakefront', 'Heritage', 'Romantic'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80' },

  // ── GOA ──
  { id: 'ga1', city: 'Goa', name: 'Vindalho at Ritz Classic', cat: 'food', area: 'Panjim', desc: 'Authentic Goan-Portuguese pork vindalho with tangy vinegar and red chilies, a 100-year-old recipe.', rating: 4.4, price: 2, cost: 600, unit: 'per person', lat: 15.4989, lng: 73.8278, tags: ['Goan', 'Portuguese', 'Pork'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80' },
  { id: 'ga2', city: 'Goa', name: 'Beach Shack Fish Thali', cat: 'food', area: 'Anjuna Beach', desc: 'Fresh-catch seafood thali with kokum curry, fried kingfish, and rice — feet in the sand dining.', rating: 4.3, price: 1, cost: 350, unit: 'per person', lat: 15.5835, lng: 73.7413, tags: ['Seafood', 'Beach', 'Fresh Catch'], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80' },
  { id: 'ga3', city: 'Goa', name: 'Basilica of Bom Jesus', cat: 'heritage', area: 'Old Goa', desc: 'UNESCO 16th-century Baroque basilica housing the sacred relics of St. Francis Xavier.', rating: 4.6, price: 1, cost: 0, unit: 'free', lat: 15.5009, lng: 73.9116, walk: 40, tags: ['UNESCO', 'Church', 'Colonial'], image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80' },
  { id: 'ga4', city: 'Goa', name: 'Fort Aguada', cat: 'heritage', area: 'Candolim', desc: '17th-century Portuguese sea fortress with a lighthouse offering panoramic views of the Arabian Sea.', rating: 4.5, price: 1, cost: 50, unit: 'entry', lat: 15.4920, lng: 73.7735, walk: 45, tags: ['Fort', 'Lighthouse', 'Sea View'], image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80' },
  { id: 'ga5', city: 'Goa', name: 'Taj Exotica Resort & Spa', cat: 'stay', area: 'Benaulim', desc: 'Mediterranean-style luxury resort on a private beach with infinity pool overlooking the Arabian Sea.', rating: 4.8, price: 3, cost: 18000, unit: 'per night', lat: 15.2641, lng: 73.9268, tags: ['Luxury', 'Beach', 'Spa'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80' },
  { id: 'ga6', city: 'Goa', name: 'Jungle Hostel Arambol', cat: 'stay', area: 'Arambol', desc: 'Bohemian jungle treehouse hostel with hammocks, jam sessions, and a short walk to Arambol beach.', rating: 4.2, price: 1, cost: 600, unit: 'per night', lat: 15.6851, lng: 73.7085, tags: ['Bohemian', 'Treehouse', 'Budget'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80' },
];

// Legacy alias for backward compatibility
export const PLACES = ALL_PLACES.filter(p => p.city === 'Jaipur');
export const INITIAL_CITY = CITIES[0];

export function getPlacesForCity(cityName: string): Place[] {
  return ALL_PLACES.filter(p => p.city.toLowerCase() === cityName.toLowerCase());
}

export function getCityInfo(cityName: string): CityInfo | undefined {
  return CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
}

export const NOTES: Note[] = [
  { id: 'n1', city: 'Jaipur', name: 'Bazaar lanes heavily crowded (5–7 PM)', area: 'Johari Bazaar', lat: 26.920, lng: 75.800, label: 'Busy Hours', source: 'sample' },
  { id: 'n2', city: 'Jaipur', name: 'Dim street lighting reported behind market', area: 'Chandpole Lane', lat: 26.926, lng: 75.785, label: 'Community Alert', source: 'community' },
  { id: 'n3', city: 'Jaipur', name: 'Pavement improvement work near crossing', area: 'Station Road', lat: 26.914, lng: 75.810, label: 'Use Caution', source: 'sample' },
  { id: 'n4', city: 'Delhi', name: 'Chandni Chowk closed for pedestrianization', area: 'Chandni Chowk', lat: 28.656, lng: 77.230, label: 'Pedestrian Zone', source: 'official' },
  { id: 'n5', city: 'Mumbai', name: 'Marine Drive waterlogging during monsoon', area: 'Marine Drive', lat: 18.944, lng: 72.823, label: 'Monsoon Alert', source: 'community' },
];

export const COMMUNITY_REPORTS: CommunityReport[] = [
  { id: 'r1', cat: 'Poor Lighting', loc: 'Lane behind textile market', when: 'Reported 2h ago · Evening', source: 'Community Member', status: 'Under Review' },
  { id: 'r2', cat: 'Heavy Crowding', loc: 'Hawa Mahal main entry gate', when: 'Reported 4h ago · Midday', source: 'Community Member', status: 'Verified' },
  { id: 'r3', cat: 'Road Construction', loc: 'Station Road pedestrian crossing', when: 'Reported Yesterday', source: 'Municipal Notice', status: 'Resolved' },
];

export const ROUTES: RouteOption[] = [
  { type: 'fast', title: 'Bazaar Direct Route (Fastest)', desc: 'Straight along the main bazaar arterial road through two busy junctions.', duration: '14 mins', distance: '1.2 km' },
  { type: 'calm', title: 'Heritage Alleyways (Recommended / Calmer)', desc: 'Follows wider pedestrian corridors with evening street illumination.', duration: '19 mins', distance: '1.5 km' },
];
