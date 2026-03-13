import { GameObjects } from "phaser";
import Game_config from "../configs/Game_config";

export class Player extends GameObjects.Sprite {

    constructor(scene, x, y, asset) {
        super(scene, x, y, asset);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(5);
        this.body.setSize(48, 48);
        this.body.setOffset(8, 16);
        
        this.tileSize = 64;
        this.moveSpeed = 300;
        this.isMoving = false;
        this.currentDirection = 'down';
        
        this.startX = x;
        this.startY = y;
        
        this.createAnimations(scene, asset);
        
        // Only play animation if it was successfully created
        if (scene.anims.exists('idle_front')) {
            this.play('idle_front');
        }
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,S,A,D');
        
        this.keyPressed = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    }

    createAnimations(scene, asset) {
        const animations = [
            { key: 'walk_down', start: 0, end: 3, frameRate: 12 },
            { key: 'walk_up', start: 4, end: 7, frameRate: 12 },
            { key: 'walk_left', start: 8, end: 11, frameRate: 12 },
            { key: 'walk_right', start: 12, end: 15, frameRate: 12 },
            { key: 'idle_front', start: 0, end: 0, frameRate: 1 },
            { key: 'die_right', start: 16, end: 21, frameRate: 10, repeat: 0 },
            { key: 'die_left', start: 22, end: 27, frameRate: 10, repeat: 0 },
            { key: 'die_up', start: 28, end: 33, frameRate: 10, repeat: 0 },
            { key: 'die_down', start: 34, end: 39, frameRate: 10, repeat: 0 }
        ];

        animations.forEach(anim => {
            if (!scene.anims.exists(anim.key)) {
                try {
                    scene.anims.create({
                        key: anim.key,
                        frames: scene.anims.generateFrameNumbers(asset, { start: anim.start, end: anim.end }),
                        frameRate: anim.frameRate,
                        repeat: anim.repeat !== undefined ? anim.repeat : -1
                    });
                } catch (error) {
                    console.error(`Failed to create animation ${anim.key}:`, error);
                }
            }
        });
    }

    update() {
        if (!this.active || !this.scene) return;
        if (this.body?.enable === false) return;

        if (this.isMoving) {
            return;
        }

        const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown;
        const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown;
        const upPressed = this.cursors.up.isDown || this.wasd.W.isDown;
        const downPressed = this.cursors.down.isDown || this.wasd.S.isDown;

        if (leftPressed && !this.keyPressed.left) {
            this.keyPressed.left = true;
            this.moveToTile(-1, 0, 'left');
        } else if (rightPressed && !this.keyPressed.right) {
            this.keyPressed.right = true;
            this.moveToTile(1, 0, 'right');
        } else if (upPressed && !this.keyPressed.up) {
            this.keyPressed.up = true;
            this.moveToTile(0, -1, 'up');
        } else if (downPressed && !this.keyPressed.down) {
            this.keyPressed.down = true;
            this.moveToTile(0, 1, 'down');
        }

        // moveToTile can trigger a room transition that destroys this player mid-frame
        if (!this.active || !this.scene) return;

        if (!leftPressed) this.keyPressed.left = false;
        if (!rightPressed) this.keyPressed.right = false;
        if (!upPressed) this.keyPressed.up = false;
        if (!downPressed) this.keyPressed.down = false;

        if (!this.isMoving) {
            if (this.scene.anims.exists('idle_front')) {
                this.play('idle_front', true);
            }
        }
    }

    moveToTile(deltaX, deltaY, direction) {
        const newX = this.x + (deltaX * this.tileSize);
        const newY = this.y + (deltaY * this.tileSize);
        
        const worldBounds = this.scene.physics.world.bounds;
        
        if (newX < this.tileSize/2 || newX > worldBounds.width - this.tileSize/2 ||
            newY < this.tileSize/2 || newY > worldBounds.height - this.tileSize/2) {
            return;
        }
        
        // Calculate tile coordinates
        const newTileX = Math.round((newX - this.tileSize/2) / this.tileSize);
        const newTileY = Math.round((newY - this.tileSize/2) / this.tileSize);
        
        if (this.scene.tilemap) {
            const tile = this.scene.tilemap.getTileAt(newTileX, newTileY);
            if (tile) {
                if (tile.index === 2) {
                    if (!this.scene.cheatMode) {
                        this.currentDirection = direction;
                        this.scene.triggerWallAt(newTileX, newTileY);
                        this.die();
                        return;
                    }
                    // Cheat mode: pass through death tiles without dying
                }
                
                const borderWalls = [5, 6, 8, 9, 10, 11, 12, 13, 16];
                if (borderWalls.includes(tile.index)) {
                    return;
                }
                
                if (tile.index === 15 || tile.index === 22) {
                    this.scene.handleDoorTransition(newTileX, newTileY);
                    return;
                }
            }
        }
        
        this.isMoving = true;
        this.currentDirection = direction;
        const walkAnim = `walk_${direction}`;
        if (this.scene.anims.exists(walkAnim)) {
            this.play(walkAnim, true);
        }
        
        this.scene.tweens.add({
            targets: this,
            x: newX,
            y: newY,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.isMoving = false;
                if (this.scene.anims.exists('idle_front')) {
                    this.play('idle_front', true);
                }
                // Check if player landed on a key tile
                if (this.scene.roomManager) {
                    this.scene.roomManager.checkKeyTileCollision(this.x, this.y);
                }
            }
        });
    }

    die() {
        this.isMoving = false;
        const deathAnim = `die_${this.currentDirection}`;
        
        this.anims.stop();
        
        if (this.scene.anims.exists(deathAnim)) {
            this.play(deathAnim);
            console.log("muere bien");
            this.setTint(0xff0000);
        } else {
            this.setFrame(16);
            this.setTint(0xff0000);
        }
        
        this.body.enable = false;
        
        this.scene.time.delayedCall(1500, () => {
            this.respawn();
        });
    }
    
    respawn() {
        this.reset(this.startX, this.startY);
    }

    reset(x, y) {
        this.removeAllListeners();
        this.setPosition(x, y);
        this.body.enable = true;
        this.body.setVelocity(0, 0);
        this.isMoving = false;
        this.currentDirection = 'down';
        
        this.clearTint();
        this.setAlpha(1);
        this.setVisible(true);
        
        if (this.scene.anims.exists('idle_front')) {
            this.play('idle_front', true);
        }
    }

    getTilePosition() {
        return {
            x: Math.round((this.x - this.tileSize/2) / this.tileSize),
            y: Math.round((this.y - this.tileSize/2) / this.tileSize)
        };
    }

    setTilePosition(tileX, tileY) {
        this.x = tileX * this.tileSize + this.tileSize/2;
        this.y = tileY * this.tileSize + this.tileSize/2;
        this.startX = this.x;
        this.startY = this.y;
    }
}