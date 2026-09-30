import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Use the game's pinned Planck UMD build: PLANCK_PATH=/path/to/planck.cjs npm test.
// No browser/renderer is mocked as verified; these tests exercise physics and scene state.
test('Planck scene: controls, contact scoring, ragdoll, reset and hurdle filters', {
    skip: !process.env.PLANCK_PATH && 'Set PLANCK_PATH to the Planck 0.3.31 CommonJS/UMD build'
}, async () => {
    globalThis.window = globalThis;
    globalThis.planck = createRequire(import.meta.url)(process.env.PLANCK_PATH);
    globalThis.Phaser = { Scene: class {}, Input: { Keyboard: { JustDown: () => false } } };
    const { GameScene } = await import('../js/GameScene.js');
    const dimensions = { body: [57, 131], pelvis: [29, 25], thigh: [40, 106], leg: [30, 100],
        foot: [54, 27], upperArm: [30, 78], lowerArm: [27, 89], head: [43, 53] };
    const display = () => new Proxy({}, { get: (obj, key) => key in obj ? obj[key] : (...args) => obj.proxy });
    const object = () => { const obj = display(); obj.proxy = obj; return obj; };
    const registry = new Map();
    const scene = new GameScene();
    scene.add = { tileSprite: object, rectangle: object, text: object, image: object, circle: object };
    scene.registry = { get: key => registry.get(key), set: (key, value) => registry.set(key, value) };
    scene.textures = { get: key => ({ getSourceImage: () => ({ width: dimensions[key][0], height: dimensions[key][1] }) }) };
    scene.input = { addPointer() {}, on() {}, keyboard: { addKeys: names => Object.fromEntries(names.split(',').map(k => [k, { isDown: false }])), resetKeys() {} } };
    scene.game = { events: { on() {}, off() {} } };
    scene.events = { once() {} };
    scene.tweens = { add() {} };
    scene.cameras = { main: {} };
    scene.create();
    scene.start();
    const keys = pressed => Object.fromEntries(['Q', 'W', 'O', 'P'].map(k => [k, { isDown: pressed.includes(k) }]));
    scene.runner.updateControls(keys('QWOP'));
    assert.equal(scene.runner.joints.leftHipLeg.getMotorSpeed(), -3);
    assert.equal(scene.runner.joints.leftHipLeg.getLowerLimit(), -0.35);
    scene.runner.updateControls(keys('P'));
    assert.equal(scene.runner.joints.leftHipLeg.getLowerLimit(), -0.35);
    scene.runner.updateControls(keys(''));
    assert.equal(scene.runner.joints.leftHipLeg.getLowerLimit(), -0.35);
    assert.equal(scene.runner.joints.leftHipLeg.getMotorSpeed(), 0);
    // Drop the head onto the floor, exercising real pre-solve manifold point dispatch.
    scene.runner.head.body.setTransform(planck.Vec2(4, 13), 0);
    for (let i = 0; i < 120; i++) scene.update(i * 25, 25);
    assert.equal(scene.state, 'over');
    assert.equal(scene.rules.GameOver, true);
    const score = scene.score, elapsed = scene.rules.timeElapsed;
    scene.update(3025, 25);
    assert.equal(scene.score, score);
    assert(scene.rules.timeElapsed > elapsed);
    assert.equal(scene.runner.joints.leftKnee.isMotorEnabled(), false);
    assert.equal(scene.runner.joints.leftKnee.isLimitEnabled(), true);
    assert.equal(scene.runner.joints.rightKnee.isLimitEnabled(), true);
    assert.equal(scene.runner.joints.leftAnkle.isMotorEnabled(), true);
    for (const part of scene.runner.allParts) assert(Number.isFinite(part.body.getPosition().x));
    scene.createHurdle();
    assert.equal(scene.obstacles[0].body.getFixtureList().getFilterMaskBits(), 65529);
    assert.equal(scene.obstacles[1].body.getFixtureList().getFilterMaskBits(), 65531);
    scene.create();
    assert.equal(scene.state, 'intro');
    assert.equal(scene.rules.GameOver, false);
    assert.equal(scene.score, 0);
    // Real foot contact beyond 100 m must end with the landing score and pause.
    scene.start();
    scene.runner.rightFoot.body.setTransform(planck.Vec2(1001, 13.3), 0);
    scene.update(0, 25);
    assert.equal(scene.rules.JumpLanded, true);
    assert.equal(scene.rules.pausedOnLanding, true);
    const landingTime = scene.rules.timeElapsed;
    scene.update(25, 25);
    assert.equal(scene.rules.timeElapsed, landingTime);

    // Hold both thighs horizontal: the torso must follow through the hips.
    scene.create();
    scene.world.setGravity(planck.Vec2(0, 0));
    scene.world.destroyBody(scene.ground);
    scene.runner.releaseMotors();
    for (const part of [scene.runner.leftThigh, scene.runner.rightThigh]) {
        part.body.setTransform(part.body.getPosition(), Math.PI / 2);
        part.body.setType('static');
    }
    for (let i = 0; i < 120; i++) scene.world.step(0.025, 10, 10);
    assert(Math.abs(scene.runner.body.body.getAngle() - Math.PI / 2) < 0.4,
        'Torso must follow horizontal legs, including after a fall');

    // Drive each actual runner knee against its straight stop, then backward.
    // Isolate the joint so ground/hip forces do not hide the bending direction.
    for (const name of ['leftKnee', 'rightKnee']) {
        scene.create();
        const joint = scene.runner.joints[name];
        scene.world.setGravity(planck.Vec2(0, 0));
        for (const other of scene.runner.allJoints) {
            if (other !== joint) scene.world.destroyJoint(other);
        }
        scene.world.destroyBody(scene.ground);
        joint.getBodyA().setType('static');
        joint.setMotorSpeed(-3);
        for (let i = 0; i < 60; i++) scene.world.step(0.025, 10, 10);
        // Planck permits a small angular solver tolerance at a joint limit.
        assert(joint.getJointAngle() >= -0.04, `${name} hyperextended`);
        joint.setMotorSpeed(3);
        for (let i = 0; i < 30; i++) scene.world.step(0.025, 10, 10);
        assert(joint.getJointAngle() > 0.5, `${name} must still bend backward`);
        assert(joint.getJointAngle() <= 2.04, `${name} exceeded its bend limit`);
    }
});
