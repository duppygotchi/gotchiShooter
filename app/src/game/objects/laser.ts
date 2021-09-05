// src/game/objects/laser.ts
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { LASERS } from 'game/assets';

export class Laser extends Phaser.GameObjects.Image {

 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, LASERS, 0);
   this.setOrigin(10, -5);
   this.displayWidth = getGameHeight(scene) / 8;
   this.displayHeight = getGameHeight(scene)/ 64;
   this.setDisplaySize(this.displayWidth * getGameHeight(scene) / 1200, this.displayHeight * getGameHeight(scene) / 1200);
   // this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 }

 public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
  };

  public update = () => {
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (this.x > this.displayWidth) {
      // scene.countUpShots();
      this.destroy();
    }
  }

  public handleOverlap = () => {
    // this.countUpShots();
    this.destroy();
  }

}