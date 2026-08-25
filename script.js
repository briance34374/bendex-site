/* Bendex Print & Copy — site behavior */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- current year ---------- */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- sticky header shadow ---------- */
  var hdr = $('#hdr');
  var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var burger = $('#burger');
  var nav = $('#nav');

  var closeNav = function () {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  };

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---------- service search ---------- */
  var search = $('#svcSearch');
  var clearBtn = $('#svcClear');
  var count = $('#svcCount');
  var empty = $('#svcEmpty');
  var cards = $$('#svcGrid .card');

  var totalItems = cards.reduce(function (n, c) {
    return n + c.querySelectorAll('.tags li').length;
  }, 0);

  var idle = function () {
    count.textContent = totalItems + ' products across ' + cards.length + ' categories';
  };

  var filter = function () {
    var q = search.value.trim().toLowerCase();
    clearBtn.hidden = q === '';

    if (!q) {
      cards.forEach(function (c) {
        c.classList.remove('is-out');
        $$('.tags li', c).forEach(function (li) { li.classList.remove('is-hit'); li.hidden = false; });
      });
      empty.hidden = true;
      idle();
      return;
    }

    var hits = 0;
    var shown = 0;

    cards.forEach(function (card) {
      var title = card.querySelector('h3').textContent.toLowerCase();
      var catMatch = title.indexOf(q) !== -1;
      var local = 0;

      $$('.tags li', card).forEach(function (li) {
        var hit = li.textContent.toLowerCase().indexOf(q) !== -1;
        li.classList.toggle('is-hit', hit);
        li.hidden = !(hit || catMatch);
        if (hit) local++;
      });

      var keep = catMatch || local > 0;
      card.classList.toggle('is-out', !keep);
      if (keep) shown++;
      hits += catMatch && local === 0 ? card.querySelectorAll('.tags li').length : local;
    });

    empty.hidden = shown > 0;
    count.textContent = shown === 0
      ? 'No products match "' + search.value.trim() + '"'
      : hits + ' match' + (hits === 1 ? '' : 'es') + ' in ' + shown + ' categor' + (shown === 1 ? 'y' : 'ies');
  };

  if (search) {
    idle();
    search.addEventListener('input', filter);
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { search.value = ''; filter(); }
    });
    clearBtn.addEventListener('click', function () {
      search.value = '';
      filter();
      search.focus();
    });
  }

  /* clicking a product tag pre-fills the quote form */
  $$('#svcGrid .tags li').forEach(function (li) {
    li.addEventListener('click', function () {
      var details = $('#f-details');
      if (!details) return;
      details.value = li.textContent.trim() + ' — ';
      document.getElementById('quote').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () {
        details.focus();
        details.setSelectionRange(details.value.length, details.value.length);
      }, 500);
    });
    li.style.cursor = 'pointer';
    li.title = 'Ask us about ' + li.textContent.trim();
  });

  /* ---------- quote form -> pre-filled email ---------- */
  var form = $('#quoteForm');
  var ok = $('#formOk');

  var messages = {
    'f-name': 'Please tell us your name.',
    'f-email': 'We need a valid email to send your quote.',
    'f-phone': 'A phone number helps us reach you faster.',
    'f-service': 'Pick the closest product — we can adjust later.',
    'f-details': 'A sentence or two about the job is plenty.'
  };

  var setError = function (el, bad) {
    var field = el.closest('.field');
    field.classList.toggle('is-bad', bad);
    var err = field.querySelector('[data-err]');
    if (err) err.textContent = bad ? (messages[el.id] || 'This field is required.') : '';
  };

  var validate = function (el) {
    var v = el.value.trim();
    var bad = v === '';
    if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!bad && el.type === 'tel') bad = (v.replace(/\D/g, '').length < 10);
    setError(el, bad);
    return !bad;
  };

  if (form) {
    $$('[required]', form).forEach(function (el) {
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('input', function () {
        if (el.closest('.field').classList.contains('is-bad')) validate(el);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ok.hidden = true;

      var required = $$('[required]', form);
      var firstBad = null;
      required.forEach(function (el) {
        if (!validate(el) && !firstBad) firstBad = el;
      });

      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var val = function (id) { return ($(id) || {}).value || ''; };

      var lines = [
        'QUOTE REQUEST — bendexprint.com',
        '',
        'Name:       ' + val('#f-name'),
        'Business:   ' + (val('#f-company') || '—'),
        'Email:      ' + val('#f-email'),
        'Phone:      ' + val('#f-phone'),
        '',
        'Product:    ' + val('#f-service'),
        'Quantity:   ' + (val('#f-qty') || 'Not sure yet'),
        'Needed by:  ' + (val('#f-due') || 'Flexible'),
        'Artwork:    ' + val('#f-art'),
        '',
        'DETAILS',
        val('#f-details'),
        '',
        '— Please attach any artwork files to this email before sending. —'
      ];

      var subject = 'Quote request: ' + val('#f-service') + ' — ' + val('#f-name');
      var href = 'mailto:sales@bendexprintandcopy.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;
      ok.hidden = false;
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
