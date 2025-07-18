// KeyTile.js
import { GameObjects } from 'phaser';

export default class KeyTile extends GameObjects.Sprite {

    constructor(scene, x, y, asset) {

        super(scene, x, y, asset);
        scene.add.existing(this);

        if (!scene.anims.exists('key_tile')) {
            scene.anims.create({
                key: 'key_tile_animation',
                frames: scene.anims.generateFrameNames(asset, { prefix: 'keyTile_', end: 11, zeroPad: 4 }),
                repeat: -1,
                frameRate: 12,
            });
        }
    }

    playAnimation() {
        this.play('key_tile', true);
    }
}