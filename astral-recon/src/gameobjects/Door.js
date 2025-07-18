// Door.js
import { GameObjects } from 'phaser';

export default class Door extends GameObjects.Sprite {
    constructor(scene, x, y, atlasKey, animKey, prefix, reverse = false) {
        super(scene, x, y, atlasKey);
        scene.add.existing(this);

        let frames = scene.anims.generateFrameNames(atlasKey, {
            prefix,
            start: 0,
            end: 11,
            zeroPad: 4
        });

        if (reverse) {
            frames = frames.reverse();
        }

        // Avoid re-creating animation if it already exists
        if (!scene.anims.exists(animKey)) {
            scene.anims.create({
                key: animKey,
                frames,
                frameRate: 6,
                repeat: 0
            });
        }

        if (reverse && animKey === 'door_left_close') {

            this.setFlipX(true);
        } else if (reverse && animKey === 'door_top_close') {

            this.setFlipY(true);
        }

        this.play(animKey);
        this.on('animationcomplete', () => {
            this.destroy();
        });
    }
}