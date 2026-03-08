const pl = planck;
const SCALE = 80;
const CATEGORY_GROUND = 0x0001;
const CATEGORY_RUNNER = 0x0002;

export class Runner {
    constructor(scene, world, x, y) {
        this.scene = scene;
        this.world = world;
        this.startX = x;
        this.startY = y;
        this.bodies = {};
        this.sprites = {};
        this.joints = {};
        this.motorState = {
            leftHip: 0,
            rightHip: 0,
            leftKnee: 0,
            rightKnee: 0
        };
        this.distance = 0;
        this.build(x, y);
    }

    destroy() {
        Object.values(this.sprites).forEach(s => s.destroy());
        const joints = Object.values(this.joints);
        joints.forEach(j => this.world.destroyJoint(j));
        Object.values(this.bodies).forEach(b => this.world.destroyBody(b));
        this.bodies = {};
        this.sprites = {};
        this.joints = {};
    }

    reset() {
        this.destroy();
        this.build(this.startX, this.startY);
    }

    createPart(name, key, x, y, w, h, opts = {}) {
        const body = this.world.createDynamicBody({
            position: pl.Vec2(x, y),
            angle: opts.angle || 0,
            linearDamping: opts.linearDamping ?? 0.15,
            angularDamping: opts.angularDamping ?? 1.4
        });

        body.createFixture(pl.Box(w * 0.5, h * 0.5), {
            density: opts.density ?? 1.0,
            friction: opts.friction ?? 0.9,
            restitution: opts.restitution ?? 0.0,
            filterCategoryBits: CATEGORY_RUNNER,
            filterMaskBits: CATEGORY_GROUND | CATEGORY_RUNNER
        });

        const sprite = this.scene.add.rectangle(0, 0, w * SCALE, h * SCALE, opts.color || 0xdbeafe);
        sprite.setStrokeStyle(2, 0x0f172a, 1);
        sprite.setOrigin(0.5);

        this.bodies[name] = body;
        this.sprites[name] = sprite;
        return body;
    }

