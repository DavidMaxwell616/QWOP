
// const hipLimits = [-0.8, 0.8];
// const kneeLimits = [-1.2, 0.1];
// const ankleLimits = [-0.6, 0.6];
// const shoulderLimits = [-1.0, 1.0];
// const elbowLimits = [-1.2, 0.2];
/*
 BODY PART DIMENSIONS
 body: 222 x 435 1.959
 thigh: 120 x 153 1.275
 leg: 68 x 183 2.651
 foot: 148 x 64 .432 
 upperArm: 112 x 189 1.6875
 lowerArm: 100 x 212 2.12
 head: 180 x 237 1.316
 */


// const hipLimits = [0, 0];
// const pelvisLimits = [-0.6, 1.6];
// const kneeLimits = [0, 1.6];
// const ankleLimits = [-0.6, 0.6];
// const shoulderLimits = [-1.0, 1.0];
// const elbowLimits = [-1.2, 0.2];
import { MOTOR_TORQUE, originX, originY, CATEGORY_BODYPARTS, MASK_BODYPARTS } from "./config.js";
const pl = planck;
const m2px = (m) => m * PPM;
const px2m = (px) => px / PPM;
const PPM = 30;


export class Runner {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.lowerLeftArmOffset = { x: 0, y: 40 };
        this.upperLeftArmOffset = { x: 0, y: - 20 };
        this.leftThighOffset = { x: 0, y: 70 };
        this.leftFootOffset = { x: 10, y: 172 };
        this.leftLegOffset = { x: -10, y: 140 };
        this.rightFootOffset = { x: 10, y: 172 };
        this.rightLegOffset = { x: -10, y: 140 };
        this.rightThighOffset = { x: 0, y: 70 };
        this.headOffset = { x: 0, y: -95 };
        this.backOffset = { x: 0, y: 0 };
        this.pelvisOffset = { x: 0, y: 0 };
        this.lowerRightArmOffset = { x: 0, y: 40 };
        this.upperRightArmOffset = { x: 0, y: - 20 };
        this.bodyOffset = { x: 0, y: 0 };


        this.motorTorque = MOTOR_TORQUE ?? 140;
        this.shoulderLimits = [-1.8, 1.8];
        this.elbowLimits = [-1.6, 0.2];
        this.hipLimits = [-0.5, 0.5];
        this.pelvisLimits = [-1.1, 1.1];
        this.kneeLimits = [-0.1, 2.0];
        this.ankleLimits = [-0.7, 0.7];
        this.neckLimits = [-0.12, 0.12];

        this._accum = 0;
        this.targets = {
            hipBack: 0,
            leftHip: 0.2,
            rightHip: 0.2,
            leftKnee: 0.6,
            rightKnee: 0.6,
            leftAnkle: 0,
            rightAnkle: 0,
            leftShoulder: 0.2,
            rightShoulder: 0.2,
            leftElbow: 1.0,
            rightElbow: 1.0
        };
        this.S = {
            body: { w: 71, h: 140 },
            pelvis: { w: 42, h: 42 },
            thigh: { w: 62, h: 80 },
            leg: { w: 30, h: 80 },
            foot: { w: 50, h: 23 },
            upperArm: { w: 47, h: 80 },
            lowerArm: { w: 43, h: 80 },
            head: { r: 35 }
        };

