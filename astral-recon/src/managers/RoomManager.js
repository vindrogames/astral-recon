// src/managers/RoomManager.js
import GameState from './GameState.js';
import KeyTile from '../gameobjects/Key_tile.js';
import Door from '../gameobjects/Door.js';
import { Player } from '../gameobjects/Player.js';
import { Wall } from '../gameobjects/Wall.js';

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

        // Create and spawn player
        this.spawnPlayer(this.roomConfig);

        // Create wall sprites for death tiles (index 2)
        this.createWalls();
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
        this.scene.tilemap = map; // Player class expects tilemap property
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

    spawnPlayer(roomConfig) {
        if (!roomConfig.playerStart) return;

        // Destroy existing player if it exists
        if (this.scene.player) {
            this.scene.player.destroy();
        }

        // Create new player at the specified start position
        // Use player asset loaded in main Preloader
        this.scene.player = new Player(
            this.scene,
            roomConfig.playerStart.x,
            roomConfig.playerStart.y,
            'player_animation'
        );

        // Convert pixel coordinates to tile coordinates and center player properly
        const tileX = Math.floor(roomConfig.playerStart.x / 64);
        const tileY = Math.floor(roomConfig.playerStart.y / 64);
        this.scene.player.setTilePosition(tileX, tileY);

        this.scene.cleanupObjects.push(this.scene.player);
    }

    createWalls() {
        this.scene.walls = [];

        if (!this.scene.map) return;

        const wallAssetKey = this.config.wallAnimationKey;

        for (let y = 0; y < this.scene.map.height; y++) {
            for (let x = 0; x < this.scene.map.width; x++) {
                const tile = this.scene.map.getTileAt(x, y);
                if (tile && tile.index === 2) {
                    const wall = new Wall(this.scene, x * 64 + 32, y * 64 + 32, wallAssetKey);
                    this.scene.walls.push(wall);
                    this.scene.cleanupObjects.push(wall);
                }
            }
        }
    }

    handleRoomEntryAnimations(roomConfig) {
        // Optional closed door placeholder for exit door (world_2)
        // Adds placeholder to be destroyed when exit door animation runs, then added to cleanup
        if (roomConfig.exitDoorAnimation?.closedDoorPlaceholder) {
            const cfg = roomConfig.exitDoorAnimation;
            this.scene.closedDoorPlaceholder = this.scene.add.image(cfg.pos_X, cfg.pos_Y, cfg.closedDoorPlaceholder).setDepth(2);
            this.scene.cleanupObjects.push(this.scene.closedDoorPlaceholder);
        }

        // Optional entry door animation (reversed) only in world 1
        if (roomConfig.entryDoorAnimation) {
            this.triggerDoorAnimation(this.roomConfig.entryDoorAnimation, 'entry');
        }

        // Optional entry Astro caged animation only for rooms 3
        if (roomConfig.entryAstroCaged) {
            this.spawnAstroCaged(roomConfig.entryAstroCaged);
        }
    }

    cleanupPreviousRoom() {
        console.log(this.scene.cleanupObjects);

        this.scene.cleanupObjects.forEach(obj => {
            obj.destroy()
        });

        // eliminates any residue
        this.scene.cleanupObjects = [];
        this.scene.layer = null;
        this.scene.map = null;
        this.scene.tilemap = null;
        this.scene.keyTile = null;
        this.scene.pressedKeyTile = null;
        this.scene.staticOpenDoor = null;
        this.scene.closedDoorPlaceholder = null;
        this.scene.cagedAstro = null;
        this.scene.player = null;
        this.scene.walls = [];
    }

    checkKeyTileCollision(playerX, playerY) {
        if (GameState.keyCollected || !this.scene.keyTile) return;

        const tile = this.scene.map.getTileAtWorldXY(playerX, playerY);
        if (tile?.index !== 1) return;

        this.pressKeyTile();

        const lastRoomIndex = this.config.rooms.length - 1;
        if (GameState.currentRoomIndex < lastRoomIndex) {
            this.triggerDoorAnimation(this.roomConfig.exitDoorAnimation, 'exit');
        } else {
            this.endWorldSequence();
        }
    }

    pressKeyTile() {
        console.log('Key tile collected!');
        // Sets GAmeState key collected for protection when exiting room
        GameState.setKeyCollected(true);

        const cfg = this.roomConfig.keyTile;

        // Adds pressed keyTile image on top of floor tile placeholder
        this.scene.pressedKeyTile = this.scene.add.image(
            cfg.pos_X,
            cfg.pos_Y,
            cfg.pressedKey ?? 0
        ).setDepth(2);

        // pushes pressedKeyTile to be destroyed on cleanup when changinng rooms
        this.scene.cleanupObjects.push(this.scene.pressedKeyTile);

        // Destroys keyTile animation
        if (this.scene.keyTile) {
            this.scene.keyTile.destroy();
            this.scene.keyTile = null;
        }
    }

    triggerDoorAnimation(cfg, type = 'exit') {
        const reverse = type === 'entry';

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

            // Update the tilemap tile so the player can walk through the door
            if (type === 'exit' && cfg.openTileIndex !== undefined && this.scene.map) {
                const tileX = Math.floor(cfg.pos_X / 64);
                const tileY = Math.floor(cfg.pos_Y / 64);
                this.scene.map.putTileAt(cfg.openTileIndex, tileX, tileY);
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
                repeat: config.repeat
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
        this.astroRevealed = this.scene.add.sprite(
            astroRevealCnfg.pos_X,
            astroRevealCnfg.pos_Y,
            astroRevealCnfg.animationKey
        ).setDepth(1);

        this.scene.cleanupObjects.push(this.astroRevealed);
        this.astroRevealed.play(astroRevealCnfg.animationKey);
        this.scene.cleanupObjects.push(this.astroRevealed);
        this.spawnedAstroCaged.destroy();


        this.astroRevealed.on('animationcomplete', () => {

            if (this.roomConfig.endDialogue) {
                const endDialogueCnfg = this.roomConfig.endDialogue;
                if (!this.scene.anims.exists(endDialogueCnfg.animationKey)) {
                    this.scene.anims.create({
                        key: endDialogueCnfg.animationKey,
                        frames: this.scene.anims.generateFrameNames(endDialogueCnfg.atlasKey, {
                            prefix: endDialogueCnfg.prefix,
                            start: endDialogueCnfg.start,
                            end: endDialogueCnfg.end,
                            zeroPad: endDialogueCnfg.zeroPad
                        }),
                        duration: endDialogueCnfg.duration,
                        repeat: endDialogueCnfg.repeat
                    });
                }

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
                    this.astroRevealed.destroy();
                    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.quitWorld();
                    });
                });
            } else {
                // No end dialogue — fade out and return to start screen
                this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
                this.astroRevealed.destroy();
                this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.quitWorld();
                });
            }
        });
    }
}

