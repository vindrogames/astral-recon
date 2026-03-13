import Phaser from 'phaser';
import Preloader from './scenes/Preloader.js';
import StartScene from './scenes/StartScene.js';
import World from './scenes/World.js';
import Game_config from './configs/Game_config.js';

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

const game = new Phaser.Game(config);

// Ensure the canvas captures keyboard events by keeping it focused
game.events.on('ready', () => {
    game.canvas.setAttribute('tabindex', '1');
    game.canvas.style.outline = 'none';
    game.canvas.focus();
});

window.addEventListener('click', () => game.canvas.focus());