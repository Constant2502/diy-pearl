(function () {
  const { Grid, History, Palette, CanvasRenderer, Tools } = window.DiyPearl;

  const grid = new Grid(20, 20);
  const history = new History();

  const canvasEl = document.getElementById('canvas');
  const renderer = new CanvasRenderer(canvasEl, grid);
  const palette = new Palette(document.getElementById('palette'), () => {});
  const tools = new Tools(renderer, grid, history, palette);

  function resizeCanvas() {
    renderer.fitToContainer();
    renderer.render();
  }

  resizeCanvas();

  function updateUndoRedo() {
    document.getElementById('undo').disabled = !history.canUndo();
    document.getElementById('redo').disabled = !history.canRedo();
  }

  document.getElementById('undo').addEventListener('click', () => {
    const restored = history.undo(grid);
    if (restored) {
      grid.width = restored.width;
      grid.height = restored.height;
      grid.data = restored.data.map(r => [...r]);
      renderer.fitToContainer();
      renderer.render();
      updateUndoRedo();
    }
  });

  document.getElementById('redo').addEventListener('click', () => {
    const restored = history.redo(grid);
    if (restored) {
      grid.width = restored.width;
      grid.height = restored.height;
      grid.data = restored.data.map(r => [...r]);
      renderer.fitToContainer();
      renderer.render();
      updateUndoRedo();
    }
  });

  document.getElementById('save-btn').addEventListener('click', () => {
    const dataUrl = renderer.exportImage();
    const link = document.createElement('a');
    link.download = `diy-pearl-${grid.width}x${grid.height}.png`;
    link.href = dataUrl;
    link.click();
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (grid.data.every(row => row.every(c => !c))) return;
    history.push(grid);
    grid.clear();
    renderer.render();
    updateUndoRedo();
  });

  const ironBtn = document.getElementById('iron-btn');
  ironBtn.addEventListener('click', () => {
    const nowIroned = renderer.toggleIron();
    ironBtn.classList.toggle('active', nowIroned);
  });

  document.getElementById('resize-btn').addEventListener('click', () => {
    const w = Math.max(3, Math.min(60, parseInt(document.getElementById('grid-w').value) || 20));
    const h = Math.max(3, Math.min(60, parseInt(document.getElementById('grid-h').value) || 20));
    history.push(grid);
    grid.resize(w, h);
    renderer.setIroned(false);
    ironBtn.classList.remove('active');
    renderer.fitToContainer();
    renderer.render();
    updateUndoRedo();
  });

  document.querySelectorAll('[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tools.setTool(btn.dataset.tool);
    });
  });

  document.getElementById('custom-color').addEventListener('input', (e) => {
    palette.addColor(e.target.value);
  });

  const rewardModal = document.getElementById('reward-modal');
  const rewardBtn = document.getElementById('reward-btn');
  const rewardClose = document.getElementById('reward-close');
  const rewardBackdrop = document.getElementById('reward-backdrop');

  function openRewardModal() {
    rewardModal.classList.add('open');
    rewardModal.setAttribute('aria-hidden', 'false');
  }

  function closeRewardModal() {
    rewardModal.classList.remove('open');
    rewardModal.setAttribute('aria-hidden', 'true');
  }

  rewardBtn.addEventListener('click', openRewardModal);
  rewardClose.addEventListener('click', closeRewardModal);
  rewardBackdrop.addEventListener('click', closeRewardModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRewardModal();
  });

  window.addEventListener('resize', resizeCanvas);
})();
