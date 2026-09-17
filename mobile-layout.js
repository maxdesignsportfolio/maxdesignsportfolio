(() => {
  const query = window.matchMedia('(max-width: 900px)');
  let mounted = null;

  function setRootMode() {
    document.documentElement.classList.toggle('mobile-layout', query.matches);
  }

  function syncDesktopMedia() {
    document.querySelectorAll('.desktop-site video').forEach(video => {
      if (query.matches) {
        video.pause();
      } else if (video.autoplay) {
        const play = video.play();
        if (play && typeof play.catch === 'function') play.catch(() => {});
      }
    });
  }

  function mountMobile() {
    setRootMode();
    syncDesktopMedia();
    const template = document.getElementById('mobile-layout-template');
    if (!query.matches || !template || mounted) return;

    const fragment = template.content.cloneNode(true);
    const root = fragment.querySelector('.mobile-site');
    if (!root) return;

    template.insertAdjacentElement('afterend', root);
    mounted = root;
  }

  function unmountMobile() {
    setRootMode();
    syncDesktopMedia();
    if (query.matches) {
      mountMobile();
      return;
    }
    if (mounted) {
      mounted.remove();
      mounted = null;
    }
  }

  function openContact() {
    const modal = document.querySelector('.homepage-contact-modal, .contact-modal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeContact() {
    const modal = document.querySelector('.homepage-contact-modal, .contact-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (event) => {
    const open = event.target.closest('[data-contact-open]');
    if (open) {
      event.preventDefault();
      openContact();
      return;
    }

    const close = event.target.closest('[data-contact-close]');
    if (close) closeContact();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeContact();
  });

  setRootMode();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMobile, { once: true });
  } else {
    mountMobile();
  }

  if (query.addEventListener) query.addEventListener('change', unmountMobile);
  else query.addListener(unmountMobile);
})();
