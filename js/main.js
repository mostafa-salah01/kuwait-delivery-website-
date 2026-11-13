/* ==========================================================================
   الشركة الكويتية للتوصيل | Kuwait Delivery Company
   Main Application Script — Pure Vanilla JS (Static GitHub Pages Ready)
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. CENTRALIZED PLACEHOLDERS & SITE CONFIGURATION
   عدّل هذه القيم من هنا فقط لتنعكس تلقائياً في كل صفحات الموقع
   ========================================================================== */
const SITE_CONFIG = {
  // رابط إرسال الفورمات (Formspree أو أي خدمة فورمات ثابتة)
  FORM_ENDPOINT: 'https://formspree.io/f/your-form-id',

  // رابط نظام الإدارة الحقيقي (يُستبدل لاحقاً في صفحة admin.html)
  ADMIN_SYSTEM_URL: '#',

  // مسار الملف التعريفي للشركة (يُرفع الملف لاحقاً داخل مجلد files/)
  COMPANY_PROFILE_PDF: 'files/company-profile.pdf',

  // بيانات التواصل الموحدة (تظهر في الفوتر وصفحة تواصل معنا)
  CONTACT: {
    email: 'info@example.com',
    phone: '+20 000 000 0000',
    addressAr: 'القاهرة، جمهورية مصر العربية',
    addressEn: 'Cairo, Arab Republic of Egypt'
  },

  // البيانات القانونية والتسجيلية (صفحة من نحن — سيتم إضافتها عند استكمال التأسيس)
  LEGAL: {
    crAr: 'سيتم إضافتها',
    crEn: 'To be added',
    taxAr: 'سيتم إضافتها',
    taxEn: 'To be added',
    addressAr: 'القاهرة، مصر (سيتم إضافة العنوان التفصيلي)',
    addressEn: 'Cairo, Egypt (Detailed address to be added)'
  }
};

/* ==========================================================================
   2. PEN WRITING EFFECT CONFIGURATION (إعدادات تأثير الكتابة بالقلم)
   ========================================================================== */
const PEN_EFFECT_CONFIG = {
  enabled: true,
  baseCharDelayMs: 26,     // سرعة كتابة الحرف (بالملي ثانية) للنصوص القصيرة
  maxDurationMs: 2000,     // الحد الأقصى لمدة كتابة أي عنصر (~2 ثانية)
  penColorGold: '#C7A44E', // لون جسم القلم الذهبي
  penColorGreen: '#0F5240' // لون سن القلم الأخضر
};

/* ==========================================================================
   3. BILINGUAL DICTIONARY (Dynamic UI Messages & Validation)
   ========================================================================== */
const I18N = {
  ar: {
    trackingSoon: 'خدمة التتبع ستكون متاحة قريباً — نعمل حالياً على ربط البوابة بنظام التشغيل الميداني.',
    trackingEmpty: 'يرجى إدخال رقم الشحنة أولاً.',
    formSending: 'جاري إرسال طلبك...',
    formSuccess: 'تم استلام طلبك بنجاح. سيتواصل معك فريقنا المختص في أقرب وقت.',
    formError: 'تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى أو التواصل عبر البريد الإلكتروني.',
    formValidation: 'يرجى التحقق من استكمال جميع الحقول المطلوبة بشكل صحيح.',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    invalidPhone: 'يرجى إدخال رقم هاتف صحيح.'
  },
  en: {
    trackingSoon: 'Shipment tracking service will be available soon — we are connecting the portal to our live operations system.',
    trackingEmpty: 'Please enter a shipment tracking number first.',
    formSending: 'Submitting your request...',
    formSuccess: 'Your request has been received. Our specialized team will contact you shortly.',
    formError: 'Unable to submit right now. Please try again or reach out via email.',
    formValidation: 'Please complete all required fields accurately.',
    invalidEmail: 'Please enter a valid email address.',
    invalidPhone: 'Please enter a valid phone number.'
  }
};

const prefersReducedMotion = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentLang = 'ar';

