import test from 'node:test';
import assert from 'node:assert/strict';
import { Athletics, SAND_PIT_AT, WORLD_DEFAULTS, setFlagSpeed, stepSpring } from '../js/Athletics.js';

test('only the four named HitBox parts end a run on track contact', () => {
    for (const part of ['chead', 'crfarm', 'clfarm', 'cruarm']) {
        const game = new Athletics();
        const effect = game.contactAdded(part, 'track2', { x: 23.46 }, 6);
        game.everyFrame(100, 0);
        assert.equal(game.GameOver, true);
        assert.equal(game.score, 2.3);
        assert.equal(effect.sound, 'Crunch_sound');
        assert.equal(game.pausedOnLanding, undefined);
    }
    for (const part of ['cbody', 'pelvis', 'cluarm', 'clthigh', 'crcalf', 'clfoot']) {
        const game = new Athletics();
        game.contactAdded(part, 'track', { x: 20 });
        assert.equal(game.GameOver, false);
    }
    const game = new Athletics();
    game.contactAdded('chead', 'hurdle1', { x: 20 });
    assert.equal(game.GameOver, false);
});

test('FootBox uses strict thresholds and freezes on foot landing', () => {
    const game = new Athletics();
    const contact = x => game.contactAdded('crfoot', 'track1', { x: x / WORLD_DEFAULTS.scale });
    contact(SAND_PIT_AT - 220);
    assert.equal(game.Jumped, false);
    contact(SAND_PIT_AT - 219);
    assert.equal(game.Jumped, true);
    assert.equal(game.JumpLanded, false);
    contact(SAND_PIT_AT);
    assert.equal(game.JumpLanded, false);
    assert.equal(contact(SAND_PIT_AT + 41).burst, true);
    game.everyFrame(900, 0);
    assert.equal(game.GameOver, true);
    assert.equal(game.pausedOnLanding, true);
    assert.equal(game.score, 100.1);
    assert.equal(game.highScore, 100.1);
});

test('a fall after Jumped uses jump ending but retains post-fall simulation', () => {
    const game = new Athletics();
    game.Jumped = true;
    game.contactAdded('chead', 'track', { x: 1001 }, 2);
    game.everyFrame(10, 0);
    assert.equal(game.JumpLanded, true);
    assert.equal(game.pausedOnLanding, undefined);
    assert.equal(game.score, 100.1);
});

test('score, best and crowd speed follow Athletics; new run clears run state', () => {
    const game = new Athletics(9);
    game.everyFrame(-2.6, 17);
    assert.equal(game.score, -0.3);
    assert.equal(game.crowdVolume, 1);
    game.Muted = true;
    game.everyFrame(1, 17);
    assert.equal(game.crowdVolume, 0);
    for (let i = 0; i < 40; i++) game.everyFrame(1, 0);
    assert.equal(game.speedHistory.length, 30);
    const reset = new Athletics(game.highScore);
    assert.equal(reset.highScore, 9);
    assert.equal(reset.GameOver, false);
    assert.equal(reset.Jumped, false);
    assert.equal(reset.JumpLanded, false);
    assert.equal(reset.score, 0);
});

test('Joint flags select speeds and wake bodies; spring uses joint speed', () => {
    let speed, torque, wakes = 0;
    const body = { setAwake: value => { if (value) wakes++; } };
    const joint = { setMotorSpeed: value => { speed = value; }, getBodyA: () => body, getBodyB: () => body,
        getJointAngle: () => -0.5, getJointSpeed: () => 2, setMaxMotorTorque: value => { torque = value; } };
    setFlagSpeed(joint, true, { speed1: 3, speed2: -7 });
    assert.equal(speed, -7);
    setFlagSpeed(joint, false, { speed1: 3, speed2: -7 });
    assert.equal(speed, 3);
    assert.equal(wakes, 4);
    stepSpring(joint, { spring: true, springConstant: 10, springDamping: 1 });
    assert.equal(torque, 3);
    assert.equal(speed, 1000000);
});
