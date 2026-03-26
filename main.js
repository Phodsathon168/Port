/* =============================================
   IT PORTFOLIO — main.js
   Features:
   - Scroll reveal animations
   - Navbar scroll effect + active link
   - Mobile hamburger menu
   - Smooth scroll with offset
   ============================================= */

'use strict';

/* ── 1. Scroll Reveal (Intersection Observer) ── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* ── 2. Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ── 3. Active Nav Link on Scroll ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const NAV_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;

function setActiveLink() {
  let currentId = '';
  const scrollPos = window.scrollY + NAV_HEIGHT + 80;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink(); // run once on load


/* ── 4. Mobile Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    !hamburger.contains(e.target) &&
    !navLinksContainer.contains(e.target) &&
    navLinksContainer.classList.contains('open')
  ) {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});


/* ── 5. Smooth Scroll with Navbar Offset ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 6. Hero Name Typing Effect (optional — light touch) ── */
// Runs only once on page load to draw attention to the name
const heroName = document.querySelector('.hero-name');

if (heroName) {
  const originalText = heroName.textContent.trim();
  // Only apply if the name has been customized (doesn't contain brackets)
  if (!originalText.includes('[')) {
    heroName.dataset.text = originalText;
    heroName.textContent = '';
    heroName.style.minHeight = '1.08em'; // prevent layout shift

    let charIndex = 0;
    const typeSpeed = 60; // ms per character

    // Start after the reveal animation delay (approx 0.3s)
    setTimeout(() => {
      const typingInterval = setInterval(() => {
        heroName.textContent = originalText.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex >= originalText.length) {
          clearInterval(typingInterval);
        }
      }, typeSpeed);
    }, 400);
  }
}


/* ── 7. Project Card — Keyboard accessibility ── */
document.querySelectorAll('.project-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const primaryLink = card.querySelector('.project-link');
      if (primaryLink) primaryLink.click();
    }
  });
});


/* ── 8. Console Easter Egg ── */
console.log(
  '%c 👋 สวัสดี! ยินดีที่ได้พบคุณ ',
  'background:#0d1b2e; color:#2dd4bf; font-size:14px; padding:8px 16px; border-radius:4px; font-family:monospace;'
);
console.log(
  '%c พอร์ตฟอลิโอนี้สร้างด้วย HTML + CSS + Vanilla JS ✨',
  'color:#8ba3be; font-size:12px; font-family:monospace;'
);

/* =============================================
   PDF MODAL VIEWER
   ============================================= */

// สร้าง modal element ครั้งแรก (inject เข้า body)
(function createPdfModal() {
  const modal = document.createElement('div');
  modal.id = 'pdf-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="pdf-modal-backdrop" id="pdf-backdrop"></div>
    <div class="pdf-modal-box">
      <div class="pdf-modal-header">
        <div class="pdf-modal-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span id="pdf-modal-label">เอกสาร</span>
        </div>
        <div class="pdf-modal-controls">
          <a id="pdf-modal-dl" href="#" download class="pdf-modal-dl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ดาวน์โหลด
          </a>
          <button class="pdf-modal-close" id="pdf-modal-close" aria-label="ปิด">✕</button>
        </div>
      </div>
      <div class="pdf-modal-frame">
        <iframe id="pdf-iframe" title="PDF Viewer" allowfullscreen></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ปิดด้วย backdrop หรือปุ่ม ✕
  document.getElementById('pdf-backdrop').addEventListener('click', closePdfModal);
  document.getElementById('pdf-modal-close').addEventListener('click', closePdfModal);

  // ปิดด้วย Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePdfModal();
  });
})();

function openPdfModal(pdfPath, title) {
  const modal  = document.getElementById('pdf-modal');
  const iframe = document.getElementById('pdf-iframe');
  const label  = document.getElementById('pdf-modal-label');
  const dlBtn  = document.getElementById('pdf-modal-dl');

  label.textContent = title || 'เอกสาร';
  dlBtn.href        = pdfPath;
  dlBtn.download    = pdfPath.split('/').pop();

  // เปิด PDF ใน iframe — ใช้ Google Docs Viewer เป็น fallback
  // ถ้าอยู่บน localhost หรือมี PDF ในเครื่อง ให้ใช้ path ตรงๆ
  const isLocal = location.protocol === 'file:' || location.hostname === 'localhost';
  iframe.src = isLocal
    ? pdfPath
    : `https://docs.google.com/gview?url=${encodeURIComponent(location.origin + '/' + pdfPath)}&embedded=true`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal  = document.getElementById('pdf-modal');
  const iframe = document.getElementById('pdf-iframe');
  modal.classList.remove('open');
  iframe.src = '';                   // หยุดโหลด PDF
  document.body.style.overflow = '';
}