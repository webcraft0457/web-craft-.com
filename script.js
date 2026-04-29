/* ═══════════════════════════════════════════════
   WebCraft Technologies — script.js
   Organic Web · Lagos, Nigeria
   ═══════════════════════════════════════════════ */

'use strict';

/* ── LIGHTBOX ── */
const allImages = [];
let currentLbIndex = 0;

function buildImageRegistry() {
  const clickableImgs = document.querySelectorAll(
    '.port-card img, .service-card img, .blog-card img, .mc-img img, .about-img-wrap img, .sp-img img, .contact-map-img'
  );
  clickableImgs.forEach(img => {
    if (!allImages.find(i => i.src === img.src)) {
      allImages.push({
        src: img.src,
        title: img.closest('[onclick]')
          ? extractLbTitle(img.closest('[onclick]').getAttribute('onclick'))
          : (img.alt || 'WebCraft Technologies'),
        desc: extractLbDesc(img),
        tag: extractLbTag(img)
      });
    }
  });
}

function extractLbTitle(onclickStr) {
  if (!onclickStr) return '';
  const m = onclickStr.match(/openLightbox\([^,]+,\s*'([^']+)'/);
  return m ? m[1] : '';
}

function extractLbDesc(img) {
  const card = img.closest('[onclick]');
  if (!card) return img.alt || '';
  const onclick = card.getAttribute('onclick');
  const m = onclick && onclick.match(/openLightbox\([^,]+,\s*'[^']+',\s*'([^']+)'/);
  return m ? m[1] : (img.alt || '');
}

function extractLbTag(img) {
  const card = img.closest('[onclick]');
  if (!card) return '';
  const onclick = card.getAttribute('onclick');
  const m = onclick && onclick.match(/openLightbox\([^,]+,\s*'[^']+',\s*'[^']+',\s*'([^']+)'/);
  return m ? m[1] : '';
}

function openLightbox(imgEl, title, desc, tag) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbTag = document.getElementById('lbTag');

  // Find index in allImages array
  if (imgEl && imgEl.src) {
    const idx = allImages.findIndex(i => i.src === imgEl.src);
    if (idx !== -1) currentLbIndex = idx;
  }

  const entry = allImages[currentLbIndex] || { src: imgEl?.src, title, desc, tag };
  const finalSrc   = entry.src   || imgEl?.src   || '';
  const finalTitle = entry.title || title || '';
  const finalDesc  = entry.desc  || desc  || '';
  const finalTag   = entry.tag   || tag   || '';

  lbTitle.textContent = finalTitle;
  lbDesc.textContent  = finalDesc;
  lbTag.textContent   = finalTag;

  // Show loader while image loads
  const loader = lb.querySelector('.lb-loader');
  lbImg.style.opacity = '0';
  loader.style.display = 'block';

  lbImg.onload = () => {
    loader.style.display = 'none';
    lbImg.style.opacity = '1';
    lbImg.style.transition = 'opacity .3s';
  };
  lbImg.src = finalSrc;
  lbImg.alt = finalTitle;

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Show/hide nav arrows
  const hasPrev = currentLbIndex > 0;
  const hasNext = currentLbIndex < allImages.length - 1;
  lb.querySelector('.lb-prev').style.opacity = hasPrev ? '1' : '0.2';
  lb.querySelector('.lb-next').style.opacity = hasNext ? '1' : '0.2';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  const next = currentLbIndex + dir;
  if (next < 0 || next >= allImages.length) return;
  currentLbIndex = next;
  const entry = allImages[currentLbIndex];
  openLightbox({ src: entry.src }, entry.title, entry.desc, entry.tag);
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
});

/* ── MOBILE MENU ── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

/* ── STICKY NAV SHRINK ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
});

/* ── FAQ ACCORDION ── */
function tFaq(el) {
  const item = el.closest('.faq-item');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revealObserver.unobserve(e.target); // Only animate once
    }
  });
}, { threshold: 0.08 });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ── STAGGERED GRID REVEAL ── */
function initStagger() {
  const grids = document.querySelectorAll('.services-grid, .portfolio-grid, .pricing-grid, .blog-grid');
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}


