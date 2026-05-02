window.DiyPearl = window.DiyPearl || {};
const { computeRegions, renderIroned } = window.DiyPearl;

window.DiyPearl.CanvasRenderer = class CanvasRenderer {
  constructor(canvasEl, grid) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.grid = grid;
    this.ironed = false;
    this.cellSize = 30;
    this.gap = 2;
  }

  setIroned(val) {
    this.ironed = val;
    this.render();
  }

  toggleIron() {
    this.ironed = !this.ironed;
    this.render();
    return this.ironed;
  }

  fitToContainer() {
    const parent = this.canvas.parentElement;
    const maxW = parent.clientWidth - 8;
    const maxH = parent.clientHeight - 8;

    const cw = Math.floor(maxW / this.grid.width);
    const ch = Math.floor(maxH / this.grid.height);
    this.cellSize = Math.max(8, Math.min(cw, ch, 48));

    this.canvas.width = this.grid.width * this.cellSize;
    this.canvas.height = this.grid.height * this.cellSize;
    this.render();
  }

  getCellFromPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / this.cellSize);
    const y = Math.floor((clientY - rect.top) / this.cellSize);
    return { x, y };
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const s = this.cellSize;

    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e0ddd5';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= this.grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * s, 0);
      ctx.lineTo(x * s, h);
      ctx.stroke();
    }
    for (let y = 0; y <= this.grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * s);
      ctx.lineTo(w, y * s);
      ctx.stroke();
    }

    if (this.ironed) {
      const regions = computeRegions(this.grid);
      renderIroned(ctx, this.grid, regions, this.cellSize);
    } else {
      this._renderBeads();
    }
  }

  _renderBeads() {
    const ctx = this.ctx;
    const s = this.cellSize;
    const gap = this.gap;
    const r = (s - gap * 2) / 2;
    if (r <= 0) return;
    const cx = s / 2;
    const cy = s / 2;

    this.grid.forEach((x, y, color) => {
      if (!color) return;
      const px = x * s + cx;
      const py = y * s + cy;

      ctx.beginPath();
      ctx.arc(px + 1.5, py + 1.5, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fill();

      const grad = ctx.createRadialGradient(
        px - r * 0.25, py - r * 0.3, r * 0.05,
        px, py, r
      );
      grad.addColorStop(0, this._lighten(color, 35));
      grad.addColorStop(0.6, color);
      grad.addColorStop(1, this._darken(color, 15));
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px - r * 0.22, py - r * 0.22, r * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    });
  }

  exportImage() {
    const beadSize = 32;
    const padding = 20;
    const gap = 2;
    const w = this.grid.width * beadSize + padding * 2;
    const h = this.grid.height * beadSize + padding * 2;

    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const r = (beadSize - gap * 2) / 2;

    this.grid.forEach((x, y, color) => {
      if (!color) return;
      const px = padding + x * beadSize + beadSize / 2;
      const py = padding + y * beadSize + beadSize / 2;

      ctx.beginPath();
      ctx.arc(px + 1, py + 1, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fill();

      const grad = ctx.createRadialGradient(
        px - r * 0.25, py - r * 0.3, r * 0.05,
        px, py, r
      );
      grad.addColorStop(0, this._lighten(color, 35));
      grad.addColorStop(0.6, color);
      grad.addColorStop(1, this._darken(color, 15));
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px - r * 0.22, py - r * 0.22, r * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    });

    return cvs.toDataURL('image/png');
  }

  _lighten(hex, amt) {
    const c = this._parseHex(hex);
    return `rgb(${Math.min(255, c[0] + amt)},${Math.min(255, c[1] + amt)},${Math.min(255, c[2] + amt)})`;
  }

  _darken(hex, amt) {
    const c = this._parseHex(hex);
    return `rgb(${Math.max(0, c[0] - amt)},${Math.max(0, c[1] - amt)},${Math.max(0, c[2] - amt)})`;
  }

  _parseHex(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
  }
};
