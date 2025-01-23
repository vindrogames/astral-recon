import { Game } from "phaser";
import { Preloader } from "./preloader";
import { StartScene } from "./scenes/StartScene";
import { World_1 } from "./scenes/World_1";
import { World_2 } from "./scenes/World_2";

const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#1c172e",
    max: {
        width: 800,
        height: 600,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        Preloader,
        StartScene,
        World_1,
        World_2

    ]
};

new Game(config);