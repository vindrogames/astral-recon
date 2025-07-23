import Phaser from 'phaser';
import Preloader from './scenes/Preloader.js';
import StartScene from './scenes/StartScene.js';
import World from './scenes/World.js';
import Game_config from './configs/Game_config.js';
// import { World_1 } from "./scenes/World_1";
// import { World_2 } from "./scenes/World_2";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: Game_config.gameWidth,
    height: Game_config.gameHeight,
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
        World
    ]
};

new Phaser.Game(config);