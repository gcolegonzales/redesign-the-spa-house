(function () {
  'use strict';

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('navmenu');
  var scrim = document.querySelector('.nav-scrim');
  var navOpen = false;

  // The drawer (.nav-menu) is authored inside .site-header, which is
  // position:fixed and thus forms a stacking context. Trapped there, the
  // drawer's z-index (120) can't rise above the root-level .nav-scrim (110), so
  // on mobile the scrim paints over the links and swallows taps — tapping a nav
  // link hit-tests the scrim and just closes the drawer. Fix: on mobile, hoist
  // the drawer out to <body>, directly AFTER the scrim so it stacks above it,
  // escaping the header's stacking context. On desktop the same <ul> is the
  // static flex nav row, so we must restore it into the header — done
  // responsively via matchMedia so the desktop nav stays intact.
  var navHome = menu ? menu.parentNode : null;      // original <nav class="nav">
  var mqMobile = window.matchMedia('(max-width:760px)');

  // In-panel close (X) — the single, always-visible close control on mobile.
  // Injected once so the drawer owns a real, tappable X (the hamburger hides on open).
  var navClose = null;
  if (menu) {
    navClose = document.createElement('button');
    navClose.type = 'button';
    navClose.className = 'nav-close';
    navClose.setAttribute('aria-label', 'Close menu');
    navClose.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    menu.insertBefore(navClose, menu.firstChild);
  }
  function placeDrawer(isMobile) {
    if (!menu || !scrim) return;
    if (isMobile) {
      // Put drawer immediately after the scrim at body level (scrim below, panel above).
      if (menu.previousElementSibling !== scrim || menu.parentNode !== scrim.parentNode) {
        scrim.parentNode.insertBefore(menu, scrim.nextSibling);
      }
    } else if (navHome && menu.parentNode !== navHome) {
      navHome.appendChild(menu);   // back into the header for the desktop row
    }
  }
  placeDrawer(mqMobile.matches);
  (mqMobile.addEventListener
    ? mqMobile.addEventListener.bind(mqMobile, 'change')
    : mqMobile.addListener.bind(mqMobile))(function (e) {
      placeDrawer(e.matches);
      setNav(false);          // reset drawer + toggle state across the breakpoint
      syncDrawerHidden();     // desktop: expose nav; mobile-closed: hide off-canvas drawer
    });
  // Everything that should be hidden from AT / removed from tab order while the
  // drawer is open (the whole page except the header controls + the drawer).
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');
  var inertTargets = [main, footer].filter(Boolean);

  function focusables() {
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el.getClientRects().length; }
    );
  }

  // Keep the closed off-canvas drawer out of the tab order / AT tree on mobile.
  function syncDrawerHidden() {
    if (mqMobile.matches && !navOpen) {
      menu.setAttribute('inert', '');
      menu.setAttribute('aria-hidden', 'true');
    } else {
      menu.removeAttribute('inert');
      menu.removeAttribute('aria-hidden');
    }
  }

  function setNav(open) {
    navOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    if (open && header) header.classList.remove('hide'); // never open into a hidden header

    if (open) {
      inertTargets.forEach(function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
      menu.removeAttribute('inert');
      menu.removeAttribute('aria-hidden');
      var f = focusables();
      if (f.length) f[0].focus({ preventScroll: true }); // preventScroll so opening never jumps the page (G3)
    } else {
      inertTargets.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
      syncDrawerHidden();
    }
  }
  toggle.addEventListener('click', function () {
    var willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    setNav(willOpen);
    if (!willOpen) toggle.focus({ preventScroll: true }); // closing via hamburger: keep focus on the toggle
  });
  if (navClose) navClose.addEventListener('click', function () {
    setNav(false); toggle.focus({ preventScroll: true });
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { setNav(false); toggle.focus({ preventScroll: true }); }
  });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); toggle.focus({ preventScroll: true }); });
  document.addEventListener('keydown', function (e) {
    if (!navOpen) return;
    if (e.key === 'Escape') { setNav(false); toggle.focus({ preventScroll: true }); return; }
    if (e.key === 'Tab') {
      // Trap Tab within the drawer, cycling through its links and the toggle.
      // We manage focus explicitly so it can never land on the (still-visible)
      // header brand/skip-link or any other page control.
      var loop = focusables().concat([toggle]);
      if (!loop.length) { e.preventDefault(); return; }
      e.preventDefault();
      var idx = loop.indexOf(document.activeElement);
      var next;
      if (e.shiftKey) next = idx <= 0 ? loop.length - 1 : idx - 1;
      else next = idx === -1 || idx === loop.length - 1 ? 0 : idx + 1;
      loop[next].focus({ preventScroll: true });
    }
  });
  syncDrawerHidden();

  // ---- Sticky / shrinking header + hide-on-down / reveal-on-up ----
  var header = document.getElementById('siteHeader');
  var lastScroll = -1;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y === lastScroll) return;
    var goingDown = lastScroll >= 0 && y > lastScroll;
    header.classList.toggle('scrolled', y > 20);
    // Reveal on ANY upward scroll; hide only when scrolling down past the header.
    if (!navOpen) {
      if (goingDown && y > 120) header.classList.add('hide');
      else if (y < lastScroll || y <= 120) header.classList.remove('hide');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Concept request form (no backend) ----
  var form = document.getElementById('requestForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name');
      var phone = form.querySelector('#phone');
      if (!name.value.trim() || !phone.value.trim()) {
        status.textContent = 'Please add your name and a phone number so we can reach you.';
        status.style.color = '#a35b4f';
        (name.value.trim() ? phone : name).focus();
        return;
      }
      status.style.color = '';
      status.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] +
        '! This is a concept form — please call (225) 644-9014 or book online to confirm your appointment.';
      form.reset();
    });
  }

  // ---- Footer year ----
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
