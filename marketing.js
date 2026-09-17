
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress');
function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }

  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const reveals = document.querySelectorAll('[data-reveal], [data-section-reveal], [data-closing]');

  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .14 });

    reveals.forEach(el => observer.observe(el));
  }

  if (!reduce) {
    document.querySelectorAll('.flyer').forEach(card => {
      const image = card.querySelector('img');
      if (!image) return;

      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - .5;
        const py = (e.clientY - rect.top) / rect.height - .5;
        image.style.transform =
          `scale(1.055) translate3d(${px * 7}px,${py * 7}px,0)`;
      });

      card.addEventListener('pointerleave', () => {
        image.style.transform = '';
      });
    });

    const mockup = document.querySelector('.mockup-frame');

    if (mockup) {
      const image = mockup.querySelector('img');

      mockup.addEventListener('pointermove', e => {
        const rect = mockup.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - .5;
        const py = (e.clientY - rect.top) / rect.height - .5;
        image.style.transform =
          `scale(1.035) translate3d(${px * 5}px,${py * 5}px,0)`;
      });

      mockup.addEventListener('pointerleave', () => {
        image.style.transform = '';
      });
    }
  }

  const video = document.querySelector('.campaign-video');

  if (video) {
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    });
  }
  /* =========================================================
   CONTACT MODAL
========================================================= */

const contactModal =
  document.querySelector('.contact-modal');

const contactOpen =
  document.querySelector('[data-contact-open]');

const contactCloseButtons =
  document.querySelectorAll('[data-contact-close]');


function openContactModal() {

  if (!contactModal) return;

  contactModal.classList.add('is-open');

  contactModal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.style.overflow = 'hidden';
}


function closeContactModal() {

  if (!contactModal) return;

  contactModal.classList.remove('is-open');

  contactModal.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.style.overflow = '';
}


if (contactOpen) {

  contactOpen.addEventListener(
    'click',
    openContactModal
  );

}


contactCloseButtons.forEach(button => {

  button.addEventListener(
    'click',
    closeContactModal
  );

});


document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      contactModal?.classList.contains('is-open')
    ) {
      closeContactModal();
    }

  }
);
})();
