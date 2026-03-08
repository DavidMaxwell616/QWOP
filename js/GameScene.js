import { Runner } from "./Runner.js";

const pl = planck;
const SCALE = 80;
const W = 1100;
const H = 620;

const CATEGORY_GROUND = 0x0001;
const CATEGORY_RUNNER = 0x0002;

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    preload() {
        this.load.setPath('assets/images');
        this.load.image('head', 'head.png');
        this.load.image('lower_arm', 'lower_arm.png');
        this.load.image('upper_arm', 'upper_arm.png');
        this.load.image('thigh', 'thigh.png');
        this.load.image('lower_leg', 'lower_leg.png');
        this.load.image('torso', 'torso.png');
        this.load.image('foot', 'foot.png');

        this.load.image('q', 'q.png');
        this.load.image('w', 'w.png');
        this.load.image('o', 'o.png');
        this.load.image('p', 'p.png');

        this.load.image('background_slice', 'background_slice.png');
        this.load.image('marker', 'marker.png');
        this.load.image('ground', 'ground.png');

        this.load.image('maxxdaddy', 'maxxdaddy.jpg');
    }

    create() {
        this.cameras.main.setBackgroundColor('#539df0');

        this.worldWidth = 140;
        this.planckWorld = new pl.World({ gravity: pl.Vec2(0, 24) });

        this.drawBackground();
        this.createGround();
        this.createRunner();
        this.createUi();
        this.createInput();

        this.cameras.main.setBounds(0, 0, this.worldWidth * SCALE, H);
    }

    drawBackground() {
        for (let index = 0; index < this.worldWidth * SCALE; index++) {
            this.add.image(index, 0, 'background_slice').setDisplaySize(1, H).setOrigin(0, 0);
        }
        for (let index = 1000; index < this.worldWidth * SCALE; index += 1000) {
            this.add.image(index, 503, 'marker').setOrigin(0, 0);
        }
    }

    createGround() {
        const ground = this.planckWorld.createBody();
        const pts = [];
        for (let i = 0; i <= this.worldWidth; i += 2) {
            const y = 7 + Math.sin(i * 0.16) * 0.08 + Math.sin(i * 0.055) * 0.14;
            pts.push(pl.Vec2(i, y));
        }

        for (let i = 0; i < pts.length - 1; i++) {
            ground.createFixture(pl.Edge(pts[i], pts[i + 1]), {
                friction: 1.35,
                filterCategoryBits: CATEGORY_GROUND,
                filterMaskBits: CATEGORY_RUNNER
            });
        }
    }

    createRunner() {
        this.runner = new Runner(this, this.planckWorld, 6.5, 5.15);
    }

    createUi() {
        this.distanceText = this.add.text(16, 80, 'Distance: 0.00 m', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#0f172a',
            fontStyle: 'bold'
        }).setScrollFactor(0);

        this.tipText = this.add.text(16, 110, 'Lean into alternating keys. Falling is expected.', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#1e293b'
        }).setScrollFactor(0);
    }

    createInput() {
        this.keys = this.input.keyboard.addKeys({
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            O: Phaser.Input.Keyboard.KeyCodes.O,
            P: Phaser.Input.Keyboard.KeyCodes.P,
            R: Phaser.Input.Keyboard.KeyCodes.R
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
            this.runner.reset();
        }

        this.runner.updateControls(this.keys);
        this.runner.stabilize();

        const fixedTimeStep = 1 / 60;
        this.planckWorld.step(fixedTimeStep, 8, 3);
        this.runner.syncSprites();

        const followX = Math.max(0, this.runner.bodies.torso.getPosition().x * SCALE - 280);
        this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, followX, 0.08);

        this.distanceText.setText(`Distance: ${this.runner.distance.toFixed(2)} m`);

        // Reset if the runner goes catastrophically out of control.
        const torsoY = this.runner.bodies.torso.getPosition().y;
        if (torsoY > 12) {
            this.runner.reset();
        }
    }
}
