import Phaser from 'phaser'
import { history } from '../constants'
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

  getDoors() {
    return this.room.doors
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
    this.margin = 60
    this.scene = scene
    this.mask = mask
    this.x1 = x
    this.y1 = y + this.margin
    this.x2 = x + w
    this.y2 = y + h - this.margin
    this.width = w
    this.height = h - this.margin
    var center_x = (this.x1 + this.x2) / 2
    this.center_coords = { x: center_x, y: this.y2 - 8 }
    this.numberDoors = Math.random() < 0.2 ? 2 : 1
    this.wallDoors = []
    this.doors = []

    while (this.wallDoors.length < this.numberDoors) {
      var r = Math.floor(Math.random() * 3)
      if (this.wallDoors.indexOf(r) === -1) this.wallDoors.push(r)
    }

    this.walls = scene.physics.add.staticGroup()
    this.floors = scene.add.group()
    this.furniture = scene.physics.add.staticGroup()
    this.items = scene.physics.add.staticGroup()
    this.effectSound = scene.sound.add('pickupItem')
    this.usedPositions = []
    const possibleElements = [
      {
        name: 'bed', width: 32, height: 64, solid: true
      },
      {
        name: 'closet', width: 36, height: 69, solid: true
      },
      {
        name: 'table', width: 25, height: 14, solid: true
      },
      {
        name: 'smallShirt', width: 32, height: 32, solid: false
      }
    ]
    const possibleItems = [
      {
        name: 'blood', width: 16, height: 16, solid: false
      },
      {
        name: 'medicine', width: 16, height: 16, solid: false
      }
    ]
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

    this.createDoors()
  }

  getDoors() {
    return this.doors
  }

  createDoors() {
    for (let ix of this.wallDoors) {
      let x,
        y,
        frame,
        offset = {},
        size = {}
      switch (ix) {
        case 0:
          x = this.x1
          y = getRandom(this.y1, this.y2)
          frame = 'left-door'
          size = { x: 16, y: 16 }
          offset = { x: 0, y: 32 }
          break
        case 1:
          x = getRandom(this.x1 + 32, this.x2 - 32)
          y = this.y1 - 24
          frame = 'front-door'
          size = { x: 32, y: 16 }
          offset = { x: 0, y: 32 }
          break
          break
        case 2:
          x = this.x2 - 16
          y = getRandom(this.y1, this.y2)
          frame = 'right-door'
          size = { x: 16, y: 16 }
          offset = { x: 0, y: 32 }
          break
      }
      const door = this.walls.create(x, y, 'atlas').setFrame(frame)
      door.setDepth(door.y + 40)
      door.body.setSize(size.x, size.y)
      door.body.setOffset(offset.x, offset.y)
      door.alpha = 0.5
      this.doors.push(door)
    }
    //ENTRY

    //ENTRY
    const door = this.walls.create(this.center_coords.x, this.y2 + 8, 'atlas').setFrame('front-door')
    door.setDepth(this.y2 + 32)
    door.body.setSize(32, 16)
    door.body.setOffset(0, 32)
    //door.setMask(this.mask)
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
    for (let ix = from; ix < to; ix += spriteSize) {
      let x, y, spriteFrame
      x = isVertical ? axis : ix
      y = isVertical ? ix : axis
      const randomFrame = Math.random()

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
    const gap = 35
    let tries = 0
    const maxTries = 2000
    const validateUsedPositions = (posX, posY, elementWidth, elementHeight) => {
      if (this.usedPositions.length === 0) {
        return true
      }
      for (const { possibleX, possibleY, usedWidth,  usedHeight} of this.usedPositions) {
        if ((posX + elementWidth > possibleX + usedWidth + gap || posX + elementWidth < possibleX + usedWidth + gap) &&
        (posY + elementHeight > possibleY + usedHeight + gap || posY + elementHeight < possibleY + usedHeight + gap)) {
          return true
        }
      }
      return false
    }

    const findPosition = (element) => {
      tries += 1
      const { x, y } = this.center_coords
      perlin.noise.seed(Math.random())
      const noise = Math.abs(perlin.noise.simplex2(x, y))
      const randomX = getRandom(10, this.width)
      const randomY = getRandom(10, this.height)
      const possibleX = this.x1 + getRandom(noise * randomX, this.width)
      const possibleY = this.y1 + getRandom(noise * randomY, this.height)
      if (
        possibleX > this.x1 + element.width + gap &&
        possibleX < this.x2 - element.width - gap &&
        possibleY > this.y1 + element.height + gap &&
        possibleY < this.y2 - element.height - gap &&
        validateUsedPositions(possibleX, possibleY, element.width, element.height)
      ) {
        const possiblePosition = { possibleX, possibleY, usedWidth:  element.width, usedHeight: element.height }
        this.usedPositions.push(possiblePosition)
        return { possibleX, possibleY, set: true }
      } else if (tries <= maxTries) {
        return findPosition(element)
      } else {
        return { possibleX, possibleY, set: false }
      }
    }

    for (const element of elements) {
      const { possibleX, possibleY, set } = findPosition(element)
      if (set) {
        this[type].create(possibleX, possibleY, element.name).setMask(this.mask)
      }
    }
    if (type === 'items') {
      Phaser.Actions.Call(this.items.getChildren(), (item) => {
        item.setInteractive()
        item.on('pointerdown', (pointer) => {
          this.effectSound.play()
          console.log('touch ', item)
          if (item.texture.key === 'blood') {
            this.scene.player.addBlood()
            item.destroy(item)
            console.log('new health ' + this.scene.player.health)
          }
          if (item.texture.key === 'medicine') {
            this.scene.player.addSanity()
            item.destroy(item)
            const hudText = document.getElementById('hud-text')
            const playerSanity = this.scene.player.getSanity()
            console.log('playerSanity', playerSanity)
            hudText.innerHTML = `<p>${history[playerSanity]}</p>`
            hudText.style.display = 'block'
            setTimeout(() => {
              hudText.style.display = 'none'
            }, 10000)
            console.log('new sanity ' + this.scene.player.sanity)
          }
          
        })
      })
    }
  }
}

export default Map
