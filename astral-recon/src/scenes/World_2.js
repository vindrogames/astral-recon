import { Scene } from "phaser";

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

export class World_2 extends Scene {

    constructor() {
        super("World_2");
    }

    init(difficulty) {

        this.mode = difficulty.mode || 'hard';

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        //this.scene.launch("World_2");
    }

    create() {

        var map = this.make.tilemap({ key: 'world_2_room_1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('world_2_tileset_64', null, TILEDIMENSION, TILEDIMENSION, 0, 0);       
        var layer = map.createLayer('layer', tileset, 0, 0);

        
        const HOME_BTN = this.add.image(64 * 4.5 + 32, 576 - 28, 'world_2_quit').setInteractive({ useHandCursor: true });

        HOME_BTN.on('pointerover', () => {

            HOME_BTN.setTexture('world_2_quit_hover');
        });

        HOME_BTN.on('pointerout', () => {

            HOME_BTN.setTexture('world_2_quit');
        });

        HOME_BTN.on('pointerdown', () => {

            this.scene.start('StartScene');
            this.scene.stop('world_2');
        });

        if (this.mode === 'hard') {

            console.log('Hard mode on');
            const HARD_MODE_BTN = this.add.image(64 * 1.5 + 32, 576 - 28, 'world_2_hard_on').setInteractive({ useHandCursor: false });
            const EASY_MODE_BTN = this.add.image(64 * 2.5 + 32, 576 - 28, 'world_2_easy_off').setInteractive({ useHandCursor: true });

            EASY_MODE_BTN.on('pointerover', () => {

                EASY_MODE_BTN.setTexture('world_2_easy_on');
            })

            EASY_MODE_BTN.on('pointerout', () => {

                EASY_MODE_BTN.setTexture('world_2_easy_off');
            });

            EASY_MODE_BTN.on('pointerdown', () => {

                this.scene.restart({mode: 'easy'});
            });
        } else if (this.mode === 'easy') {

            console.log('easy mode on');
            const HARD_MODE_BTN = this.add.image(64 * 1.5 + 32, 576 - 28, 'world_2_hard_off').setInteractive({ useHandCursor: true });
            const EASY_MODE_BTN = this.add.image(64 * 2.5 + 32, 576 - 28, 'world_2_easy_on').setInteractive({ useHandCursor: false });

            HARD_MODE_BTN.on('pointerover', () => {

                HARD_MODE_BTN.setTexture('world_2_hard_on');
            })

            HARD_MODE_BTN.on('pointerout', () => {

                HARD_MODE_BTN.setTexture('world_2_hard_off');
            });

            HARD_MODE_BTN.on('pointerdown', () => {

                this.scene.restart({mode: 'hard'});
            });
        }
    }
}