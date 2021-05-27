import { Scene } from 'phaser'
import Player from '../entity/player'
import SpotLight from '../entity/spotLight'

class GameScene extends Scene {
  constructor() {
    super('scene-game')
  }
  preload() {
    //PLAYER INSTANCE
    this.player = new Player({
      scene: this,
      x: this.game.config.width / 2,
      y: this.game.config.height / 2,
      sprite: 'player'
    }).setOrigin(0.5, 0.5)

    //SPOTLIGHT INSTANCE
    this.spotlight = new SpotLight(this)
    this.player.setMask(this.spotlight.getMask())

    this.cameras.main.setZoom(1)
  }

  update(time, delta) {
    this.spotlight.getLight().x = this.player.x
    this.spotlight.getLight().y = this.player.y
  }
}
export default GameScene
