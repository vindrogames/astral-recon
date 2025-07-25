// KeyTile.js
import { GameObjects } from 'phaser';
import GameState from '../managers/GameState.js';

export default class KeyTile extends GameObjects.Sprite {

    constructor(scene, keyTileConfig) {
        if (!scene) {
            console.error('KeyTile: Scene is undefined!');
        }

        const x = keyTileConfig.pos_X;
        const y = keyTileConfig.pos_Y;
        const atlasKey = keyTileConfig.atlasKey;

        super(scene, x, y, atlasKey);

        this.scene = scene;
        this.config = keyTileConfig;

        scene.add.existing(this);

        // Check and create animation only if it doesn't exist
        if (!scene.anims.exists(keyTileConfig.animationKey)) {
            scene.anims.create({
                key: keyTileConfig.animationKey,
                frames: scene.anims.generateFrameNames(atlasKey, {
                    prefix: keyTileConfig.prefix,
                    start: 0,
                    end: keyTileConfig.end,
                    zeroPad: keyTileConfig.zeroPad,
                }),
                frameRate: keyTileConfig.frameRate,
                repeat: keyTileConfig.repeat
            });
        }
    }

    playAnimation() {
        this.play(this.config.animationKey, true);
    }
}