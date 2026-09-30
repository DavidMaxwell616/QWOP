import { GameScene } from './GameScene.js';
new Phaser.Game({
    type: Phaser.AUTO, width: 1100, height: 620, parent: 'game',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [GameScene]
});
