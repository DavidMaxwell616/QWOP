import { Runner } from "./Runner.js";
import {
    PPM,
    SCALE,
    CATEGORY_GROUND,
    MASK_GROUND,
    px2m,
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


        this.world = new pl.World({
            gravity: pl.Vec2(0, 24)
        });

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
            body: this.getTextureDimensions('head'),
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
        // Define dimensions for your floor (e.g., centered near the bottom of the screen)
        let posX = 400;
        let posY = 550;
        let width = this.w;
        let height = 25;
        const pixelsPerMeter = 30; // 30 pixels equals 1 meter

        let floorBody = this.world.createBody({
            type: 'static',
            position: new pl.Vec2(posX / pixelsPerMeter, posY / pixelsPerMeter)
        });

        let floorShape = new pl.Box((width / 2) / pixelsPerMeter, (height / 2) / pixelsPerMeter);
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

    makePartRect(key, xPx, yPx, wPx, hPx, density = 1.0, friction = 0.6, restitution = 0.1) {
        const body = this.world.createBody({
            type: "dynamic",
            position: pl.Vec2(px2m(xPx), px2m(yPx)),
            angle: 0,
            linearDamping: 0.05,
            angularDamping: 0.10
        });

        const fix = body.createFixture(pl.Box(px2m(wPx / 2), px2m(hPx / 2)), {
            density,
            friction,
            restitution
        });

        fix.setFilterData({
            categoryBits: CATEGORY_BODYPARTS,
            maskBits: MASK_BODYPARTS,
            groupIndex: 0
        });

        const sprite = this.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(wPx, hPx);
        sprite._pbody = body;

        return { body, sprite, fix };
    }
    makePartCircle(key, xPx, yPx, rPx, density = 1.0, friction = 0.6, restitution = 0.1) {
        const body = this.world.createBody({
            type: "dynamic",
            position: pl.Vec2(px2m(xPx), px2m(yPx)),
            angle: 0,
            linearDamping: 0.05,
            angularDamping: 0.10
        });

        const fix = body.createFixture(pl.Circle(px2m(rPx)), {
            density, friction, restitution
        });

        fix.setFilterData({
            categoryBits: CATEGORY_BODYPARTS,
            maskBits: MASK_BODYPARTS,
            groupIndex: 0
        });

        const sprite = this.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(rPx * 2, rPx * 2);
        sprite._pbody = body;

        return { body, sprite, fix };
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

        this.runner = new Runner(
            this,
            this.world,
            this.w,
            this.h,
            // 6.5,
            // 3,
            // RUNNER_SCALE,
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

        this.tipText = this.add.text(
            this.w / 2 - 180,
            110,
            "Lean into alternating keys. Falling is expected.",
            {
                fontFamily: "Arial",
                fontSize: "16px",
                color: "#ffffff"
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

        // if (this.runner.updateControls) {
        //     this.runner.updateControls(this.keys);
        // }

        // if (this.runner.stabilize) {
        //     this.runner.stabilize();
        // }

        this.world.step(1 / 60, 12, 6);
        this.runner.updateControls(this.keys);
        this.runner.stabilize();
        this.runner.syncSprites();

        if (this.runner.bodies && this.runner.bodies.torso) {
            const torso = this.runner.bodies.torso;

            const followX = Math.max(
                0,
                torso.getPosition().x * SCALE - 280
            );

            this.cameras.main.scrollX = Phaser.Math.Linear(
                this.cameras.main.scrollX,
                followX,
                0.08
            );

            if (this.runner.distance !== undefined) {
                this.distanceText.setText(
                    `Distance: ${this.runner.distance.toFixed(2)} m`
                );
            }

            if (torso.getPosition().y > 12) {
                this.runner.reset();
            }
        }
    }
}