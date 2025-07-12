import { GameObjects } from "phaser";

export class Wall extends GameObjects.Sprite {

    constructor(scene, x, y, asset) {

        super(scene, x, y, asset);

        scene.add.existing(this);
        
        this.setVisible(false);
        this.setAlpha(0);
        this.isTriggered = false;

        if (!scene.anims.exists('wall_animation')) {
            scene.anims.create({
                key: 'wall_animation', 
                frames: scene.anims.generateFrameNames(asset, { 
                    prefix: 'wall_animation_imgset', 
                    start: 0, 
                    end: 5, 
                    suffix: '.png' 
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
            this.play('wall_animation', true);
        }
    }
}