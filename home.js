/* Mates for Mulligans home page: the round.
 *
 * Signature move, hole 1: take a mulligan. The pinned act's --sc-p plays two
 * tee shots along SVG flight paths. Each ball rides a real arc: its height
 * lifts it off its ground shadow and grows it slightly, and the tree canopy is
 * a plane above the balls, so the slice vanishes under it. The second ball
 * lands by the pin and the flag (the brand mark) asks the question.
 * The engine is untouched. Runs before ScrollCraft.mount.
 */
(function () {
  'use strict';
  var X = window.MFMX, C = window.MFM, esc = X.esc;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var ease = function (x) { x = clamp01(x); return 1 - Math.pow(1 - x, 2.2); };

  // ---------------------------------------------------------- hole 1 --
  var tee = document.getElementById('hole-1');
  var svg = tee.querySelector('[data-course]');
  var shots = [0, 1].map(function (k) {
    var path = svg.querySelector('[data-path="' + k + '"]'), trail = svg.querySelector('[data-trail="' + k + '"]');
    var L = path.getTotalLength();
    trail.setAttribute('stroke-dasharray', L + ' ' + L);
    return { path: path, L: L, trail: trail, ball: svg.querySelector('[data-ball="' + k + '"]'), shadow: svg.querySelector('[data-shadow="' + k + '"]'), H: k ? 95 : 70 };
  });
  // Shot windows on the act's progress.
  var WIN = [[0.08, 0.36], [0.47, 0.8]];
  var lines = tee.querySelectorAll('[data-line]');
  var ask = svg.querySelector('[data-ask]');
  var flag = svg.querySelector('[data-flag]');
  var mull = tee.querySelector('[data-mulligan]');
  // Phones: show the whole hole (tee to pin) rather than cropping to fill.
  // The letterbox is the same rough green as the course, so it reads as more course.
  var fit = function () { svg.setAttribute('preserveAspectRatio', innerWidth < 900 ? 'xMidYMid meet' : 'xMidYMid slice'); };
  fit(); addEventListener('resize', fit);

  function place(s, t, visible) {
    if (!visible) { s.ball.style.opacity = s.shadow.style.opacity = '0'; s.trail.style.strokeDashoffset = s.L; return; }
    var pt = s.path.getPointAtLength(t * s.L), h = Math.sin(Math.PI * t) * s.H;
    s.ball.setAttribute('cx', pt.x); s.ball.setAttribute('cy', pt.y - h); s.ball.setAttribute('r', (9 * (1 + h / 160)).toFixed(2));
    s.shadow.setAttribute('cx', pt.x + h * 0.25); s.shadow.setAttribute('cy', pt.y + 2); s.shadow.setAttribute('rx', (9 * (1 - h / 260)).toFixed(2));
    s.ball.style.opacity = '1'; s.shadow.style.opacity = (0.35 * (1 - h / 170)).toFixed(3);
    s.trail.style.strokeDashoffset = (s.L * (1 - t)).toFixed(1);
  }
  var shown = -1;
  function showLine(i) {
    if (i === shown) return; shown = i;
    lines.forEach(function (l, k) { l.classList.toggle('is-on', k === i); l.setAttribute('aria-hidden', String(k !== i)); });
  }
  var lastP = -1;
  function frame() {
    var p = reduce ? 1 : parseFloat(tee.style.getPropertyValue('--sc-p')) || 0;
    if (p !== lastP) {
      lastP = p;
      var t0 = ease((p - WIN[0][0]) / (WIN[0][1] - WIN[0][0]));
      var t1 = ease((p - WIN[1][0]) / (WIN[1][1] - WIN[1][0]));
      // The slice stays on its card (ball lost in the trees, trail fading)
      // until the mulligan is struck, so the second shot reads as another go.
      place(shots[0], t0, !reduce && p >= WIN[0][0]);
      shots[0].trail.style.opacity = p > WIN[1][0] ? '0.18' : '0.6';
      place(shots[1], t1, p >= WIN[1][0] - 0.01);
      var a = clamp01((p - 0.8) / 0.06);
      ask.setAttribute('opacity', a.toFixed(2));
      flag.setAttribute('transform', 'translate(953 186) scale(' + (1 + 0.12 * Math.sin(Math.PI * a)).toFixed(3) + ')');
      showLine(reduce ? 3 : p < 0.1 ? 0 : p < 0.42 ? 1 : p < 0.8 ? 2 : 3);
      var m = !reduce && p > 0.3 && p < 0.62;
      mull.style.opacity = m ? '1' : '0';
      if (m) mull.removeAttribute('inert'); else mull.setAttribute('inert', '');
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  mull.addEventListener('click', function () {
    var top = tee.getBoundingClientRect().top + scrollY, travel = tee.offsetHeight - innerHeight;
    scrollTo({ top: top + 0.86 * travel, behavior: 'smooth' });
  });
  mull.style.transition = 'opacity 240ms var(--sc-ease-out)';

  // ---------------------------------------------------------- hole 2 --
  var rail = document.querySelector('[data-rail]');
  rail.querySelectorAll('.pline').forEach(function (el) { el.remove(); });
  rail.insertAdjacentHTML('beforeend', X.products.map(function (p, i) { return X.line(p, null, { eager: i < 2 }); }).join(''));
  rail.addEventListener('focusin', function (e) {
    var item = e.target.closest('.pline, .feature'); var act = rail.closest('[data-sc-act="pan"]');
    if (!item || !act) return;
    requestAnimationFrame(function () {
      rail.parentElement.scrollLeft = 0;
      var travel = (rail.scrollWidth - innerWidth) * (1 + (parseFloat(rail.getAttribute('data-sc-pan')) || 0));
      var p = clamp01((item.offsetLeft + item.offsetWidth / 2 - innerWidth / 2) / travel);
      scrollTo({ top: act.getBoundingClientRect().top + scrollY + p * (act.offsetHeight - innerHeight), behavior: 'instant' });
    });
  });
  if (reduce) {
    var act = rail.closest('[data-sc-act]');
    act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span'); rail.removeAttribute('data-sc-pan');
    rail.style.cssText += ';overflow-x:auto;padding-block:var(--sc-section);scroll-snap-type:x mandatory';
  }

  // ---------------------------------------------------------- hole 3 --
  var meter = document.querySelector('[data-meter]');
  var share = C.raised / C.target;
  meter.querySelector('[data-raised]').textContent = X.money(C.raised);
  meter.querySelector('[data-meter-of]').textContent = 'of our ' + X.money(C.target) + ' target · ' + Math.round(share * 100) + '% of the way';
  meter.querySelector('[data-meter-asof]').textContent = 'As published on the store, ' + C.raisedAsOf + '. The live total is on the fundraiser page.';
  var bar = meter.querySelector('[data-meter-bar]');
  bar.setAttribute('aria-valuenow', String(C.raised)); bar.setAttribute('aria-valuetext', X.money(C.raised) + ' of ' + X.money(C.target));
  var fill = meter.querySelector('.meter__fill');
  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { fill.style.setProperty('--m', share.toFixed(3)); o.disconnect(); } }, { threshold: 0.4 }).observe(meter);
  } else fill.style.setProperty('--m', share.toFixed(3));

  // ---------------------------------------------------------- hole 4 --
  var OPENERS = [
    'Hey {name}, been thinking about you. How are you actually going?',
    'Oi {name}, no reason, just checking in. You right, mate?',
    '{name}! Haven\'t had a hit in ages. Nine holes this weekend? First round\'s on me.',
    'Hey {name}, I know things have been a lot lately. I\'m around if you want a yarn, no pressure.',
  ];
  var comp = document.querySelector('[data-composer]');
  var mate = comp.querySelector('[data-mate]'), openers = comp.querySelector('[data-openers]'), preview = comp.querySelector('[data-preview]');
  var pick = 0;
  openers.innerHTML = OPENERS.map(function (o, i) { return '<button type="button" data-o="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(o.replace('{name}', 'mate')) + '</button>'; }).join('');
  function msg() { var n = mate.value.trim() || 'mate'; return OPENERS[pick].replace('{name}', n); }
  function update() {
    var m = msg();
    preview.textContent = m;
    comp.querySelector('[data-sms]').href = 'sms:?&body=' + encodeURIComponent(m);
    comp.querySelector('[data-wa]').href = 'https://wa.me/?text=' + encodeURIComponent(m);
    openers.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === pick)); b.textContent = OPENERS[i].replace('{name}', mate.value.trim() || 'mate'); });
  }
  openers.addEventListener('click', function (e) { var b = e.target.closest('[data-o]'); if (b) { pick = Number(b.dataset.o); update(); b.focus(); } });
  mate.addEventListener('input', update);
  comp.querySelector('[data-copy]').addEventListener('click', function () {
    var m = msg();
    (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(function () { X.toast('Copied. Now send it.'); }, function () { X.toast('Select the message and copy it.'); });
  });
  update();

  // --------------------------------------------------------- hole 19 --
  var gift = X.bySlug['gift-voucher'], gv = gift.variants[0];
  var vbox = document.querySelector('[data-voucher]');
  vbox.innerHTML = '<div style="display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:center"><span style="width:44px;color:var(--green)">' + X.mark + '</span>' +
    '<div><b class="display" style="font-size:1.3rem">A round on me</b><div style="font-size:.85rem;color:var(--sc-ink-soft)">Gift voucher, sent by email</div></div></div>' +
    '<div class="sizes" role="group" aria-label="Voucher value">' + gv.sizes.map(function (z) { return '<button class="size size--lg" type="button" data-v="' + esc(z.size) + '">' + esc(z.size) + '</button>'; }).join('') + '</div>' +
    '<small style="color:var(--sc-ink-soft)">They pick their own kit. Delivered by email.</small>';
  vbox.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b && X.cart.add(gift, gv, b.dataset.v)) X.openCard(); });
})();
