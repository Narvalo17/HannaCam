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


