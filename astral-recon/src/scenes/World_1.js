import { Scene } from "phaser";
import { KeyTile }  from "../gameobjects/KeyTile.js";
import { Player } from "../gameobjects/Player.js";
import { Wall } from "../gameobjects/Wall.js";


// general specs. I want to import this from config.js
const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;
const TILEDIMENSION = 64;

var cheatmode = false;

// map reference constants
const TILE_HIDDEN_DOOR = 16;
const TILE_OPEN_DOOR_LEFT = 0;
const TILE_OPEN_DOOR_LEFT_BLOCKED = 21;
const TILE_OPEN_DOOR_BOTTOM_BLOCKED = 22;
const TILE_HIDDEN_DOOR_UP = 17;
const TILE_OPEN_DOOR_UP = 14;
const TILE_NORMAL_FLOOR = 2;
const TILE_DEATH = 3;
const TILE_WALL_UP = 6;
const TILE_WALL_DOWN = 11;
const TILE_WALL_LEFT = 9;
const TILE_WALL_RIGHT = 13;
const TILE_WALL_FIXED = 20;
const TUPAC_SHOW = 19;

const KEY_POSITION_ROOM_1_X = 2;
const KEY_POSITION_ROOM_1_Y = 2;
const KEY_POSITION_ROOM_2_X = 7;
const KEY_POSITION_ROOM_2_Y = 2;
const KEY_POSITION_ROOM_3_X = 2;
const KEY_POSITION_ROOM_3_Y = 3;

const PLAYER_POSITION_ROOM_1_X = 1;
const PLAYER_POSITION_ROOM_1_Y = 1;
const PLAYER_POSITION_ROOM_2_X = 8;
const PLAYER_POSITION_ROOM_2_Y = 4;
const PLAYER_POSITION_ROOM_3_X = 1;
const PLAYER_POSITION_ROOM_3_Y = 1;

export class World_1 extends Scene {

    constructor() {
        super("World_1");
    }

    init(params) {

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.mode = params.mode || 'hard';
        this.room = params.room || 'world_1_room_1';
        this.complete = params.complete || false;
        this.key_tile_x = params.key_tile_x || TILEDIMENSION * KEY_POSITION_ROOM_1_X + TILEDIMENSION / 2;
        this.key_tile_y = params.key_tile_y || TILEDIMENSION * KEY_POSITION_ROOM_1_Y + TILEDIMENSION / 2;
        this.player_x = params.player_x || TILEDIMENSION * PLAYER_POSITION_ROOM_1_X + TILEDIMENSION / 2;
        this.player_y = params.player_y || TILEDIMENSION * PLAYER_POSITION_ROOM_1_Y + TILEDIMENSION / 2;
        this.hasKey = params.hasKey || false;
    }

    create() {

        var map = this.make.tilemap({ key: this.room, tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('world_1_tileset_64', null, TILEDIMENSION, TILEDIMENSION, 0, 0);       
        var layer = map.createLayer('layer', tileset, 0, 0);
        
        this.tilemap = map;

        this.walls = [];
        
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                if (tile && tile.index === TILE_DEATH) {
                    const wall = new Wall(
                        this,
                        x * TILEDIMENSION + TILEDIMENSION / 2,
                        y * TILEDIMENSION + TILEDIMENSION / 2,
                        'world_1_wall_animation'
                    );
                    this.walls.push(wall);
                }
            }
        }

        const levelBtn = this.add.text(56, 56, 'Next Level', {fontSize: '14px', color: 'black'})
                            .setInteractive({ useHandCursor: true })
                            .on('pointerdown', () => {
                
                                if (this.room === 'world_1_room_1') {

                                    console.log("Starting room 2");
                                    this.scene.restart({

                                        room: 'world_1_room_2',
                                        key_tile_x: TILEDIMENSION * KEY_POSITION_ROOM_2_X + TILEDIMENSION / 2,
                                        key_tile_y: TILEDIMENSION * KEY_POSITION_ROOM_2_Y + TILEDIMENSION / 2,
                                        player_x: TILEDIMENSION * PLAYER_POSITION_ROOM_2_X + TILEDIMENSION / 2,
                                        player_y: TILEDIMENSION * PLAYER_POSITION_ROOM_2_Y + TILEDIMENSION / 2,

                                    });
                                } else if (this.room === 'world_1_room_2') {

                                    console.log("starting room 3");
                                    this.scene.restart({

                                        room: 'world_1_room_3',
                                        key_tile_x: TILEDIMENSION * KEY_POSITION_ROOM_3_X + TILEDIMENSION / 2,
                                        key_tile_y: TILEDIMENSION * KEY_POSITION_ROOM_3_Y + TILEDIMENSION / 2,
                                        player_x: TILEDIMENSION * PLAYER_POSITION_ROOM_3_X + TILEDIMENSION / 2,
                                        player_y: TILEDIMENSION * PLAYER_POSITION_ROOM_3_Y + TILEDIMENSION / 2,

                                    });
                                }
                            }); 

        if (!this.hasKey) {
            this.key_tile = new KeyTile(
                this,
                this.key_tile_x,
                this.key_tile_y,
                'world_1_key_animation',
            );
            this.key_tile.playAnimation();
            this.physics.add.existing(this.key_tile);
            this.key_tile.body.setSize(48, 48);
        }

        this.createDoorSprites();

        this.player = new Player(
            this,
            this.player_x,
            this.player_y,
            'player_animation'
        );
        
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.player.body.setCollideWorldBounds(true);
        
        if (!this.hasKey && this.key_tile) {
            this.physics.add.overlap(this.player, this.key_tile, this.collectKey, null, this);
        }
        
    }

