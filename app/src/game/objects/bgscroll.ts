// src/game/objects/bgscroll.ts

import { getGameWidth, getGameHeight } from '../helpers';
import { BG } from 'game/assets';

export class Bgscroll extends Phaser.GameObjects.TileSprite {
 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, 0, 0, BG, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene);
   this.displayWidth = getGameHeight(scene);

 }

  public update = () => {
    if (this.x < -2 * this.displayWidth) {
      this.destroy()
    }
  }
}