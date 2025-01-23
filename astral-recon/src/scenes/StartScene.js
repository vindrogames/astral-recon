import { Scene } from "phaser";

const WORLD_1_BTN_X = 64 * 2 + 32;
const WORLD_1_BTN_Y = 64 * 6 + 32;

const WORLD_2_BTN_X = 64 * 6 + 32;
const WORLD_2_BTN_Y = 64 * 6 + 32;

export class StartScene extends Scene {

    constructor() {
        super("StartScene");
    }

    // Se incluye params para los 3 avatares de los 3 mundos.
    // Al finalizar cada World, pasamos el param como true al empezar el Start Scene de nuevo
    init(avatars) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.tupac_complete = avatars.tupac || false;
        this.elvis_complete = avatars.elvis || false;
        this.michael_complete = avatars.michael || false;
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, "background").setDepth(0);
        //const fx = logo.postFX.addShine(1, .2, 5);

        this.anims.create({
            key: 'worlds_recon_animation',
            frames: this.anims.generateFrameNames('worlds_recon_animation', { prefix: 'worlds_', end: 11, zeroPad: 2 }),
            repeat: -1,
            frameRate: 8,
        });

        var worlds = this.add.sprite(576 / 2, 576 / 2, 'worlds_recon_animation').setDepth(1);
        var worldsAnim = worlds.play('worlds_recon_animation');

        if (this.tupac_complete) {

            this.add.image(576 / 2 - 126, 576 / 2, 'tupac_complete').setDepth(1);

        } else if (!this.tupac_complete) {


            const BTN_WORLD_1 = this.add.image(WORLD_1_BTN_X, WORLD_1_BTN_Y, 'world_1_button').setInteractive({ useHandCursor: true });

            BTN_WORLD_1.on('pointerdown', () => {

                console.log('Starting World 1');
                this.scene.start('World_1');
                this.scene.stop('StartScreen');
                // this.scene.stop('Screen_start');
            });
        }

        if (this.elvis_complete) {

            this.add.image(576 / 2 - 126, 576 / 2, 'tupac_complete').setDepth(1);

        } else if (!this.elvis_complete) {


            const BTN_WORLD_2 = this.add.image(WORLD_2_BTN_X, WORLD_2_BTN_Y, 'world_2_button').setInteractive({ useHandCursor: true });

            BTN_WORLD_2.on('pointerdown', () => {

                console.log('Starting World 2');
                this.scene.start('World_2');
                this.scene.stop('StartScreen');
                // this.scene.stop('Screen_start');
            });
        }
    }
}