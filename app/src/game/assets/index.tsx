export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO';
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}

export const BG = 'bg';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const PIPES = 'pipes';
export const LIQUIDATORS = 'liquidators';
export const LASERS = 'lasers';
export const CLICK = 'click';
export const BOOP = 'boop';
export const FIRING = 'firing';
export const COLLECTING = 'collecting';
export const EXPLODING = 'exploding';
export const EXPLOSION = 'explosion';
export const STARS = 'stars';
export const COINS = 'coins';
export const BOMBS = 'bombs';


// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/images/bg.png',
    type: 'IMAGE',
  },
  {
    key: LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: PIPES,
    src: 'assets/sprites/spritesheet.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 80 / 1,
      frameHeight: 217 / 3,
    }
  },
  {
    key: BOOP,
    src: 'assets/sounds/boop.mp3',
    type: 'AUDIO',
  },
  {
    key: LIQUIDATORS,
    src: 'assets/sprites/sprLiquidator.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 60,
      frameHeight: 60,
    }
  },
  {
    key: LASERS,
    src: 'assets/sprites/sprLaserPlayer.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 4,
    }
  },
  {
    key: FIRING,
    src: 'assets/sounds/sndLaser.wav',
    type: 'AUDIO',
  },
  {
    key: COLLECTING,
    src: 'assets/sounds/send.mp3',
    type: 'AUDIO',
  },
  {
    key: EXPLODING,
    src: 'assets/sounds/sndExplode0.wav',
    type: 'AUDIO',
  },
  {
    key: EXPLOSION,
    src: 'assets/sprites/sprExplosion.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
  {
    key: COINS,
    src: 'assets/sprites/sprGHST_32x32.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
  {
    key: BOMBS,
    src: 'assets/images/82_sushi.svg',
    type: 'SVG',
  },

];