function getStoredLang() {
  try {
    const saved = localStorage.getItem('kdc_lang');
    return saved === 'en' ? 'en' : 'ar';
  } catch (e) {
    return 'ar';
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem('kdc_lang', lang);
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
}

/* ==========================================================================
   4. APPLY SITE CONFIG PLACEHOLDERS
   ========================================================================== */
function hydrateSiteConfig() {
  document.querySelectorAll('[data-config-link="admin"]').forEach((el) => {
    el.setAttribute('href', SITE_CONFIG.ADMIN_SYSTEM_URL);
  });

  document.querySelectorAll('[data-config-link="profile"]').forEach((el) => {
    el.setAttribute('href', SITE_CONFIG.COMPANY_PROFILE_PDF);
  });

  document.querySelectorAll('[data-contact="email"]').forEach((el) => {
    el.textContent = SITE_CONFIG.CONTACT.email;
    if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + SITE_CONFIG.CONTACT.email);
  });

  document.querySelectorAll('[data-contact="phone"]').forEach((el) => {
    el.textContent = SITE_CONFIG.CONTACT.phone;
    if (el.tagName === 'A') {
      el.setAttribute('href', 'tel:' + SITE_CONFIG.CONTACT.phone.replace(/[^+\d]/g, ''));
    }
  });

  document.querySelectorAll('[data-contact="address"]').forEach((el) => {
    el.setAttribute('data-ar', SITE_CONFIG.CONTACT.addressAr);
    el.setAttribute('data-en', SITE_CONFIG.CONTACT.addressEn);
    el.textContent = currentLang === 'ar' ? SITE_CONFIG.CONTACT.addressAr : SITE_CONFIG.CONTACT.addressEn;
  });

  document.querySelectorAll('[data-legal="cr"]').forEach((el) => {
    el.setAttribute('data-ar', SITE_CONFIG.LEGAL.crAr);
    el.setAttribute('data-en', SITE_CONFIG.LEGAL.crEn);
    el.textContent = currentLang === 'ar' ? SITE_CONFIG.LEGAL.crAr : SITE_CONFIG.LEGAL.crEn;
  });

  document.querySelectorAll('[data-legal="tax"]').forEach((el) => {
    el.setAttribute('data-ar', SITE_CONFIG.LEGAL.taxAr);
    el.setAttribute('data-en', SITE_CONFIG.LEGAL.taxEn);
    el.textContent = currentLang === 'ar' ? SITE_CONFIG.LEGAL.taxAr : SITE_CONFIG.LEGAL.taxEn;
  });

  document.querySelectorAll('[data-legal="address"]').forEach((el) => {
    el.setAttribute('data-ar', SITE_CONFIG.LEGAL.addressAr);
    el.setAttribute('data-en', SITE_CONFIG.LEGAL.addressEn);
    el.textContent = currentLang === 'ar' ? SITE_CONFIG.LEGAL.addressAr : SITE_CONFIG.LEGAL.addressEn;
  });

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/* ==========================================================================
   5. PEN WRITING ENGINE (تأثير الكتابة بالقلم بدون كسر الحروف العربية)
   ========================================================================== */
const PenWriter = (() => {
  const activeAnimations = new Map();
  let observer = null;

  function createPenSVG() {
    const span = document.createElement('span');
    span.className = 'pen-nib';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML =
      '<svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M25.5 3.5L28.5 6.5L11.5 23.5L6.5 25.5L8.5 20.5L25.5 3.5Z" fill="' + PEN_EFFECT_CONFIG.penColorGold + '" stroke="' + PEN_EFFECT_CONFIG.penColorGreen + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M21.5 7.5L24.5 10.5" stroke="' + PEN_EFFECT_CONFIG.penColorGreen + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M8.5 20.5L11.5 23.5" stroke="' + PEN_EFFECT_CONFIG.penColorGreen + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="6.2" cy="25.8" r="1.3" fill="' + PEN_EFFECT_CONFIG.penColorGreen + '"/>' +
      '</svg>';
    return span;
  }

  function cancelElement(el) {
    const state = activeAnimations.get(el);
    if (state) {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      activeAnimations.delete(el);
    }
    const existingNib = el.querySelector('.pen-nib');
    if (existingNib) existingNib.remove();
  }

  function finishImmediately(el, text) {
    cancelElement(el);
    el.textContent = text;
    el.style.minHeight = '';
    el.dataset.penDone = 'true';
  }

  function animateElement(el) {
    if (el.dataset.penDone === 'true') return;
    const fullText = (el.getAttribute('data-' + currentLang) || el.textContent || '').trim();
    if (!fullText) {
      el.dataset.penDone = 'true';
      return;
    }

    if (prefersReducedMotion || !PEN_EFFECT_CONFIG.enabled) {
      finishImmediately(el, fullText);
      return;
    }

    cancelElement(el);

    // Put full text first to measure final height accurately (prevents layout jump)
    el.textContent = fullText;
    el.style.minHeight = '';
    const measuredHeight = el.getBoundingClientRect().height;
    if (measuredHeight > 0) {
      el.style.minHeight = Math.ceil(measuredHeight) + 'px';
    }

    // Preserve accessibility label while animating
    el.setAttribute('aria-label', fullText);

    // Single text node inside one span guarantees unbroken Arabic cursive shaping
    el.textContent = '';
    const textSpan = document.createElement('span');
    textSpan.setAttribute('aria-hidden', 'true');
    const textNode = document.createTextNode('');
    textSpan.appendChild(textNode);
    el.appendChild(textSpan);

    const nib = createPenSVG();
    el.appendChild(nib);

    const isRTL = document.documentElement.dir === 'rtl';
    const totalChars = fullText.length;
    const targetDuration = Math.min(
      PEN_EFFECT_CONFIG.maxDurationMs,
      Math.max(420, totalChars * PEN_EFFECT_CONFIG.baseCharDelayMs)
    );

    const state = { rafId: null, startTime: null };
    activeAnimations.set(el, state);

    const range = document.createRange();

    function step(timestamp) {
      if (!state.startTime) state.startTime = timestamp;
      const elapsed = timestamp - state.startTime;
      const progress = Math.min(1, elapsed / targetDuration);
      // Smooth ease-out curve for natural handwriting deceleration at end
      const eased = 1 - Math.pow(1 - progress, 1.35);
      const charCount = Math.max(1, Math.round(eased * totalChars));

      if (textNode.nodeValue.length !== charCount) {
        textNode.nodeValue = fullText.slice(0, charCount);
      }

      // Position pen nib right beside the last written character, clamped inside element width
      try {
        let idx = charCount - 1;
        while (idx > 0 && fullText[idx] === ' ') {
          idx--;
        }
        range.setStart(textNode, idx);
        range.setEnd(textNode, Math.min(charCount, idx + 1));
        const charRect = range.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        if (charRect.width > 0 || charRect.height > 0) {
          const jitterX = Math.sin(elapsed * 0.045) * 1.8;
          const jitterY = Math.cos(elapsed * 0.065) * 2.2;
          const rawTipX = isRTL
            ? (charRect.left - elRect.left - 4 + jitterX)
            : (charRect.right - elRect.left - 2 + jitterX);
          const maxTipX = Math.max(0, elRect.width - 28);
          const tipX = Math.max(-2, Math.min(maxTipX, rawTipX));
          const tipY = Math.max(-6, charRect.bottom - elRect.top - 26 + jitterY);
          const tilt = isRTL ? -10 : 8;
          nib.style.transform =
            'translate3d(' + tipX.toFixed(1) + 'px, ' + tipY.toFixed(1) + 'px, 0) rotate(' + tilt + 'deg)';
        }
      } catch (err) {
        // Fallback silently if range fails during DOM transition
      }

      if (progress < 1) {
        state.rafId = requestAnimationFrame(step);
      } else {
        nib.classList.add('is-done');
        el.dataset.penDone = 'true';
        activeAnimations.delete(el);
        setTimeout(() => {
          if (el.dataset.penDone === 'true') {
            el.textContent = fullText;
            el.style.minHeight = '';
          }
        }, 280);
      }
    }

    state.rafId = requestAnimationFrame(step);
  }

  function initObserver() {
    if (observer) observer.disconnect();
    const targets = document.querySelectorAll('.pen-write');
    if (!targets.length) return;

    if (prefersReducedMotion || !PEN_EFFECT_CONFIG.enabled || !('IntersectionObserver' in window)) {
      targets.forEach((el) => {
        const text = el.getAttribute('data-' + currentLang) || el.textContent;
        finishImmediately(el, text);
      });
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            animateElement(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -16px 0px' }
    );

    targets.forEach((el) => {
      if (el.dataset.penDone !== 'true') {
        observer.observe(el);
      }
    });
  }

  function replayOnLanguageChange() {
    const targets = document.querySelectorAll('.pen-write');
    targets.forEach((el) => {
      cancelElement(el);
      delete el.dataset.penDone;
      el.style.minHeight = '';
      const newText = el.getAttribute('data-' + currentLang);
      if (newText) el.textContent = newText;
    });
    initObserver();
  }

  return {
    init: initObserver,
    replay: replayOnLanguageChange
  };
})();

/* ==========================================================================
   6. LANGUAGE SWITCHING (AR RTL / EN LTR)
   ========================================================================== */
function applyLanguage(lang, isUserToggle) {
  currentLang = lang === 'en' ? 'en' : 'ar';
  const html = document.documentElement;
  html.setAttribute('lang', currentLang);
  html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

  // Update regular bilingual elements (excluding active pen-write elements handled below)
  document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
    if (el.tagName === 'META') {
      el.setAttribute('content', el.getAttribute('data-' + currentLang) || '');
      return;
    }
    if (el.classList.contains('pen-write') && isUserToggle) {
      return;
    }
    el.textContent = el.getAttribute('data-' + currentLang) || '';
  });

  // Update placeholders
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', el.getAttribute('data-' + currentLang + '-placeholder') || '');
  });

  // Update image alt attributes
  document.querySelectorAll('[data-ar-alt][data-en-alt]').forEach((el) => {
    el.setAttribute('alt', el.getAttribute('data-' + currentLang + '-alt') || '');
  });

  // Update language toggle button label
  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
    btn.setAttribute(
      'aria-label',
      currentLang === 'ar' ? 'Switch language to English' : 'التبديل إلى اللغة العربية'
    );
  });

  saveLang(currentLang);

  if (isUserToggle) {
    PenWriter.replay();
  }
}

