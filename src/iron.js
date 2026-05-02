window.DiyPearl = window.DiyPearl || {};

window.DiyPearl.computeRegions = function computeRegions(grid) {
  const visited = Array.from({ length: grid.height }, () =>
    Array(grid.width).fill(false)
  );
  const regions = [];

  grid.forEach((x, y, color) => {
    if (!color || visited[y][x]) return;

    const region = { color, cells: [] };
    const stack = [[x, y]];
    visited[y][x] = true;

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      region.cells.push([cx, cy]);

      for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
        if (
          nx >= 0 && nx < grid.width &&
          ny >= 0 && ny < grid.height &&
          !visited[ny][nx] &&
          grid.get(nx, ny) === color
        ) {
          visited[ny][nx] = true;
          stack.push([nx, ny]);
        }
      }
    }

    regions.push(region);
  });

  return regions;
};

function isEdgeOfRegion(x, y, cells) {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dx, dy] of dirs) {
    if (!cells.some(([cx, cy]) => cx === x + dx && cy === y + dy)) {
      return true;
    }
  }
  return false;
}

function isBoundaryBetween(x, y, nx, ny, cells) {
  return !cells.some(([cx, cy]) => cx === nx && cy === ny);
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function darken(hex, amt) {
  const c = parseHex(hex);
  return `rgb(${Math.max(0, c[0] - amt)},${Math.max(0, c[1] - amt)},${Math.max(0, c[2] - amt)})`;
}

function parseHex(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

window.DiyPearl.renderIroned = function renderIroned(ctx, grid, regions, cellSize) {
  const s = cellSize;

  for (const region of regions) {
    const { color, cells } = region;

    for (const [cx, cy] of cells) {
      const px = cx * s;
      const py = cy * s;
      const inset = 1;
      ctx.fillStyle = color;
      roundRect(ctx, px + inset, py + inset, s - inset * 2, s - inset * 2, 3);
      ctx.fill();
    }

    for (const [cx, cy] of cells) {
      if (!isEdgeOfRegion(cx, cy, cells)) continue;
      const px = cx * s;
      const py = cy * s;
      ctx.strokeStyle = darken(color, 25);
      ctx.lineWidth = 0.5;

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dx, dy] of dirs) {
        if (isBoundaryBetween(cx, cy, cx + dx, cy + dy, cells)) {
          const x1 = px + (dx === 1 ? s : 0);
          const y1 = py + (dy === 1 ? s : 0);
          const x2 = dx !== 0 ? x1 : px + s;
          const y2 = dy !== 0 ? y1 : py + s;
          ctx.beginPath();
          ctx.moveTo(x1 + 0.5, y1 + 0.5);
          ctx.lineTo(x2 + 0.5, y2 + 0.5);
          ctx.stroke();
        }
      }
    }
  }
};
