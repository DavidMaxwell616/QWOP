import { Runner } from './Runner.js';
import { DemoRun } from './DemoRun.js';
import { PPM, px2m, m2px, CATEGORY_GROUND, CATEGORY_HURDLE, SAND_PIT_WIDTH } from './config.js';
const pl = globalThis.planck;
import { Athletics, WORLD_DEFAULTS, SAND_PIT_AT } from './Athletics.js';
const STEP = WORLD_DEFAULTS.timeStep;
const ASSETS = { body: 'torso', pelvis: 'pelvis', thigh: 'thigh', leg: 'lower_leg', foot: 'foot', upperArm: 'upper_arm', lowerArm: 'lower_arm', head: 'head', q: 'q', w: 'w', o: 'o', p: 'p', background_slice: 'background_slice', marker: 'marker' };

export class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    preload() {
        this.load.on('loaderror', file => console.error(`Asset failed to load: ${file.url}`));
        for (const [key, file] of Object.entries(ASSETS)) this.load.image(key, `assets/images/${file}.png`);
    }
    create(data = {}) {
        this.demoMode = data.demo === true;
        this.demo = null;
        this.w = 1100; this.h = 620; this.groundY = 540;
        this.bestScore = this.registry.get('best') || 0;
        this.state = 'intro'; this.accumulator = 0; this.score = 0;
        this.touch = new Map(); this.obstacles = []; this.pitCreated = false;
        this.rules = new Athletics(this.bestScore);
        this.world = new pl.World(pl.Vec2(WORLD_DEFAULTS.gravityX, WORLD_DEFAULTS.gravityY));
        this.add.tileSprite(0, 0, this.w, this.h, 'background_slice')
            .setOrigin(0).setScrollFactor(0)
            .setTileScale(1, 1); // Stretch the 575px source slice by 50px vertically.
        this.ground = this.world.createBody();
        this.ground.createFixture(pl.Edge(pl.Vec2(-10000, px2m(this.groundY)), pl.Vec2(10000, px2m(this.groundY))), { friction: 1, restitution: 0.2, filterCategoryBits: CATEGORY_GROUND, filterMaskBits: 0xffff, userData: { name: 'track' } });
        this.add.rectangle(0, this.groundY, this.w, 80, 0xa55540).setOrigin(0).setScrollFactor(0);
        const dimensions = {};
        for (const key of ['body', 'pelvis', 'thigh', 'leg', 'foot', 'upperArm', 'lowerArm', 'head']) {
            const source = this.textures.get(key).getSourceImage();
            dimensions[key] = { w: source.width, h: source.height };
        }
        this.runner = new Runner(this, this.world, this.w, this.h, dimensions);
        this.startX = m2px(this.runner.body.body.getPosition().x);
        // Athletics uses ten Box2D units per displayed metre.
        this.hurdleX = 50 * PPM * 10;
        this.pitX = SAND_PIT_AT;
        for (let metre = -10; metre <= 110; metre += 5) {
            const x = metre * PPM * 10;
            this.add.image(x, this.groundY + 30, 'marker').setOrigin(0.5, 1).setDepth(1);
            this.add.text(x, this.groundY - 100, `${metre} m`, { fontSize: '96px', fontStyle: 'bold' }).setOrigin(0.5, 1).setDepth(1).setAlpha(0.5);
        }
        if (this.bestScore > 0) this.add.text(this.bestScore * PPM * 10, 190, `Best: ${this.bestScore.toFixed(1)} m`, { fontSize: '22px' });
        this.distanceText = this.add.text(550, 25, '', { fontSize: '28px' }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
        this.message = this.add.text(550, 150, 'QWOP\nClick or press Q/W/O/P to start\nH: help • R: restart', { fontSize: '26px', align: 'center', backgroundColor: '#172238', padding: { x: 22, y: 16 } }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
        this.keys = this.input.keyboard.addKeys('Q,W,O,P,R,SPACE,H,D');
        this.add.text(550, 75, this.demoMode ? 'MANUAL PLAY (D)' : 'DEMO RUN (D)', {
            fontSize: '18px', backgroundColor: '#172238', padding: { x: 12, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setInteractive()
            .on('pointerdown', () => this.scene.restart({ demo: !this.demoMode }));
        this.buttons = {};
        this.input.addPointer(3);
        for (const [i, key] of ['Q', 'W', 'O', 'P'].entries()) {
            const button = this.add.image([60, 135, 965, 1040][i], 65, key.toLowerCase()).setScrollFactor(0).setDepth(30).setInteractive();
            button.on('pointerdown', pointer => { this.touch.set(pointer.id, key); this.start(); });
            button.on('pointerout', pointer => this.touch.delete(pointer.id));
            this.buttons[key] = button;
        }
        for (const [label, left, right] of [['HIPS', 'Q', 'W'], ['KNEES', 'O', 'P']]) {
            const a = this.buttons[left], b = this.buttons[right];
            const x = (a.x + b.x) / 2;
            const y = Math.max(a.y + a.displayHeight / 2, b.y + b.displayHeight / 2) + 8;
            this.add.text(x, y, label, { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#ffffff' })
                .setOrigin(0.5, 0).setScrollFactor(0).setDepth(30);
        }
        this.input.on('pointerup', pointer => this.touch.delete(pointer.id));
        this.input.on('pointerdown', () => this.start());
        this.onBlur = () => { this.touch.clear(); this.input.keyboard.resetKeys(); if (this.state === 'running') this.help(); };
        this.game.events.on('blur', this.onBlur);
        this.events.once('shutdown', () => { this.game.events.off('blur', this.onBlur); this.world = null; });
        // Box2D Add is per manifold point. Planck begin-contact alone misses
        // new points on an already touching foot, so compare point IDs in pre-solve.
        this.world.on('pre-solve', (contact, oldManifold) => {
            if (this.state !== 'running') return;
            const a = contact.getFixtureA(), b = contact.getFixtureB();
            const manifold = contact.getManifold();
            const worldManifold = contact.getWorldManifold(null);
            if (!worldManifold) return;
            for (let i = 0; i < manifold.pointCount; i++) {
                const feature = manifold.points[i].id.cf;
                if (oldManifold.points.slice(0, oldManifold.pointCount).some(point =>
                    ['indexA', 'indexB', 'typeA', 'typeB'].every(key => point.id.cf[key] === feature[key]))) continue;
                const point = worldManifold.points[i];
                const velocityA = a.getBody().getLinearVelocityFromWorldPoint(point);
                const velocityB = b.getBody().getLinearVelocityFromWorldPoint(point);
                const speed = pl.Vec2.sub(velocityA, velocityB).length();
                for (const [part, other] of [[a, b], [b, a]]) {
                    const effect = this.rules.contactAdded(part.getUserData()?.name, other.getUserData()?.name, point, speed);
                    if (effect?.burst) this.burst(point);
                }
            }
        });
        if (this.demoMode) {
            this.demo = new DemoRun(this.runner, this.groundY);
            this.start();
        }
    }
    burst(point) {
        const ring = this.add.circle(m2px(point.x), m2px(point.y), 40, 0xffe080, 0.7).setDepth(5);
        this.tweens.add({ targets: ring, alpha: 0, scale: 1.5, duration: 400, onComplete: () => ring.destroy() });
    }
    createPit() {
        this.pitCreated = true;
        this.add.rectangle(this.pitX, this.groundY, SAND_PIT_WIDTH, 80.9, 0xd8bb7b).setOrigin(0);
        this.add.rectangle(this.pitX, this.groundY - 2, 12, 5, 0xffffff);
        this.add.text(this.pitX, this.groundY - 35, '100 m ? long jump', { fontSize: '22px' });
    }

    start() {
        if (this.state === 'intro' || this.state === 'help') { this.state = 'running'; this.message.setVisible(false); this.accumulator = 0; }
    }
    help() {
        if (this.state === 'help') return this.start();
        if (this.state !== 'running') return;
        this.state = 'help'; this.touch.clear();
        if (this.demoMode) {
            this.message.setText('Demo paused\nClick or press H to resume\nD: manual play').setVisible(true);
            return;
        }
        this.message.setText('Q / W: opposing thigh and arm motion\nO / P: opposing calf motion\nReach the hurdle at 50 m and sand at 100 m\nClick or press H to resume').setVisible(true);
    }
    end(reason) {
        this.state = 'over'; this.runner.releaseMotors();
        this.bestScore = this.rules.highScore; this.registry.set('best', this.bestScore);
        this.message.setText(`${reason}: ${this.score.toFixed(1)} metres\nBest: ${this.bestScore.toFixed(1)} m\nSpace or R to restart`).setVisible(true);
    }
    createHurdle() {
        const x = this.hurdleX;
        // Athletics' explicit hurdle dimensions, filters and local anchors.
        // Only density/friction inherit Shape defaults; no Hurdle symbols supplied.
        const yOffset = this.groundY - (429.8 - 146.8 / 2);
        const base = this.world.createDynamicBody({ position: pl.Vec2(px2m(x), px2m(343 + yOffset)), awake: false });
        base.createFixture(pl.Box(px2m(67), px2m(12)), { density: 1, friction: 0.2, filterCategoryBits: CATEGORY_HURDLE, filterMaskBits: 65529 });
        const top = this.world.createDynamicBody({ position: pl.Vec2(px2m(x + 34.6), px2m(194.3 + yOffset)), awake: false });
        top.createFixture(pl.Box(px2m(21.5), px2m(146)), { density: 1, friction: 0.2, filterCategoryBits: CATEGORY_HURDLE, filterMaskBits: 65531 });
        this.world.createJoint(pl.RevoluteJoint({
            bodyA: top, bodyB: base,
            localAnchorA: pl.Vec2(px2m(7.2), px2m(149.2)), localAnchorB: pl.Vec2(px2m(41.8), px2m(0.5)),
            enableLimit: true, lowerAngle: 0, upperAngle: 0
        }));
        for (const [body, w, h] of [[base, 134, 24], [top, 43, 292]]) this.obstacles.push({ body, sprite: this.add.rectangle(0, 0, w, h, 0xf0e4db) });
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.D)) { this.scene.restart({ demo: !this.demoMode }); return; }
        if (Phaser.Input.Keyboard.JustDown(this.keys.R) || (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && this.state === 'over')) { this.scene.restart({ demo: this.demoMode }); return; }
        if (Phaser.Input.Keyboard.JustDown(this.keys.H)) this.help();
        if (this.demoMode) {
            if (this.state === 'running') {
                this.demo.update(Math.min(delta / 1000, 0.1));
                this.score = this.demo.distance;
                const x = this.score * PPM * 10;
                if (!this.obstacles.length && x > this.hurdleX - 1300) this.createHurdle();
                if (!this.pitCreated && x > this.pitX - 1300) this.createPit();
                if (this.demo.finished) {
                    this.state = 'over';
                    this.message.setText(`Demo complete: ${this.demo.targetDistance.toFixed(1)} metres\nR: replay demo | D: manual play`).setVisible(true);
                }
            }
            for (const key of ['Q', 'W', 'O', 'P']) {
                const pressed = this.state === 'running' && this.demo.controls[key];
                this.buttons[key].setTint(pressed ? 0xffcc66 : 0xffffff);
            }
            this.syncView();
            this.distanceText.setText(`DEMO: ${this.score.toFixed(1)} / ${this.demo.targetDistance.toFixed(1)} m`);
            return;
        }
        const controls = {};
        for (const key of ['Q', 'W', 'O', 'P']) {
            controls[key] = { isDown: this.keys[key].isDown || [...this.touch.values()].includes(key) };
            this.buttons[key].setTint(controls[key].isDown ? 0xffcc66 : 0xffffff);
        }
        if (this.state === 'intro' && Object.values(controls).some(key => key.isDown)) this.start();
        if (this.state === 'running' || (this.state === 'over' && !this.rules.pausedOnLanding)) {
            this.accumulator += Math.min(delta / 1000, 0.1);
            while (this.accumulator >= STEP && !this.rules.pausedOnLanding) {
                if (this.state === 'running') this.runner.updateControls(controls);
                else this.runner.updateAnkles();
                this.runner.stabilize();
                this.world.step(STEP, WORLD_DEFAULTS.iterations, WORLD_DEFAULTS.iterations);
                this.rules.timeElapsed += STEP;
                this.accumulator -= STEP;
                this.rules.everyFrame(this.runner.body.body.getWorldCenter().x, this.runner.head.body.getLinearVelocity().x);
                this.score = this.rules.score;
                const x = m2px(this.runner.body.body.getWorldCenter().x);
                if (!this.obstacles.length && x > this.hurdleX - 1000) this.createHurdle();
                if (!this.pitCreated && x > this.pitX - 1300) this.createPit();
                if (this.state === 'running' && this.rules.GameOver) this.end(this.rules.JumpLanded ? 'Jump landed' : 'You fell');
            }
        }
        this.syncView();
        this.distanceText.setText(`${this.score.toFixed(1)} metres    Best: ${this.bestScore.toFixed(1)} m`);
    }

    syncView() {
        this.runner.syncSprites();
        for (const { body, sprite } of this.obstacles) { sprite.setPosition(m2px(body.getPosition().x), m2px(body.getPosition().y)); sprite.rotation = body.getAngle(); }
        this.cameras.main.scrollX = m2px(this.runner.body.body.getWorldCenter().x) - 220;
    }
}
