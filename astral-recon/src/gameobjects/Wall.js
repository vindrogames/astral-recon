import { GameObjects } from "phaser";

export class Wall extends GameObjects.Sprite {

    constructor(scene, x, y, asset) {

        super(scene, x, y, asset);

        scene.add.existing(this);
        
        this.setVisible(false);
        this.setAlpha(0);
        this.isTriggered = false;

        this.animKey = asset;

        if (!scene.anims.exists(this.animKey)) {
            scene.anims.create({
                key: this.animKey,
                frames: scene.anims.generateFrameNames(asset, {
                    prefix: 'wall_animation_',
                    start: 0,
                    end: 5,
                    zeroPad: 4
                }),
                repeat: 0,
                frameRate: 8,
            });
        }
    }

    triggerWall() {
        if (!this.isTriggered) {
            this.isTriggered = true;
            this.setVisible(true);
            this.setAlpha(1);
            this.play(this.animKey, true);
        }
    }
}