window.DiyPearl = window.DiyPearl || {};

window.DiyPearl.Grid = class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = [];
    this.clear();
  }

  clear() {
    this.data = Array.from({ length: this.height }, () =>
      Array(this.width).fill(null)
    );
  }

  get(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.data[y][x];
  }

  set(x, y, color) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.data[y][x] = color;
  }

  resize(newWidth, newHeight) {
    const newData = Array.from({ length: newHeight }, () =>
      Array(newWidth).fill(null)
    );
    for (let y = 0; y < Math.min(this.height, newHeight); y++) {
      for (let x = 0; x < Math.min(this.width, newWidth); x++) {
        newData[y][x] = this.data[y][x];
      }
    }
    this.width = newWidth;
    this.height = newHeight;
    this.data = newData;
  }

  forEach(fn) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        fn(x, y, this.data[y][x]);
      }
    }
  }

  clone() {
    const g = new Grid(this.width, this.height);
    g.data = this.data.map(row => [...row]);
    return g;
  }
};
