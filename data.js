/* All content below is SAMPLE data. Replace with API/CMS responses.
   Place fields: image = optional path (e.g. "images/lassi.jpg"); if empty an illustration is drawn. */
window.CP = {
  places: [
    {id:'p1', name:'Lassi counter on MI Road', cat:'food', area:'MI Road', desc:'Thick lassi served in clay cups, made in small batches through the morning.', rating:4.6, price:1, cost:120, unit:'per person', x:48, y:62, image:''},
    {id:'p2', name:'Old-city kachori shop', cat:'food', area:'Station Road', desc:'Crisp onion and sweet mawa kachori, usually gone by lunch.', rating:4.4, price:1, cost:150, unit:'per person', x:30, y:40, image:''},
    {id:'p3', name:'Lane-side chai counter', cat:'food', area:'Tripolia lanes', desc:'A regulars’ stop for sweet masala chai and buttered rusk.', rating:4.3, price:1, cost:40, unit:'per person', x:66, y:58, image:''},
    {id:'p4', name:'Rooftop thali house', cat:'food', area:'Chandpole', desc:'Unhurried Rajasthani thali with a view across the old walls at dusk.', rating:4.2, price:2, cost:650, unit:'per person', x:40, y:34, image:''},
    {id:'p5', name:'Palace of Winds façade', cat:'heritage', area:'Badi Choupad', desc:'The honeycomb sandstone front of 953 small windows; best at sunrise.', rating:4.5, price:2, cost:200, unit:'entry', x:52, y:30, image:'', walk:25},
    {id:'p6', name:'Royal city palace complex', cat:'heritage', area:'Old city', desc:'Courtyards, textile rooms and armories, partly still a family residence.', rating:4.6, price:3, cost:700, unit:'entry', x:60, y:20, image:'', walk:90},
    {id:'p7', name:'Stone observatory park', cat:'heritage', area:'Old city', desc:'Giant 18th-century instruments that read time and the stars.', rating:4.5, price:2, cost:200, unit:'entry', x:68, y:30, image:'', walk:45},
    {id:'p8', name:'Museum in the gardens', cat:'heritage', area:'Ram Niwas', desc:'An 1880s museum with a small collection of crafts, arms and miniatures.', rating:4.4, price:2, cost:300, unit:'entry', x:42, y:74, image:'', walk:60},
    {id:'p9', name:'Courtyard haveli stay', cat:'stay', area:'Old city', desc:'A restored merchant house with a quiet courtyard and rooftop breakfast.', rating:4.5, price:3, cost:5500, unit:'per night', x:36, y:22, image:''},
    {id:'p10', name:'Station-side hostel', cat:'stay', area:'Railway station', desc:'Clean dorm beds and a shared kitchen; good for early trains.', rating:4.2, price:1, cost:700, unit:'per night', x:76, y:68, image:''},
    {id:'p11', name:'Garden guesthouse', cat:'stay', area:'Bani Park', desc:'Eight rooms around a lawn, a short auto ride from the bazaars.', rating:4.3, price:2, cost:2200, unit:'per night', x:22, y:66, image:''}
  ],
  notes: [
    {id:'n1', name:'Bazaar lanes crowded 5–7 pm', area:'Johari Bazaar', x:24, y:52, label:'Busy', source:'sample'},
    {id:'n2', name:'Dim stretch behind the market', area:'Chandpole lane', x:18, y:28, label:'Community report', source:'community'},
    {id:'n3', name:'Pavement works near the crossing', area:'Station Road', x:70, y:46, label:'Use caution', source:'sample'}
  ],
  reports: [
    {cat:'Poor lighting', loc:'Lane behind the textile market', when:'Sample · evening', source:'community'},
    {cat:'Crowding', loc:'Palace of Winds gate', when:'Sample · late morning', source:'community'},
    {cat:'Pavement issue', loc:'Station Road crossing', when:'Sample · yesterday', source:'community'}
  ],
  routes: {
    fast:'Straight along the main bazaar road, through two busy junctions. Quicker, but pavements are narrow and crowded at peak hours.',
    calm:'Follows wider roads with shops open later, avoiding the dim stretch reported near the market. About 5 minutes longer. “Steadier” is a sample judgement, not a safety guarantee.'
  }
};
