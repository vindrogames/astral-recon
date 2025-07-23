// Door.js
import { GameObjects } from 'phaser';

export default class Door extends GameObjects.Sprite {

    // takes scene, current room's door animation config and if animation should be reversed
    // For world 1 doors close on room entry, thus reversing and rotating frames
    constructor(scene, doorAnimationConfig, reverse = false) {

        if (!scene) {
            console.error('KeyTile: Scene is undefined!');
        }

        const x = doorAnimationConfig.pos_X;
        const y = doorAnimationConfig.pos_Y;
        const atlasKey = doorAnimationConfig.atlasKey;

        super(scene, x, y, atlasKey);

        this.scene = scene;
        this.config = doorAnimationConfig;

        scene.add.existing(this);

        // Generate frames first
        let frames = scene.anims.generateFrameNames(atlasKey, {
            prefix: this.config.prefix,
            start: this.config.start,
            end: this.config.end,
            zeroPad: this.config.zeroPad
        });

        // reverse frames if Door Close on entry
        if (reverse) {
            frames = frames.reverse();
        }

        // Avoid re-creating animation if it already exists
        if (!scene.anims.exists(this.config.animationKey)) {
            scene.anims.create({
                key: this.config.animationKey,
                frames,
                frameRate: this.config.frameRate,
                repeat: this.config.repeat
            });
        }

        // Flip X orientation if left door close and Y if top door close
        if (reverse && this.config.animationKey === 'door_left_close') {

            this.setFlipX(true);
        } else if (reverse && this.config.animationKey === 'door_top_close') {

            this.setFlipY(true);
        }
    }

    playOpenAnimation(onComplete) {
        this.play(this.config.animationKey);
        this.once('animationcomplete', onComplete);
    }
}