    build(x, y) {
        // Body proportions in meters.
        const torsoW = 0.30, torsoH = 0.82;
        const headS = 0.28;
        const upperLegW = 0.16, upperLegH = 0.48;
        const lowerLegW = 0.14, lowerLegH = 0.50;
        const footW = 0.24, footH = 0.09;
        const upperArmW = 0.13, upperArmH = 0.38;
        const lowerArmW = 0.12, lowerArmH = 0.38;

        const torso = this.createPart('torso', 'torso', x, y - 0.95, torsoW, torsoH, {
            density: 1.8,
            angularDamping: 2.2,
            color: 0x60a5fa
        });

        const head = this.world.createDynamicBody({
            position: pl.Vec2(x, y - 1.55),
            linearDamping: 0.15,
            angularDamping: 1.0
        });
        head.createFixture(pl.Circle(headS * 0.5), {
            density: 0.8,
            friction: 0.6,
            restitution: 0.0,
            filterCategoryBits: CATEGORY_RUNNER,
            filterMaskBits: CATEGORY_GROUND | CATEGORY_RUNNER
        });
        this.bodies.head = head;
        // const headSprite = this.scene.add.circle(0, 0, headS * SCALE * 0.5, 0xf8fafc);
        // headSprite.setStrokeStyle(2, 0x0f172a, 1);
        const headSprite = this.scene.add.image(0, 0, 'head');
        this.sprites.head = headSprite;

        this.createPart('leftUpperLeg', 'thigh', x - 0.14, y - 0.34, upperLegW, upperLegH, { density: 1.5, color: 0xf59e0b });
        this.createPart('rightUpperLeg', 'thigh', x + 0.14, y - 0.34, upperLegW, upperLegH, { density: 1.5, color: 0xf59e0b });
        this.createPart('leftLowerLeg', 'lower_leg', x - 0.14, y + 0.16, lowerLegW, lowerLegH, { density: 1.2, color: 0xfbbf24 });
        this.createPart('rightLowerLeg', 'lower_leg', x + 0.14, y + 0.16, lowerLegW, lowerLegH, { density: 1.2, color: 0xfbbf24 });
        this.createPart('leftFoot', 'foot', x - 0.14, y + 0.48, footW, footH, { density: 0.75, friction: 0.95, angularDamping: 0.45, color: 0x334155 });
        this.createPart('rightFoot', 'foot', x + 0.14, y + 0.48, footW, footH, { density: 0.75, friction: 0.95, angularDamping: 0.45, color: 0x334155 });
        this.createPart('leftUpperArm', 'upper_arm', x - 0.28, y - 1.0, upperArmW, upperArmH, { density: 0.8, color: 0x10b981 });
        this.createPart('rightUpperArm', 'upper_arm', x + 0.28, y - 1.0, upperArmW, upperArmH, { density: 0.8, color: 0x10b981 });
        this.createPart('leftLowerArm', 'lower_arm', x - 0.28, y - 0.62, lowerArmW, lowerArmH, { density: 0.7, color: 0x34d399 });
        this.createPart('rightLowerArm', 'lower_arm', x + 0.28, y - 0.62, lowerArmW, lowerArmH, { density: 0.7, color: 0x34d399 });

        // Neck
        this.joints.neck = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -0.35,
            upperAngle: 0.35
        }, torso, head, pl.Vec2(x, y - 1.34)));

        // Hips
        this.joints.leftHip = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true,
            maxMotorTorque: 120,
            motorSpeed: 0,
            enableLimit: true,
            lowerAngle: -1.15,
            upperAngle: 0.75
        }, torso, this.bodies.leftUpperLeg, pl.Vec2(x - 0.13, y - 0.60)));

        this.joints.rightHip = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true,
            maxMotorTorque: 120,
            motorSpeed: 0,
            enableLimit: true,
            lowerAngle: -0.75,
            upperAngle: 1.15
        }, torso, this.bodies.rightUpperLeg, pl.Vec2(x + 0.13, y - 0.60)));

        // Knees
        this.joints.leftKnee = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true,
            maxMotorTorque: 95,
            motorSpeed: 0,
            enableLimit: true,
            lowerAngle: -1.45,
            upperAngle: 0.12
        }, this.bodies.leftUpperLeg, this.bodies.leftLowerLeg, pl.Vec2(x - 0.14, y - 0.08)));

        this.joints.rightKnee = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true,
            maxMotorTorque: 95,
            motorSpeed: 0,
            enableLimit: true,
            lowerAngle: -1.45,
            upperAngle: 0.12
        }, this.bodies.rightUpperLeg, this.bodies.rightLowerLeg, pl.Vec2(x + 0.14, y - 0.08)));

        // Ankles
        this.joints.leftAnkle = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -0.9,
            upperAngle: 0.7
        }, this.bodies.leftLowerLeg, this.bodies.leftFoot, pl.Vec2(x - 0.14, y + 0.40)));

        this.joints.rightAnkle = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -0.9,
            upperAngle: 0.7
        }, this.bodies.rightLowerLeg, this.bodies.rightFoot, pl.Vec2(x + 0.14, y + 0.40)));

        // Shoulders and elbows for extra chaos / balance.
        this.joints.leftShoulder = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -1.8,
            upperAngle: 1.0
        }, torso, this.bodies.leftUpperArm, pl.Vec2(x - 0.20, y - 1.20)));

        this.joints.rightShoulder = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -1.0,
            upperAngle: 1.8
        }, torso, this.bodies.rightUpperArm, pl.Vec2(x + 0.20, y - 1.20)));

        this.joints.leftElbow = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -1.4,
            upperAngle: 0.2
        }, this.bodies.leftUpperArm, this.bodies.leftLowerArm, pl.Vec2(x - 0.28, y - 0.80)));

        this.joints.rightElbow = this.world.createJoint(pl.RevoluteJoint({
            enableLimit: true,
            lowerAngle: -1.4,
            upperAngle: 0.2
        }, this.bodies.rightUpperArm, this.bodies.rightLowerArm, pl.Vec2(x + 0.28, y - 0.80)));
    }

    updateControls(keys) {
        const hipSpeed = 4.8;
        const kneeSpeed = 6.5;

        // Q / W drive hips opposite to create stride.
        if (keys.Q.isDown) {
            this.motorState.leftHip = -hipSpeed;
            this.motorState.rightHip = hipSpeed;
        } else if (keys.W.isDown) {
            this.motorState.leftHip = hipSpeed;
            this.motorState.rightHip = -hipSpeed;
        } else {
            this.motorState.leftHip = 0;
            this.motorState.rightHip = 0;
        }

        // O / P drive knees opposite.
        if (keys.O.isDown) {
            this.motorState.leftKnee = -kneeSpeed;
            this.motorState.rightKnee = kneeSpeed * 0.9;
        } else if (keys.P.isDown) {
            this.motorState.leftKnee = kneeSpeed * 0.9;
            this.motorState.rightKnee = -kneeSpeed;
        } else {
            this.motorState.leftKnee = 0;
            this.motorState.rightKnee = 0;
        }

        this.joints.leftHip.setMotorSpeed(this.motorState.leftHip);
        this.joints.rightHip.setMotorSpeed(this.motorState.rightHip);
        this.joints.leftKnee.setMotorSpeed(this.motorState.leftKnee);
        this.joints.rightKnee.setMotorSpeed(this.motorState.rightKnee);

        // Passive arm swing based on torso tilt for comic balance.
        const torsoAngle = this.bodies.torso.getAngle();
        const armBias = Phaser.Math.Clamp(-torsoAngle * 2.5, -2.0, 2.0);
        this.bodies.leftUpperArm.applyTorque(-armBias * 0.8, true);
        this.bodies.rightUpperArm.applyTorque(armBias * 0.8, true);
    }

    stabilize() {
        // Gentle upright assistance so it is playable but still awkward.
        const torso = this.bodies.torso;
        const angle = torso.getAngle();
        const angVel = torso.getAngularVelocity();
        const torque = (-angle * 28) - (angVel * 5.2);
        torso.applyTorque(torque, true);

        // Slight forward lean helps movement.
        const vel = torso.getLinearVelocity();
        torso.applyForceToCenter(pl.Vec2(5.5, 0), true);
        if (vel.x > 6.5) {
            torso.setLinearVelocity(pl.Vec2(6.5, vel.y));
        }
    }

    syncSprites() {
        for (const [name, body] of Object.entries(this.bodies)) {
            const pos = body.getPosition();
            const spr = this.sprites[name];
            spr.x = pos.x * SCALE;
            spr.y = pos.y * SCALE;
            spr.rotation = body.getAngle();
        }
        this.distance = Math.max(this.distance, this.bodies.torso.getPosition().x - this.startX);
    }
}
