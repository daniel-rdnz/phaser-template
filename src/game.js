import "./main.css";
import Phaser, {Game} from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOver';

const canvas = document.getElementById('game-canvas');



const config = {
  type: Phaser.WEB_GL,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    GameScene,
    TitleScene,
    GameOverScene
  ]
};

const game = new Game(config);