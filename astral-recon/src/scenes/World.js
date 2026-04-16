// src/scenes/World.js
import GameState from '../managers/GameState.js';
import RoomManager from '../managers/RoomManager.js';
import GameButton from '../gameobjects/GameButton.js';
// import { Wall } from '../gameobjects/Wall.js';


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

        // Timer — starts now, sits in the bottom-left next to the quit button row
        this.timerRunning = true;
        this.timerStartTime = this.time.now;
        const quitBtn = this.config.uiButtons.find(b => b.button === 'quit');
        const timerY = quitBtn ? quitBtn.pos_Y : 548;
        this.timerText = this.add.text(8, timerY, '00:00', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setDepth(42).setOrigin(0, 0.5);
    }

    stopTimer() {
        if (!this.timerRunning) return;
        this.timerRunning = false;
        this.timerFinalMs = this.time.now - this.timerStartTime;
        if (this.timerText) this.timerText.setText(this._formatTime(this.timerFinalMs));
    }

    // Called when end sequence starts — makes the frozen time prominent on the end-level screen
    highlightTimer() {
        if (!this.timerText) return;
        this.timerText.setText('Time  ' + this._formatTime(this.timerFinalMs ?? 0));
        this.timerText.setFontSize('18px');
        this.timerText.setColor('#FFD700');
        this.timerText.setDepth(90);
    }

    showMissionCompleteCard(onDone) {
        const elapsed = this.timerFinalMs ?? 0;
        const [gold, silver] = this.config.starThresholds ?? [60_000, 150_000];
        const stars = elapsed <= gold ? 3 : elapsed <= silver ? 2 : 1;

        const cx = 288, cy = 252;
        const objs = [];

        const add = (fn, ...args) => { const o = fn.call(this.add, ...args); objs.push(o); return o; };

        add(this.add.rectangle, cx, cy, 300, 170, 0x000000, 0.88).setDepth(100).setOrigin(0.5);
        add(this.add.rectangle, cx, cy, 300, 170).setDepth(100).setOrigin(0.5).setStrokeStyle(2, 0xffd700, 1).setFillStyle();

        add(this.add.text, cx, cy - 58, 'MISSION COMPLETE', {
            fontFamily: 'monospace', fontSize: '15px', color: '#FFD700',
            stroke: '#000000', strokeThickness: 3
        }).setDepth(101).setOrigin(0.5);

        add(this.add.text, cx, cy - 12, '★'.repeat(stars) + '☆'.repeat(3 - stars), {
            fontFamily: 'monospace', fontSize: '30px', color: '#FFD700',
            stroke: '#000000', strokeThickness: 3
        }).setDepth(101).setOrigin(0.5);

        add(this.add.text, cx, cy + 42, this._formatTime(elapsed), {
            fontFamily: 'monospace', fontSize: '22px', color: '#ffffff',
            stroke: '#000000', strokeThickness: 3
        }).setDepth(101).setOrigin(0.5);

        objs.forEach(o => o.setAlpha(0));
        this.tweens.add({
            targets: objs, alpha: 1, duration: 500, ease: 'Power2',
            onComplete: () => this.time.delayedCall(2500, onDone)
        });
    }

    _formatTime(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
        const secs = (totalSecs % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // Function to create the UI buttons (again, only once)
    createUiButtons() {

        // Create UI buttons iterating over the list from World_ui_config
        this.config.uiButtons.forEach(btnConfig => {

            // Use action map to access and set corresponding difficulty functions from GameState.js
            const actionMap = {
                /*
                setEasy: () => {
                    GameState.setDifficulty('easy');
                    this.updateDifficultyUiButtons();
                },
                setHard: () => {
                    GameState.setDifficulty('hard');
                    this.updateDifficultyUiButtons();
                },
                */
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
        this.timerRunning = false;
        if (this.timerText) { this.timerText.destroy(); this.timerText = null; }

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


    /*
    handleDoorTransition(tileX, tileY) {
        if (GameState.keyCollected) {
            this.roomManager.goToNextRoom();
        }
    }
    */

    handleDoorTransition(tileX, tileY) {
        // Check if this is an entry door (12 or 13)
        const tile = this.map?.getTileAt(tileX, tileY);
        
        if (tile && (tile.index === 12 || tile.index === 13)) {
            // Entry door — go back to previous room
            this.handleBackwardDoorTransition(tileX, tileY);
            return;
        }

        // Exit door — go forward to next room (original logic)
        if (GameState.keyCollected) {
            this.roomManager.goToNextRoom();
        }
    }

    /* OLD FUNCTION TO TRIGGER WALLS AND PLACE STATIC SPRITE ON MAP (INTITAL EASY MODE)
    
    triggerWallAt(tileX, tileY) {
        if (!this.walls) return;

        this.walls.forEach(wall => {
            const wallTileX = Math.round((wall.x - 32) / 64);
            const wallTileY = Math.round((wall.y - 32) / 64);

            if (wallTileX === tileX && wallTileY === tileY) {
                wall.triggerWall();
            }
        });
    }

    */

    triggerWallAt(tileX, tileY) {
        const wallAssetKey = this.config.wallAnimationKey;
        const worldX = tileX * 64 + 32;
        const worldY = tileY * 64 + 32;

        // Create temporary sprite for animation
        const tempWall = this.add.sprite(worldX, worldY, wallAssetKey).setDepth(3);

        // Create animation if it doesn't exist
        if (!this.anims.exists(wallAssetKey)) {
            this.anims.create({
                key: wallAssetKey,
                frames: this.anims.generateFrameNames(wallAssetKey, {
                    prefix: 'wall_animation_',
                    start: 0,
                    end: 11,
                    zeroPad: 4
                }),
                repeat: 0,
                frameRate: 8,
            });
        }

        // Play animation and destroy when done
        tempWall.play(wallAssetKey);
        this.time.delayedCall(
            (12 / 8) * 1000, // duration based on frame count / frameRate
            () => tempWall.destroy()
        );
    }

    update() {
        if (this.player) {
            this.player.update();
        }
        if (this.timerRunning && this.timerText) {
            this.timerText.setText(this._formatTime(this.time.now - this.timerStartTime));
        }
    }
}
