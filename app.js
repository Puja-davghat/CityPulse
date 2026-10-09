/* CityPulse app. Components are small render functions sharing one state object.
   No animation. State changes re-render immediately. */
(function () {
  'use strict';
  var D = window.CP, $ = function (s, r) { return (r || document).querySelector(s); };
  var CATS = {
    food: {label: 'Food', color: '#B4533A', shape: 'circle'},
    heritage: {label: 'Heritage', color: '#7A5C14', shape: 'square'},
    stay: {label: 'Stays', color: '#2F6B52', shape: 'diamond'},
    note: {label: 'Area notes', color: '#4A5A68', shape: 'triangle'}
  };
  var PRICE = ['', '₹', '₹₹', '₹₹₹'];
  var state = {q: '', cat: 'all', mapOn: {food: true, heritage: true, stay: true, note: true}, sel: null,
               saved: load('citypulse.saved', []), mine: load('citypulse.reports', [])};

  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function byId(id) { return D.places.filter(function (p) { return p.id === id; })[0] || D.notes.filter(function (n) { return n.id === id; })[0]; }
  function dist(a, b) { return Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 12); } /* ~12 m per map unit: illustrative */
  function isSaved(id) { return state.saved.indexOf(id) > -1; }

  /* ---------- illustration fallback (swap for photos via place.image) ---------- */
  function art(cat, seed, big) {
    var c = (CATS[cat] || CATS.note).color, h = big ? 300 : 200, s = '';
    if (cat === 'food') s = '<ellipse cx="150" cy="128" rx="72" ry="22" fill="#FBF7EA" stroke="#1E3A2F"/><ellipse cx="150" cy="120" rx="56" ry="14" fill="' + c + '"/><path d="M132 92q8-14 0-26M162 96q8-14 0-26" stroke="#1E3A2F" fill="none"/>';
    else if (cat === 'stay') s = '<rect x="80" y="62" width="140" height="88" fill="#FBF7EA" stroke="#1E3A2F"/><path d="M70 62h160" stroke="' + c + '" stroke-width="8"/>' + [0, 1, 2].map(function (i) { return '<rect x="' + (98 + i * 40) + '" y="82" width="22" height="30" fill="#DCE4D2" stroke="#1E3A2F"/>'; }).join('') + '<rect x="138" y="122" width="24" height="28" fill="' + c + '"/>';
    else s = '<path d="M70 150V84h160v66z" fill="#FBF7EA" stroke="#1E3A2F"/><path d="M62 84q88-64 176 0z" fill="' + c + '" stroke="#1E3A2F"/>' + [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (84 + i * 30) + ' 150v-28a10 10 0 0120 0v28z" fill="#DCE4D2" stroke="#1E3A2F"/>'; }).join('');
    var off = (seed || 0) % 3 * 12;
    return '<svg viewBox="0 0 300 ' + (big ? 200 : 200) + '" role="img" aria-label="Illustration of a ' + (CATS[cat] ? CATS[cat].label.toLowerCase() : 'place') + '" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#DCE4D2"/><g fill="none" stroke="#1E3A2F" opacity=".18"><path d="M-10 ' + (40 + off) + 'C80 10 160 90 310 ' + (40 + off) + '"/><path d="M-10 ' + (60 + off) + 'C80 30 160 110 310 ' + (60 + off) + '"/><path d="M-10 ' + (80 + off) + 'C80 50 160 130 310 ' + (80 + off) + '"/></g><rect y="150" width="300" height="50" fill="#EFE8D3"/>' + s + '</svg>';
  }
  function media(p, big) { return '<div class="art">' + (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">' : art(p.cat, p.id.length + p.id.charCodeAt(1), big)) + '</div>'; }
  function shape(cat) {
    var c = CATS[cat], f = 'fill="' + c.color + '" stroke="#FBF7EA" stroke-width="2"';
    var g = {circle: '<circle cx="12" cy="12" r="9" ' + f + '/>', square: '<rect x="3" y="3" width="18" height="18" ' + f + '/>', diamond: '<path d="M12 1l11 11-11 11L1 12z" ' + f + '/>', triangle: '<path d="M12 2l11 20H1z" ' + f + '/>'}[c.shape];
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + g + '</svg>';
  }
  function chipSet(el, items, current, onPick) {
    el.innerHTML = items.map(function (i) { return '<button type="button" class="chip" data-k="' + i[0] + '" aria-pressed="' + (current(i[0])) + '">' + i[1] + '</button>'; }).join('');
    el.onclick = function (e) { var b = e.target.closest('.chip'); if (b) onPick(b.dataset.k); };
  }

  /* ---------- Header / nav ---------- */
  var navEl = $('#nav'), menuBtn = $('#menu-btn');
  menuBtn.onclick = function () { var open = navEl.hasAttribute('hidden'); navEl.toggleAttribute('hidden', !open); menuBtn.setAttribute('aria-expanded', open); };
  navEl.onclick = function (e) { if (e.target.tagName === 'A' && window.innerWidth <= 960) { navEl.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false'); } };
  $('#search-open').onclick = function () { $('#top').scrollIntoView(); $('#hs-q').focus(); };
  $('#city').onchange = function (e) {
    var n = $('#city-note');
    if (e.target.value !== 'Jaipur') { n.textContent = 'Only Jaipur has sample content in this prototype. Other cities need data added to js/data.js or an API.'; n.hidden = false; e.target.value = 'Jaipur'; } else n.hidden = true;
  };

  /* ---------- Hero ---------- */
  $('#hero-art').innerHTML = art('heritage', 0, true);
  var heroCats = [['food', 'Food'], ['heritage', 'Heritage'], ['stay', 'Stays'], ['budget', 'Budget picks']];
  chipSet($('#hero-chips'), heroCats, function () { return 'false'; }, function (k) { setCat(k); $('#picks').scrollIntoView(); });
  $('#hero-search').onsubmit = function (e) { e.preventDefault(); state.q = $('#hs-q').value.trim().toLowerCase(); $('#p-q').value = $('#hs-q').value.trim(); setCat($('#hs-c').value); $('#picks').scrollIntoView(); };

  /* ---------- Map ---------- */
  var mapCats = ['food', 'heritage', 'stay', 'note'];
  chipSet($('#map-filters'), mapCats.map(function (k) { return [k, CATS[k].label]; }), function (k) { return state.mapOn[k]; },
    function (k) { state.mapOn[k] = !state.mapOn[k]; if (state.sel && !state.mapOn[(byId(state.sel).cat || 'note')]) state.sel = null; renderMap(); });
  $('#legend').innerHTML = mapCats.map(function (k) { return '<li><span style="width:20px;height:20px;display:inline-block">' + shape(k) + '</span>' + CATS[k].label + '</li>'; }).join('');
  function renderMap() {
    chipSet($('#map-filters'), mapCats.map(function (k) { return [k, CATS[k].label]; }), function (k) { return state.mapOn[k]; },
      function (k) { state.mapOn[k] = !state.mapOn[k]; if (state.sel && !state.mapOn[byId(state.sel).cat || 'note']) state.sel = null; renderMap(); });
    var items = D.places.concat(D.notes);
    $('#map-markers').innerHTML = items.map(function (p) {
      var c = p.cat || 'note';
      return '<button class="mk" data-id="' + p.id + '" style="left:' + p.x + '%;top:' + p.y + '%" aria-pressed="' + (state.sel === p.id) + '" aria-label="' + esc(p.name) + ', ' + CATS[c].label + '"' + (state.mapOn[c] ? '' : ' hidden') + '>' + shape(c) + '</button>';
    }).join('');
    renderDetail();
  }
  $('#map-markers').onclick = function (e) { var b = e.target.closest('.mk'); if (!b) return; state.sel = b.dataset.id; renderMap(); $('#map-detail').focus(); };
  function renderDetail() {
    var el = $('#map-detail'), p = state.sel && byId(state.sel);
    el.setAttribute('tabindex', '-1');
    if (!p) { el.innerHTML = '<p class="muted">Select a marker to see details. Hidden categories are filtered out above.</p>'; return; }
    if (p.cat) {
      el.innerHTML = media(p) + '<span class="cat cat-' + p.cat + '">' + CATS[p.cat].label + '</span><h3>' + esc(p.name) + '</h3><p class="muted small">' + esc(p.area) + '</p><p>' + esc(p.desc) + '</p><p class="meta"><span>★ ' + p.rating.toFixed(1) + ' <span class="tag tag-sample">Sample</span></span><span>' + PRICE[p.price] + ' · ≈ ₹' + p.cost + ' ' + p.unit + '</span></p><p style="margin-top:12px"><button class="save" data-save="' + p.id + '" aria-pressed="' + isSaved(p.id) + '">' + (isSaved(p.id) ? 'Saved' : 'Save place') + '</button></p>';
    } else {
      el.innerHTML = '<span class="cat cat-note">Area note</span><h3>' + esc(p.name) + '</h3><p class="muted small">' + esc(p.area) + '</p><p><span class="tag ' + (p.source === 'community' ? 'tag-community' : 'tag-sample') + '">' + (p.source === 'community' ? 'Community report · unverified' : 'Sample') + '</span> <strong>' + esc(p.label) + '</strong></p><p class="muted small" style="margin-top:10px">Notes are context, not a safety rating. Verified status needs an official data source.</p>';
    }
  }

  /* ---------- Local picks ---------- */
  var pickCats = [['all', 'All'], ['food', 'Food'], ['heritage', 'Heritage'], ['stay', 'Stays'], ['budget', 'Budget picks']];
  function setCat(k) { state.cat = k; renderPicks(); }
  function matches(p) {
    var q = state.q, t = (p.name + ' ' + p.area + ' ' + p.desc + ' ' + CATS[p.cat].label).toLowerCase();
    if (q && t.indexOf(q) < 0) return false;
    if (state.cat === 'budget') return p.price === 1;
    return state.cat === 'all' || p.cat === state.cat;
  }
  function renderPicks() {
    chipSet($('#p-chips'), pickCats, function (k) { return state.cat === k; }, setCat);
    var list = D.places.filter(matches);
    $('#p-count').textContent = list.length + ' of ' + D.places.length + ' sample places shown';
    $('#cards').innerHTML = list.length ? list.map(function (p) {
      return '<article class="card">' + media(p) + '<div class="card-body"><span class="cat cat-' + p.cat + '">' + CATS[p.cat].label + ' · ' + esc(p.area) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p><div class="meta"><span>★ ' + p.rating.toFixed(1) + ' · ' + PRICE[p.price] + ' <span class="tag tag-sample">Sample</span></span><span>≈ ₹' + p.cost + ' ' + p.unit + '</span></div><button class="save" data-save="' + p.id + '" aria-pressed="' + isSaved(p.id) + '" aria-label="' + (isSaved(p.id) ? 'Unsave ' : 'Save ') + esc(p.name) + '">' + (isSaved(p.id) ? 'Saved' : 'Save') + '</button></div></article>';
    }).join('') : '<div class="empty"><p><strong>No places match.</strong></p><p class="muted">Try a different word, or <button class="save" id="reset">clear filters</button>.</p></div>';
    renderSaved();
  }
  $('#p-q').oninput = function (e) { state.q = e.target.value.trim().toLowerCase(); renderPicks(); };
  document.addEventListener('click', function (e) {
    if (e.target.id === 'reset') { state.q = ''; state.cat = 'all'; $('#p-q').value = ''; renderPicks(); return; }
    var b = e.target.closest('[data-save]'); if (!b) return;
    var id = b.dataset.save, i = state.saved.indexOf(id);
    if (i > -1) state.saved.splice(i, 1); else state.saved.push(id);
    save('citypulse.saved', state.saved); renderPicks(); renderDetail();
    var again = document.querySelector('[data-save="' + id + '"]'); if (again && b.closest('#map-detail') ) again.focus();
  });
  function renderSaved() {
    $('#saved-count').textContent = state.saved.length;
    $('#saved-list').innerHTML = state.saved.length ? state.saved.map(function (id) { var p = byId(id); return '<li><span><strong>' + esc(p.name) + '</strong> <span class="muted small">' + CATS[p.cat].label + ' · ' + esc(p.area) + '</span></span><button class="save" data-save="' + id + '" aria-pressed="true" aria-label="Remove ' + esc(p.name) + ' from saved">Remove</button></li>'; }).join('') : '<li class="muted">Nothing saved yet. Use “Save” on any place.</li>';
  }
  $('#saved-btn').onclick = function () { var p = $('#saved-panel'); p.hidden = !p.hidden; this.setAttribute('aria-expanded', !p.hidden); };

  /* ---------- Tools ---------- */
  $('#n-from').innerHTML = D.places.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + '</option>'; }).join('');
  function renderNearby() {
    var o = byId($('#n-from').value), r = +$('#n-r').value;
    var l = D.places.filter(function (p) { return p.id !== o.id && dist(o, p) <= r; }).sort(function (a, b) { return dist(o, a) - dist(o, b); });
    $('#n-list').innerHTML = l.length ? l.map(function (p) { var d = dist(o, p); return '<li><span>' + esc(p.name) + '</span><span>≈ ' + d + ' m · ' + Math.max(1, Math.round(d / 75)) + ' min walk</span></li>'; }).join('') : '<li class="muted">Nothing within that range on the sample map.</li>';
  }
  $('#n-from').onchange = $('#n-r').onchange = renderNearby;
  function renderBudget() {
    var m = +$('#b-max').value; $('#b-out').textContent = '₹' + m;
    var l = D.places.filter(function (p) { return p.cost <= m; }).sort(function (a, b) { return a.cost - b.cost; });
    $('#b-list').innerHTML = l.length ? l.map(function (p) { return '<li><span>' + esc(p.name) + '</span><span>₹' + p.cost + ' <span class="muted small">' + p.unit + '</span></span></li>'; }).join('') : '<li class="muted">No sample places at this budget.</li>';
  }
  $('#b-max').oninput = renderBudget;
  var stops = D.places.filter(function (p) { return p.walk; }).sort(function (a, b) { return a.x - b.x; }), skip = {};
  stops = ['p5', 'p7', 'p6', 'p8'].map(byId);
  $('#w-list').innerHTML = stops.map(function (p) { return '<li><label><input type="checkbox" data-w="' + p.id + '" checked> <span><strong>' + esc(p.name) + '</strong><br><span class="muted small">' + p.walk + ' min visit</span></span></label></li>'; }).join('');
  $('#w-list').onchange = function (e) { skip[e.target.dataset.w] = !e.target.checked; renderWalk(); };
  function renderWalk() {
    var on = stops.filter(function (p) { return !skip[p.id]; }), m = 0, t = 0;
    on.forEach(function (p, i) { t += p.walk; if (i) m += dist(on[i - 1], p); });
    $('#w-total').textContent = on.length ? on.length + ' stops · ≈ ' + (m / 1000).toFixed(1) + ' km · ≈ ' + Math.round((t + m / 75) / 5) * 5 + ' min (sample estimate)' : 'Select at least one stop.';
  }

  /* ---------- Safety ---------- */
  var tagFor = function (s) { return s === 'community' ? '<span class="tag tag-community">Community report · unverified</span>' : '<span class="tag tag-sample">Sample</span>'; };
  $('#areas').innerHTML = D.notes.map(function (n) { return '<li><strong>' + esc(n.area) + ': ' + esc(n.label) + '</strong>' + esc(n.name) + '<div class="tags">' + tagFor(n.source) + '</div></li>'; }).join('');
  $('#reports').innerHTML = D.reports.map(function (r) { return '<li><strong>' + esc(r.cat) + '</strong>' + esc(r.loc) + ' · <span class="muted">' + esc(r.when) + '</span><div class="tags">' + tagFor(r.source) + '<span class="tag tag-sample">Sample</span></div></li>'; }).join('');
  function renderRoute() { $('#route-exp').textContent = D.routes[document.querySelector('input[name=route]:checked').value]; }
  document.querySelectorAll('input[name=route]').forEach(function (r) { r.onchange = renderRoute; });

  /* ---------- Report form ---------- */
  var F = {type: $('#r-type'), loc: $('#r-loc'), desc: $('#r-desc'), mail: $('#r-mail'), ok: $('#r-ok')};
  function setErr(key, msg) { var e = $('#e-' + key); e.hidden = !msg; e.textContent = msg || ''; F[key].setAttribute('aria-invalid', !!msg); return !!msg; }
  $('#report-form').onsubmit = function (e) {
    e.preventDefault();
    var bad = [
      setErr('type', F.type.value ? '' : 'Choose a type of update.'),
      setErr('loc', F.loc.value.trim() ? '' : 'Enter the place or area.'),
      setErr('desc', F.desc.value.trim().length >= 15 ? '' : 'Describe what you noticed in at least 15 characters.'),
      setErr('mail', !F.mail.value || F.mail.validity.valid ? '' : 'Enter a valid email address or leave it blank.'),
      setErr('ok', F.ok.checked ? '' : 'Please confirm to continue.')
    ];
    var first = ['type', 'loc', 'desc', 'mail', 'ok'].filter(function (k, i) { return bad[i]; })[0];
    if (first) { F[first].focus(); return; }
    var ref = 'CP-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    state.mine.unshift({ref: ref, cat: F.type.value, loc: F.loc.value.trim(), desc: F.desc.value.trim()}); save('citypulse.reports', state.mine);
    var c = $('#confirm'); c.hidden = false; c.innerHTML = '<h3>Update received</h3><p>Thank you. Reference <strong>' + ref + '</strong>. It is saved in this browser only and marked <span class="tag tag-community">Community report · unverified</span>. A backend is needed to publish or review it.</p>'; c.focus();
    this.reset(); ['type', 'loc', 'desc', 'mail', 'ok'].forEach(function (k) { setErr(k, ''); }); renderMine();
  };
  function renderMine() {
    $('#mine').innerHTML = state.mine.length ? state.mine.map(function (r) { return '<li><strong>' + esc(r.cat) + '</strong> · ' + esc(r.loc) + '<br><span class="muted small">' + esc(r.ref) + ' · unverified</span><br>' + esc(r.desc) + '</li>'; }).join('') : '<li class="muted">Nothing submitted yet.</li>';
    $('#snap-count').textContent = D.reports.length + state.mine.length;
  }

  /* ---------- init ---------- */
  renderMap(); renderPicks(); renderNearby(); renderBudget(); renderWalk(); renderRoute(); renderMine();
})();
