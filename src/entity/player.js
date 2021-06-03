import Phaser from 'phaser'

const capitalizeText = (text) => text.charAt(0).toUpperCase() + text.slice(1)

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.sprite)
    this.bloodQuantity = 20
    this.maxSanity = 10
    this.sanity = 1
    this.maxHealth = 100 * this.sanity
    this.health = this.maxHealth - 50
    this.setOrigin(0.5, 0.5)
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.body.setSize(32, 34)
    this.body.setOffset(0, 16)

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
    this.body.setVelocityX(-100)
    this.flipX = true
  }
  moveRight() {
    this.body.setVelocityX(100)
    this.flipX = false
  }
  moveDown() {
    this.body.setVelocityY(100)
  }
  moveUp() {
    this.body.setVelocityY(-100)
  }
  
  setColliders(group){
    this.scene.physics.add.collider(this, group)
  }

  updateHud (type) {
    const bar = document.getElementById(type)
    const max = this[`max${capitalizeText(type)}`]
    bar.style.width = `${this[type] * 100 / max}%`
  }

  removeBlood (qty) {
    const newHealth = this.health - qty
    if (newHealth <= 0) {
      // Game over
    }
    this.health = newHealth
    this.updateHud('health')
  }

  addBlood () {
    const newHealth = this.health + (this.bloodQuantity * this.sanity)
    this.health = newHealth > this.maxHealth ? this.maxHealth : newHealth
    this.updateHud('health')
  }

  addSanity () {
    if ( this.sanity >= this.maxSanity) {
      // Win
    }
    this.sanity += 1
    this.health = this.health * this.sanity
    this.updateHud('sanity')
  }

  preUpdate(time, delta) {
    this.body.setVelocity(0)
    this.setDepth(this.y)
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
    this.updateHud('health')
    this.updateHud('sanity')
  }
}

export default Player
