/* Mates for Mulligans: shared behaviour.
 * Scorecard nav, product lines, "your card" (the bag, with what the round
 * raises for Beyond Blue), and checkout through the store's own Shopify. */
(function () {
  'use strict';
  var C = window.MFM;
  var mem = {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('mfm.' + k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('mfm.' + k, JSON.stringify(v)); } catch (e) {} },
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { n = Math.round(n * 100) / 100; return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }); };
  var slug = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var give = function (n) { return Math.round(n * C.donationShare * 100) / 100; };

  // ---------------------------------------------------------- catalogue --
  var products = window.MFM_PRODUCTS.map(function (p) {
    var out = Object.assign({}, p);
    out.variants = p.variants.map(function (v) {
      var imgs = Array.isArray(p.images) ? p.images : (p.images[v.colour] || []);
      return {
        colour: v.colour, slug: slug(v.colour), hex: v.hex, handle: v.handle, price: v.price || p.price, imgs: imgs,
        sizes: v.sizes.map(function (z) { return { size: z[0], id: z[1], ok: !!z[2], price: z[3] || v.price || p.price }; }),
        // Whether voucher sales count toward the 30% is not stated by the store.
        gives: !p.voucher,
      };
    });
    out.variants.forEach(function (v) { v.inStock = v.sizes.some(function (z) { return z.ok; }); });
    return out;
  });
  var bySlug = {}; products.forEach(function (p) { bySlug[p.slug] = p; });
  var img = function (f) { return '/mfm-preview-68d01b22/assets/products/' + f; };
  var url = function (p, v) { return '/mfm-preview-68d01b22/kit/' + p.slug + '.html' + (v && p.variants.length > 1 ? '?colour=' + v.slug : ''); };

  // ---------------------------------------------------------------- bar --
  var HOLES = [['1', 'Tee off', '/mfm-preview-68d01b22/#hole-1'], ['2', 'The kit', '/mfm-preview-68d01b22/#hole-2'], ['3', 'The cause', '/mfm-preview-68d01b22/#hole-3'], ['4', 'Check in', '/mfm-preview-68d01b22/#hole-4'], ['19', 'Clubhouse', '/mfm-preview-68d01b22/#hole-19']];
  var MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="22" cy="56" rx="13" ry="4.5" fill="currentColor" opacity=".28"/><rect x="20" y="8" width="4" height="48" rx="2" fill="currentColor"/><path d="M24 10h24a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H33l-9 7V10z" fill="currentColor"/><circle cx="33" cy="22" r="2.4" fill="#f3eee3"/><circle cx="40" cy="22" r="2.4" fill="#f3eee3"/><circle cx="47" cy="22" r="2.4" fill="#f3eee3"/></svg>';
  var icon = {
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M4 13h16M10 3v18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };
  var bar = document.querySelector('[data-bar]');
  if (bar) {
    bar.innerHTML =
      '<a class="lockup" href="/mfm-preview-68d01b22/" aria-label="Mates for Mulligans home">' + MARK + '<span>Mates for Mulligans</span></a>' +
      '<nav class="card-nav" aria-label="The round">' + HOLES.map(function (h) { return '<a href="' + h[2] + '" data-hole-link="' + h[0] + '"><b>' + h[0] + '</b>' + h[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="bar__end"><a class="icon-btn shop-link" href="/mfm-preview-68d01b22/shop.html">Pro shop</a>' +
      '<button class="icon-btn icon-btn--fill" type="button" data-open-card aria-label="Open your card">' + icon.card + '<span>Your card</span><span class="count" data-count data-zero>0</span></button>' +
      '<button class="icon-btn menu-btn" type="button" data-open-menu aria-label="Open menu">' + icon.menu + '</button></div>';
  }
  // On the home page, the scorecard follows the hole you are on.
  var holes = document.querySelectorAll('[data-hole]');
  if (holes.length && 'IntersectionObserver' in window) {
    var onHole = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        document.querySelectorAll('[data-hole-link]').forEach(function (a) {
          if (a.dataset.holeLink === e.target.dataset.hole) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    holes.forEach(function (h) { onHole.observe(h); });
  }

  // ------------------------------------------------------------ drawers --
  var scrim = document.createElement('div'); scrim.className = 'scrim'; document.body.appendChild(scrim);
  function drawer(id, title, left) {
    var el = document.createElement('aside'); el.className = 'drawer' + (left ? ' drawer--left' : ''); el.id = id;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', title);
    el.innerHTML = '<div class="drawer__head"><h2>' + title + '</h2><button class="icon-btn" type="button" data-close aria-label="Close">' + icon.close + '</button></div><div class="drawer__body"></div><div class="drawer__foot"></div>';
    document.body.appendChild(el); return el;
  }
  var openEl = null, lastFocus = null;
  function open(el) { lastFocus = document.activeElement; openEl = el; el.classList.add('is-open'); scrim.classList.add('is-open'); document.documentElement.style.overflow = 'hidden'; setTimeout(function () { el.querySelector('[data-close]').focus(); }, 40); }
  function close() { if (!openEl) return; openEl.classList.remove('is-open'); scrim.classList.remove('is-open'); document.documentElement.style.overflow = ''; openEl = null; if (lastFocus) lastFocus.focus(); }
  scrim.addEventListener('click', close);
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && openEl) {
      var f = openEl.querySelectorAll('a[href],button:not([disabled]),input,select'); var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  var menu = drawer('mfm-menu', 'The round', true);
  menu.querySelector('.drawer__body').innerHTML = '<nav class="mobile-nav" aria-label="The round">' + HOLES.map(function (h) { return '<a href="' + h[2] + '"><b>' + h[0] + '</b>' + h[1] + '</a>'; }).join('') + '<a href="/mfm-preview-68d01b22/shop.html"><b></b>Pro shop</a></nav>';
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
  var cardEl = drawer('mfm-card', 'Your card');

  // --------------------------------------------------------------- cart --
  var cart = {
    items: function () { return store.get('cart', []); },
    save: function (it) { store.set('cart', it); render(); },
    add: function (p, v, size, quiet) {
      var z = v.sizes.find(function (x) { return x.size === size; }); if (!z || !z.ok) return false;
      var it = cart.items(), hit = it.find(function (i) { return i.id === z.id; });
      if (hit) hit.qty += 1;
      else it.push({ id: z.id, slug: p.slug, name: p.name, colour: v.colour, size: size, price: z.price, img: v.imgs[0] || '', qty: 1, gives: v.gives, multi: p.variants.length > 1 });
      cart.save(it);
      if (!quiet) toast(p.name + (p.variants.length > 1 ? ', ' + v.colour : '') + (size !== 'One size' ? ', ' + size : '') + ' added');
      return true;
    },
    subtotal: function () { return cart.items().reduce(function (s, i) { return s + i.price * i.qty; }, 0); },
    givingTotal: function () { return cart.items().reduce(function (s, i) { return s + (i.gives === false ? 0 : i.price * i.qty); }, 0); },
    count: function () { return cart.items().reduce(function (s, i) { return s + i.qty; }, 0); },
    // Shopify cart permalink: lands in the store's own checkout, bag filled.
    checkoutUrl: function () { return C.store + '/cart/' + cart.items().map(function (i) { return i.id + ':' + i.qty; }).join(','); },
  };
  // The next piece of kit: what a golfer is most likely missing.
  var NEXT = ['the-crossed-clubs-polo', 'check-on-your-mates-cap', 'sure-grip-glove', 'ball-marker-coin', 'golf-towel'];
  function nextPiece(items) {
    var have = items.map(function (i) { return i.slug; });
    var s = NEXT.find(function (x) { return have.indexOf(x) === -1; }); if (!s) return null;
    var p = bySlug[s]; return { p: p, v: p.variants.find(function (v) { return v.inStock; }) };
  }
  function render() {
    var n = cart.count();
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = n; el.toggleAttribute('data-zero', !n); });
    var items = cart.items(), body = cardEl.querySelector('.drawer__body'), foot = cardEl.querySelector('.drawer__foot');
    if (!items.length) {
      body.innerHTML = '<p class="empty">Nothing on your card yet. Every item you add shows what it raises for Beyond Blue.</p><a class="btn btn--block" href="/mfm-preview-68d01b22/shop.html">Visit the pro shop</a>';
      foot.innerHTML = ''; return;
    }
    var sub = cart.subtotal();
    body.innerHTML = '<table class="card-table"><thead><tr><th scope="col">Kit</th><th scope="col">Price</th><th scope="col">To Beyond Blue</th></tr></thead><tbody>' +
      items.map(function (i) {
        return '<tr><td><div class="line-item">' + (i.img ? '<img src="' + img(i.img) + '" alt="" width="52" height="52">' : '<span></span>') +
          '<div><a class="link" href="/mfm-preview-68d01b22/kit/' + i.slug + '.html">' + esc(i.name) + '</a><small>' + esc([i.multi ? i.colour : '', i.size !== 'One size' ? i.size : ''].filter(Boolean).join(' · ')) + '</small>' +
          '<div class="qty" aria-label="Quantity"><button type="button" data-q="' + i.id + '" data-d="-1" aria-label="One less">−</button><span>' + i.qty + '</span><button type="button" data-q="' + i.id + '" data-d="1" aria-label="One more">+</button></div></div></div></td>' +
          '<td class="num">' + money(i.price * i.qty) + '</td><td class="num give">' + (i.gives === false ? '–' : money(give(i.price * i.qty))) + '</td></tr>';
      }).join('') + '</tbody></table>' + kitNext(items);
    foot.innerHTML = '<div class="totals"><div><span>Subtotal</span><span class="num">' + money(sub) + '</span></div></div>' +
      '<div class="raises"><span>Your round raises for ' + esc(C.charity.name) + '</span><b class="num">' + money(give(cart.givingTotal())) + '</b></div>' +
      '<a class="btn btn--pin btn--block" href="' + cart.checkoutUrl() + '" data-checkout>Checkout</a>' +
      '<small>You finish on the Mates for Mulligans Shopify checkout. Shipping and any discount codes are applied there. ' + Math.round(C.donationShare * 100) + '% of every sale goes to ' + esc(C.charity.name) + '.</small>';
  }
  function kitNext(items) {
    var n = nextPiece(items); if (!n) return '';
    return '<div class="kit-next"><img src="' + img(n.v.imgs[0]) + '" alt="" width="64" height="64"><div><b>Complete the kit:</b> ' + esc(n.p.name) + ', ' + money(n.v.price) +
      '<div class="sizes">' + n.v.sizes.slice(0, 10).map(function (z) { return '<button class="size" type="button" data-next="' + n.p.slug + '|' + n.v.colour + '|' + z.size + '"' + (z.ok ? '' : ' disabled') + '>' + (z.size === 'One size' ? 'Add' : z.size) + '</button>'; }).join('') + '</div></div></div>';
  }
  cardEl.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]');
    if (q) cart.save(cart.items().map(function (i) { if (i.id === q.dataset.q) i.qty += Number(q.dataset.d); return i; }).filter(function (i) { return i.qty > 0; }));
    var nx = e.target.closest('[data-next]');
    if (nx) { var a = nx.dataset.next.split('|'), p = bySlug[a[0]]; cart.add(p, p.variants.find(function (v) { return v.colour === a[1]; }), a[2]); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-card]')) { render(); open(cardEl); }
    if (e.target.closest('[data-open-menu]')) open(menu);
    if (e.target.closest('[data-close]')) close();
  });

  // -------------------------------------------------------------- toast --
  var toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var tt; function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400); }

  // ----------------------------------------------------- product lines --
  function line(p, colour, opts) {
    opts = opts || {};
    var v = p.variants.find(function (x) { return x.colour === colour; }) || p.variants.find(function (x) { return x.inStock; }) || p.variants[0];
    return '<article class="pline" data-line="' + p.slug + '" data-colour="' + esc(v.colour) + '">' + lineInner(p, v, opts) + '</article>';
  }
  function lineInner(p, v, opts) {
    var first = v.imgs[0];
    var media = p.voucher ? voucherArt(v.sizes[0].price) : '<img src="' + img(first) + '" alt="' + esc(p.name + (p.variants.length > 1 ? ' in ' + v.colour : '')) + '" width="600" height="600"' + (opts.eager ? '' : ' loading="lazy"') + '>';
    var sizeBtns = p.hands ? '' : v.sizes.map(function (z) {
      return '<button class="size" type="button" data-add="' + esc(z.size) + '"' + (z.ok ? '' : ' disabled') + ' aria-label="Add ' + esc(p.name + (p.variants.length > 1 ? ', ' + v.colour : '') + ', ' + z.size) + ' to your card">' + (z.size === 'One size' ? 'Add to card' : esc(z.size)) + '</button>';
    }).join('');
    return '<a class="pline__media" href="' + url(p, v) + '" tabindex="-1" aria-hidden="true">' + (opts.tag ? '<span class="pline__tag">' + esc(opts.tag) + '</span>' : '') + media + '</a>' +
      (p.variants.length > 1 ? '<ul class="swatches" aria-label="Colours">' + p.variants.map(function (x) {
        return '<li><button class="swatch" type="button" style="--sw:' + x.hex + '" data-swap="' + esc(x.colour) + '" aria-pressed="' + (x === v) + '" aria-label="' + esc(x.colour) + '"></button></li>';
      }).join('') + '</ul>' : '') +
      '<h3><a href="' + url(p, v) + '">' + esc(p.name) + '</a></h3>' +
      '<div class="pline__row"><span>' + esc(p.variants.length > 1 ? v.colour + ' · ' + p.variants.length + ' colours' : p.line) + '</span><span class="num">' + (p.voucher ? 'From ' : '') + money(v.price) + '</span></div>' +
      (v.gives ? '<div class="pline__give">' + money(give(v.price)) + ' to ' + esc(C.charity.name) + '</div>' : '') +
      (opts.noAdd ? '' : p.hands || p.voucher ? '<a class="btn btn--ghost" href="' + url(p, v) + '">' + (p.voucher ? 'Choose a value' : 'Choose size and hand') + '</a>' : '<div class="sizes" aria-label="Add to your card">' + sizeBtns + '</div>');
  }
  function voucherArt(value) {
    return '<span style="display:grid;place-items:center;width:86%;aspect-ratio:1.6;border-radius:14px;background:var(--green);color:var(--bone);box-shadow:var(--sc-e2);text-align:center;padding:1rem">' +
      '<span style="color:var(--pin);width:34px">' + MARK + '</span><span class="display" style="font-size:1.4rem">A round on me</span><span class="num" style="font-size:.8rem;opacity:.8">Gift voucher from ' + money(value) + '</span></span>';
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-line]'); if (!el) return;
    var p = bySlug[el.dataset.line];
    var sw = e.target.closest('[data-swap]');
    if (sw) { var v = p.variants.find(function (x) { return x.colour === sw.dataset.swap; }); el.dataset.colour = v.colour; el.innerHTML = lineInner(p, v, {}); el.querySelector('[data-swap="' + CSS.escape(v.colour) + '"]').focus(); }
    var ad = e.target.closest('[data-add]');
    if (ad) { var vv = p.variants.find(function (x) { return x.colour === el.dataset.colour; }); if (cart.add(p, vv, ad.dataset.add)) { render(); open(cardEl); } }
  });

  // ------------------------------------------------------------- footer --
  var foot = document.querySelector('[data-foot]');
  if (foot) foot.innerHTML =
    '<div><a class="lockup" href="/mfm-preview-68d01b22/">' + MARK + '<span>Mates for Mulligans</span></a><p style="margin:1rem 0 0;max-width:36ch;opacity:.85">Golf kit with a reminder built in. ' + Math.round(C.donationShare * 100) + '% of every sale goes to ' + esc(C.charity.name) + '.</p></div>' +
    '<div><h2>Pro shop</h2><ul>' + products.map(function (p) { return '<li><a href="/mfm-preview-68d01b22/kit/' + p.slug + '.html">' + esc(p.name) + '</a></li>'; }).join('') + '</ul></div>' +
    '<div><h2>The round</h2><ul>' + HOLES.map(function (h) { return '<li><a href="' + h[2] + '">' + h[1] + '</a></li>'; }).join('') + '<li><a href="/mfm-preview-68d01b22/#faq">Sizing and FAQ</a></li></ul></div>' +
    '<div><h2>Say g\'day</h2><ul><li><a href="' + C.instagram + '">Instagram</a></li><li><a href="' + C.facebook + '">Facebook</a></li><li><a href="' + C.store + '/pages/contact">Contact us</a></li><li><a href="' + C.fundraiser + '">Our fundraiser</a></li></ul></div>' +
    '<p class="help">Doing it tough? Talk to someone today. <b>' + esc(C.charity.name) + ' ' + esc(C.charity.phone) + '</b>, any time. In a crisis, call <b>' + esc(C.crisis.name) + ' ' + esc(C.crisis.phone) + '</b>. In an emergency, call 000.</p>' +
    '<div class="foot__base"><span>© Mates for Mulligans</span><span><a href="' + C.store + '/policies/privacy-policy">Privacy</a></span></div>';

  render();
  window.MFMX = { products: products, bySlug: bySlug, img: img, url: url, money: money, give: give, esc: esc, slug: slug, line: line, cart: cart, toast: toast, store: store, mark: MARK, openCard: function () { render(); open(cardEl); } };
})();