function initLanguageToggle() {
  const initialLang = getStoredLang();
  applyLanguage(initialLang, false);

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = currentLang === 'ar' ? 'en' : 'ar';
      applyLanguage(next, true);
    });
  });
}

/* ==========================================================================
   7. SPLASH SCREEN (Once Per Session, ~1.4s)
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem('kdc_intro_shown') === '1';
  } catch (e) {
    alreadyShown = false;
  }

  if (alreadyShown || prefersReducedMotion) {
    splash.classList.add('is-hidden');
    return;
  }

  try {
    sessionStorage.setItem('kdc_intro_shown', '1');
  } catch (e) {
    // Ignore
  }

  setTimeout(() => {
    splash.classList.add('is-leaving');
    setTimeout(() => {
      splash.classList.add('is-hidden');
    }, 750);
  }, 1350);
}

/* ==========================================================================
   8. NAVIGATION, STICKY HEADER & FULLSCREEN MOBILE DRAWER
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');

  // Highlight active page link cleanly
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav__link, .mobile-nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (menuToggle && drawer) {
    const setScrollLock = (locked) => {
      document.documentElement.classList.toggle('menu-open', locked);
      document.body.classList.toggle('menu-open', locked);
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      setScrollLock(false);
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      setScrollLock(isOpen);
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // Close when tapping outside the navigation items/CTA inside the drawer or on header/outside
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('is-open')) return;
      if (menuToggle.contains(e.target)) return;
      if (e.target === drawer || !drawer.contains(e.target)) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1080 && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }
}

/* ==========================================================================
   9. SCROLL PROGRESS BAR & HERO PARALLAX
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.querySelector('.scroll-progress__bar');
  const heroMedia = document.querySelector('.hero__media');

  if (!progressBar && !heroMedia) return;

  let ticking = false;

  function update() {
    ticking = false;
    const scrollY = window.scrollY || window.pageYOffset;

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    if (heroMedia) {
      if (!prefersReducedMotion && window.innerWidth >= 768) {
        const heroRect = heroMedia.parentElement.getBoundingClientRect();
        if (heroRect.bottom > 0) {
          const shift = Math.min(64, scrollY * 0.14);
          heroMedia.style.transform = 'translate3d(0, ' + shift.toFixed(1) + 'px, 0)';
        }
      } else if (heroMedia.style.transform) {
        heroMedia.style.transform = '';
      }
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });

  update();
}

/* ==========================================================================
   10. REVEAL OBSERVERS (Cards Stagger, Media Clip-Path, Gold Rules)
   ========================================================================== */
