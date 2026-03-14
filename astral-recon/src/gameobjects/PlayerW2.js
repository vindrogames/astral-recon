import { Player } from './Player.js';

// World 2 player: slides in the pressed direction until hitting a wall,
// border, or death tile. Death tiles act as stop obstacles (no death).
// Uses a world-2-specific 8-frame sprite (4 cols × 2 rows, 64×64 each).
export class PlayerW2 extends Player {

    createAnimations(scene, asset) {
        // Frames 0-3 (row 1): slide/walk cycle used for all directions
        // Frames 4-7 (row 2): secondary animation (e.g. idle or alt walk)
        const animations = [
            { key: 'walk_down',  start: 0, end: 3, frameRate: 8 },
            { key: 'walk_up',    start: 0, end: 3, frameRate: 8 },
            { key: 'walk_left',  start: 0, end: 3, frameRate: 8 },
            { key: 'walk_right', start: 0, end: 3, frameRate: 8 },
            { key: 'idle_front', start: 4, end: 7, frameRate: 6 },
        ];

        animations.forEach(anim => {
            if (scene.anims.exists(anim.key)) scene.anims.remove(anim.key);
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNumbers(asset, { start: anim.start, end: anim.end }),
                frameRate: anim.frameRate,
                repeat: -1
            });
        });
    }

    moveToTile(deltaX, deltaY, direction) {
        if (!this.scene.tilemap) return;

        const curTileX = Math.round((this.x - this.tileSize / 2) / this.tileSize);
        const curTileY = Math.round((this.y - this.tileSize / 2) / this.tileSize);

        let destTileX = curTileX;
        let destTileY = curTileY;
        let hitDoorTile = null;
        let hitWallTile = null; // death tile that stopped the slide

        // Tiles that stop the slide (death tiles block without killing)
        const STOP_TILES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];

        for (let step = 1; step <= 9; step++) {
            const checkX = curTileX + deltaX * step;
            const checkY = curTileY + deltaY * step;

            // Out of grid bounds — stop at last valid tile
            if (checkX < 0 || checkX >= 9 || checkY < 0 || checkY >= 9) break;

            const tile = this.scene.tilemap.getTileAt(checkX, checkY);
            if (!tile) break;

            // Blocking tile — stop before it; track death tiles for wall flash
            if (STOP_TILES.includes(tile.index)) {
                if (tile.index === 2) hitWallTile = { tileX: checkX, tileY: checkY };
                break;
            }

            // Open door — slide onto it then transition
            if (tile.index === 15 || tile.index === 22) {
                destTileX = checkX;
                destTileY = checkY;
                hitDoorTile = { tileX: checkX, tileY: checkY };
                break;
            }

            // Valid tile — advance destination
            destTileX = checkX;
            destTileY = checkY;

            // Key tile — stop here so key can be collected
            if (tile.index === 1) break;
        }

        // No movement — still flash the wall if that's what stopped us
        if (destTileX === curTileX && destTileY === curTileY) {
            if (hitWallTile) this.scene.triggerWallAt(hitWallTile.tileX, hitWallTile.tileY);
            return;
        }

        const destX = destTileX * this.tileSize + this.tileSize / 2;
        const destY = destTileY * this.tileSize + this.tileSize / 2;
        const steps = Math.abs(destTileX - curTileX) + Math.abs(destTileY - curTileY);

        this.isMoving = true;
        this.currentDirection = direction;

        const walkAnim = `walk_${direction}`;
        if (this.scene.anims.exists(walkAnim)) {
            this.play(walkAnim, true);
        }

        this.scene.tweens.add({
            targets: this,
            x: destX,
            y: destY,
            duration: steps * 120,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                if (this.scene?.anims.exists('idle_front')) {
                    this.play('idle_front', true);
                }
                if (!this.active || !this.scene) return;

                // Flash the wall that stopped us
                if (hitWallTile) {
                    this.scene.triggerWallAt(hitWallTile.tileX, hitWallTile.tileY);
                }

                if (this.scene.roomManager) {
                    this.scene.roomManager.checkKeyTileCollision(this.x, this.y);
                }
                if (!this.active || !this.scene) return;

                if (hitDoorTile) {
                    this.scene.handleDoorTransition(hitDoorTile.tileX, hitDoorTile.tileY);
                }
            }
        });
    }
}
