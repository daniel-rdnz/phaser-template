import "./main.css";
import Phaser, {Game} from 'phaser';
import MenuScene from './scenes/MenuScene';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOver';
import FinalScene from './scenes/FinalScene';

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
      debug: true
    }
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    TitleScene,
    GameOverScene,
    FinalScene
  ]
};

const game = new Game(config);