function initRevealObservers() {
  const targets = document.querySelectorAll('.reveal, .media-frame, .gold-rule');
  if (!targets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay');
          if (delay) {
            entry.target.style.transitionDelay = delay + 'ms';
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -16px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   11. MAGNETIC BUTTONS & 3D CARD TILT + GOLD SPOTLIGHT (Mouse Hover Only)
   ========================================================================== */
function initPointerEffects() {
  if (
    prefersReducedMotion ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }

  // Magnetic Buttons
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
      btn.style.transform = 'translate3d(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px, 0)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // 3D Tilt & Gold Glow Cards
  document.querySelectorAll('.card--interactive').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');

      const rx = ((y / rect.height) - 0.5) * -4.5;
      const ry = ((x / rect.width) - 0.5) * 4.5;
      card.style.transform =
        'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   12. ANIMATED SVG ROUTE PATH & GOLD RIDER BEACON
   ========================================================================== */
function initAnimatedRoutes() {
  const svgs = document.querySelectorAll('[data-route-svg]');
  if (!svgs.length) return;

  svgs.forEach((svg) => {
    const drawPath = svg.querySelector('.route-path-draw');
    const riderGroup = svg.querySelector('.route-rider-group');
    if (!drawPath || typeof drawPath.getTotalLength !== 'function') return;

    const totalLen = drawPath.getTotalLength();
    drawPath.style.strokeDasharray = totalLen;
    drawPath.style.strokeDashoffset = prefersReducedMotion ? '0' : totalLen;

    if (prefersReducedMotion) {
      if (riderGroup) {
        const pt = drawPath.getPointAtLength(totalLen * 0.5);
        riderGroup.setAttribute('transform', 'translate(' + pt.x + ', ' + pt.y + ')');
      }
      return;
    }

    let isInView = false;
    let pathDrawn = false;
    let drawStart = null;
    let loopStart = null;
    let rafId = null;

    function animate(ts) {
      if (!isInView) {
        rafId = null;
        return;
      }

      if (!pathDrawn) {
        if (!drawStart) drawStart = ts;
        const p = Math.min(1, (ts - drawStart) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        drawPath.style.strokeDashoffset = (totalLen * (1 - eased)).toFixed(1);
        if (p >= 1) pathDrawn = true;
      }

      if (riderGroup) {
        if (!loopStart) loopStart = ts;
        const cycle = ((ts - loopStart) % 4500) / 4500;
        const pt = drawPath.getPointAtLength(cycle * totalLen);
        riderGroup.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ', ' + pt.y.toFixed(1) + ')');
      }

      rafId = requestAnimationFrame(animate);
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInView = entry.isIntersecting;
            if (isInView && !rafId) {
              rafId = requestAnimationFrame(animate);
            }
          });
        },
        { threshold: 0.15 }
      );
      obs.observe(svg);
    }
  });
}

