document.addEventListener('DOMContentLoaded', () => {

  /*  Entry veil: fade from black into the scene on load  */
  const entryVeil = document.getElementById('entryVeil');
  if (entryVeil) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entryVeil.classList.add('hide');
      });
    });
  }

  window.addEventListener('pageshow', (e) => {
    if (e.persisted && entryVeil) {
      entryVeil.classList.remove('hide');
      void entryVeil.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          entryVeil.classList.add('hide');
        });
      });
    }
  });

  /*  Mouse parallax + cursor glow  */
  const scene = document.getElementById('scene');
  const bgDark = document.querySelector('.bg-dark');
  const cursorGlow = document.getElementById('cursorGlow');

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // subtle parallax drift on the background
      bgDark.style.transform = `scale(1.1) translate(${x * -16}px, ${y * -16}px)`;

      // cursor glow follows pointer
      cursorGlow.style.left = `${e.clientX - rect.left}px`;
      cursorGlow.style.top = `${e.clientY - rect.top}px`;
      cursorGlow.style.opacity = '1';
    });

    scene.addEventListener('mouseleave', () => {
      bgDark.style.transform = '';
      cursorGlow.style.opacity = '0';
    });
  }

  /*  Part pager (arrows switch between the 2 parts)  */
  const partStage = document.getElementById('partStage');
  const screens   = Array.from(document.querySelectorAll('.part-screen'));
  const prevBtn   = document.getElementById('partPrev');
  const nextBtn   = document.getElementById('partNext');
  const indicator = document.getElementById('partIndicator');

  let current = 0;
  const total = screens.length;

  function updateNavState(){
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    indicator.innerHTML = String(current + 1).padStart(2, '0') + ' <em>/</em> ' + String(total).padStart(2, '0');
  }

  function goTo(newIndex, direction){
    if (newIndex === current || newIndex < 0 || newIndex >= total) return;

    const outgoing = screens[current];
    const incoming = screens[newIndex];

    // outgoing slides away opposite to travel direction
    outgoing.classList.remove('active');
    outgoing.style.transform = direction > 0
      ? 'translateX(-40px) scale(0.98)'
      : 'translateX(40px) scale(0.98)';
    outgoing.style.opacity = '0';
    outgoing.style.filter = 'blur(6px)';

    // incoming starts from the direction of travel, then eases into place
    incoming.style.transition = 'none';
    incoming.style.transform = direction > 0
      ? 'translateX(40px) scale(0.98)'
      : 'translateX(-40px) scale(0.98)';
    incoming.style.opacity = '0';
    incoming.style.filter = 'blur(6px)';

    // force reflow so the "no transition" starting state is applied before animating
    void incoming.offsetWidth;
    incoming.style.transition = '';

    requestAnimationFrame(() => {
      incoming.classList.add('active');
      incoming.style.transform = '';
      incoming.style.opacity = '';
      incoming.style.filter = '';
    });

    current = newIndex;
    updateNavState();
  }

  nextBtn.addEventListener('click', () => goTo(current + 1, 1));
  prevBtn.addEventListener('click', () => goTo(current - 1, -1));

  document.addEventListener('keydown', (e) => {
    if (isDetailOpen) return;
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  updateNavState();

  /*  Detail zoom overlay  */
  const overlay      = document.getElementById('detailOverlay');
  const detailContent= document.getElementById('detailContent');
  const closeBtn      = document.getElementById('detailClose');
  const backLink      = document.getElementById('backLink');
  const brandMark      = document.getElementById('brandMark');
  const items          = document.querySelectorAll('.part-item');

  const templates = {
    about: document.getElementById('tpl-about'),
    project: document.getElementById('tpl-project'),
    skills: document.getElementById('tpl-skills'),
    contact: document.getElementById('tpl-contact'),
    cv: document.getElementById('tpl-cv'),
    bot: document.getElementById('tpl-bot')
  };

  let isDetailOpen = false;

  function openDetail(kind){
    if (isDetailOpen) return;
    isDetailOpen = true;

    const tpl = templates[kind];
    if (tpl){
      detailContent.innerHTML = '';
      detailContent.appendChild(tpl.content.cloneNode(true));
    }

    partStage.classList.add('dimmed');
    backLink.classList.add('hidden');
    brandMark.classList.add('hidden');

    requestAnimationFrame(() => {
      overlay.classList.add('open');
    });
  }

  function closeDetail(){
    if (!isDetailOpen) return;
    isDetailOpen = false;

    overlay.classList.remove('open');
    partStage.classList.remove('dimmed');
    backLink.classList.remove('hidden');
    brandMark.classList.remove('hidden');
  }

  items.forEach(item => {
    item.addEventListener('click', () => openDetail(item.dataset.panel));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openDetail(item.dataset.panel);
      }
    });
  });

  closeBtn.addEventListener('click', closeDetail);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('detail-blur')){
      closeDetail();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
  });

});