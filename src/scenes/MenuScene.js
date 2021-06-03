import { Scene } from 'phaser'

class MenuScene extends Scene {
  constructor() {
    super('scene-menu')
  }

  create() {
    this.add.image(0, 0, 'house').setOrigin(0).setDepth(0);

    const playButton = this.add.image((this.game.renderer.width / 2) + 200, this.game.renderer.height / 2, 'playButton').setDepth(1);
    playButton.setInteractive();

    playButton.on("pointerover", () => {
      playButton.tint = 0xCCCCCC
    })
    playButton.on("pointerout", () => {
      playButton.tint = 0xFFFFFF
    })

    playButton.on("pointerup", () => {
      this.scene.start('scene-game');
    })
  }
}

export default MenuScene
