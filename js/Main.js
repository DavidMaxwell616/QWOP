import GameScene from "./GameScene.js";
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 500,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { y: .01 }
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);