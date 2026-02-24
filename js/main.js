/**
 * .BEIN BERGEN AS - Main JavaScript
 * Navigation, animations, form validation, gallery, lightbox
 */

document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initContactForm();
  initGalleryFilters();
  initLightbox();
  initSmoothScroll();
  initBeforeAfterSlider();
});

/**
 * Header - Transparent to solid on scroll
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const scrollThreshold = 50;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.remove('header--transparent');
      header.classList.add('header--solid');
    } else {
      header.classList.add('header--transparent');
      header.classList.remove('header--solid');
    }
  }

  updateHeader();

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
  const toggle = document.querySelector('.header__toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav__overlay');
  const links = document.querySelectorAll('.mobile-nav__link');

  if (!toggle || !mobileNav) return;

  function openNav() {
    toggle.classList.add('header__toggle--active');
    mobileNav.classList.add('mobile-nav--open');
    if (overlay) overlay.classList.add('mobile-nav__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.classList.remove('header__toggle--active');
    mobileNav.classList.remove('mobile-nav--open');
    if (overlay) overlay.classList.remove('mobile-nav__overlay--visible');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    if (mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  links.forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeNav();
    }
  });
}

/**
 * Scroll Animations - Intersection Observer
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add(entry.target.classList.contains('fade-in-left')
          ? 'fade-in-left--visible'
          : entry.target.classList.contains('fade-in-right')
            ? 'fade-in-right--visible'
            : 'fade-in--visible'
        );
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  const fields = {
    name: {
      element: form.querySelector('#name'),
      validate: function(value) {
        return value.trim().length >= 2;
      },
      error: 'Vennligst oppgi ditt navn'
    },
    email: {
      element: form.querySelector('#email'),
      validate: function(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      error: 'Vennligst oppgi en gyldig e-postadresse'
    },
    phone: {
      element: form.querySelector('#phone'),
      validate: function(value) {
        return value.trim() === '' || /^[+]?[\d\s-]{8,}$/.test(value);
      },
      error: 'Vennligst oppgi et gyldig telefonnummer'
    },
    message: {
      element: form.querySelector('#message'),
      validate: function(value) {
        return value.trim().length >= 10;
      },
      error: 'Meldingen må være minst 10 tegn'
    }
  };

  function validateField(field) {
    if (!field.element) return true;

    const value = field.element.value;
    const isValid = field.validate(value);
    const group = field.element.closest('.form-group');
    const errorEl = group.querySelector('.form-error');

    if (isValid) {
      group.classList.remove('form-group--error');
    } else {
      group.classList.add('form-group--error');
      if (errorEl) errorEl.textContent = field.error;
    }

    return isValid;
  }

  Object.values(fields).forEach(function(field) {
    if (field.element) {
      field.element.addEventListener('blur', function() {
        validateField(field);
      });

      field.element.addEventListener('input', function() {
        const group = field.element.closest('.form-group');
        if (group.classList.contains('form-group--error')) {
          validateField(field);
        }
      });
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach(function(field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sender...';
      btn.disabled = true;

      // Simulate form submission
      setTimeout(function() {
        btn.textContent = 'Sendt!';
        btn.style.backgroundColor = '#27ae60';

        setTimeout(function() {
          form.reset();
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 2000);
      }, 1500);
    }
  });
}

/**
 * Gallery Filters
 */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      filterBtns.forEach(function(b) {
        b.classList.remove('filter-btn--active');
      });
      this.classList.add('filter-btn--active');

      galleryItems.forEach(function(item) {
        const type = item.dataset.type;

        if (filter === 'all' || type === filter) {
          item.style.display = 'block';
          setTimeout(function() {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(function() {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Lightbox
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (!galleryItems.length || !lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  const contentImg = lightbox.querySelector('.lightbox__content img');
  const infoTitle = lightbox.querySelector('.lightbox__info-title');
  const infoType = lightbox.querySelector('.lightbox__info-type');

  let currentIndex = 0;
  let items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item__title');
    const type = item.querySelector('.gallery-item__type');

    if (contentImg && img) {
      contentImg.src = img.src;
      contentImg.alt = img.alt;
    }
    if (infoTitle && title) {
      infoTitle.textContent = title.textContent;
    }
    if (infoType && type) {
      infoType.textContent = type.textContent;
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % items.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightboxContent();
  }

  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      // Update items array in case of filtering
      items = Array.from(document.querySelectorAll('.gallery-item')).filter(function(i) {
        return i.style.display !== 'none';
      });
      const visibleIndex = items.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : index);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevImage);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextImage);
  }

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('lightbox--open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Before/After Slider
 */
function initBeforeAfterSlider() {
  var sliders = document.querySelectorAll('.ba-slider');

  sliders.forEach(function(slider) {
    var before = slider.querySelector('.ba-slider__before');
    var handle = slider.querySelector('.ba-slider__handle');
    var isDragging = false;

    function updatePosition(x) {
      var rect = slider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      var pct = pos * 100;
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', function(e) {
      isDragging = true;
      updatePosition(e.clientX);
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        updatePosition(e.clientX);
        e.preventDefault();
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
    });

    slider.addEventListener('touchstart', function(e) {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (isDragging) {
        updatePosition(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', function() {
      isDragging = false;
    });
  });
}