/* ── CURSOR POINTER on clickable images ── */
function initClickableCursors() {
  const clickableImgWrappers = document.querySelectorAll(
    '.port-card, .service-card, .blog-card, .mc-img, .about-img-wrap, .sp-img, .contact-map-img'
  );
  clickableImgWrappers.forEach(el => {
    el.style.cursor = 'pointer';
  });
}

/* ── SMOOTH ACTIVE NAV LINK ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--wh)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ── ANIMATED COUNTER ── */
function animateCounters() {
  const stats = document.querySelectorAll('.stat strong');
  const isInView = el => el.getBoundingClientRect().top < window.innerHeight;

  let animated = false;
  const tryAnimate = () => {
    if (animated) return;
    if (stats.length && isInView(stats[0])) {
      animated = true;
      stats.forEach(stat => {
        const target = stat.textContent;
        const num = parseInt(target.replace(/\D/g, ''));
        if (isNaN(num)) return;
        const prefix = target.match(/^[^0-9]*/)?.[0] || '';
        const suffix = target.match(/[^0-9]*$/)?.[0] || '';
        let current = 0;
        const step = Math.ceil(num / 50);
        const interval = setInterval(() => {
          current = Math.min(current + step, num);
          stat.textContent = prefix + current.toLocaleString() + suffix;
          if (current >= num) clearInterval(interval);
        }, 30);
      });
    }
  };
  window.addEventListener('scroll', tryAnimate, { passive: true });
  tryAnimate();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initStagger();
  initClickableCursors();
  initActiveNav();
  animateCounters();
  buildImageRegistry();

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    const menu = document.getElementById('mobileMenu');
    const ham  = document.getElementById('hamBtn');
    if (menu.classList.contains('open') && !menu.contains(e.target) && !ham.contains(e.target)) {
      closeMenu();
    }
  });

  // Close lightbox on backdrop (belt + suspenders alongside inline onclick)
  document.querySelector('.lb-backdrop')?.addEventListener('click', closeLightbox);
});

/* ── CONTACT FORM → SENDS TO WHATSAPP 09068759598 ── */
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.btn-submit');

  // Read each field by its label
  const firstName = form.querySelector('input[placeholder="John"]')?.value.trim() || '';
  const lastName  = form.querySelector('input[placeholder="Doe"]')?.value.trim() || '';
  const email     = form.querySelector('input[type="email"]')?.value.trim() || '';
  const phone     = form.querySelector('input[type="tel"]')?.value.trim() || '';
  const selects   = form.querySelectorAll('select');
  const service   = selects[0]?.value || '—';
  const budget    = selects[1]?.value || '—';
  const message   = form.querySelector('textarea')?.value.trim() || '';

  // Validate required fields
  if (!firstName || !lastName || !email || !phone) {
    alert('Please fill in all required fields before submitting.');
    return;
  }

  // Build the WhatsApp message
  const now = new Date().toLocaleString('en-NG', { dateStyle: 'long', timeStyle: 'short' });

  const waMsg =
`🌿 *NEW PROJECT ENQUIRY*
*WebCraft Technologies Website*
──────────────────────────
📅 *Date:* ${now}

👤 *Full Name:* ${firstName} ${lastName}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🛠 *Service Needed:* ${service}
💰 *Budget Range:* ${budget}

📝 *Project Brief:*
${message || '(No message provided)'}

──────────────────────────
_Sent from webcrafttech.com_`;

  // Button loading state
  const original = btn.innerHTML;
  btn.innerHTML = '⏳ Opening WhatsApp...';
  btn.disabled  = true;
  btn.style.background = '#1a8a3a';

  // Open WhatsApp with pre-filled message to 09068759598
  setTimeout(() => {
    window.open('https://wa.me/2349068759598?text=' + encodeURIComponent(waMsg), '_blank');

    btn.innerHTML = '✅ Sent via WhatsApp! Expect a reply soon.';
    btn.style.background = '#25d366';
    btn.disabled = false;

    // Reset after a few seconds
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      form.reset();
    }, 6000);
  }, 700);
}