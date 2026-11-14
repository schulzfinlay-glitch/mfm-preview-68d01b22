/* Mates for Mulligans: product page. The build bakes the default option into
 * the HTML for crawlers; this takes over with the live choices. */
(function () {
  'use strict';
  var X = window.MFMX, C = window.MFM, esc = X.esc;
  var main = document.querySelector('[data-kit]');
  var p = X.bySlug[main.dataset.kit];
  var q = new URLSearchParams(location.search).get('colour');
  var v = p.variants.find(function (x) { return x.slug === q; }) || p.variants.find(function (x) { return x.inStock; }) || p.variants[0];
  var size = null, hand = null;
  var el = function (k) { return main.querySelector('[data-' + k + ']'); };
  var addBtn = el('add'), sticky = el('sticky'), stickyBtn = el('sticky-btn');
  var single = v.sizes.length === 1 && v.sizes[0].size === 'One size';
  if (single) size = 'One size';

  function chosen() {
    if (p.hands) return size && hand ? size + ' / ' + hand : null;
    return size;
  }
  function render(first) {
    var imgs = v.imgs;
    if (imgs.length) el('gallery').innerHTML = imgs.map(function (f, i) {
      var photo = /course|photo/.test(f);
      return '<figure><img class="' + (photo ? 'photo' : '') + '" src="' + X.img(f) + '" alt="' + esc(p.name + (p.variants.length > 1 ? ' in ' + v.colour : '') + (i ? ', view ' + (i + 1) : '')) + '" width="1000" height="1000"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '></figure>';
    }).join('');
    var pick = chosen(), z = pick && v.sizes.find(function (x) { return x.size === pick; });
    var price = z ? z.price : v.price;
    el('price').textContent = (p.voucher && !z ? 'From ' : '') + X.money(price);
    el('give').textContent = v.gives ? X.money(X.give(price)) + ' to ' + C.charity.name : '';
    var html = '';
    if (p.variants.length > 1) html += '<div class="group"><span>Colour: <b>' + esc(v.colour) + '</b></span><ul class="swatches">' + p.variants.map(function (x) {
      return '<li><button class="swatch" type="button" style="--sw:' + x.hex + '" data-c="' + esc(x.colour) + '" aria-pressed="' + (x === v) + '" aria-label="' + esc(x.colour) + '"></button></li>';
    }).join('') + '</ul></div>';
    if (p.hands) {
      var sizes = [], hands = ['Left', 'Right'];
      v.sizes.forEach(function (x) { var s = x.size.split(' / ')[0]; if (sizes.indexOf(s) === -1) sizes.push(s); });
      html += '<div class="group"><span>Size</span><div class="sizes">' + sizes.map(function (s) { return '<button class="size size--lg" type="button" data-z="' + s + '" aria-pressed="' + (s === size) + '">' + s + '</button>'; }).join('') + '</div></div>' +
        '<div class="group"><span>Hand you wear it on</span><div class="sizes">' + hands.map(function (h) {
          var ok = !size || v.sizes.some(function (x) { return x.size === size + ' / ' + h && x.ok; });
          return '<button class="size size--lg" type="button" data-h="' + h + '"' + (ok ? '' : ' disabled') + ' aria-pressed="' + (h === hand) + '">' + h + '</button>';
        }).join('') + '</div></div>';
    } else if (!single) {
      html += '<div class="group"><span>' + (p.voucher ? 'Value' : 'Size') + '</span><div class="sizes">' + v.sizes.map(function (x) {
        return '<button class="size size--lg" type="button" data-z="' + esc(x.size) + '"' + (x.ok ? '' : ' disabled aria-label="' + esc(x.size) + ', sold out"') + ' aria-pressed="' + (x.size === size) + '">' + esc(x.size) + '</button>';
      }).join('') + '</div></div>';
    }
    el('options').innerHTML = html;
    var ready = !!(z && z.ok);
    addBtn.disabled = !ready;
    addBtn.textContent = ready ? 'Add to your card, ' + X.money(price) : !v.inStock ? 'Sold out' : p.hands ? 'Choose size and hand' : p.voucher ? 'Choose a value' : 'Choose a size';
    stickyBtn.textContent = ready ? 'Add to your card' : addBtn.textContent;
    el('sticky-label').innerHTML = esc(p.name) + '<br>' + X.money(price);
    renderNext();
    if (!first && p.variants.length > 1) { var u = new URL(location.href); u.searchParams.set('colour', v.slug); history.replaceState(null, '', u); }
  }
  // Complete the kit: one tap to add the next most useful piece.
  function renderNext() {
    var order = ['check-on-your-mates-cap', 'sure-grip-glove', 'ball-marker-coin', 'golf-towel', 'the-crossed-clubs-polo'];
    var n = X.bySlug[order.find(function (s) { return s !== p.slug && !X.bySlug[s].hands; })];
    if (!n || p.voucher) { el('next').innerHTML = ''; return; }
    var nv = n.variants.find(function (x) { return x.inStock; }), one = nv.sizes.length === 1;
    el('next').innerHTML = '<div class="kit-next"><img src="' + X.img(nv.imgs[0]) + '" alt="" width="64" height="64"><div><b>Complete the kit:</b> ' + esc(n.name) + (n.variants.length > 1 ? ' in ' + esc(nv.colour) : '') + ', ' + X.money(nv.price) +
      '<div class="sizes">' + (one ? '<button class="size" type="button" data-nz="One size">Add</button>' : nv.sizes.map(function (z) { return '<button class="size" type="button" data-nz="' + esc(z.size) + '"' + (z.ok ? '' : ' disabled') + '>' + esc(z.size) + '</button>'; }).join('')) + '</div></div></div>';
    el('next')._n = { p: n, v: nv };
  }
  function add() {
    var pick = chosen(); if (pick && X.cart.add(p, v, pick)) X.openCard();
  }
  main.addEventListener('click', function (e) {
    var c = e.target.closest('[data-c]'); if (c) { v = p.variants.find(function (x) { return x.colour === c.dataset.c; }); render(); main.querySelector('[data-c="' + CSS.escape(v.colour) + '"]').focus(); }
    var z = e.target.closest('[data-z]'); if (z) { size = z.dataset.z; if (p.hands && hand && !v.sizes.some(function (x) { return x.size === size + ' / ' + hand && x.ok; })) hand = null; render(); main.querySelector('[data-z="' + CSS.escape(size) + '"]').focus(); }
    var h = e.target.closest('[data-h]'); if (h) { hand = h.dataset.h; render(); main.querySelector('[data-h="' + hand + '"]').focus(); }
    if (e.target.closest('[data-add]')) add();
    var nz = e.target.closest('[data-nz]'); if (nz) { var n = el('next')._n; if (X.cart.add(n.p, n.v, nz.dataset.nz)) X.openCard(); }
    if (e.target.closest('[data-sticky-btn]')) {
      if (chosen()) add();
      else { el('options').scrollIntoView({ block: 'center' }); var f = el('options').querySelector('button:not([disabled])'); if (f) f.focus({ preventScroll: true }); }
    }
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    var on = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', String(!on)); stickyBtn.tabIndex = on ? 0 : -1;
  }).observe(addBtn);
  render(true);
})();
