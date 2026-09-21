(() => {
  const trigger = document.getElementById('cellsTrigger');
  const popover = document.getElementById('cellsPopover');
  const note = document.getElementById('designNote');

  function closePopover(){
    popover.hidden = true;
    trigger.setAttribute('aria-expanded','false');
  }

  trigger?.addEventListener('click', () => {
    const next = !popover.hidden;
    popover.hidden = next ? false : true;
    trigger.setAttribute('aria-expanded', String(!popover.hidden));
  });

  document.addEventListener('click', (e) => {
    if (!popover || popover.hidden) return;
    if (popover.contains(e.target) || trigger.contains(e.target)) return;
    closePopover();
  });

  document.querySelectorAll('[data-cell-mock]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-cell-mock]').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      note.textContent = btn.textContent + ' · UX-Platzhalter; Zellfilter ist im aktuellen Runtime-Snapshot noch nicht verdrahtet.';
      note.hidden = false;
      closePopover();
      clearTimeout(window.__simbloodNoteTimer);
      window.__simbloodNoteTimer = setTimeout(() => { note.hidden = true; }, 2600);
    });
  });
})();