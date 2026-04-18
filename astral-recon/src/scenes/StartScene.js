import GameState from '../managers/GameState.js';
import Start_scene_config from '../configs/Start_scene_config.js';
import GameButton from '../gameobjects/GameButton.js';
import World_1_Config from '../configs/World_1_config.js';
import World_2_Config from '../configs/World_2_config.js';

export default class StartScene_2 extends Phaser.Scene {
    constructor() {

        // Uses key from Start_scene_config
        super({ key: Start_scene_config.key });
    }

    init() {
        // Short faed in animmation effect when game loads
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {

        // Background image is simply dark background and title of game
        this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDepth(0);

        // Buttons for Start Scene to start World.js scene with each corresponding world_config
        // Buttons will be removed after a world is complete
        this.buttons = {};

        // Iterates over buttons in Start_scene_config. Can scale to as many worlds as we want
        Start_scene_config.uiButtons.forEach(btnConfig => {
            const button = new GameButton(
                this,
                btnConfig.pos_X,
                btnConfig.pos_Y,
                btnConfig.worldBtnDark,
                btnConfig.worldBtnLight,
                () => this.handleButtonPress(btnConfig.button)
            );

            this.buttons[btnConfig.button] = button;
        });

        // Creates animation sprite with questionmarks only if not already created
        // Depth is important as astro imgs will be placed on top when world is complete
        if (!this.anims.exists('worlds_recon_animation')) {
            this.anims.create({
                key: 'worlds_recon_animation',
                frames: this.anims.generateFrameNames('worlds_recon_animation', {
                    prefix: 'worlds_',  // <-- adjust this prefix to match your JSON keys
                    start: 0,
                    end: 10,
                    zeroPad: 2 // or whatever your filenames use
                }),
                frameRate: 6,
                repeat: -1
            });
        }

        // Adds sprite animation to Start Screen and plays Sprite
        const unknown_worlds_animation = this.add.sprite(
            Start_scene_config.uiAnimationPos_X,
            Start_scene_config.uiAnimationPos_Y,
            Start_scene_config.uiAnimationKey
        ).setDepth(1);

        unknown_worlds_animation.play(Start_scene_config.uiAnimationKey);

        GameState.completedWorlds && Object.entries(GameState.completedWorlds).forEach(([worldKey, isComplete]) => {
            if (isComplete) {
                const asset = Start_scene_config.uiAstros[worldKey];
                if (asset) {
                    this.add.image(asset.pos_X, asset.pos_Y, asset.imgKey).setDepth(84);

                    const ms = GameState.getWorldTime(worldKey);
                    if (ms !== null && ms !== undefined) {
                        const totalSecs = Math.floor(ms / 1000);
                        const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
                        const secs = (totalSecs % 60).toString().padStart(2, '0');
                        this.add.text(asset.pos_X, asset.pos_Y + 105, `Time:\n${mins}:${secs}`, {
                            fontFamily: 'monospace',
                            fontSize: '18px',
                            color: '#FFD700',
                            stroke: '#000000',
                            strokeThickness: 3,
                            align: 'center'
                        }).setDepth(85).setOrigin(0.5, 0);
                    }

                    // Optional: disable or remove mission button for completed world
                    console.log(this.buttons);
                    const button = this.buttons[`${worldKey}_btn`];
                    if (button) {
                        button.setVisible(false);
                        button.destroy(); // or button.destroy();
                    }
                }
            }
        });
    }

    // When a world button is clicked, players will ALWYAS start in room 1 (resets GameState room).
    // World.js scene starts with corresponding world_config (Sets GameState world)
    handleButtonPress(buttonKey) {
        switch (buttonKey) {
            case 'world_1_btn':
                GameState.setWorld('world_1');
                GameState.currentRoomIndex = 0;
                this.scene.start('World', { ...World_1_Config });
                break;
            case 'world_2_btn':
                GameState.setWorld('world_2');
                GameState.currentRoomIndex = 0;
                this.scene.start('World', { ...World_2_Config });
                break;
            default:
                console.warn(`No handler for button: ${buttonKey}`);
        }
    }
}
