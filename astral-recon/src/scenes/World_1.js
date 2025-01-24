import { Scene } from "phaser";
import { KeyTile }  from "../gameobjects/KeyTile.js"


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

export class World_1 extends Scene {

    constructor() {
        super("World_1");
    }

    init(params) {

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.mode = params.mode || 'hard';
        this.room = params.room || 'world_1_room_1';
        this.complete = params.complete || false;
        this.key_tile_x = params.key_tile_x || TILEDIMENSION * 5 + TILEDIMENSION / 2;
        this.key_tile_y = params.key_tile_y || TILEDIMENSION * 5 + TILEDIMENSION / 2;
    }

    create() {

        var map = this.make.tilemap({ key: this.room, tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('world_1_tileset_64', null, TILEDIMENSION, TILEDIMENSION, 0, 0);       
        var layer = map.createLayer('layer', tileset, 0, 0);

        const levelBtn = this.add.text(56, 56, 'Next Level', {fontSize: '14px', color: 'black'})
                            .setInteractive({ useHandCursor: true })
                            .on('pointerdown', () => {
                
                                if (this.room === 'world_1_room_1') {

                                    console.log("Starting room 2");
                                    this.scene.restart({

                                        room: 'world_1_room_2',
                                        key_tile_x: TILEDIMENSION * 2 + TILEDIMENSION / 2,
                                        key_tile_y: TILEDIMENSION * 7 + TILEDIMENSION / 2,

                                    });
                                } else if (this.room === 'world_1_room_2') {

                                    console.log("starting room 3");
                                    this.scene.restart({

                                        room: 'world_1_room_3',
                                        key_tile_x: TILEDIMENSION * 5 + TILEDIMENSION / 2,
                                        key_tile_y: TILEDIMENSION * 2 + TILEDIMENSION / 2,

                                    });
                                }
                            }); 

        const HOME_BTN = this.add.image(64 * 4.5 + 128, 576 - 28, 'world_1_quit').setInteractive({ useHandCursor: true });

        HOME_BTN.on('pointerover', () => {

            HOME_BTN.setTexture('world_1_quit_hover');
        });

        HOME_BTN.on('pointerout', () => {

            HOME_BTN.setTexture('world_1_quit');
        });

        HOME_BTN.on('pointerdown', () => {

            this.scene.start('StartScene', { tupac: true} );
            this.scene.stop('World_1');
        });

        if (this.mode === 'hard') {

            console.log('Hard mode on');
            const HARD_MODE_BTN = this.add.image(64 * 1.5 + 32, 576 - 28, 'world_1_hard_on').setInteractive({ useHandCursor: false });
            const EASY_MODE_BTN = this.add.image(64 * 2.5 + 32, 576 - 28, 'world_1_easy_off').setInteractive({ useHandCursor: true });

            EASY_MODE_BTN.on('pointerover', () => {

                EASY_MODE_BTN.setTexture('world_1_easy_on');
            })

            EASY_MODE_BTN.on('pointerout', () => {

                EASY_MODE_BTN.setTexture('world_1_easy_off');
            });

            EASY_MODE_BTN.on('pointerdown', () => {

                this.scene.restart({mode: 'easy'});
            });
        } else if (this.mode === 'easy') {

            console.log('easy mode on');
            const HARD_MODE_BTN = this.add.image(64 * 1.5 + 32, 576 - 28, 'world_1_hard_off').setInteractive({ useHandCursor: true });
            const EASY_MODE_BTN = this.add.image(64 * 2.5 + 32, 576 - 28, 'world_1_easy_on').setInteractive({ useHandCursor: false });

            HARD_MODE_BTN.on('pointerover', () => {

                HARD_MODE_BTN.setTexture('world_1_hard_on');
            })

            HARD_MODE_BTN.on('pointerout', () => {

                HARD_MODE_BTN.setTexture('world_1_hard_off');
            });

            HARD_MODE_BTN.on('pointerdown', () => {

                this.scene.restart({mode: 'hard'});
            });
        }

        const key_tile = new KeyTile(
            this,
            this.key_tile_x,
            this.key_tile_y,
            'world_1_key_animation',
        );

        key_tile.playAnimation();

        
        
    }
}