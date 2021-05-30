import { Scene } from 'phaser'

class BootScene extends Scene {
  constructor() {
    super('scene-boot')
  }

  preload() {
    this.load.image('player', 'assets/sprite/player_.png')
    this.load.image('light', 'assets/sprite/light.png')
    this.load.image("wall", "assets/sprite/block.png");
    this.load.image("floor", "assets/sprite/floor.png");
    this.load.image("bed", "assets/sprite/bed.png");
    this.load.image("closet", "assets/sprite/closet.png");
    this.load.image("table", "assets/sprite/table.png");
    this.load.image("topWall", "assets/sprite/topWall.png");
    this.load.image("sideWall", "assets/sprite/sideWall.png");
  }

  create() {
    this.scene.start('scene-game')
  }
}

export default BootScene
