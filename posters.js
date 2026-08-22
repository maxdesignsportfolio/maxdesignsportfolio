

(() => {

  const reduce =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  const cursor =
    document.querySelector('.cursor');

  const dot =
    document.querySelector('.cursor-dot');

  const progress =
    document.querySelector('.scroll-progress');


  /* =========================
     CUSTOM CURSOR
  ========================= */

  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;

  let cursorX = mouseX;
  let cursorY = mouseY;

  let dotX = mouseX;
  let dotY = mouseY;


  addEventListener(
    'pointermove',
    event => {

      mouseX = event.clientX;
      mouseY = event.clientY;

    },
    { passive:true }
  );


  function cursorLoop(){

    cursorX +=
      (mouseX - cursorX) * .14;

    cursorY +=
      (mouseY - cursorY) * .14;

    dotX +=
      (mouseX - dotX) * .34;

    dotY +=
      (mouseY - dotY) * .34;


    if(cursor){

      cursor.style.transform =
        `translate3d(
          ${cursorX}px,
          ${cursorY}px,
          0
        ) translate(-50%,-50%)`;

    }


    if(dot){

      dot.style.transform =
        `translate3d(
          ${dotX}px,
          ${dotY}px,
          0
        ) translate(-50%,-50%)`;

    }


    requestAnimationFrame(
      cursorLoop
    );

  }


  if(!reduce && cursor && dot){

    cursorLoop();

  }


  /* =========================
     HOVER CURSOR
  ========================= */

  document
    .querySelectorAll('[data-hover]')
    .forEach(element => {

      element.addEventListener(
        'mouseenter',
        () => {

          document.body
            .classList
            .add('is-hovering');

        }
      );


      element.addEventListener(
        'mouseleave',
        () => {

          document.body
            .classList
            .remove('is-hovering');

        }
      );

    });


  /* =========================
     SCROLL PROGRESS
  ========================= */

  function updateProgress(){

    if(!progress) return;


    const max =
      document.documentElement
        .scrollHeight -
      innerHeight;


    const amount =
      max > 0
        ? scrollY / max
        : 0;


    progress.style.transform =
      `scaleX(${amount})`;

  }


  addEventListener(
    'scroll',
    updateProgress,
    { passive:true }
  );


  updateProgress();


  /* =========================
     SECTION REVEALS
  ========================= */

  const sections =
    document.querySelectorAll(
      '[data-section-reveal], [data-closing]'
    );


  if(sections.length){

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if(!entry.isIntersecting){
              return;
            }


            entry.target
              .classList
              .add('is-visible');


            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold:.12
        }
      );


    sections.forEach(section => {

      observer.observe(section);

    });

  }


  /* =========================
     IMAGE PARALLAX
  ========================= */

  if(!reduce){

    document
      .querySelectorAll(
        '.feature-poster, .poster-card, .square-card'
      )
      .forEach(card => {

        const image =
          card.querySelector('img');


        if(!image) return;


        card.addEventListener(
          'pointermove',
          event => {

            const rect =
              card.getBoundingClientRect();


            const px =
              (event.clientX - rect.left) /
                rect.width -
              .5;


            const py =
              (event.clientY - rect.top) /
                rect.height -
              .5;


            card.style.setProperty(
              '--mx',
              `${px * 100 + 50}%`
            );


            card.style.setProperty(
              '--my',
              `${py * 100 + 50}%`
            );


            const isFeature =
              card.classList.contains(
                'feature-poster'
              );


            const scale =
              isFeature
                ? 1.045
                : 1.055;


            const move =
              isFeature
                ? 5
                : 7;


            image.style.transform =
              `scale(${scale})
               translate3d(
                 ${px * move}px,
                 ${py * move}px,
                 0
               )`;

          }
        );


        card.addEventListener(
          'pointerleave',
          () => {

            image.style.transform = '';

            card.style.setProperty(
              '--mx',
              '50%'
            );

            card.style.setProperty(
              '--my',
              '50%'
            );

          }
        );

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


