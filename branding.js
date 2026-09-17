(() => {
  const reduce = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* =========================================================
     ELEMENTS
  ========================================================= */
  const progress = document.querySelector('.scroll-progress');


  /* =========================================================
     SCROLL PROGRESS
  ========================================================= */

  function updateScrollProgress() {
    if (!progress) return;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const amount =
      maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

    progress.style.transform =
      `scaleX(${amount})`;
  }


  window.addEventListener(
    'scroll',
    updateScrollProgress,
    { passive: true }
  );

  updateScrollProgress();


  /* =========================================================
     SECTION REVEALS
     
     Handles:
     - .branding-continuation
     - .branding-squares
     
     You can duplicate either section and it will still work.
  ========================================================= */

  const continuationSections =
    document.querySelectorAll(
      '.branding-continuation, .branding-squares'
    );


  if (continuationSections.length) {

    const continuationObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add('is-visible');

            continuationObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );


    continuationSections.forEach((section) => {
      continuationObserver.observe(section);
    });

  }


  /* =========================================================
     PROJECT IMAGE HOVER / PARALLAX
     
     Handles:
     - .project
     - .secondary-project
     - .square-project
  ========================================================= */

  if (!reduce) {

    const projects =
      document.querySelectorAll(
        '.project, .secondary-project, .square-project'
      );


    projects.forEach((project) => {

      const image =
        project.querySelector('img');


      if (!image) {
        return;
      }


      project.addEventListener(
        'pointermove',
        (event) => {

          const rect =
            project.getBoundingClientRect();


          const px =
            (event.clientX - rect.left) /
              rect.width -
            0.5;


          const py =
            (event.clientY - rect.top) /
              rect.height -
            0.5;


          image.style.transform =
            `scale(1.045)
             translate3d(
               ${px * 7}px,
               ${py * 7}px,
               0
             )`;
        }
      );


      project.addEventListener(
        'pointerleave',
        () => {
          image.style.transform = '';
        }
      );

    });

  }


  /* =========================================================
     RESET IMAGE POSITION WHEN WINDOW LOSES FOCUS
  ========================================================= */

  window.addEventListener(
    'blur',
    () => {

      document
        .querySelectorAll(
          '.project img, .secondary-project img, .square-project img'
        )
        .forEach((image) => {

          image.style.transform = '';

        });

    }
  );

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