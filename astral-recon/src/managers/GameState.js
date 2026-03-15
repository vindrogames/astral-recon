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

    // Track which doors have been opened (by world and room index)
    openDoors: {
        world_1: {},
        world_2: {}
    },

    // helper functions to manage GameState
    setWorld(worldKey) {
        this.currentWorldKey = worldKey;
        this.currentRoomIndex = 0;
        this.keyCollected = false;
        // Reset door states when entering a new world
        this.openDoors[worldKey] = {};
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

    goToPreviousRoom() {
        if (this.currentRoomIndex > 0) {
            this.currentRoomIndex--;
            this.keyCollected = false;
        }
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

    markDoorOpen(worldKey, roomIndex) {
        if (!this.openDoors[worldKey]) {
            this.openDoors[worldKey] = {};
        }
        this.openDoors[worldKey][roomIndex] = true;
    },

    isDoorOpen(worldKey, roomIndex) {
        return this.openDoors[worldKey]?.[roomIndex] === true;
    }
};

export default GameState;
