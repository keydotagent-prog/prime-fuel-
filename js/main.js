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
/* ---------- Coupon code copy ---------- */

const couponBtn = document.getElementById('couponCode');
const couponAction = document.getElementById('couponCodeAction');

if (couponBtn) {
  couponBtn.addEventListener('click', async () => {
    const code = 'PRM77';
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      // Fallback for browsers without Clipboard API support
      const temp = document.createElement('textarea');
      temp.value = code;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    couponBtn.classList.add('is-copied');
    couponAction.textContent = 'Copied!';
    setTimeout(() => {
      couponBtn.classList.remove('is-copied');
      couponAction.textContent = 'Tap to copy';
    }, 1800);
  });
}
