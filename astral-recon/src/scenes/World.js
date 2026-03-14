// src/scenes/World.js
import GameState from '../managers/GameState.js';
import RoomManager from '../managers/RoomManager.js';
import GameButton from '../gameobjects/GameButton.js';
import { Wall } from '../gameobjects/Wall.js';


export default class World extends Phaser.Scene {

    constructor() {
        super('World');
        // buttons object to destroy and resent when quiting World
        this.buttons = {};
        // room Objects to be destroyed both when quitting World AND changing rooms
        this.cleanupObjects = [];
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Store world-specific configuration
        this.config = data;
        this.currentRoom = GameState.currentRoomIndex;
        this.roomConfig = this.config.rooms[this.currentRoom];
    }

    preload() {

        // When starting scene, sets path to load assets by world (asstes/world_1, assets/world_2...)
        this.load.setPath(`assets/${this.config.key}/`);

        // Preloads each tilemap (room csv)
        this.config.assets.tilemaps.forEach(tilemap => {
            this.load.tilemapCSV(tilemap.assetKey, tilemap.assetPath);
        });

        // Preloads each image (ui buttons, tilemset img, static images for keyPressed and openDoors)
        this.config.assets.images.forEach(image => {
            this.load.image(image.assetKey, image.assetPath);
        })

        // Preloads each atlas for animations (img and json atlas)
        this.config.assets.atlases.forEach(atlas => {
            this.load.atlas(atlas.assetKey, atlas.assetPath, atlas.atlasPath);
        })

    }

    create() {
        /// Create persistent UI buttons (hard, easy, quit)
        if (!this.buttons || Object.keys(this.buttons).length === 0) {
            this.createUiButtons();
        }

        // Cheat mode toggle — press C to bypass death tiles (debug only)
        this.cheatMode = false;
        this.input.keyboard.on('keydown-C', () => {
            this.cheatMode = !this.cheatMode;
            console.log(`Cheat mode: ${this.cheatMode ? 'ON' : 'OFF'}`);
        });

        // Touch/swipe input for mobile
        const SWIPE_THRESHOLD = 30;
        this.touchStartX = null; // null until a pointerdown is captured in this scene
        this.touchStartY = null;

        this.input.on('pointerdown', (pointer) => {
            this.touchStartX = pointer.x;
            this.touchStartY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            // Ignore if no pointerdown was recorded in this scene (e.g. carry-over from StartScene tap)
            if (this.touchStartX === null) return;
            if (!this.player || !this.player.active || this.player.isMoving) return;

            const dx = pointer.x - this.touchStartX;
            const dy = pointer.y - this.touchStartY;

            if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.player.moveToTile(1, 0, 'right');
                else this.player.moveToTile(-1, 0, 'left');
            } else {
                if (dy > 0) this.player.moveToTile(0, 1, 'down');
                else this.player.moveToTile(0, -1, 'up');
            }
        });

        // Initiates RoomManager for current World with World config
        this.roomManager = new RoomManager(this, this.config);

        // Small delay to load cirrent room (from here, it will be room 1)
        this.time.delayedCall(0, () => {
            this.roomManager.loadCurrentRoom();
        });
    }

    // Function to create the UI buttons (again, only once)
    createUiButtons() {

        // Create UI buttons iterating over the list from World_ui_config
        this.config.uiButtons.forEach(btnConfig => {

            // Use action map to access and set corresponding difficulty functions from GameState.js
            const actionMap = {
                setEasy: () => {
                    GameState.setDifficulty('easy');
                    this.updateDifficultyUiButtons();
                },
                setHard: () => {
                    GameState.setDifficulty('hard');
                    this.updateDifficultyUiButtons();
                },
                quitWorld: () => this.quitWorld(this)
            };

            // creates Button Instance for each button, with corresponding positions and textures from world_config
            const btn = new GameButton(
                this,
                btnConfig.pos_X,
                btnConfig.pos_Y,
                btnConfig.imgKeyDark,
                btnConfig.imgKeyLight,
                () => {
                    const action = actionMap[btnConfig.onClickAction];
                    if (action) action();
                    else console.warn(`No handler for action: ${btnConfig.onClickAction}`);
                }
            );

            const isQuitBtn = btnConfig.button === 'quit';
            // For difficulty buttons (not quit button), set enabled based on currentDifficulty from GameState.js
            // default difficulty is hard
            if (!isQuitBtn) {
                const isActive = btnConfig.button === GameState.currentDifficulty;
                btn.setEnabled(!isActive); // disable if active (clicked)
            }

            // Set high depth so when cleaning up rooms, the button textures are not removed (42 oc)
            btn.setDepth(42);

            // add button to buttons object
            this.buttons[btnConfig.button] = btn;
        });
    }

    quitWorld() {
        console.log('Quitting world...');

        // Cleanup tracked objects
        if (this.cleanupObjects) {
            this.cleanupObjects.forEach(obj => obj?.destroy?.());
            this.cleanupObjects = [];
        }

        // Optional: clean UI references
        this.buttons = {};

        this.scene.cleanupObjects = [];
        this.layer = null;
        this.map = null;
        this.tilemap = null;
        this.keyTile = null;
        this.pressedKeyTile = null;
        this.staticOpenDoor = null;
        this.cagedAstro = null;
        this.tupacRevealed = null;
        this.endDialogue = null;

        // Reset game state
        GameState.currentWorldKey = null;
        GameState.currentRoomIndex = 0;
        GameState.setKeyCollected(false);
        GameState.currentDifficulty = 'hard';

        this.scene.start('Start_Scene');
        this.scene.stop(this.scene.key);
    }

    // Honestly, I know this sets the GameState Difficulty and updates button textures...
    // But unclear on how. fucking chatGPT
    updateDifficultyUiButtons() {
        ['easy', 'hard'].forEach(key => {
            const btn = this.buttons[key];
            if (btn) {
                const active = key === GameState.currentDifficulty;
                btn.setEnabled(!active);
            }
        });
    }


    handleDoorTransition(tileX, tileY) {
        if (GameState.keyCollected) {
            this.roomManager.goToNextRoom();
        }
    }

    triggerWallAt(tileX, tileY) {
        if (!this.walls) return;

        this.walls.forEach(wall => {
            const wallTileX = Math.round((wall.x - 32) / 64);
            const wallTileY = Math.round((wall.y - 32) / 64);

            if (wallTileX === tileX && wallTileY === tileY && !wall.isTriggered) {
                wall.triggerWall();
            }
        });
    }

    update() {
        // Update player if it exists
        if (this.player) {
            this.player.update();
        }
    }
}