/* ==========================================================================
   13. IMAGE, LOGO & VIDEO FALLBACKS + SMOOTH PAGE TRANSITIONS
   ========================================================================== */
function handleLogoFallback(img) {
  const splashWrap = img.closest('.splash-logo-wrap');
  if (splashWrap) {
    splashWrap.style.display = 'none';
    return;
  }
  const logoBadge = img.closest('.logo-badge');
  if (logoBadge) {
    logoBadge.style.display = 'none';
    return;
  }
  img.style.display = 'none';
}

function initMediaFallbacks() {
  // Content image frames
  document.querySelectorAll('.media-frame img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      const frame = img.closest('.media-frame');
      if (frame) frame.classList.add('is-broken');
    }
    img.addEventListener('error', () => {
      const frame = img.closest('.media-frame');
      if (frame) frame.classList.add('is-broken');
    });
  });

  // Logo images: show text-only company name without broken icon if logo fails to load
  document.querySelectorAll('img[src*="logo-icon.png"], img[src*="logo.png"]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      handleLogoFallback(img);
    }
    img.addEventListener('error', () => handleLogoFallback(img));
  });

  // Hero video fallback: keep images/home-hero.jpg visible if all video sources fail
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    const hideBrokenVideo = () => {
      heroVideo.style.display = 'none';
    };
    if (heroVideo.error || heroVideo.networkState === 3) {
      hideBrokenVideo();
    }
    heroVideo.addEventListener('error', hideBrokenVideo);
    const sources = heroVideo.querySelectorAll('source');
    if (sources.length) {
      let failedCount = 0;
      sources.forEach((srcEl) => {
        srcEl.addEventListener('error', () => {
          failedCount++;
          if (failedCount >= sources.length) {
            hideBrokenVideo();
          }
        });
      });
    }
  }
}

