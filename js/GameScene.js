import { Runner } from "./Runner.js";
import {
    PPM,
    SCALE,
    CATEGORY_GROUND,
    MASK_GROUND,
    px2m,
    m2px,
    CATEGORY_BODYPARTS,
    MASK_BODYPARTS
} from "./config.js";

const pl = planck;


export class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.setPath("assets/images");

        this.load.path = "assets/images/";
        this.load.image("body", "torso.png");
        this.load.image("pelvis", "pelvis.png");
        this.load.image("thigh", "thigh.png");
        this.load.image("leg", "lower_leg.png");
        this.load.image("foot", "foot.png");
        this.load.image("upperArm", "upper_arm.png");
        this.load.image("lowerArm", "lower_arm.png");
        this.load.image("head", "head.png");


        this.load.image("q", "q.png");
        this.load.image("w", "w.png");
        this.load.image("o", "o.png");
        this.load.image("p", "p.png");

        this.load.image("background_slice", "background_slice.png");
        this.load.image("marker", "marker.png");
        this.load.image("ground", "ground.png");
        this.load.image("maxxdaddy", "maxxdaddy.jpg");
    }

    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(99999);

        this.world = new pl.World({
            gravity: pl.Vec2(0, 24)
        });
        this.bestScore = 0.00;
        this.score = 0.00;
        this.drawBackground();
        this.createGround();
        this.runnerDimensions = this.getRunnerDimensions();
        this.createRunner();
        this.createUi();
        this.createInput();

        this.cameras.main.setBounds(0, 0, this.w * SCALE, this.h);
    }

    getRunnerDimensions() {
        return {
            body: this.getTextureDimensions('body'),
            pelvis: this.getTextureDimensions('pelvis'),
            thigh: this.getTextureDimensions('thigh'),
            leg: this.getTextureDimensions('leg'),
            foot: this.getTextureDimensions('foot'),
            upperArm: this.getTextureDimensions('upperArm'),
            lowerArm: this.getTextureDimensions('lowerArm'),
            head: this.getTextureDimensions('head'),
        };
    }
    getTextureDimensions(key) {
        const texture = this.textures.get(key);

        const w = texture.getSourceImage().width;
        const h = texture.getSourceImage().height;
        return { w, h };
    }

    createGround() {
        const height = 25;
        const pixelsPerMeter = 30; // 30 pixels equals 1 meter

        let floorBody = this.world.createBody({
            type: 'static',
            position: new pl.Vec2(this.w / 2 / pixelsPerMeter, this.h / pixelsPerMeter)
        });

        let floorShape = new pl.Box((this.w / 2) / pixelsPerMeter, height / pixelsPerMeter);
        const fixture = floorBody.createFixture({
            shape: floorShape,
            friction: 0.8,
            restitution: 0.1 // Low bounce
        });

        fixture.setFilterData({
            categoryBits: CATEGORY_GROUND,
            maskBits: CATEGORY_BODYPARTS,
            groupIndex: 0
        });

    }
    drawPlanckDebug() {
        if (!this.debugGraphics || !this.world) return;

        const g = this.debugGraphics;
        g.clear();

        g.lineStyle(2, 0x00ff00, 1);
        g.fillStyle(0x00ff00, 0.15);

        for (let body = this.world.getBodyList(); body; body = body.getNext()) {
            const bodyPos = body.getPosition();
            const bodyAngle = body.getAngle();

            for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                const shape = fixture.getShape();
                const type = shape.getType();

                if (type === "circle") {
                    const center = body.getWorldPoint(shape.m_p);
                    const x = center.x * PPM;
                    const y = center.y * PPM;
                    const r = shape.m_radius * PPM;

                    g.strokeCircle(x, y, r);
                }

                if (type === "polygon") {
                    const verts = shape.m_vertices.map(v => {
                        const world = body.getWorldPoint(v);
                        return {
                            x: world.x * PPM,
                            y: world.y * PPM
                        };
                    });

                    g.beginPath();
                    g.moveTo(verts[0].x, verts[0].y);

                    for (let i = 1; i < verts.length; i++) {
                        g.lineTo(verts[i].x, verts[i].y);
                    }

                    g.closePath();
                    g.strokePath();
                }
            }
        }

        // Joint anchors
        g.fillStyle(0xff0000, 1);

        for (let joint = this.world.getJointList(); joint; joint = joint.getNext()) {
            const a = joint.getAnchorA();
            const b = joint.getAnchorB();

            g.fillCircle(a.x * PPM, a.y * PPM, 4);
            g.fillCircle(b.x * PPM, b.y * PPM, 4);

            g.lineStyle(1, 0xff0000, 0.6);
            g.lineBetween(a.x * PPM, a.y * PPM, b.x * PPM, b.y * PPM);
        }
    }

    drawBackground() {
        for (let i = 0; i < this.w * SCALE; i++) {
            this.add.image(i, 0, "background_slice")
                .setDisplaySize(1, this.h)
                .setOrigin(0, 0);
        }

        for (let i = 1000; i < this.w * SCALE; i += 1000) {
            this.add.image(i, 503, "marker").setOrigin(0, 0);
        }
    }


    createRunner() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.score = 0;
        }
        this.runner = new Runner(
            this,
            this.world,
            this.w,
            this.h,
            this.runnerDimensions
        );
    }

    createUi() {
        this.distanceText = this.add.text(this.w / 2 - 100, 80, "Distance: 0.00 m", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setScrollFactor(0);

        this.bestScoreText = this.add.text(
            this.w / 2 - 110,
            110,
            "Best Score: 0.00m",
            {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setScrollFactor(0);
    }

    createInput() {
        this.keys = this.input.keyboard.addKeys({
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            O: Phaser.Input.Keyboard.KeyCodes.O,
            P: Phaser.Input.Keyboard.KeyCodes.P,
            R: Phaser.Input.Keyboard.KeyCodes.R,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.Qbutton = this.add.image(60, 60, "q")
            .setInteractive()
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.Wbutton = this.add.image(130, 60, "w")
            .setInteractive()
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.Obutton = this.add.image(950, 60, "o")
            .setInteractive()
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.Pbutton = this.add.image(1020, 60, "p")
            .setInteractive()
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.Qbutton.on("pointerdown", () => this.runner.QPressed = true);
        this.Wbutton.on("pointerdown", () => this.runner.WPressed = true);
        this.Obutton.on("pointerdown", () => this.runner.OPressed = true);
        this.Pbutton.on("pointerdown", () => this.runner.PPressed = true);

        this.Qbutton.on("pointerup", () => this.runner.QPressed = false);
        this.Wbutton.on("pointerup", () => this.runner.WPressed = false);
        this.Obutton.on("pointerup", () => this.runner.OPressed = false);
        this.Pbutton.on("pointerup", () => this.runner.PPressed = false);
    }

    update() {
        if (!this.runner) return;

        if (
            Phaser.Input.Keyboard.JustDown(this.keys.R) ||
            Phaser.Input.Keyboard.JustDown(this.keys.SPACE)
        ) {

            this.runner.destroy();
            this.createRunner();
        }

        if (this.runner.updateControls) {
            this.runner.updateControls(this.keys);
        }

        if (this.runner.stabilize) {
            this.runner.stabilize();
        }
        //this.runner.applySelfBalanceTorque();

        //this.drawPlanckDebug();

        this.world.step(1 / 60, 12, 6);

        this.runner.syncSprites();

        const torso = this.runner.body.body;
        const torsoX = m2px(torso.getPosition().x);

        this.cameras.main.scrollX = Phaser.Math.Linear(
            this.cameras.main.scrollX,
            Math.max(0, torsoX - this.w * 0.35),
            0.08
        );
        this.runner.distance = torso.getPosition().x / 10;
        this.score = this.runner.distance;
        if (this.runner.distance !== undefined) {
            this.distanceText.setText(
                `Distance: ${this.score.toFixed(2)} m`
            );
            this.bestScoreText.setText(
                `Best Score: ${this.bestScore.toFixed(2)} m`
            );
        }
        if ((this.runner.body.sprite.angle > 90 || this.runner.body.sprite.angle < -89)
            && (this.runner.head.sprite.y > 500)) {
            this.runner.destroy();
            this.createRunner();
        }
    }
}
