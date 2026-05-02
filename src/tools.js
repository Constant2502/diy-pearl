window.DiyPearl = window.DiyPearl || {};

window.DiyPearl.Tools = class Tools {
  constructor(renderer, grid, history, palette) {
    this.renderer = renderer;
    this.grid = grid;
    this.history = history;
    this.palette = palette;
    this.currentTool = 'brush';
    this.isDrawing = false;
    this.drew = false;
    this.lastCell = null;

    this._setupEvents();
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  _setupEvents() {
    const cvs = this.renderer.canvas;

    cvs.addEventListener('mousedown', (e) => this._down(e));
    cvs.addEventListener('mousemove', (e) => this._move(e));
    cvs.addEventListener('mouseup', () => this._up());
    cvs.addEventListener('mouseleave', () => this._up());

    cvs.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this._down({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });

    cvs.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this._move({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });

    cvs.addEventListener('touchend', (e) => {
      e.preventDefault();
      this._up();
    }, { passive: false });
  }

  _down(e) {
    this.isDrawing = true;
    this.drew = false;
    this.lastCell = this.renderer.getCellFromPoint(e.clientX, e.clientY);
    this._apply(this.lastCell.x, this.lastCell.y);
  }

  _move(e) {
    if (!this.isDrawing) return;
    const cell = this.renderer.getCellFromPoint(e.clientX, e.clientY);
    if (cell.x === this.lastCell.x && cell.y === this.lastCell.y) return;
    this.lastCell = cell;
    this._apply(cell.x, cell.y);
  }

  _up() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
  }

  _apply(x, y) {
    if (x < 0 || x >= this.grid.width || y < 0 || y >= this.grid.height) return;

    switch (this.currentTool) {
      case 'brush': {
        const color = this.palette.getSelected();
        if (this.grid.get(x, y) !== color) {
          if (!this.drew) {
            this.history.push(this.grid);
            this.drew = true;
          }
          this.grid.set(x, y, color);
          this.renderer.render();
        }
        break;
      }
      case 'eraser': {
        if (this.grid.get(x, y) !== null) {
          if (!this.drew) {
            this.history.push(this.grid);
            this.drew = true;
          }
          this.grid.set(x, y, null);
          this.renderer.render();
        }
        break;
      }
      case 'eyedropper': {
        const color = this.grid.get(x, y);
        if (color) {
          this.palette.select(color);
        }
        break;
      }
    }
  }
};
