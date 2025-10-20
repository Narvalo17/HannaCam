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

// Highlight current page in nav and ensure correct title usage
(() => {
  const links = document.querySelectorAll('.primary-nav a');
  const current = new URL(window.location.href);
  const normalizePath = (p) => p.replace(/\\/g,'/');
  const currentPath = normalizePath(current.pathname.endsWith('/') ? current.pathname + 'index.html' : current.pathname);
  links.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const resolved = new URL(href, window.location.origin + window.location.pathname);
    const linkPath = normalizePath(resolved.pathname);
    const isMatch = linkPath.toLowerCase() === currentPath.toLowerCase();
    if (isMatch) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });
})();

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

// Configuration de l'API
const API_BASE_URL = 'http://localhost:8080';

// Helper: format a Date as local ISO with offset (e.g. 2025-10-20T15:00:00+02:00)
function formatLocalISOWithOffset(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const tzMinutes = -date.getTimezoneOffset(); // minutes offset from UTC (e.g. +120)
  const sign = tzMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(tzMinutes);
  const tzHours = pad(Math.floor(absMinutes / 60));
  const tzMins = pad(absMinutes % 60);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMins}`;
}

// Helper: canonical key for a slot using epoch ms (string) to avoid timezone mismatches
function epochKeyFromDate(d) {
  return String(d.getTime());
}

// Récupérer les rendez-vous existants depuis le backend — retourne un Set d'epoch ms (string)
async function fetchServerBookedSlots() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rdv/all`);
    if (!res.ok) {
      console.error('Erreur en récupérant les RDV depuis le serveur', res.status);
      return new Set();
    }
    const arr = await res.json();
    const set = new Set();
    if (Array.isArray(arr)) {
      arr.forEach(r => {
        if (r && r.rdv) {
          const ms = Date.parse(r.rdv); // Date.parse understands ISO with offset
          if (!isNaN(ms)) set.add(String(ms));
        }
      });
    }
    return set;
  } catch (e) {
    console.error('fetchServerBookedSlots error', e);
    return new Set();
  }
}

// Fonction utilitaire pour envoyer des données à l'API
async function sendToAPI(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    throw error;
  }
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');
const contactSuccess = document.querySelector('.form-success');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      subject: contactForm.querySelector('#subject'),
      message: contactForm.querySelector('#message'),
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
      errorEl.textContent = message;
      if (message) valid = false;
    });

    if (!valid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) { 
      submitBtn.disabled = true; 
      submitBtn.textContent = 'Envoi…'; 
    }

    try {
      // Préparer les données pour l'API
      const contactData = {
        nom: fields.name.value,
        adresse_mail: fields.email.value,
        sujet: fields.subject.value,
        message: fields.message.value,
        heure_message: new Date().toISOString()
      };

      await sendToAPI('/api/contact/CreateContact', contactData);
      
      // Succès
      if (contactSuccess) contactSuccess.hidden = false;
      contactForm.reset();
      
    } catch (error) {
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur contact:', error);
    } finally {
      if (submitBtn) { 
        submitBtn.disabled = false; 
        submitBtn.textContent = 'Envoyer le message'; 
      }
    }
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

// RDV: preselect service from query string
(() => {
  const params = new URLSearchParams(window.location.search);
  const prest = params.get('prestation');
  if (!prest) return;
  const select = document.getElementById('service');
  if (!select) return;
  const normalized = prest.trim();
  // If option exists, select it, otherwise add and select
  let opt = Array.from(select.options).find(o => (o.textContent||'').trim().toLowerCase() === normalized.toLowerCase());
  if (!opt) {
    opt = document.createElement('option');
    opt.value = normalized.toLowerCase().replace(/\s+/g,'-');
    opt.textContent = normalized;
    select.appendChild(opt);
  }
  select.value = opt.value;
})();

