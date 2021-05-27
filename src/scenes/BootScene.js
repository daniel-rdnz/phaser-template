import { Scene } from 'phaser'

class BootScene extends Scene {
  constructor() {
    super('scene-boot')
  }

  preload() {
    this.load.image('player', 'assets/sprite/player_.png')
    this.load.image('light', 'assets/sprite/light.png')
    this.load.image("wall", "assets/sprite/wall.png");
    this.load.image("floor", "assets/sprite/floor.png");
  }

  create() {
    this.scene.start('scene-game')
  }
}

export default BootScene
