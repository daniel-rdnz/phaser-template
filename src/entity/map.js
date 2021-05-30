// import Phaser from 'phaser'
const perlin = require('../lib/perlin.js')

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}
class Map {
  currentRoom;
  constructor(scene, maxSize = 10, minSize = 5, width, height) {
    this.scene = scene
    this.currentRoom;
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
    const w = getRandom(this.room_min_size, this.room_max_size) * 16
    const h = getRandom(this.room_min_size, this.room_max_size) * 16

    const x = (this.width - w) / 2
    const y = (this.height - h) / 2

    this.room = new Room(this.scene, x, y, w, h)
  }
}

class Room {
  constructor(scene, x, y, w, h) {
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

    this.createRoom()
    this.createFurniture()
  }
  createRoom() {
    const walls = []
    const doorProbability = 90
    for (let x = this.x1; x < this.x2; x += 16) {
      for (let y = this.y1; y < this.y2; y += 16) {
        this.createFloor(x, y)
        const xLimit = x > this.x1 && x < this.x2 - 16
        const yLimit = y > this.y1 && y < this.y2 - 16
        const createDoor = getRandom(0, 100) > doorProbability
        if (y == this.y1 && xLimit) {
          // Top
          this.walls.create(x, y - 24, 'topWall')
        } else if (x === this.x1 && yLimit && !createDoor) {
          // Left
          const wall = this.walls.create(x, y, 'sideWall')
          wall.angle = 90
        } else if (x === this.x2 - 16 && yLimit && !createDoor) {
          // Right
          const wall = this.walls.create(x, y, 'sideWall')
          wall.angle = -90
        } else if (y === this.y2 - 16 && xLimit && !createDoor) {
          // Down
          this.walls.create(x, y, 'sideWall')
        }
      }
    }
    console.table(walls)
    console.log({ x1: this.x1, x2: this.x2 - 16, y1: this.y1, y2: this.y2 - 16 })
  }

  createFloor(x, y) {
    this.floors.create(x, y, 'floor')
  }

  createFurniture () {
    const gap = 50
    const usedPositions = []
    const possibleElements = ['bed', 'closet', 'table']
    let tries = 0
    const maxTries = 1000
    const validateUsedPositions = (posX, posY) => {
      if (usedPositions.length === 0) {
        return true
      }
      for (const {possibleX, possibleY} of usedPositions) {
        if((posX > possibleX + gap || posX < possibleX - gap) && (posY > possibleY + gap || posY < possibleY - gap)) {
          return true
        }
      }
      return false
    }
    
    const findPosition = () => {
      tries += 1
      const {x, y} = this.center_coords
      perlin.noise.seed(Math.random());
      const noise = Math.abs(perlin.noise.simplex2(x, y))
      const possibleX = this.x1 + (noise * getRandom(20, this.width))  
      const possibleY = this.y1 + (noise * getRandom(20, this.height))
      if (possibleX > this.x1 + gap && possibleX < this.x2 - gap
        && possibleY > this.y1 + gap && possibleY < this.y2 - gap
        && validateUsedPositions(possibleX, possibleY)) {
        const possiblePosition = {possibleX, possibleY}
        usedPositions.push(possiblePosition)
        return {possibleX, possibleY, set: true}
      } else if (tries <= maxTries){
        return findPosition()
      } else {
        return {possibleX, possibleY, set: false}
      }
    }
    for (const element of possibleElements) {
      const { possibleX, possibleY, set } = findPosition()
      if (set) {
        this.furniture.create(possibleX , possibleY, element)
      }
    }
  }
  
}

export default Map
