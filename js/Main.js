const W = 1100;
const H = 620;

import { GameScene } from "./GameScene.js";

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: 'game',
  backgroundColor: '#93c5fd',
  scene: [GameScene]
};

new Phaser.Game(config);