// Calendar functionality
(() => {
  const calendarGrid = document.querySelector('.calendar-grid');
  const calendarWeek = document.querySelector('.calendar-week');
  const prevBtn = document.getElementById('prevWeek');
  const nextBtn = document.getElementById('nextWeek');
  
  if (!calendarGrid || !calendarWeek || !prevBtn || !nextBtn) return;

  let currentWeek = new Date();
  currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Start from Monday

  const generateTimeSlots = (dayOfWeek) => {
    // Dimanche fermé
    if (dayOfWeek === 0) return [];
    const slots = [];
    for (let hour = 10; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // updateCalendar now uses epoch-ms keys for comparisons to avoid timezone shift
  const updateCalendar = async () => {
    const serverEpochSet = await fetchServerBookedSlots();

    const startOfWeek = new Date(currentWeek);
    
    // Update week display
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    calendarWeek.textContent = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('fr-FR', { month: 'short' })}`;
    
    // Update each day
    document.querySelectorAll('.calendar-day').forEach((dayEl, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      
      const dayDateEl = dayEl.querySelector('.day-date');
      const timeSlotsEl = dayEl.querySelector('.time-slots');
      
      dayDateEl.textContent = `${dayDate.getDate()} ${dayDate.toLocaleDateString('fr-FR', { month: 'short' })}`;
      dayEl.dataset.date = dayDate.toISOString().slice(0, 10);
      
      // Clear existing slots
      timeSlotsEl.innerHTML = '';
      
      // Generate time slots for this day
      const slots = generateTimeSlots(dayDate.getDay());
      slots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        // Build a Date object in local time for this slot
        // Parse yyyy-mm-dd safely and construct local Date to avoid ISO parsing as UTC
        const [y, m, d] = dayEl.dataset.date.split('-').map(Number);
        const [sh, sm] = slot.split(':').map(Number);
        const slotDate = new Date(y, m - 1, d, sh, sm, 0);
        const now = new Date();
        const isPast = slotDate < now && dayDate.toDateString() === now.toDateString();
        const slotKey = epochKeyFromDate(slotDate);
        if (serverEpochSet.has(slotKey)) {
          slotEl.classList.add('disabled');
          slotEl.setAttribute('aria-disabled', 'true');
        } else if (isPast) {
          slotEl.classList.add('disabled');
          slotEl.setAttribute('aria-disabled', 'true');
        } else {
          slotEl.addEventListener('click', () => {
            // Remove selection from other slots
            document.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));
            slotEl.classList.add('selected');
          });
        }
        timeSlotsEl.appendChild(slotEl);
      });
    });
  };

  // Navigation
  prevBtn.addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateCalendar();
  });

  // Expose updateCalendar pour pouvoir rafraîchir après création de RDV
  window.hcUpdateCalendar = updateCalendar;
  // Initialize calendar
  updateCalendar();
})();

// Service side panel (prestations)
(() => {
  const panel = document.querySelector('.service-panel');
  if (!panel) return;
  const closeBtn = panel.querySelector('.service-panel-close');
  const titleEl = panel.querySelector('.service-title');
  const priceEl = panel.querySelector('.service-duration-price');
  const descEl = panel.querySelector('.service-description');
  const imgEl = panel.querySelector('.service-image');
  const ctaEl = panel.querySelector('.service-cta');

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
      if (ctaEl) {
        const qp = new URLSearchParams({ prestation: title });
        ctaEl.setAttribute('href', 'rdv.html?' + qp.toString());
      }
      openPanel();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('click', (e) => { if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closePanel(); });
})();

// Gestion du formulaire de RDV (submit flow updated to use epoch comparison and send local-offset ISO)
const rdvForm = document.querySelector('.booking-form');
const rdvSuccess = document.querySelector('.form-success');
let rdvInlineError = null;
if (rdvForm) {
  rdvInlineError = document.createElement('p');
  rdvInlineError.className = 'form-error';
  rdvInlineError.hidden = true;
  rdvForm.appendChild(rdvInlineError);

  rdvForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fields = {
      name: rdvForm.querySelector('#name'),
      prenom: rdvForm.querySelector('#prenom'),
      email: rdvForm.querySelector('#email'),
      phone: rdvForm.querySelector('#phone'),
      service: rdvForm.querySelector('#service'),
    };

    const selectedSlot = document.querySelector('.time-slot.selected');
    if (!selectedSlot) {
      if (rdvInlineError) { rdvInlineError.textContent = 'Veuillez sélectionner un créneau horaire.'; rdvInlineError.hidden = false; }
      return;
    } else if (rdvInlineError) { rdvInlineError.hidden = true; rdvInlineError.textContent = ''; }

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

    const submitBtn = rdvForm.querySelector('button[type="submit"]');
    if (submitBtn) { 
      submitBtn.disabled = true; 
      submitBtn.textContent = 'Envoi…'; 
    }

    try {
      const selectedDay = selectedSlot.closest('.calendar-day');
      const dayISO = selectedDay && selectedDay.dataset && selectedDay.dataset.date ? selectedDay.dataset.date : null; // yyyy-mm-dd
      const timeSlot = selectedSlot.textContent; // HH:mm
      if (!dayISO) throw new Error('Date du jour introuvable');
      
      const [hours, minutes] = timeSlot.split(':');
      // Construct appointmentDate in local time using numeric constructor to avoid timezone parsing issues
      const [ay, am, ad] = dayISO.split('-').map(Number);
      const appointmentDate = new Date(ay, am - 1, ad, Number(hours), Number(minutes), 0);

      // Vérifier en backend si le créneau est toujours disponible (server authoritative)
      const serverSet = await fetchServerBookedSlots();
      const isoFull = appointmentDate.toISOString();
      const appointmentKey = epochKeyFromDate(appointmentDate);
      if (serverSet.has(appointmentKey)) {
        if (rdvInlineError) { rdvInlineError.textContent = 'Ce créneau est déjà réservé. Veuillez choisir un autre créneau.'; rdvInlineError.hidden = false; }
        if (window.hcUpdateCalendar) await window.hcUpdateCalendar();
        return;
      }

      const rdvData = {
        nom: fields.name.value,
        prenom: fields.prenom.value,
        mail: fields.email.value,
        telephone: parseInt(fields.phone.value.replace(/\D/g, '')),
        // Send local date/time with explicit offset (correctly preserves the local hour)
        rdv: formatLocalISOWithOffset(appointmentDate),
        type_Soin: fields.service.value
      };

      await sendToAPI('/api/rdv', rdvData);

      // Rafraîchir le calendrier depuis le serveur après création
      if (window.hcUpdateCalendar) await window.hcUpdateCalendar();

      if (rdvSuccess) rdvSuccess.hidden = false;
      rdvForm.reset();
      document.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));

    } catch (error) {
      console.error('Erreur RDV:', error);
      if (rdvInlineError) { rdvInlineError.textContent = "Erreur lors de la prise de rendez-vous. Veuillez réessayer."; rdvInlineError.hidden = false; }
    } finally {
      if (submitBtn) { 
        submitBtn.disabled = false; 
        submitBtn.textContent = 'Confirmer le rendez-vous'; 
      }
    }
  });
}
