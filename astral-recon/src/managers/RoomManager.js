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

        // 1. Load tilemap
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

        // Conditionals to play roomEntry animations (doors only valid for world 1, caged Astro fro both)
        // Revisit when moving on to world_2
        if (roomIndex === 1) {

            this.scene.closeDoorAnimation = new Door(this.scene, roomConfig.entryDoorAnimation, true);
            this.scene.cleanupObjects.push(this.scene.closeDoorAnimation);
        } else if (roomIndex === 2) {

            // Creates and adds sprite animation for astro caged.
            // No class for this as it only happens once per world
            if (!this.scene.anims.exists(roomConfig.entryAstroCaged.animationKey)) {
                this.scene.anims.create({
                    key: roomConfig.entryAstroCaged.animationKey,
                    frames: this.scene.anims.generateFrameNames(roomConfig.entryAstroCaged.atlasKey, {
                        prefix: roomConfig.entryAstroCaged.prefix,  // <-- adjust this prefix to match your JSON keys
                        start: roomConfig.entryAstroCaged.start,
                        end: roomConfig.entryAstroCaged.end,
                        zeroPad: roomConfig.entryAstroCaged.zeroPad
                    }),
                    frameRate: roomConfig.entryAstroCaged.frameRate,
                    repeat: -roomConfig.entryAstroCaged.repeat
                });
            }

            // Adds sprite animation to Start Screen and plays Sprite
            this.tupacCaged = this.scene.add.sprite(
                roomConfig.entryAstroCaged.pos_X,
                roomConfig.entryAstroCaged.pos_Y,
                roomConfig.entryAstroCaged.animationKey
            ).setDepth(1);

            this.scene.cleanupObjects.push(this.tupacCaged);
            this.tupacCaged.play(roomConfig.entryAstroCaged.animationKey);

            // Creates Door Animation for room 3 door close on entry, adds sprite to object cleanup
            this.scene.closeDoorAnimation = new Door(this.scene, roomConfig.entryDoorAnimation, true);
            this.scene.cleanupObjects.push(this.scene.closeDoorAnimation);
        }

        // 3. Key tile setup
        if (roomConfig.keyTile) {
            this.scene.keyTile = new KeyTile(this.scene, roomConfig.keyTile);
            this.scene.cleanupObjects.push(this.scene.keyTile);
            this.scene.keyTile.playAnimation?.();
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
            this.scene.keyTile.onPressed(); // Delegate to KeyTile
        }

        this.scene.keyTile.onPressed();
        console.log(GameState.currentRoomIndex);

        // This if statement should go in collision IF when player is added
        if (GameState.currentRoomIndex === 0 || GameState.currentRoomIndex === 1) {

            console.log(GameState.currentRoomIndex);
            this.scene.openDoorAnimation = new Door(this.scene, this.roomConfig.exitDoorAnimation, false);
            this.scene.cleanupObjects.push(this.scene.openDoorAnimation);
        } else {
            console.log('last room');
            this.endWorldSequence();
        }

    }

    goToNextRoom() {
        GameState.nextRoom();
        this.loadCurrentRoom();
    }

    reloadRoom() {
        this.loadCurrentRoom();
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

