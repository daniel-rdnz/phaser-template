import Phaser from 'phaser'

class SpotLight {
  light
  mask
  constructor(scene) {
    this.light = scene.make.sprite({
      x: scene.game.config.width / 2,
      y: scene.game.config.height / 2,
      key: 'light',
      add: false
    })

    scene.tweens.add({
      targets: this.light,
      scaleX: 1.50,
      scaleY: 1.50,
      duration: 100,
      ease: 'Sine.easeInOut',
      loop: -1,
      yoyo: true
    })

    this.mask = new Phaser.Display.Masks.BitmapMask(scene, this.light)
  }

  getMask() {
    return this.mask
  }

  getLight() {
    return this.light
  }
}

export default SpotLight
