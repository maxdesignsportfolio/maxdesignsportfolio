
    (() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cursor = document.querySelector('.cursor');
      const dot = document.querySelector('.cursor-dot');
      const progress = document.querySelector('.scroll-progress');

      // Smooth custom cursor.
      let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
      let cursorX = mouseX, cursorY = mouseY;
      let dotX = mouseX, dotY = mouseY;

      window.addEventListener('pointermove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * .14;
        cursorY += (mouseY - cursorY) * .14;
        dotX += (mouseX - dotX) * .35;
        dotY += (mouseY - dotY) * .35;

        if (cursor) cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) translate(-50%,-50%)`;
        if (dot) dot.style.transform = `translate3d(${dotX}px,${dotY}px,0) translate(-50%,-50%)`;
        requestAnimationFrame(animateCursor);
      }

      if (!reduceMotion && cursor && dot) animateCursor();

      // Hover state for interactive elements.
      document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
      });

      // Reveal the category section when it enters the viewport.
      const selector = document.querySelector('.selector');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            selector.classList.add('is-visible');
            observer.unobserve(selector);
          }
        });
      }, { threshold: .18 });

      observer.observe(selector);

      // Premium card tilt / magnetic response.
      if (!reduceMotion) {
        document.querySelectorAll('.magnetic').forEach(card => {
          card.addEventListener('pointermove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const px = x / rect.width;
            const py = y / rect.height;

            const rotateY = (px - .5) * 7;
            const rotateX = (.5 - py) * 7;
            const tx = (px - .5) * 8;
            const ty = (py - .5) * 8;

            card.style.setProperty('--mx', `${px * 100}%`);
            card.style.setProperty('--my', `${py * 100}%`);
            card.style.transform =
              `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${tx}px,${ty}px,0)`;
          });

          card.addEventListener('pointerleave', () => {
            card.style.transform =
              'perspective(1100px) rotateX(0) rotateY(0) translate3d(0,0,0)';
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '50%');
          });
        });
      }

      // Subtle scroll parallax on the hero layers.
      const parallaxItems = document.querySelectorAll('[data-parallax]');
      function updateScroll() {
        const y = window.scrollY || 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        if (!reduceMotion && y < innerHeight * 1.1) {
          parallaxItems.forEach(el => {
            const amount = Number(el.dataset.parallax || 0);
            el.style.transform = `translate3d(0, ${y * amount}px, 0)`;
          });
        }
      }

      window.addEventListener('scroll', updateScroll, { passive: true });
      updateScroll();

      // Lenis-like easing without a dependency: smooth anchor scrolling.
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const target = document.querySelector(link.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
      });

      // Small image-load polish.
      document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      });
    })();
