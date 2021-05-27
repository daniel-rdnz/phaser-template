// import Phaser from 'phaser'

class Map {
  constructor(scene, maxSize = 10, minSize = 5, width, height) {
    this.scene = scene
  
    this.walls = scene.physics.add.staticGroup()

    this.floors = scene.add.group()

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
    this.makeMap()
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  Room(x, y, w, h) {
    this.x1 = x
    this.y1 = y
    this.x2 = x + w
    this.y2 = y + h

    var center_x = (this.x1 + this.x2) / 2
    var center_y = (this.y1 + this.y2) / 2
    this.center_coords = { x: center_x, y: center_y }
  }

  createFloor(x, y) {
    const fl = this.floors.create(x, y, 'floor')
  }

  createRoom(x1, x2, y1, y2) {
    for (let x = x1; x < x2; x += 16) {
      for (let y = y1; y < y2; y += 16) {
        this.createFloor(x, y)
        if (y === y1 || y === y2 - 16 || x === x1 || x === x2 - 16) {
          this.walls.create(x, y, 'wall')
        }
      }
    }
  }

  makeMap() {
    const w = this.getRandom(this.room_min_size, this.room_max_size) * 16
    const h = this.getRandom(this.room_min_size, this.room_max_size) * 16

    const x = this.getRandom(1, this.width / 16 - (w / 16 + 1)) * 16
    const y = this.getRandom(1, this.height / 16 - (w / 16 + 1)) * 16

    this.createRoom(x, x + w, y, y + h)
    this.Room(x, y, w, h)
  }
}

export default Map
