/* ---------- Intro logo animation ---------- */

const introEl = document.getElementById('intro');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.add('intro-lock');

const introHoldMs = reduceMotion ? 0 : 1100;
setTimeout(() => {
  introEl.classList.add('is-hidden');
  document.body.classList.remove('intro-lock');
  setTimeout(() => { introEl.style.display = 'none'; }, 650);
}, introHoldMs);

/* ---------- Mobile menu toggle ---------- */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