    createDoorSprites() {
        this.doorSprites = [];
        
        if (!this.tilemap) return;
        
        for (let x = 0; x < this.tilemap.width; x++) {
            for (let y = 0; y < this.tilemap.height; y++) {
                const tile = this.tilemap.getTileAt(x, y);
                if (tile && tile.index === 16) {
                    const doorSprite = this.add.sprite(
                        x * TILEDIMENSION + TILEDIMENSION / 2,
                        y * TILEDIMENSION + TILEDIMENSION / 2,
                        'world_1_door_left_animation',
                        'doorLeft_0000'
                    );
                    
                    doorSprite.setVisible(false);
                    
                    if (!this.anims.exists('door_open')) {
                        this.anims.create({
                            key: 'door_open',
                            frames: this.anims.generateFrameNames('world_1_door_left_animation', {
                                prefix: 'doorLeft',
                                end: 5,
                                eroPad: 4
                            }),
                            frameRate: 6,
                            repeat: 0
                        });
                    }
                    
                    this.doorSprites.push({
                        sprite: doorSprite,
                        tileX: x,
                        tileY: y
                    });
                }
            }
        }
    }

    collectKey() {
        if (this.key_tile) {
            this.key_tile.destroy();
            this.key_tile = null;
            this.hasKey = true;
            this.playDoorAnimations();
        }
    }

    playDoorAnimations() {
        if (!this.doorSprites) return;
        
        this.doorSprites.forEach(doorData => {
            doorData.sprite.setVisible(true);
            doorData.sprite.play('door_open');
            
            doorData.sprite.on('animationcomplete', () => {
                this.updateDoorTiles();
            });
        });
    }

    updateDoorTiles() {
        if (!this.tilemap) return;
        
        const layer = this.tilemap.getLayer('layer');
        if (!layer) return;
        
        for (let x = 0; x < this.tilemap.width; x++) {
            for (let y = 0; y < this.tilemap.height; y++) {
                const tile = this.tilemap.getTileAt(x, y);
                if (tile && tile.index === 16) {
                    let newTileIndex;
                    if (this.room === 'world_1_room_1') {
                        newTileIndex = 15;
                    } else if (this.room === 'world_1_room_2') {
                        newTileIndex = 22;
                    }
                    
                    if (newTileIndex) {
                        this.tilemap.putTileAt(newTileIndex, x, y);
                    }
                }
            }
        }
        
        if (this.doorSprites) {
            this.doorSprites.forEach(doorData => {
                doorData.sprite.setVisible(false);
            });
        }
    }

    handleDoorTransition(tileX, tileY) {
        if (!this.hasKey) return;
        
        if (this.room === 'world_1_room_1') {
            console.log("Starting room 2");
            this.scene.restart({
                room: 'world_1_room_2',
                key_tile_x: TILEDIMENSION * KEY_POSITION_ROOM_2_X + TILEDIMENSION / 2,
                key_tile_y: TILEDIMENSION * KEY_POSITION_ROOM_2_Y + TILEDIMENSION / 2,
                player_x: TILEDIMENSION * PLAYER_POSITION_ROOM_2_X + TILEDIMENSION / 2,
                player_y: TILEDIMENSION * PLAYER_POSITION_ROOM_2_Y + TILEDIMENSION / 2,
                hasKey: false
            });
        } else if (this.room === 'world_1_room_2') {
            console.log("starting room 3");
            this.scene.restart({
                room: 'world_1_room_3',
                key_tile_x: TILEDIMENSION * KEY_POSITION_ROOM_3_X + TILEDIMENSION / 2,
                key_tile_y: TILEDIMENSION * KEY_POSITION_ROOM_3_Y + TILEDIMENSION / 2,
                player_x: TILEDIMENSION * PLAYER_POSITION_ROOM_3_X + TILEDIMENSION / 2,
                player_y: TILEDIMENSION * PLAYER_POSITION_ROOM_3_Y + TILEDIMENSION / 2,
                hasKey: false
            });
        }
    }

    triggerWallAt(tileX, tileY) {
        this.walls.forEach(wall => {
            const wallTileX = Math.round((wall.x - TILEDIMENSION/2) / TILEDIMENSION);
            const wallTileY = Math.round((wall.y - TILEDIMENSION/2) / TILEDIMENSION);
            
            if (wallTileX === tileX && wallTileY === tileY && !wall.isTriggered) {
                wall.triggerWall();
            }
        });
    }
    
    update() {
        if (this.player) {
            this.player.update();
            
            const playerTilePos = this.player.getTilePosition();
            
        }
    }
}