function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay || prefersReducedMotion) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (link.hasAttribute('download') || link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    // Only transition for local relative .html links
    if (href.startsWith('http://') || href.startsWith('https://')) return;

    e.preventDefault();
    overlay.classList.add('is-active');
    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-active');
  });
}

/* ==========================================================================
   14. TRACKING BOX, CONTACT TABS & STATIC FORMS (fetch POST JSON)
   ========================================================================== */
function initTrackingBox() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const notice = document.getElementById('tracking-notice');
  if (!form || !input || !notice) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    notice.textContent = val ? I18N[currentLang].trackingSoon : I18N[currentLang].trackingEmpty;
    notice.classList.add('is-visible');
  });
}

function initContactTabs() {
  const tabBtns = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');
  if (!tabBtns.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab-target');
      tabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      tabPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.getAttribute('data-tab-panel') === target);
      });
    });
  });
}

function initStaticForms() {
  const forms = document.querySelectorAll('form[data-static-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    const statusBox = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(type, message) {
      if (!statusBox) return;
      statusBox.className = 'form-status is-visible is-' + type;
      statusBox.textContent = message;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot bot check
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value.trim() !== '') {
        setStatus('success', I18N[currentLang].formSuccess);
        form.reset();
        return;
      }

      // Clear previous invalid flags
      form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

      let hasError = false;
      let firstErrorMsg = I18N[currentLang].formValidation;

      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach((field) => {
        if (field.type === 'radio') {
          const checked = form.querySelector('input[name="' + field.name + '"]:checked');
          if (!checked) hasError = true;
          return;
        }
        const value = field.value.trim();
        if (!value) {
          field.classList.add('is-invalid');
          hasError = true;
          return;
        }
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          field.classList.add('is-invalid');
          hasError = true;
          firstErrorMsg = I18N[currentLang].invalidEmail;
        }
        if (field.type === 'tel' && value.replace(/\D/g, '').length < 7) {
          field.classList.add('is-invalid');
          hasError = true;
          firstErrorMsg = I18N[currentLang].invalidPhone;
        }
      });

      if (hasError) {
        setStatus('error', firstErrorMsg);
        return;
      }

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((val, key) => {
        if (key !== '_gotcha') {
          payload[key] = val;
        }
      });
      payload.language = currentLang;

      if (submitBtn) submitBtn.disabled = true;
      setStatus('loading', I18N[currentLang].formSending);

      try {
        const response = await fetch(SITE_CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setStatus('success', I18N[currentLang].formSuccess);
          form.reset();
        } else {
          setStatus('error', I18N[currentLang].formError);
        }
      } catch (err) {
        setStatus('error', I18N[currentLang].formError);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

/* ==========================================================================
   15. BOOTSTRAP ON DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initLanguageToggle();
  hydrateSiteConfig();
  initHeaderAndNav();
  initScrollEffects();
  initRevealObservers();
  PenWriter.init();
  initPointerEffects();
  initAnimatedRoutes();
  initMediaFallbacks();
  initPageTransitions();
  initTrackingBox();
  initContactTabs();
  initStaticForms();
});
