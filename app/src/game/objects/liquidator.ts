// src/game/objects/liquidator.ts

import { getGameWidth, getGameHeight } from '../helpers';
import { LIQUIDATORS, EXPLOSION, EXPLODING } from 'game/assets';

export class Liquidator extends Phaser.GameObjects.Sprite {
 private isDead = false;
 private bang?: Phaser.Sound.BaseSound;

 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, LIQUIDATORS, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 10;
   this.displayWidth = getGameHeight(scene) / 10;

   this.anims.create({
    key: "sprEnemy1",
    frames: this.anims.generateFrameNumbers(LIQUIDATORS || '', { start: 0, end: 11 }),
    frameRate: 20,
    // repeat: -1
    });
    
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('sprExplosion', { start: 0, end: 16}),
        frameRate: 20,
        repeat: 0
    });
    
    this.bang = scene.sound.add(EXPLODING, { loop: false });

 }

 public setExplode(dead: boolean): void {
    this.isDead = dead;
    this.anims.play('explode', true);
    this.bang?.play();
  }


 public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
  };

  public update = () => {
    this.anims.play('sprEnemy1', true);

    if (this.x < -2 * this.displayWidth) {
      this.destroy()
    }

    if (this.isDead === true)
    {
      this.activate(0, 0, 0, 0);
    }

  }

  public handleOverlap = () => {
    this.destroy();
  }

}

