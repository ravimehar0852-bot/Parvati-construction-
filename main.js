/* =========================================
   PARVATI CONSTRUCTION — MAIN JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV: Scroll & Mobile Toggle ───────
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Start scrolled on inner pages (page hero has dark bg)
  if (window.scrollY > 40 || document.querySelector('.page-hero')) {
    nav.classList.add('scrolled');
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    });
  });

  // ─── REVEAL ON SCROLL ──────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── GALLERY FILTER ────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          if (show) {
            item.classList.remove('hidden');
            // Restart reveal animation
            item.classList.remove('visible');
            setTimeout(() => item.classList.add('visible'), 20);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ─── GALLERY LIGHTBOX ──────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContent = document.getElementById('lightboxContent');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const overlayEl = item.querySelector('.gallery-overlay');
      const title  = overlayEl ? overlayEl.querySelector('h4').textContent : 'Project';
      const detail = overlayEl ? overlayEl.querySelector('span').textContent : '';
      const img    = item.querySelector('.gallery-img');
      const bg     = img ? getComputedStyle(img).background : '';

      lightboxContent.innerHTML = `
        <div style="
          width:100%; aspect-ratio:16/9; border-radius:4px; margin-bottom:1.5rem;
          background:${bg}; position:relative; overflow:hidden;
        ">
          <div style="position:absolute;inset:0;background:rgba(0,0,0,0.1)"></div>
        </div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#fff;margin-bottom:0.4rem">${title}</h3>
        <p style="color:rgba(229,185,106,0.9);font-size:0.9rem;letter-spacing:0.06em">${detail}</p>
      `;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ─── CONTACT FORM ──────────────────────
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      // Basic validation
      let valid = true;
      const required = contactForm.querySelectorAll('[required]');
      required.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email validation
      const emailField = contactForm.querySelector('#email');
      if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('show');
        // Reset after delay
        setTimeout(() => {
          contactForm.reset();
          formSuccess.classList.remove('show');
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled = false;
        }, 5000);
      }, 1200);
    });

    // Remove error class on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─── ANIMATED COUNTERS (hero stats) ────
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    const suffix = el.dataset.suffix || '';

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target * (isDecimal ? 10 : 1)) / (isDecimal ? 10 : 1);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Observe stat numbers
  const statEls = document.querySelectorAll('.stat strong');
  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const num = parseFloat(text.replace(/[^0-9.]/g, ''));
          const suffix = text.replace(/[0-9.]/g, '');
          el.dataset.suffix = suffix;
          if (!isNaN(num)) animateCounter(el, num);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  }

  // ─── SMOOTH ANCHOR SCROLL ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
