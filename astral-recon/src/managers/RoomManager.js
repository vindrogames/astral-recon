// src/managers/RoomManager.js
import GameState from './GameState.js';
import KeyTile from '../gameobjects/Key_tile.js';
import Door from '../gameobjects/Door.js';

export default class RoomManager {

    constructor(scene, worldConfig) {

        // Phaser.Scene (World)
        this.scene = scene;
        // World config passed from World.js
        this.config = worldConfig;
    }

    loadCurrentRoom() {
        // Gets room index and roomConfig with all information needed for room
        const roomIndex = GameState.getCurrentRoomIndex();
        const roomConfig = this.config.rooms[roomIndex];

        if (!roomConfig) {
            console.warn(`No room config at index ${roomIndex}`);
            return;
        }

        // cleans up any objects from previous room
        this.cleanupPreviousRoom();
        this.roomConfig = roomConfig;

        // Load tilemap with RoomManager Method
        this.loadTileMap(this.roomConfig);

        // Handle any room entry animations (closing doors for world 1 and caged astro animations for rooms 3 in all worlds)
        this.handleRoomEntryAnimations(this.roomConfig);

        // Creeate and manage room keyTile
        this.setupKeyTile(this.roomConfig);
    }

    loadTileMap(roomConfig) {

        const map = this.scene.make.tilemap({
            key: roomConfig.csv,
            tileWidth: 64,
            tileHeight: 64
        });
        const tileset = map.addTilesetImage(this.config.tilesetImage);
        const layer = map.createLayer(0, tileset, 0, 0).setDepth(0);

        // declare map and layer for scene and push to objects to cleanUp
        this.scene.map = map;
        this.scene.layer = layer;
        this.scene.cleanupObjects.push(map, layer);
    }

    setupKeyTile(roomConfig) {
        if (!roomConfig.keyTile) return;

        const keyTile = new KeyTile(this.scene, roomConfig.keyTile);
        this.scene.keyTile = keyTile;
        this.scene.cleanupObjects.push(keyTile);
        keyTile.playAnimation?.();
    }

    handleRoomEntryAnimations(roomConfig) {
        // Optional closed door placeholder for exit door
        if (roomConfig.exitDoorAnimation?.closedDoorPlaceholder) {
            const cfg = roomConfig.exitDoorAnimation;
            this.scene.closedDoorPlaceholder = this.scene.add.image(cfg.pos_X, cfg.pos_Y, cfg.closedDoorPlaceholder).setDepth(42);
            this.scene.cleanupObjects.push(this.scene.closedDoorPlaceholder);
        }

        // Optional entry door animation (reversed)
        if (roomConfig.entryDoorAnimation) {
            this.triggerDoorAnimation(this.roomConfig.entryDoorAnimation, 'entry');
        }

        // Optional entry Astro caged animation
        if (roomConfig.entryAstroCaged) {
            this.spawnAstroCaged(roomConfig.entryAstroCaged);
        }
    }

    cleanupPreviousRoom() {
        console.log(this.scene.cleanupObjects);

        this.scene.cleanupObjects.forEach(obj => {
            obj.destroy()
        });

        this.scene.cleanupObjects = [];
        this.scene.layer = null;
        this.scene.map = null;
        this.scene.keyTile = null;
        this.scene.pressedKeyTile = null;
        this.scene.staticOpenDoor = null;
        this.scene.cagedAstro = null;
    }

    checkKeyTileCollision(playerX, playerY) {
        const tile = this.scene.map.getTileAtWorldXY(playerX, playerY);

        // 1 is key tile placeholder index in csv map
        if (tile?.index === 1 && this.scene.keyTile && !GameState.keyCollected) {
            this.pressKeyTile(); // Delegate to KeyTile
        }

        this.pressKeyTile();
        console.log(GameState.currentRoomIndex);

        // This if statement should go in collision IF when player is added
        if (GameState.currentRoomIndex === 0 || GameState.currentRoomIndex === 1) {

            console.log(this.roomConfig.exitDoorAnimation);
            this.triggerDoorAnimation(this.roomConfig.exitDoorAnimation, 'exit');
        } else {
            console.log('last room');
            this.endWorldSequence();
        }
    }

    pressKeyTile() {
        console.log('Key tile collected!');
        GameState.setKeyCollected(true);

        if (this.scene.pressedKeyTile) {
            this.scene.pressedKeyTile.destroy();
        }

        const cfg = this.roomConfig.keyTile;

        this.scene.pressedKeyTile = this.scene.add.image(
            cfg.pos_X,
            cfg.pos_Y,
            cfg.pressedKey ?? 0
        ).setDepth(42);

        this.scene.cleanupObjects.push(this.scene.pressedKeyTile);

        if (this.scene.keyTile) {
            this.scene.keyTile.destroy();
            this.scene.keyTile = null;
        }
    }

