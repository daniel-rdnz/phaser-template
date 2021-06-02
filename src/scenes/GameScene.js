import Phaser from 'phaser'
import Player from '../entity/player'
import SpotLight from '../entity/spotLight'
import Map from '../entity/map'

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
  }
  preload() {
    //SPOTLIGHT INSTANCE
    this.spotlight = new SpotLight(this)

    this.map = new Map(this, 35, 20, this.game.config.width, this.game.config.height)
    this.map.setMask(this.spotlight.getMask())
    this.map.create()
    const roomCenter = this.map.getCurrentRoom().center_coords

    //PLAYER INSTANCE
    this.player = new Player({
      scene: this,
      x: roomCenter.x,
      y: roomCenter.y,
      sprite: 'player'
    })

    //this.player.setMask(this.spotlight.getMask())

    this.player.setColliders(this.map.getCurrentRoom().walls)
    this.player.setColliders(this.map.getCurrentRoom().furniture)
  }

  update(time, delta) {
    this.spotlight.getLight().x = this.player.x
    this.spotlight.getLight().y = this.player.y

    for (let door of this.map.getDoors()) {
      const dist = Phaser.Math.Distance.BetweenPoints(this.player, door)
      if (dist < 40) {
        door.alpha = 1
      } else {
        door.alpha = 0
      }
    }
  }
}
export default GameScene
