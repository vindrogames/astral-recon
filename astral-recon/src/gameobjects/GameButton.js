import { GameObjects } from 'phaser';

export default class GameButton extends GameObjects.Image {
    constructor(scene, x, y, textureDark, textureLight, onClick) {
        super(scene, x, y, textureDark);
        scene.add.existing(this);

        this.textureDark = textureDark;
        this.textureLight = textureLight;

        this.setInteractive({ useHandCursor: true });

        this.on('pointerover', () => {
            if (this.input.enabled) {
                this.setTexture(this.textureLight);
            }
        });

        this.on('pointerout', () => {
            if (this.input.enabled) {
                this.setTexture(this.textureDark);
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
        this.setTexture(enabled ? this.textureDark : this.textureLight);
    }
}
