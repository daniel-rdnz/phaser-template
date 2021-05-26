import Phaser from 'phaser'

class HealthBar {
  constructor(scene, x, y, health) {
    this.bar = new Phaser.GameObjects.Graphics(scene)

    this.x = x
    this.y = y
    this.health = health
    this.value = health
    this.p = 6 / health

    this.draw({ x, y })

    scene.add.existing(this.bar)
  }

  decrease(amount, enemyPosition) {
    this.value -= amount
    if (this.value < 0) {
      this.value = 0
    }

    this.draw(enemyPosition)

    return this.value === 0
  }

  crease(amount, enemyPosition) {
    if (this.health > this.value) {
      this.value = this.value + amount > this.health ? this.health : this.value + amount
      this.draw(enemyPosition)
    }
  }

  draw(enemyPosition) {
    this.bar.clear()

    this.bar.fillStyle(0x43523d)

    var d = this.p * this.value
    this.bar.fillRect(enemyPosition.x + 2, enemyPosition.y + 2, d, 1)
  }
}

export default HealthBar