    triggerDoorAnimation(cfg, type = 'exit') {
        // Reverse is true when type is 'entry'
        const reverse = type === 'entry';

        console.log(cfg);
        // For exit doors: destroy the wall blocking the exit
        if (type === 'exit' && this.scene.closedDoorPlaceholder) {
            this.scene.closedDoorPlaceholder.destroy();
            this.scene.closedDoorPlaceholder = null;
        }

        const door = new Door(this.scene, cfg, reverse);
        this.scene.cleanupObjects.push(door);

        door.playOpenAnimation(() => {
            if (type === 'exit' && cfg.staticOpenDoor) {
                const openDoor = this.scene.add.image(door.x, door.y, cfg.staticOpenDoor).setDepth(42);
                this.scene.cleanupObjects.push(openDoor);
            }

            if (type === 'entry' && this.scene.staticOpenDoor) {
                this.scene.staticOpenDoor.destroy();
                this.scene.staticOpenDoor = null;
            }

            door.destroy();
        });
    }

    goToNextRoom() {
        GameState.nextRoom();
        this.loadCurrentRoom();
    }

    // Don't use this at the moment, and not clear we will, perhaps in world_2
    reloadRoom() {
        this.loadCurrentRoom();
    }

    spawnAstroCaged(config) {
        if (!this.scene.anims.exists(config.animationKey)) {
            this.scene.anims.create({
                key: config.animationKey,
                frames: this.scene.anims.generateFrameNames(config.atlasKey, {
                    prefix: config.prefix,
                    start: config.start,
                    end: config.end,
                    zeroPad: config.zeroPad
                }),
                frameRate: config.frameRate,
                repeat: -config.repeat
            });
        }

        this.spawnedAstroCaged = this.scene.add.sprite(config.pos_X, config.pos_Y, config.animationKey).setDepth(1);
        this.scene.cleanupObjects.push(this.spawnedAstroCaged);
        this.spawnedAstroCaged.play(config.animationKey);
    }

    endWorldSequence() {
        GameState.markWorldComplete(GameState.currentWorldKey);
        console.log(GameState.completedWorlds);

        const astroRevealCnfg = this.roomConfig.astroReveal;
        if (!this.scene.anims.exists(astroRevealCnfg.animationKey)) {
            this.scene.anims.create({
                key: astroRevealCnfg.animationKey,
                frames: this.scene.anims.generateFrameNames(astroRevealCnfg.atlasKey, {
                    prefix: astroRevealCnfg.prefix,  // <-- adjust this prefix to match your JSON keys
                    start: astroRevealCnfg.start,
                    end: astroRevealCnfg.end,
                    zeroPad: astroRevealCnfg.zeroPad
                }),
                frameRate: astroRevealCnfg.frameRate,
                repeat: astroRevealCnfg.repeat
            });
        }

        // Adds sprite animation to Start Screen and plays Sprite
        this.tupaceRevealed = this.scene.add.sprite(
            astroRevealCnfg.pos_X,
            astroRevealCnfg.pos_Y,
            astroRevealCnfg.animationKey
        ).setDepth(1);

        this.scene.cleanupObjects.push(this.tupaceRevealed);
        this.tupaceRevealed.play(astroRevealCnfg.animationKey);
        this.scene.cleanupObjects.push(this.tupacCaged);
        this.tupacCaged.destroy();


        this.tupaceRevealed.on('animationcomplete', () => {

            const endDialogueCnfg = this.roomConfig.endDialogue;
            if (!this.scene.anims.exists(endDialogueCnfg.animationKey)) {
                this.scene.anims.create({
                    key: endDialogueCnfg.animationKey,
                    frames: this.scene.anims.generateFrameNames(endDialogueCnfg.atlasKey, {
                        prefix: endDialogueCnfg.prefix,  // <-- adjust this prefix to match your JSON keys
                        start: endDialogueCnfg.start,
                        end: endDialogueCnfg.end,
                        zeroPad: endDialogueCnfg.zeroPad
                    }),
                    duration: endDialogueCnfg.duration,
                    repeat: endDialogueCnfg.repeat
                });
            }

            // Adds sprite animation to Start Screen and plays Sprite
            this.endDialogue = this.scene.add.sprite(
                endDialogueCnfg.pos_X,
                endDialogueCnfg.pos_Y,
                endDialogueCnfg.animationKey
            ).setDepth(84);

            this.scene.cleanupObjects.push(this.endDialogue);
            this.endDialogue.play(endDialogueCnfg.animationKey);

            this.endDialogue.on('animationcomplete', () => {
                this.scene.cameras.main.fadeOut(1000, 0, 0, 0);

                this.endDialogue.destroy();
                this.tupaceRevealed.destroy()
                this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.quitWorld(); // or delegate to RoomManager if needed
                });
            });
        });
    }
}

