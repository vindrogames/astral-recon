import { Scene } from "phaser";
import { Player } from "../gameobjects/Player.js";

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

    init(params) {

        this.mode = params.mode || 'hard';
        this.player_x = params.player_x || TILEDIMENSION * 4 + TILEDIMENSION / 2;
        this.player_y = params.player_y || TILEDIMENSION * 4 + TILEDIMENSION / 2;

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        //this.scene.launch("World_2");
    }

    create() {

        var map = this.make.tilemap({ key: 'world_2_room_1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('world_2_tileset_64', null, TILEDIMENSION, TILEDIMENSION, 0, 0);       
        var layer = map.createLayer('layer', tileset, 0, 0);

        
        this.player = new Player(
            this,
            this.player_x,
            this.player_y,
            'player_animation'
        );
        
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.player.body.setCollideWorldBounds(true);
    }
    
    update() {
        if (this.player) {
            this.player.update();
        }
    }
}