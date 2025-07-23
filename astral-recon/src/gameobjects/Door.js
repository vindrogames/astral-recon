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

        // Play animation and on completion, add open static door image no top for visual effect
        // On csv map, the tile is still a door, simply with a placeholder wall in it's position with open door tile on top
        this.play(this.config.animationKey);
        this.on('animationcomplete', () => {
            if (this.config.staticOpenDoor) {
                this.scene.staticOpenDoor = this.scene.add.image(this.x, this.y, this.config.staticOpenDoor)
                    .setDepth(42);

                // Push open static door image to cleanup objects when cleaning previous room   
                this.scene.cleanupObjects.push(this.scene.staticOpenDoor);
            }
            // destroy animation, although it will be pushed to cleanup objects as well
            this.destroy();
        });
    }
}