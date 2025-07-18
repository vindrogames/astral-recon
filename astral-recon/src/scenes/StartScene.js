import GameState from '../managers/GameState.js';
import World_1_Config from '../configs/World_1_config.js';
import World_2_Config from '../configs/World_2_config.js';

const WORLD_1_BTN_X = 64 * 2 + 32;
const WORLD_1_BTN_Y = 64 * 6 + 32;

const WORLD_2_BTN_X = 64 * 6 + 32;
const WORLD_2_BTN_Y = 64 * 6 + 32;

const tupac_complete_X = 576 / 2 - 126;
const tupac_complete_Y = 576 / 2;

const question_mark_animation_x = 576 / 2; 576 / 2;
const question_mark_animation_Y = 576 / 2;

export default class StartScene_2 extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {

        this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDepth(0);

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

        const unknown_worlds_animation = this.add.sprite(question_mark_animation_x, question_mark_animation_Y, 'worlds_recon_animation').setDepth(1);
        unknown_worlds_animation.play('worlds_recon_animation');

        const isWorld1Complete = GameState.isWorldComplete(1);
        const isWorld2Complete = GameState.isWorldComplete(2);

        if (isWorld1Complete) {

            this.add.image(tupac_complete_X, tupac_complete_Y, 'tupac_complete').setDepth(2);
        } else {

            const BTN_WORLD_1 = this.add.image(WORLD_1_BTN_X, WORLD_1_BTN_Y, 'world_1_button').setInteractive({ useHandCursor: true });

            BTN_WORLD_1.on('pointerdown', () => {

                console.log('Starting World 1');
                this.scene.start('World', World_1_Config);
            });
        }

        if (isWorld2Complete) {
            this.add.image(520, 400, 'character_world_2');
        } else {

            const BTN_WORLD_2 = this.add.image(WORLD_2_BTN_X, WORLD_2_BTN_Y, 'world_2_button').setInteractive({ useHandCursor: true });

            BTN_WORLD_2.on('pointerdown', () => {

                console.log('Starting World 1');
                this.scene.start('World', World_2_Config);
            });
        }
    }
}
