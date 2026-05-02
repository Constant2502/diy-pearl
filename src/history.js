window.DiyPearl = window.DiyPearl || {};

window.DiyPearl.History = class History {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  push(grid) {
    this.undoStack.push(grid.clone());
    this.redoStack = [];
  }

  undo(grid) {
    if (this.undoStack.length === 0) return null;
    this.redoStack.push(grid.clone());
    return this.undoStack.pop();
  }

  redo(grid) {
    if (this.redoStack.length === 0) return null;
    this.undoStack.push(grid.clone());
    return this.redoStack.pop();
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
};