        this.v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        // Parts
        this.parts = {
            head: this.makePartCircle("head", originX + this.headOffset.x, originY + this.headOffset.y, this.S.head.r, 0.8),
            pelvis: this.makePartRect("pelvis", originX + this.pelvisOffset.x, originY + this.pelvisOffset.y, this.S.pelvis.w, this.S.pelvis.h, 1.2),
            lowerLeftArm: this.makePartRect("lower_arm", originX + this.lowerLeftArmOffset.x, originY + this.lowerLeftArmOffset.y, this.S.lowerArm.w, this.S.lowerArm.h),
            upperLeftArm: this.makePartRect("upper_arm", originX + this.upperLeftArmOffset.x, originY + this.upperLeftArmOffset.y, this.S.upperArm.w, this.S.upperArm.h),
            leftLeg: this.makePartRect("lower_leg", originX + this.leftLegOffset.x, originY + this.leftLegOffset.y, this.S.leg.w, this.S.leg.h),
            leftThigh: this.makePartRect("thigh", originX + this.leftThighOffset.x, originY + this.leftThighOffset.y, this.S.thigh.w, this.S.thigh.h),
            leftFoot: this.makePartRect("foot", originX + this.leftFootOffset.x, originY + this.leftFootOffset.y, this.S.foot.w, this.S.foot.h),

            rightFoot: this.makePartRect("foot", originX + this.rightFootOffset.x, originY + this.rightFootOffset.y, this.S.foot.w, this.S.foot.h),
            rightLeg: this.makePartRect("lower_leg", originX + this.rightLegOffset.x, originY + this.rightLegOffset.y, this.S.leg.w, this.S.leg.h),
            rightThigh: this.makePartRect("thigh", originX + this.rightThighOffset.x, originY + this.rightThighOffset.y, this.S.thigh.w, this.S.thigh.h),

            body: this.makePartRect("torso", originX + this.bodyOffset.x, originY + this.bodyOffset.y, this.S.body.w, this.S.body.h, 1.2),

            lowerRightArm: this.makePartRect("lower_arm", originX + this.lowerRightArmOffset.x, originY + this.lowerRightArmOffset.y, this.S.lowerArm.w, this.S.lowerArm.h),
            upperRightArm: this.makePartRect("upper_arm", originX + this.upperRightArmOffset.x, originY + this.upperRightArmOffset.y, this.S.upperArm.w, this.S.upperArm.h),

        };

        // Aliases for convenience
        this.head = this.parts.head;
        this.body = this.parts.body;
        this.pelvis = this.parts.pelvis;

        this.upperLeftArm = this.parts.upperLeftArm;
        this.lowerLeftArm = this.parts.lowerLeftArm;
        this.upperRightArm = this.parts.upperRightArm;
        this.lowerRightArm = this.parts.lowerRightArm;

        this.leftThigh = this.parts.leftThigh;
        this.leftLeg = this.parts.leftLeg;
        this.leftFoot = this.parts.leftFoot;
        this.rightThigh = this.parts.rightThigh;
        this.rightLeg = this.parts.rightLeg;
        this.rightFoot = this.parts.rightFoot;

