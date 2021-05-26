import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }

  preload() {
    this.load.image("player", "assets/sprite/player_.png");
    this.load.image('light', 'assets/sprite/light.png');
  }

  create() {
    this.scene.start("scene-game");
  }
}

export default BootScene;
