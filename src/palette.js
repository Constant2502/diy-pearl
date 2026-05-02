window.DiyPearl = window.DiyPearl || {};

const DEFAULT_COLORS = [
  '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71',
  '#1ABC9C', '#3498DB', '#9B59B6', '#ECF0F1',
  '#BDC3C7', '#95A5A6', '#34495E', '#2C3E50',
  '#E91E63', '#FF5722', '#CDDC39', '#00BCD4',
  '#FF6B6B', '#FFB347', '#77DD77', '#89CFF0',
  '#F8BBD0', '#D4E157', '#B39DDB', '#80CBC4',
  '#A1887F', '#FFCC80', '#CE93D8', '#81D4FA',
];

window.DiyPearl.Palette = class Palette {
  constructor(containerEl, onSelect) {
    this.container = containerEl;
    this.onSelect = onSelect;
    this.colors = [...DEFAULT_COLORS];
    this.selected = this.colors[0];
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.colors.forEach(c => {
      const el = document.createElement('div');
      el.className = 'palette-swatch';
      el.dataset.color = c;
      el.style.backgroundColor = c;
      if (c === this.selected) el.classList.add('active');
      el.addEventListener('click', () => this.select(c));
      this.container.appendChild(el);
    });
  }

  select(color) {
    this.selected = color;
    this.container.querySelectorAll('.palette-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.color === color);
    });
    this.onSelect(color);
  }

  getSelected() {
    return this.selected;
  }

  addColor(color) {
    if (this.colors.includes(color)) {
      this.select(color);
      return;
    }
    this.colors.push(color);
    this.render();
    this.select(color);
  }
};
