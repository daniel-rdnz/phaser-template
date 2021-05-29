import { Scene } from 'phaser'
import Player from '../entity/player'
import SpotLight from '../entity/spotLight'
import Map from '../entity/map'

class GameScene extends Scene {
  constructor() {
    super('scene-game')
  }
  preload() {
    this.map = new Map(this, 40, 20, this.game.config.width, this.game.config.height)
    this.map.create()
    const roomCenter = this.map.getCurrentRoom().center_coords
    //PLAYER INSTANCE
    this.player = new Player({
      scene: this,
      x: roomCenter.x,
      y: roomCenter.y,
      sprite: 'player'
    })

    //SPOTLIGHT INSTANCE
    this.spotlight = new SpotLight(this)
    this.player.setMask(this.spotlight.getMask())
    
    this.player.setColliders(this.map.getCurrentRoom().walls)
    this.player.setColliders(this.map.getCurrentRoom().furniture)
  }

  update(time, delta) {
    this.spotlight.getLight().x = this.player.x
    this.spotlight.getLight().y = this.player.y
  }
}
export default GameScene