        // Joints
        this.joints = {
            neck: this.world.createJoint(
                pl.RevoluteJoint(
                    {
                        enableMotor: true,
                        motorSpeed: 0,
                        maxMotorTorque: this.motorTorque * 0.35,
                        enableLimit: true,
                        lowerAngle: this.neckLimits[0],
                        upperAngle: this.neckLimits[1]
                    },
                    this.head.body,
                    this.body.body,
                    this.v(originX, originY - 40)
                )
            ),
            leftShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: this.shoulderLimits[0],
                    upperAngle: this.shoulderLimits[1]
                }, this.upperLeftArm.body, this.body.body, this.v(originX, originY - 40))
            ),

            rightShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: this.shoulderLimits[0],
                    upperAngle: this.shoulderLimits[1]
                }, this.upperRightArm.body, this.body.body, this.v(originX, originY - 40))
            ),

            leftElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperLeftArm.body, this.lowerLeftArm.body, this.v(originX, originY + 10))
            ),

            rightElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperRightArm.body, this.lowerRightArm.body, this.v(originX, originY + 10))
            ),

            hipBack: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.hipLimits[0],
                    upperAngle: this.hipLimits[1]
                }, this.body.body, this.pelvis.body, this.v(originX, originY + 20))
            ),

            leftHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.leftThigh.body, this.v(originX, originY + 50))
            ),
            rightHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.rightThigh.body, this.v(originX, originY + 50))
            ),

            leftKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.leftThigh.body, this.leftLeg.body, this.v(originX, originY + 120))
            ),

            rightKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.rightThigh.body, this.rightLeg.body, this.v(originX, originY + 120))
            ),
            leftAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.leftLeg.body, this.leftFoot.body, this.v(originX, originY + 122))
            ),

            rightAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.rightLeg.body, this.rightFoot.body, this.v(originX, originY + 122))
            ),

        };
        this.leftSide = [
            this.upperLeftArm, this.lowerLeftArm,
            this.leftThigh, this.leftLeg, this.leftFoot
        ];

        this.rightSide = [
            this.upperRightArm, this.lowerRightArm,
            this.rightThigh, this.rightLeg, this.rightFoot
        ];

        this.allParts = Object.values(this.parts);
        this.allJoints = Object.values(this.joints);
    }

    makePartRect(name, x, y, w, h, density = 1) {
        // replace with your actual implementation
        return this.scene.makePartRect(name, x, y, w, h, density);
    }

    makePartCircle(name, x, y, r, density = 1) {
        // replace with your actual implementation
        return this.scene.makePartCircle(name, x, y, r, density);
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

        const sprite = this.scene.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(rPx * 2, rPx * 2);
        sprite._pbody = body;

        return { body, sprite, fix };
    }

    setDebugVisible(visible) {
        for (const part of this.allParts) {
            if (part.image) part.image.setVisible(visible);
            if (part.graphics) part.graphics.setVisible(visible);
        }
    }

    destroy() {
        for (const joint of this.allJoints) {
            this.world.destroyJoint(joint);
        }
        for (const part of this.allParts) {
            this.world.destroyBody(part.body);
            if (part.image) part.image.destroy();
            if (part.graphics) part.graphics.destroy();
        }
    }
    // --- fixed-step stepping ---
    stepWorld(dtSec) {
        const fixed = 1 / 60;
        dtSec = Math.min(dtSec, 1 / 30); // clamp spikes harder
        this.body.body.applyForceToCenter(pl.Vec2(2, 0), true);
        this._accum += dtSec;

        const velIters = 20;
        const posIters = 10;

        while (this._accum >= fixed) {
            this.applyPoseHold();
            this.world.step(fixed, velIters, posIters);
            this._accum -= fixed;
        }
    }
    applyPoseHold() {
        if (!this.poseHoldEnabled) return;

        this.driveJointToAngle(this.joints.hipBack, this.targets.hipBack, 10, 2.2, 6);

        this.driveJointToAngle(this.joints.leftHipLeg, this.targets.leftHip, 8, 1.6, 5);
        this.driveJointToAngle(this.joints.rightHipLeg, this.targets.rightHip, 8, 1.6, 5);

        this.driveJointToAngle(this.joints.leftKnee, this.targets.leftKnee, 9, 1.8, 5);
        this.driveJointToAngle(this.joints.rightKnee, this.targets.rightKnee, 9, 1.8, 5);

        this.driveJointToAngle(this.joints.leftAnkle, this.targets.leftAnkle, 8, 1.5, 5);
        this.driveJointToAngle(this.joints.rightAnkle, this.targets.rightAnkle, 8, 1.5, 5);

        this.driveJointToAngle(this.joints.leftShoulder, this.targets.leftShoulder, 5, 1.0, 4);
        this.driveJointToAngle(this.joints.rightShoulder, this.targets.rightShoulder, 5, 1.0, 4);

        this.driveJointToAngle(this.joints.leftElbow, this.targets.leftElbow, 4, 0.8, 3);
        this.driveJointToAngle(this.joints.rightElbow, this.targets.rightElbow, 4, 0.8, 3);
    }
    driveJointToAngle(joint, targetAngle, stiffness = 8, damping = 1.5, maxSpeed = 6) {
        const angleError = targetAngle - joint.getJointAngle();
        const speedError = joint.getJointSpeed();
        const motorSpeed = Phaser.Math.Clamp(angleError * stiffness - speedError * damping, -maxSpeed, maxSpeed);
        joint.setMotorSpeed(motorSpeed);
    }
    syncSprites() {
        const sync = (part) => {
            const p = part.body.getPosition();
            part.sprite.x = m2px(p.x);
            part.sprite.y = m2px(p.y);
            part.sprite.rotation = part.body.getAngle();
        };

        sync(this.head);
        sync(this.body);
        sync(this.pelvis);
        sync(this.upperLeftArm);
        sync(this.lowerLeftArm);
        sync(this.upperRightArm);
        sync(this.lowerRightArm);
        sync(this.leftThigh);
        sync(this.leftLeg);
        sync(this.leftFoot);
        sync(this.rightThigh);
        sync(this.rightLeg);
        sync(this.rightFoot);
    }

    resetBody() {
        const set = (part, xPx, yPx) => {
            part.body.setTransform(pl.Vec2(px2m(xPx), px2m(yPx)), 0);
            part.body.setLinearVelocity(pl.Vec2(0, 0));
            part.body.setAngularVelocity(0);
        };

        set(this.head, originX + this.headOffset.x, originY + this.headOffset.y);
        set(this.body, originX + this.backOffset.x, originY + this.backOffset.y);
        set(this.pelvis, originX + this.pelvisOffset.x, originY + this.pelvisOffset.y);

        set(this.rightThigh, originX + this.rightThighOffset.x, originY + this.rightThighOffset.y);
        set(this.rightLeg, originX + this.rightLegOffset.x, originY + this.rightThighOffset.y);
        set(this.rightFoot, originX + this.rightFootOffset.x, originY + this.rightFootOffset.y);

        set(this.leftThigh, originX + this.leftThighOffset.x, originY + this.leftThighOffset.y);
        set(this.leftLeg, originX + this.leftLegOffset.x, originY + this.leftLegOffset.y);
        set(this.leftFoot, originX + this.leftFootOffset.x, originY + this.leftFootOffset.y);

        set(this.upperRightArm, originX + this.upperRightArmOffset.x, originY + this.upperRightArmOffset.y);
        set(this.lowerRightArm, originX + this.lowerRightArmOffset.x, originY + this.lowerRightArmOffset.y);
        set(this.upperLeftArm, originX + this.upperLeftArmOffset.x, originY - this.upperRightArmOffset.y);
        set(this.lowerLeftArm, originX + this.lowerLeftArmOffset.x, originY + this.lowerLeftArmOffset.y);

        this.scene.handleQReleased();
        this.scene.handleWReleased();
        this.scene.handleOReleased();
        this.scene.handlePReleased();

        this.nowMs = Date.now();
    }
    applySelfBalanceTorque() {
        const torso = this.body.body;
        const pelvis = this.pelvis.body;

        const torsoAngle = torso.getAngle();
        const torsoOmega = torso.getAngularVelocity();

        const pelvisAngle = pelvis.getAngle();
        const pelvisOmega = pelvis.getAngularVelocity();

        const vx = torso.getLinearVelocity().x;

        // Lean slightly into travel direction
        const desiredTorso = Phaser.Math.Clamp(-vx * 0.08, -0.18, 0.18);
        const desiredPelvis = desiredTorso * 0.5;

        const torsoKp = 70;
        const torsoKd = 10;
        const pelvisKp = 45;
        const pelvisKd = 7;

        const torsoTorque = Phaser.Math.Clamp(
            (desiredTorso - torsoAngle) * torsoKp - torsoOmega * torsoKd,
            -140,
            140
        );

        const pelvisTorque = Phaser.Math.Clamp(
            (desiredPelvis - pelvisAngle) * pelvisKp - pelvisOmega * pelvisKd,
            -90,
            90
        );

        torso.applyTorque(torsoTorque, true);
        pelvis.applyTorque(pelvisTorque, true);
    }
}