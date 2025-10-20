// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const href = (e.currentTarget).getAttribute('href');
    if (!href || !lightbox || !lightboxImg) return;
    lightboxImg.src = href;
    lightbox.removeAttribute('hidden');
  });
});
if (lightbox && lightboxClose) {
  const close = () => lightbox.setAttribute('hidden', '');
  lightboxClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) close(); });
}

// Contact/RDV form
const form = document.querySelector('.contact-form');
const success = document.querySelector('.form-success');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = {
      name: form.querySelector('#name'),
      email: form.querySelector('#email'),
      phone: form.querySelector('#phone'),
      service: form.querySelector('#service'),
      date: form.querySelector('#date'),
      time: form.querySelector('#time'),
    };

    let valid = true;
    Object.entries(fields).forEach(([key, input]) => {
      const field = input;
      const container = field.closest('.form-field');
      const errorEl = container ? container.querySelector('.error') : null;
      if (!field || !errorEl) return;

      let message = '';
      if (!field.value) message = 'Champ requis';
      if (key === 'email' && field.value) {
        const emailOk = /.+@.+\..+/.test(field.value);
        if (!emailOk) message = 'Email invalide';
      }
      if (key === 'phone' && field.value) {
        const phoneOk = /[0-9 ()+.-]{6,}/.test(field.value);
        if (!phoneOk) message = 'Téléphone invalide';
      }
      errorEl.textContent = message;
      if (message) valid = false;
    });

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi…'; }
    setTimeout(() => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer la demande'; }
      if (success) success.hidden = false;
      form.reset();
    }, 900);
  });
}

// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    
    // Remove active class from all buttons and contents
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    btn.classList.add('active');
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


// Service side panel (prestations)
(() => {
  const panel = document.querySelector('.service-panel');
  if (!panel) return;
  const closeBtn = panel.querySelector('.service-panel-close');
  const titleEl = panel.querySelector('.service-title');
  const priceEl = panel.querySelector('.service-duration-price');
  const descEl = panel.querySelector('.service-description');
  const imgEl = panel.querySelector('.service-image');

  const openPanel = () => panel.setAttribute('aria-hidden', 'false');
  const closePanel = () => panel.setAttribute('aria-hidden', 'true');

  const cards = document.querySelectorAll('.cards-grid .card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent || '';
      const img = card.querySelector('.card-media img')?.getAttribute('src') || '';
      const firstP = card.querySelector('.card-body p');
      const priceText = firstP ? firstP.textContent : '';
      const paragraphs = Array.from(card.querySelectorAll('.card-body p'));
      const description = paragraphs.length > 1 ? paragraphs[1].textContent : '';

      if (titleEl) titleEl.textContent = title;
      if (priceEl) priceEl.textContent = priceText || '';
      if (descEl) descEl.textContent = description || '';
      if (imgEl && img) imgEl.setAttribute('src', img);
      openPanel();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('click', (e) => { if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closePanel(); });
})();
