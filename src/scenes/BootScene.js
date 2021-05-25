import { Scene } from 'phaser';


class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }

  preload() {
  
     
  }


  create() {
    this.scene.start('scene-game');
  }
}

export default BootScene;