import { GameObjects } from 'phaser';

export default class GameButton extends GameObjects.Image {
    constructor(scene, x, y, textureOff, textureOn, onClick) {
        super(scene, x, y, textureOff);
        scene.add.existing(this);

        this.textureOff = textureOff;
        this.textureOn = textureOn;

        this.setInteractive({ useHandCursor: true });

        this.on('pointerover', () => {
            if (this.input.enabled) {
                this.setTexture(this.textureOn);
            }
        });

        this.on('pointerout', () => {
            if (this.input.enabled) {
                this.setTexture(this.textureOff);
            }
        });

        this.on('pointerdown', () => {
            if (this.input.enabled && onClick) {
                onClick();
            }
        });
    }

    setEnabled(enabled = true) {
        this.setInteractive({ useHandCursor: enabled });
        this.input.enabled = enabled;
        this.setTexture(enabled ? this.textureOff : this.textureOn);
    }
}
