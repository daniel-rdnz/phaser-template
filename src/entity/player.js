import Phaser from 'phaser'

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.sprite)

    this.direction = -1
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.A = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.W = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.S = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.D = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.LEFT = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.RIGHT = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.DOWN = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.UP = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    //this.hp = new HealthBar(config.scene, this.x - 5, this.y - this.height/ 2 - 3, 200);
  }
  moveLeft() {
    this.x -= 1
    this.scaleX = -1
  }
  moveRight() {
    this.x += 1
    this.scaleX = 1
  }
  moveDown() {
    this.y += 1
  }
  moveUp() {
    this.y -= 1
  }
  preUpdate(time, delta) {
    if (this.A.isDown || this.LEFT.isDown) {
      this.moveLeft()
    }

    if (this.D.isDown || this.RIGHT.isDown) {
      this.moveRight()
    }

    if (this.S.isDown || this.DOWN.isDown) {
      this.moveDown()
    }

    if (this.W.isDown || this.UP.isDown) {
      this.moveUp()
    }
  }
}

export default Player
