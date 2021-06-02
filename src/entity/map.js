import Phaser from 'phaser'
const perlin = require('../lib/perlin.js')

const spriteSize = 16

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}
class Map {
  currentRoom
  mask
  constructor(scene, maxSize = 10, minSize = 5, width, height) {
    this.scene = scene
    this.currentRoom
    this.room_max_size = maxSize
    this.room_min_size = minSize
    this.max_rooms = 1

    this.lastRoomCenter = { x: 0, y: 0 }
    this.num_rooms = 0
    this.num_tiles = 0
    this.height = height
    this.width = width
    this.center_coords = { x: 0, y: 0 }
  }
  setMask(mask) {
    this.mask = mask
  }

  getCenter() {
    return this.center_coords
  }

  create() {
    this.#makeMap()
  }

  getCurrentRoom() {
    return this.room
  }

  #makeMap() {
    const w = getRandom(this.room_min_size, this.room_max_size) * spriteSize
    const h = getRandom(this.room_min_size, this.room_max_size) * spriteSize

    const x = (this.width - w) / 2
    const y = (this.height - h) / 2

    this.room = new Room(this.scene, x, y, w, h, this.mask)
  }
}

class Room {
  constructor(scene, x, y, w, h, mask) {
    this.scene = scene
    this.mask = mask
    this.x1 = x
    this.y1 = y
    this.x2 = x + w
    this.y2 = y + h
    this.width = w
    this.height = h
    var center_x = (this.x1 + this.x2) / 2
    var center_y = (this.y1 + this.y2) / 2
    this.center_coords = { x: center_x, y: center_y }

    this.walls = scene.physics.add.staticGroup()
    this.floors = scene.add.group()
    this.furniture = scene.physics.add.staticGroup()
    this.items = scene.physics.add.staticGroup()
    const possibleElements = ['bed', 'closet', 'table', 'smallShirt']
    const possibleItems = ['blood', 'medicine']
    this.createRoom()
    this.createObjects(possibleElements)
    this.createObjects(possibleItems, 'items')
  }
  createRoom() {
    for (let x = this.x1; x < this.x2; x += spriteSize) {
      for (let y = this.y1; y < this.y2; y += spriteSize) {
        this.createFloor(x, y)
      }
    }
    //Top Wall
    this.#createWall(
      this.y1,
      this.x1 + 16,
      this.x2 - 16,
      [
        { frame: 'topWall', probInf: 0, probSup: 0.85 },
        { frame: 'topWall1', probInf: 0.85, probSup: 0.92 },
        { frame: 'topWall2', probInf: 0.92, probSup: 0.96 },
        { frame: 'topWall3', probInf: 0.96, probSup: 1 }
      ],
      false,
      { x: 0, y: -24 },
      undefined,
      {
        x: 0,
        y: 16
      }
    )

    //Left Wall
    this.#createWall(
      this.x1,
      this.y1 - 24,
      this.y2,
      [
        { frame: 'leftWall', probInf: 0, probSup: 0.95 },
        { frame: 'leftWall1', probInf: 0.9, probSup: 0.95 },
        { frame: 'leftWall2', probInf: 0.95, probSup: 1 }
      ],
      true
    )

    //Right Wall
    this.#createWall(
      this.x2 - 16,
      this.y1 - 24,
      this.y2,
      [
        { frame: 'rightWall', probInf: 0, probSup: 0.95 },
        { frame: 'rightWall1', probInf: 0.9, probSup: 0.95 },
        { frame: 'rightWall2', probInf: 0.95, probSup: 1 }
      ],
      true
    )

    //Down Wall
    this.#createWall(
      this.y2 - 8,
      this.x1,
      this.x2,
      [
        { frame: 'topWall', probInf: 0, probSup: 0.85 },
        { frame: 'topWall1', probInf: 0.85, probSup: 0.92 },
        { frame: 'topWall2', probInf: 0.92, probSup: 0.96 },
        { frame: 'topWall3', probInf: 0.96, probSup: 1 }
      ],
      false,
      { x: 0, y: 16 },
      undefined,
      {
        x: 0,
        y: 32
      },
      true,
      ['downWallLeft', 'downWallRight']
    )
  }

  createFloor(x, y) {
    const floor = this.floors.create(x, y + 16, 'atlas')
    floor.setFrame('floor')
    floor.setMask(this.mask)
    floor.setDepth(-1)
  }

  #createWall(
    axis,
    from,
    to,
    frame,
    isVertical,
    offset = { x: 0, y: 0 },
    bodySize = { x: 16, y: 16 },
    bodyOffset = { x: 0, y: 0 },
    hasCorners = false,
    corners,
    spriteSize = 16
  ) {
    const doorProbability = 85
    for (let ix = from; ix < to; ix += spriteSize) {
      let x, y, spriteFrame
      x = isVertical ? axis : ix
      y = isVertical ? ix : axis
      const randomFrame = Math.random()
      
      const createDoor = getRandom(0, 100) > doorProbability

      for (const el of frame) {
        if (randomFrame >= el.probInf && randomFrame <= el.probSup) {
          spriteFrame = el.frame
        }
      }

      if (hasCorners && ix === from) {
        spriteFrame = corners[0]
      }

      if (hasCorners && ix === to - 16) {
        spriteFrame = corners[1]
      }

      const wall = this.walls.create(x + offset.x, y + offset.y, 'atlas').setFrame(spriteFrame)
      wall.body.setSize(bodySize.x, bodySize.y)
      wall.body.setOffset(bodyOffset.x, bodyOffset.y)
      wall.setDepth(y + bodyOffset.y)
    }
  }

  createObjects(elements, type = 'furniture') {
    const gap = 50
    const usedPositions = []
    let tries = 0
    const maxTries = 1000
    const validateUsedPositions = (posX, posY) => {
      if (usedPositions.length === 0) {
        return true
      }
      for (const { possibleX, possibleY } of usedPositions) {
        if ((posX > possibleX + gap || posX < possibleX - gap) && (posY > possibleY + gap || posY < possibleY - gap)) {
          return true
        }
      }
      return false
    }

    const findPosition = () => {
      tries += 1
      const { x, y } = this.center_coords
      perlin.noise.seed(Math.random())
      const noise = Math.abs(perlin.noise.simplex2(x, y))
      const possibleX = this.x1 + noise * getRandom(20, this.width)
      const possibleY = this.y1 + noise * getRandom(20, this.height)
      if (
        possibleX > this.x1 + gap &&
        possibleX < this.x2 - gap &&
        possibleY > this.y1 + gap &&
        possibleY < this.y2 - gap &&
        validateUsedPositions(possibleX, possibleY)
      ) {
        const possiblePosition = { possibleX, possibleY }
        usedPositions.push(possiblePosition)
        return { possibleX, possibleY, set: true }
      } else if (tries <= maxTries) {
        return findPosition()
      } else {
        return { possibleX, possibleY, set: false }
      }
    }

    for (const element of elements) {
      const { possibleX, possibleY, set } = findPosition()
      if (set) {
        this[type].create(possibleX, possibleY, element).setMask(this.mask)
      }
    }
    if (type === 'items') {
      Phaser.Actions.Call(this.items.getChildren(), (item) => {
        item.setInteractive()
        item.on('pointerdown', (pointer) => {
          console.log('touch ', item)
          if (item.texture.key === 'blood') {
            this.scene.player.addBlood()
            console.log('new health '+this.scene.player.health)
          }
          if (item.texture.key === 'medicine') {
            this.scene.player.addSanity()
            console.log('new sanity '+this.scene.player.sanity)
          }
          this.items.destroy(item)
        })
      })
    }
  }
}

export default Map
