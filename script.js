(function () {
  'use strict';

  // ---- Sticky / shrinking header ----
  var header = document.getElementById('siteHeader');
  var lastScroll = -1;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y === lastScroll) return;
    lastScroll = y;
    header.classList.toggle('scrolled', y > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('navmenu');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  }
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

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
