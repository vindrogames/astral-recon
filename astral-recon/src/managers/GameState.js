const GameState = {

    // Tracks completed worlds for StartScence to display Astro or not (on top of ?? animation)
    completedWorlds: {
        world_1: false,
        world_2: false,
    },

    // Tracks global World settings and room settings
    currentWorldKey: null,
    currentRoomIndex: 0,
    keyCollected: false,
    currentDifficulty: 'hard',

    // helper functions to manage GameState
    setWorld(worldKey) {
        this.currentWorldKey = worldKey;
        this.currentRoomIndex = 0;
        this.keyCollected = false;
    },

    setDifficulty(newDifficulty) {
        if (['easy', 'hard'].includes(newDifficulty)) {
            this.currentDifficulty = newDifficulty;
            console.log(`Difficulty set to ${newDifficulty}`);
        }
    },

    getDifficulty() {
        return this.currentDifficulty;
    },

    nextRoom() {
        this.currentRoomIndex++;
        this.keyCollected = false;
    },

    setKeyCollected(val) {
        this.keyCollected = val;
    },

    getKeyCollected() {
        return this.keyCollected;
    },

    isKeyCollected() {
        return this.keyCollected;
    },

    getWorld() {
        return this.currentWorldKey;
    },

    getCurrentRoomIndex() {
        return this.currentRoomIndex;
    },

    markWorldComplete(worldKey) {
        this.completedWorlds[worldKey] = true;
    },

    isWorldComplete(worldKey) {
        return this.completedWorlds[worldKey];
    },
};

export default GameState;
