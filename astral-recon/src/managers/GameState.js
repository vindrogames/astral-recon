const GameState = {
  completedWorlds: {
    1: false,
    2: false
  },

  markWorldComplete(worldKey) {
    this.completedWorlds[worldKey] = true;
  },

  isWorldComplete(worldKey) {
    return this.completedWorlds[worldKey];
  }
};

export default GameState;