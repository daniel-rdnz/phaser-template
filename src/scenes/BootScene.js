import { Scene } from 'phaser'

class BootScene extends Scene {
  constructor() {
    super('scene-boot')
  }

  preload() {
    this.load.image('player', 'assets/sprite/player_.png')
    this.load.image('light', 'assets/sprite/light.png')
    this.load.image("wall", "assets/sprite/block.png")
    this.load.image("floor", "assets/sprite/floor.png")
    this.load.image("bed", "assets/sprite/bed.png")
    this.load.image("closet", "assets/sprite/closet.png")
    this.load.image("table", "assets/sprite/table.png")
    this.load.image("topWall", "assets/sprite/topWall.png")
    this.load.image("sideWall", "assets/sprite/sideWall.png")
    this.load.atlas('atlas', 'assets/tilesets/atlas.png', 'assets/atlas/set.json')
    this.load.image("smallShirt", "assets/sprite/small_shirt.png")
    this.load.image("blood", "assets/sprite/blood.png")
    this.load.image("medicine", "assets/sprite/medicine.png")
    this.load.image("house", "assets/sprite/house.jpg")
    this.load.image("playButton", "assets/sprite/play_button.png")
    
    this.load.audio("pickupItem", ["assets/sounds/pickupItem.mp3"])
    this.load.audio('darkNoise', ["assets/sounds/horror-loop.mp3"])

    const loadingBar = this.add.graphics({
        fillStyle: {
            color: 0xffffff
        }
    })

    this.load.on("progress", (percent) => {
        const width = this.game.renderer.width - 100
        loadingBar.fillRect(50, this.game.renderer.height / 2, (width * percent) , 50)
        console.log(percent);
    })
  }

  create() {
    this.scene.start('scene-menu')
    const music = this.sound.add('darkNoise')
    music.setLoop(true)
    music.play()
  }
}

export default BootScene
