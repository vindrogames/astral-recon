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

        // Creates simulation buttons for keyTile logic, door animations and switching rooms
        // *TO BE DELETED*
        if (!this.simBtn || !this.nextBtn) {
            this.createSimulationButtons();
        }

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
        this.simBtn = null;
        this.nextBtn = null;
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

    // This will be deleted, *HOWEVER*
    createSimulationButtons() {
        const btnStyle = { fontSize: '18px', fill: '#fff', backgroundColor: '#000', padding: 10 };

        // RoomManager has a checkKeyCollision Methos wich takes player pos_x and player pos_y
        // As of now, I celebrate keyTileCollision regardless of coorinates
        this.simBtn = this.add.text(21, 14, '🗝 Simulate Key', btnStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.roomManager.checkKeyTileCollision(6, 6);
            });

        this.simBtn.setDepth(42);

        // Room Manager handles changing rooms. So use this when machango leaves a door (if possible)
        // Player can go back in world_2 (as an error), but not in world 1
        this.nextBtn = this.add.text(400, 14, '➡️ Next Room', btnStyle)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (GameState.keyCollected) {
                    this.roomManager.goToNextRoom();
                } else {
                    console.log('collect key first');
                }

            });

        this.nextBtn.setDepth(42);
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
