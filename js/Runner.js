
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
import { MOTOR_TORQUE, px2m, m2px, CATEGORY_BODYPARTS, MASK_BODYPARTS } from "./config.js";
const pl = planck;



export class Runner {
    constructor(scene, world, w, h, dimensions) {
        this.scene = scene;
        this.world = world;
        this.motorTorque = MOTOR_TORQUE ?? 140;
        this.shoulderLimits = [-1.8, 1.8];
        this.elbowLimits = [-1.6, 0.2];
        this.hipLimits = [-0.5, 0.5];
        this.pelvisLimits = [-1.1, 1.1];
        this.kneeLimits = [-0.1, 2.0];
        this.ankleLimits = [-0.7, 0.7];
        this.neckLimits = [-0.12, 0.12];
        this.originX = w * .2;
        this.originY = h / 2;
        this._accum = 0;
        this.motorState = {
            leftHip: 0,
            rightHip: 0,
            leftKnee: 0,
            rightKnee: 0
        };
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

        const offsets = {
            lowerLeftArmOffset: { x: 0, y: 40 },
            upperLeftArmOffset: { x: 0, y: - 20 },
            leftThighOffset: { x: 0, y: 70 },
            leftFootOffset: { x: 10, y: 172 },
            leftLegOffset: { x: -10, y: 140 },
            rightFootOffset: { x: 10, y: 172 },
            rightLegOffset: { x: -10, y: 140 },
            rightThighOffset: { x: 0, y: 70 },
            headOffset: { x: 0, y: -95 },
            backOffset: { x: 0, y: 0 },
            pelvisOffset: { x: 0, y: 0 },
            lowerRightArmOffset: { x: 0, y: 40 },
            upperRightArmOffset: { x: 0, y: - 20 },
            bodyOffset: { x: 0, y: 0 },

        };

        this.v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        this.parts = {
            head: this.makePartCircle("head", this.originX + offsets.headOffset.x, this.originY + offsets.headOffset.y, dimensions.head.w / 2, 0.8),
            pelvis: this.makePartRect("pelvis", this.originX + offsets.pelvisOffset.x, this.originY + offsets.pelvisOffset.y, dimensions.pelvis.w, dimensions.pelvis.h, 1.2),
            lowerLeftArm: this.makePartRect("lowerArm", this.originX + offsets.lowerLeftArmOffset.x, this.originY + offsets.lowerLeftArmOffset.y, dimensions.lowerArm.w, dimensions.lowerArm.h),
            upperLeftArm: this.makePartRect("upperArm", this.originX + offsets.upperLeftArmOffset.x, this.originY + offsets.upperLeftArmOffset.y, dimensions.upperArm.w, dimensions.upperArm.h),
            leftLeg: this.makePartRect("leg", this.originX + offsets.leftLegOffset.x, this.originY + offsets.leftLegOffset.y, dimensions.leg.w, dimensions.leg.h),
            leftThigh: this.makePartRect("thigh", this.originX + offsets.leftThighOffset.x, this.originY + offsets.leftThighOffset.y, dimensions.thigh.w, dimensions.thigh.h),
            leftFoot: this.makePartRect("foot", this.originX + offsets.leftFootOffset.x, this.originY + offsets.leftFootOffset.y, dimensions.foot.w, dimensions.foot.h),

            rightFoot: this.makePartRect("foot", this.originX + offsets.rightFootOffset.x, this.originY + offsets.rightFootOffset.y, dimensions.foot.w, dimensions.foot.h),
            rightLeg: this.makePartRect("leg", this.originX + offsets.rightLegOffset.x, this.originY + offsets.rightLegOffset.y, dimensions.leg.w, dimensions.leg.h),
            rightThigh: this.makePartRect("thigh", this.originX + offsets.rightThighOffset.x, this.originY + offsets.rightThighOffset.y, dimensions.thigh.w, dimensions.thigh.h),

            body: this.makePartRect("body", this.originX + offsets.bodyOffset.x, this.originY + offsets.bodyOffset.y, dimensions.body.w, dimensions.body.h, 1.2),

            lowerRightArm: this.makePartRect("lowerArm", this.originX + offsets.lowerRightArmOffset.x, this.originY + offsets.lowerRightArmOffset.y, dimensions.lowerArm.w, dimensions.lowerArm.h),
            upperRightArm: this.makePartRect("upperArm", this.originX + offsets.upperRightArmOffset.x, this.originY + offsets.upperRightArmOffset.y, dimensions.upperArm.w, dimensions.upperArm.h),

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
                    this.v(this.originX, this.originY - 40)
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
                }, this.upperLeftArm.body, this.body.body, this.v(this.originX, this.originY - 40))
            ),

            rightShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: this.shoulderLimits[0],
                    upperAngle: this.shoulderLimits[1]
                }, this.upperRightArm.body, this.body.body, this.v(this.originX, this.originY - 40))
            ),

            leftElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperLeftArm.body, this.lowerLeftArm.body, this.v(this.originX, this.originY + 10))
            ),

            rightElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperRightArm.body, this.lowerRightArm.body, this.v(this.originX, this.originY + 10))
            ),

            hipBack: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.hipLimits[0],
                    upperAngle: this.hipLimits[1]
                }, this.body.body, this.pelvis.body, this.v(this.originX, this.originY + 20))
            ),

            leftHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.leftThigh.body, this.v(this.originX, this.originY + 50))
            ),
            rightHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.rightThigh.body, this.v(this.originX, this.originY + 50))
            ),

            leftKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.leftThigh.body, this.leftLeg.body, this.v(this.originX, this.originY + 120))
            ),

            rightKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.rightThigh.body, this.rightLeg.body, this.v(this.originX, this.originY + 120))
            ),
            leftAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.leftLeg.body, this.leftFoot.body, this.v(this.originX, this.originY + 122))
            ),

            rightAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.rightLeg.body, this.rightFoot.body, this.v(this.originX, this.originY + 122))
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
        return this.scene.makePartRect(name, x, y, w, h, density);
    }

    makePartCircle(name, x, y, r, density = 1) {
        return this.scene.makePartCircle(name, x, y, r, density);
    }

    setDebugVisible(visible) {
        for (const part of this.allParts) {
            if (part.image) part.image.setVisible(visible);
            if (part.graphics) part.graphics.setVisible(visible);
        }
    }

    destroy() {

        // Hide everything first
        for (const part of this.allParts) {

            if (part.sprite) {
                part.sprite.setVisible(false);
            }

            if (part.image) {
                part.image.setVisible(false);
            }

            if (part.graphics) {
                part.graphics.setVisible(false);
            }
        }

        // Destroy joints
        for (const joint of this.allJoints) {
            this.world.destroyJoint(joint);
        }

        // Destroy bodies + display objects
        for (const part of this.allParts) {

            this.world.destroyBody(part.body);

            if (part.sprite) {
                part.sprite.destroy();
            }

            if (part.image) {
                part.image.destroy();
            }

            if (part.graphics) {
                part.graphics.destroy();
            }
        }
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

        this.joints.leftHipLeg.setMotorSpeed(this.motorState.leftHip);
        this.joints.rightHipLeg.setMotorSpeed(this.motorState.rightHip);
        this.joints.leftKnee.setMotorSpeed(this.motorState.leftKnee);
        this.joints.rightKnee.setMotorSpeed(this.motorState.rightKnee);

        // Passive arm swing based on torso tilt for comic balance.
        const torsoAngle = this.parts.body.sprite.angle;
        const armBias = Phaser.Math.Clamp(-torsoAngle * 2.5, -2.0, 2.0);
        this.parts.upperLeftArm.body.applyTorque(-armBias * 0.8, true);
        this.parts.upperRightArm.body.applyTorque(armBias * 0.8, true);
    }

    stabilize() {
        // Gentle upright assistance so it is playable but still awkward.
        const torso = this.parts.body.body;
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