/* Aaron Riddle Tattoos — Main JS */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Nav Toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  // --- Hero loaded animation ---
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }

  // --- Scroll fade-up ---
  const faders = document.querySelectorAll('.fade-up');
  if (faders.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(f => obs.observe(f));
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');

    // Collect all gallery images
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item, .masonry-item'));
    const images = galleryItems.map(item => {
      const img = item.querySelector('img');
      return { src: img ? img.src : '', alt: img ? img.alt : '' };
    });
    let current = 0;

    const openLightbox = (idx) => {
      if (!images.length) return;
      current = ((idx % images.length) + images.length) % images.length;
      lbImg.src = images[current].src;
      lbImg.alt = images[current].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    const prevImage = (e) => { if (e) e.stopPropagation(); openLightbox(current - 1); };
    const nextImage = (e) => { if (e) e.stopPropagation(); openLightbox(current + 1); };

    // Attach click to gallery items
    galleryItems.forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => openLightbox(i));
    });

    // Controls
    lbClose?.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    lbPrev?.addEventListener('click', prevImage);
    lbNext?.addEventListener('click', nextImage);

    // Click outside (overlay) to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    lbImg?.addEventListener('click', (e) => e.stopPropagation());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(current - 1);
      if (e.key === 'ArrowRight') openLightbox(current + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) openLightbox(current + 1);
        else openLightbox(current - 1);
      }
    }, { passive: true });
  }

  // --- Nav scroll bg ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 80
        ? 'rgba(10,10,12,.95)'
        : 'rgba(10,10,12,.85)';
    }, { passive: true });
  }
});
