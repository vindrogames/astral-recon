// src/scenes/World.js

import GameState from '../managers/GameState.js';
import GameButton from '../gameobjects/GameButton.js';
import KeyTile from '../gameobjects/KeyTile.js';
import Door from '../gameobjects/Door.js';

const uiButtons = [
    {
        button: 'hard',
        pos_X: 64 * 1.5 + 32,
        pos_Y: 576 - 28,
        textureOn: 'hard_on',
        textureOff: 'hard_off',
        action: 'setHard'
    },
    {
        button: 'easy',
        pos_X: 64 * 2.5 + 32,
        pos_Y: 576 - 28,
        textureOn: 'easy_on',
        textureOff: 'easy_off',
        action: 'setEasy'
    },
    {
        button: 'quit',
        pos_X: 64 * 4.5 + 160,
        pos_Y: 576 - 28,
        textureOn: 'quit_btn',
        textureOff: 'quit_btn_hover',
        action: 'quitWorld'
    }
]

export default class World extends Phaser.Scene {
    constructor() {
        super('World');

        this.currentDifficulty = 'hard';
        this.buttons = {};
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.config = data; // Comes from StartScene: World1Config or World2Config
        this.roomIndex = 1;
    }

    preload() {
        // Load room CSV, tilemaps, etc. dynamically if needed
        // If using Preloader.js to load all, skip this
        this.load.setPath(`assets/${this.config.key}/`);

        this.config.assetPaths.forEach(path => {

            try {

                if (path.type === 'image') {

                    this.load.image(path.loadedRef, path.imgPath);
                } else if (path.type === 'tilemapCSV') {

                    this.load.tilemapCSV(path.loadedRef, path.csvPath);
                } else if (path.type === 'atlas') {

                    this.load.atlas(path.animationRef, path.imgPath, path.jsonPath);
                }
            } catch (err) {

                console.log(err)
            }

        });

    }

    create() {
        // Keep track of current room's config
        this.loadRoom(this.roomIndex);

        uiButtons.forEach(btnConfig => {
            const isQuitBtn = btnConfig.button === 'quit';

            const btn = new GameButton(
                this,
                btnConfig.pos_X,
                btnConfig.pos_Y,
                btnConfig.textureOff,
                btnConfig.textureOn,
                () => this[btnConfig.action](btnConfig.button)
            );

            // For difficulty buttons, set enabled based on currentDifficulty
            if (!isQuitBtn) {
                const isActive = btnConfig.button === this.currentDifficulty;
                btn.setEnabled(!isActive); // disable if active (clicked)
            }

            this.buttons[btnConfig.button] = btn;
        });

        this.createSimulationButtons();
    }

    loadRoom(index) {
        const roomConfig = this.config.rooms[index];
        if (!roomConfig) {
            console.warn('No room at index', index);
            return;
        }

        this.currentRoom = roomConfig;

        // Create tilemap from CSV
        const map = this.make.tilemap({ key: roomConfig.csv, tileWidth: 64, tileHeight: 64 });
        const tileset = map.addTilesetImage(this.config.tilesetImage);
        const layer = map.createLayer(0, tileset, 0, 0);

        // Store map and layer for potential later use
        this.map = map;
        this.layer = layer;

        // 🔐 Close entry door (reversed animation)
        if (roomConfig.entryDoor) {
            const { x, y, atlasKey, animKey, prefix } = roomConfig.entryDoor;
            new Door(this, x, y, atlasKey, animKey, prefix, true); // true = reversed
        }


        this.keyTile = new KeyTile(this, roomConfig.keyTile.x, roomConfig.keyTile.y, roomConfig.keyTile.animation);

        // Play animation if defined
        if (roomConfig.keyTile.animation) {
            console.log('playing keyTile animation')
            this.keyTile.play(roomConfig.keyTile.animation);
        }

        // // Instantiate classes
        // const PlayerClass = this.getClass(this.config.playerClass);
        // this.player = new PlayerClass(this, roomConfig.playerStart.x, roomConfig.playerStart.y);



        // const DoorClass = this.getClass(this.config.doorClass);
        // this.door = new DoorClass(this, roomConfig.door.x, roomConfig.door.y);
        // if (roomConfig.door.closedFrame !== undefined) {
        //     this.door.setFrame(roomConfig.door.closedFrame);
        // }

        // this.physics.add.collider(this.player, this.keyTile, () => this.onKeyTileCollision());
        // this.physics.add.collider(this.player, this.door, () => this.onDoorCollision());

        // this.cameras.main.startFollow(this.player);
    }

    // onKeyTileCollision() {
    //     const door = this.door;
    //     this.keyTile.destroy();

    //     if (this.currentRoom.door.openAnim) {
    //         door.play(this.currentRoom.door.openAnim);
    //     }

    //     // Change tile frame if needed
    //     if (this.currentRoom.door.openFrame !== undefined) {
    //         door.setFrame(this.currentRoom.door.openFrame);
    //     }
    // }

    // onDoorCollision() {
    //     // Optional: check if door is open
    //     if (!this.keyTile.active) {
    //         this.transitionToNextRoom();
    //     }
    // }

    // transitionToNextRoom() {
    //     this.clearCurrentRoom();
    //     this.roomIndex++;
    //     this.loadRoom(this.roomIndex);
    // }

    // clearCurrentRoom() {
    //     this.player?.destroy();
    //     this.keyTile?.destroy();
    //     this.door?.destroy();
    //     this.layer?.destroy();
    // }

    setEasy() {
        this.setDifficulty('easy');
    }

    setHard() {
        this.setDifficulty('hard');
    }

    setDifficulty(newDifficulty) {
        if (this.currentDifficulty === newDifficulty) return;

        this.currentDifficulty = newDifficulty;

        ['easy', 'hard'].forEach(key => {
            const btn = this.buttons[key];
            const config = uiButtons.find(b => b.button === key);
            const active = key === newDifficulty;
            btn.setEnabled(!active);
            // Optionally update texture explicitly, but GameButton#setEnabled handles it
        });

        console.log(`Difficulty set to ${newDifficulty}`);
        // Add additional game logic for difficulty change here
    }

    quitWorld() {
        console.log('quitting world');
        this.scene.start('StartScene', { tupac: false });
        this.scene.stop(this.scene.key);
    }

    createSimulationButtons() {
        const btnStyle = { fontSize: '18px', fill: '#fff', backgroundColor: '#000', padding: 10 };

        this.simBtn = this.add.text(21, 14, '🗝 Simulate Key', btnStyle)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.keyTile?.onPressed) this.keyTile.onPressed();
            });

        this.nextBtn = this.add.text(400, 14, '➡️ Next Room', btnStyle)
            .setInteractive()
            .on('pointerdown', () => {
                this.roomManager.switchToRoom('world_1_room_2');
            });
    }
}
