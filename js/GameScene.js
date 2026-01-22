import { SpriteAssets } from "./SpriteAssets.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.runner = null;
        this.distance = 0;
        this.distanceText = null;
        this.keys = {};
        this.ground = null;
        this.finishLine = 100;
        this.height = 0;
        this.width = 0;
    }

    preload() {
        // Create sprite textures programmatically
        const textures = {
            torso: SpriteAssets.createCanvas(20, 60, '#FF6B6B'),
            head: SpriteAssets.createCircle(15, '#FFD93D'),
            upperArm: SpriteAssets.createCanvas(10, 40, '#FF9F9F'),
            forearm: SpriteAssets.createCanvas(8, 35, '#FFB6B6'),
            thigh: SpriteAssets.createCanvas(12, 50, '#6BCB77'),
            calf: SpriteAssets.createCanvas(10, 50, '#4D96FF'),
            foot: SpriteAssets.createCanvas(25, 10, '#2C3E50'),
            ground: SpriteAssets.createCanvas(100, 40, '#8B7355')
        };

        // Load textures into Phaser
        for (let key in textures) {
            this.textures.addBase64(key, textures[key]);
        }
    }

    create() {
        this.height = this.game.config.height;
        this.width = this.game.config.witdh;
        this.matter.world.setBounds(0, 0, 2000, this.height);
        //this.matter.world.setGravity(0, 2);

        // Create ground using sprite
        for (let i = 0; i < 20; i++) {
            const groundPiece = this.matter.add.sprite(i * 100 + 50, this.height - 20, 'ground', null, {
                isStatic: true,
                friction: 0.8
            });
            groundPiece.setDisplaySize(100, 40);
        }

        // Create finish line
        const finish = this.add.rectangle(this.finishLine * 10, 300, 5, 300, 0xFF0000);
        finish.setOrigin(0.5, 0.5);

        // Create track markers every 10m
        for (let i = 0; i <= 10; i++) {
            this.add.text(i * 100, this.height - 60, `${i * 10}m`, {
                fontSize: '14px',
                color: '#fff'
            });
        }

        // Create runner
        this.createRunner(100, this.height - 200);

        // Camera follow
        this.cameras.main.setBounds(0, 0, 2000, this.height);
        this.cameras.main.startFollow(this.runner.torso, true, 0.1, 0.1);

        // Setup input
        this.keys = {
            Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            P: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
            R: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        };

        // UI
        this.distanceText = this.add.text(16, 16, 'Distance: 0.0m', {
            fontSize: '24px',
            fontFamily: 'Tacoma',
            color: '#f83232',
            backgroundColor: '#87CEEB',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);

        this.add.text(16, 50, 'Q = Left Thigh | W = Left Calf | O = Right Thigh | P = Right Calf | R = Reset',
            {
                fontSize: '20px',
                fontFamily: 'Tacoma',
                color: '#f83232',
                backgroundColor: '#87CEEB',
                padding: { x: 10, y: 5 }
            }).setScrollFactor(0);

        this.resultText = this.add.text(400, 300, '', {
            fontSize: '48px',
            fontFamily: 'Tacoma',
            color: '#f83232',
            backgroundColor: '#87CEEB',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);
    }

    createRunner(x, y) {
        // Torso
        const torso = this.matter.add.sprite(x, y, 'torso', null, {
            friction: 0.8,
            density: 0.01
        });

        // Head
        const head = this.matter.add.sprite(x, y - 40, 'head', null, {
            friction: 0.8,
            density: 0.005,
            shape: 'circle'
        });

        // Left upper arm
        const leftUpperArm = this.matter.add.sprite(x - 20, y - 10, 'upperArm', null, {
            friction: 0.8,
            density: 0.004
        });

        // Left forearm
        const leftForearm = this.matter.add.sprite(x - 20, y + 20, 'forearm', null, {
            friction: 0.8,
            density: 0.003
        });

        // Right upper arm
        const rightUpperArm = this.matter.add.sprite(x + 20, y - 10, 'upperArm', null, {
            friction: 0.8,
            density: 0.004
        });

        // Right forearm
        const rightForearm = this.matter.add.sprite(x + 20, y + 20, 'forearm', null, {
            friction: 0.8,
            density: 0.003
        });

        // Left thigh
        const leftThigh = this.matter.add.sprite(x - 5, y + 45, 'thigh', null, {
            friction: 0.8,
            density: 0.008
        });

        // Left calf
        const leftCalf = this.matter.add.sprite(x - 5, y + 95, 'calf', null, {
            friction: 0.8,
            density: 0.006
        });

        // Right thigh
        const rightThigh = this.matter.add.sprite(x + 5, y + 45, 'thigh', null, {
            friction: 0.8,
            density: 0.008
        });

        // Right calf
        const rightCalf = this.matter.add.sprite(x + 5, y + 95, 'calf', null, {
            friction: 0.8,
            density: 0.006
        });

        // Left foot
        const leftFoot = this.matter.add.sprite(x - 5, y + 125, 'foot', null, {
            friction: 1.0,
            density: 0.005
        });

        // Right foot
        const rightFoot = this.matter.add.sprite(x + 5, y + 125, 'foot', null, {
            friction: 1.0,
            density: 0.005
        });

        // Connect head - use body references
        this.matter.add.constraint(torso.body, head.body, 20, 0.8, {
            pointA: { x: 0, y: -30 },
            pointB: { x: 0, y: 10 }
        });

        // Arm constraints
        this.matter.add.constraint(torso.body, leftUpperArm.body, 12, 0.5, {
            pointA: { x: -10, y: -20 },
            pointB: { x: 0, y: -20 },
            stiffness: 0.6
        });

        this.matter.add.constraint(leftUpperArm.body, leftForearm.body, 10, 0.5, {
            pointA: { x: 0, y: 20 },
            pointB: { x: 0, y: -17 },
            stiffness: 0.6
        });

        this.matter.add.constraint(torso.body, rightUpperArm.body, 12, 0.5, {
            pointA: { x: 10, y: -20 },
            pointB: { x: 0, y: -20 },
            stiffness: 0.6
        });

        this.matter.add.constraint(rightUpperArm.body, rightForearm.body, 10, 0.5, {
            pointA: { x: 0, y: 20 },
            pointB: { x: 0, y: -17 },
            stiffness: 0.6
        });

        // Leg constraints
        this.matter.add.constraint(torso.body, leftThigh.body, 15, 0.5, {
            pointA: { x: -5, y: 30 },
            pointB: { x: 0, y: -25 },
            stiffness: 0.6
        });

        this.matter.add.constraint(leftThigh.body, leftCalf.body, 15, 0.5, {
            pointA: { x: 0, y: 25 },
            pointB: { x: 0, y: -25 },
            stiffness: 0.6
        });

        this.matter.add.constraint(torso.body, rightThigh.body, 15, 0.5, {
            pointA: { x: 5, y: 30 },
            pointB: { x: 0, y: -25 },
            stiffness: 0.6
        });

        this.matter.add.constraint(rightThigh.body, rightCalf.body, 15, 0.5, {
            pointA: { x: 0, y: 25 },
            pointB: { x: 0, y: -25 },
            stiffness: 0.6
        });

        // Foot constraints (ankles)
        this.matter.add.constraint(leftCalf.body, leftFoot.body, 10, 0.5, {
            pointA: { x: 0, y: 25 },
            pointB: { x: -8, y: 0 },
            stiffness: 0.7
        });

        this.matter.add.constraint(rightCalf.body, rightFoot.body, 10, 0.5, {
            pointA: { x: 0, y: 25 },
            pointB: { x: -8, y: 0 },
            stiffness: 0.7
        });

        this.runner = {
            torso,
            head,
            leftUpperArm,
            leftForearm,
            rightUpperArm,
            rightForearm,
            leftThigh,
            leftCalf,
            leftFoot,
            rightThigh,
            rightCalf,
            rightFoot
        };
    }
    resetRunner() {
        // Destroy existing runner parts
        if (this.runner) {
            Object.values(this.runner).forEach(part => {
                if (part && part.body) {
                    this.matter.world.remove(part.body);
                    part.destroy();
                }
            });
        }

        // Recreate runner at starting position
        this.createRunner(100, 400);

        // Reset camera to follow new runner
        this.cameras.main.startFollow(this.runner.torso, true, 0.1, 0.1);

        // Reset distance
        this.distance = 0;
        this.distanceText.setText('Distance: 0.0m');

        // Hide result text
        if (this.resultText) {
            this.resultText.setVisible(false);
        }
    }
    update() {
        if (!this.runner) return;

        // Check for reset key
        if (this.keys.R.isDown) {
            this.resetRunner();
            return;
        }

        const torque = 0.015;

        // Q - Left thigh forward
        if (this.keys.Q.isDown) {
            this.runner.leftThigh.setAngularVelocity(-torque * 2);
        }

        // W - Left calf forward
        if (this.keys.W.isDown) {
            this.runner.leftCalf.setAngularVelocity(-torque * 3);
        }

        // O - Right thigh forward
        if (this.keys.O.isDown) {
            this.runner.rightThigh.setAngularVelocity(-torque * 2);
        }

        // P - Right calf forward
        if (this.keys.P.isDown) {
            this.runner.rightCalf.setAngularVelocity(-torque * 3);
        }

        // Update distance
        this.distance = Math.max(0, (this.runner.torso.body.position.x - 100) / 10);
        this.distanceText.setText(`Distance: ${this.distance.toFixed(1)}m`);

        // Check for failure (torso too low)
        if (this.runner.torso.body.position.y > 520 && !this.resultText.visible) {
            this.showResult('FAILED!');
        }

        // Check for success
        if (this.distance >= this.finishLine && !this.resultText.visible) {
            this.showResult('SUCCESS!');
        }
    }

    showResult(text) {
        this.resultText.setText(text);
        this.resultText.setVisible(true);

        this.time.delayedCall(2000, () => {
            this.resetRunner();
        });
    }
}