import { MOTOR_TORQUE, px2m, m2px, CATEGORY_BODYPARTS, MASK_BODYPARTS } from "./config.js";
const pl = planck;

export class Runner {
    constructor(scene, world, w, h, dimensions) {
        this.scene = scene;
        this.world = world;
        this.distance = 0;
        this.motorTorque = MOTOR_TORQUE ?? 140;
        this.shoulderLimits = [-1.8, 1.8];
        this.elbowLimits = [-1.6, 0.2];
        this.hipLimits = [-0.05, 0.1];
        this.pelvisLimits = [-1.1, 0.1];
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

        //body w: 57, h: 131
        //foot w: 54, h: 27
        //head w: 43, h: 53
        //leg w: 30, h: 100
        //lowerArm w: 27, h: 89
        //pelvis w: 29, h: 25
        //thigh w: 40, h: 106
        //upperArm w: 30, h: 78

        const offsets = {
            lowerLeftArmOffset: { x: -5, y: 40 },
            upperLeftArmOffset: { x: -10, y: - 30 },
            leftFootOffset: { x: 10, y: 205 },
            rightFootOffset: { x: 10, y: 205 },
            leftThighOffset: { x: -5, y: 80 },
            rightThighOffset: { x: -5, y: 80 },
            headOffset: { x: 5, y: -100 },
            bodyOffset: { x: 0, y: -15 },
            pelvisOffset: { x: -5, y: 20 },
            lowerRightArmOffset: { x: -5, y: 40 },
            upperRightArmOffset: { x: -10, y: - 30 },
            leftLegOffset: { x: -5, y: 155 },
            rightLegOffset: { x: -5, y: 155 },
        };

        this.v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        this.parts = {
            head: this.makePartCircle("head", this.originX + offsets.headOffset.x, this.originY + offsets.headOffset.y, dimensions.head.w * .6, 0.8),
            pelvis: this.makePartRect("pelvis", this.originX + offsets.pelvisOffset.x, this.originY + offsets.pelvisOffset.y, dimensions.pelvis.w, dimensions.pelvis.h, 1.2),
            lowerLeftArm: this.makePartRect("lowerArm", this.originX + offsets.lowerLeftArmOffset.x, this.originY + offsets.lowerLeftArmOffset.y, dimensions.lowerArm.w, dimensions.lowerArm.h),
            upperLeftArm: this.makePartRect("upperArm", this.originX + offsets.upperLeftArmOffset.x, this.originY + offsets.upperLeftArmOffset.y, dimensions.upperArm.w, dimensions.upperArm.h),
            leftLeg: this.makePartRect("leg", this.originX + offsets.leftLegOffset.x, this.originY + offsets.leftLegOffset.y, dimensions.leg.w, dimensions.leg.h),
            leftThigh: this.makePartRect("thigh", this.originX + offsets.leftThighOffset.x, this.originY + offsets.leftThighOffset.y, dimensions.thigh.w, dimensions.thigh.h),
            leftFoot: this.makePartRect("foot", this.originX + offsets.leftFootOffset.x, this.originY + offsets.leftFootOffset.y, dimensions.foot.w, dimensions.foot.h),

            body: this.makePartRect("body", this.originX + offsets.bodyOffset.x, this.originY + offsets.bodyOffset.y, dimensions.body.w, dimensions.body.h, 1.2),

            rightLeg: this.makePartRect("leg", this.originX + offsets.rightLegOffset.x, this.originY + offsets.rightLegOffset.y, dimensions.leg.w, dimensions.leg.h),
            rightThigh: this.makePartRect("thigh", this.originX + offsets.rightThighOffset.x, this.originY + offsets.rightThighOffset.y, dimensions.thigh.w, dimensions.thigh.h),
            rightFoot: this.makePartRect("foot", this.originX + offsets.rightFootOffset.x, this.originY + offsets.rightFootOffset.y, dimensions.foot.w, dimensions.foot.h),

            lowerRightArm: this.makePartRect("lowerArm", this.originX + offsets.lowerRightArmOffset.x, this.originY + offsets.lowerRightArmOffset.y, dimensions.lowerArm.w, dimensions.lowerArm.h),
            upperRightArm: this.makePartRect("upperArm", this.originX + offsets.upperRightArmOffset.x, this.originY + offsets.upperRightArmOffset.y, dimensions.upperArm.w, dimensions.upperArm.h),
        };
        // Aliases for convenience
        this.head = this.parts.head;
        this.body = this.parts.body;
        this.pelvis = this.parts.pelvis;
        this.pelvis.sprite.setVisible(false);
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

        const neckY = this.originY - 90;
        const shoulderX = this.originX - 5;
        const shoulderY = this.originY - 60;
        const pelvisY = this.originY + 30;
        const hipY = this.originY + 30;
        const ankleY = this.originY + 122;
        const elbowX = this.originX - 8;

        const elbowY =
            (this.originY + offsets.upperLeftArmOffset.y)
            + (dimensions.upperArm.h * 0.5)
            - 6;

        const kneeX = this.originX - 9;

        const kneeY =
            (this.originY + offsets.leftThighOffset.y)
            + (dimensions.thigh.h * 0.5)
            - 16;

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
                    this.v(this.originX, neckY)
                )
            ),
            leftShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.shoulderLimits[0],
                    upperAngle: this.shoulderLimits[1]
                }, this.upperLeftArm.body, this.body.body, this.v(shoulderX, shoulderY))
            ),
            rightShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.shoulderLimits[0],
                    upperAngle: this.shoulderLimits[1]
                }, this.upperRightArm.body, this.body.body, this.v(shoulderX, shoulderY))
            ),

            leftElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperLeftArm.body, this.lowerLeftArm.body, this.v(elbowX, elbowY))
            ),

            rightElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.elbowLimits[0],
                    upperAngle: this.elbowLimits[1]
                }, this.upperRightArm.body, this.lowerRightArm.body, this.v(elbowX, elbowY))
            ),

            hipBack: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.hipLimits[0],
                    upperAngle: this.hipLimits[1]
                }, this.body.body, this.pelvis.body, this.v(this.originX, pelvisY))
            ),

            leftHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.leftThigh.body, this.v(this.originX, hipY))
            ),
            rightHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque,
                    enableLimit: true,
                    lowerAngle: this.pelvisLimits[0],
                    upperAngle: this.pelvisLimits[1]
                }, this.pelvis.body, this.rightThigh.body, this.v(this.originX, hipY))
            ),


            leftKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 2,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.leftThigh.body, this.leftLeg.body, this.v(kneeX, kneeY))
            ),

            rightKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: this.motorTorque * 2,
                    enableLimit: true,
                    lowerAngle: this.kneeLimits[0],
                    upperAngle: this.kneeLimits[1]
                }, this.rightThigh.body, this.rightLeg.body, this.v(kneeX, kneeY))
            ),
            leftAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.leftLeg.body, this.leftFoot.body, this.v(this.originX, ankleY))
            ),

            rightAnkle: this.world.createJoint(
                pl.WeldJoint({}, this.rightLeg.body, this.rightFoot.body, this.v(this.originX, ankleY))
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

    makePartRect(key, xPx, yPx, wPx, hPx, density = 1.0, friction = 0.6, restitution = 0.1) {
        const body = this.world.createBody({
            type: "dynamic",
            position: pl.Vec2(px2m(xPx), px2m(yPx)),
            angle: 0,
            linearDamping: 0.05,
            angularDamping: 0.40
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

        const sprite = this.scene.add.image(xPx, yPx, key).setOrigin(0.5);
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

        const sprite = this.scene.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(rPx * 2, rPx * 2);
        sprite._pbody = body;

        return { body, sprite, fix };
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

        if (keys.O.isDown) {
            this.motorState.leftKnee = kneeSpeed;
            this.motorState.rightKnee = 0;
        } else if (keys.P.isDown) {
            this.motorState.leftKnee = 0;
            this.motorState.rightKnee = kneeSpeed;
        } else {
            this.motorState.leftKnee = 0;
            this.motorState.rightKnee = 0;
        }


        this.joints.leftHipLeg.setMotorSpeed(this.motorState.leftHip);
        this.joints.rightHipLeg.setMotorSpeed(this.motorState.rightHip);
        this.joints.leftKnee.setMotorSpeed(this.motorState.leftKnee);
        this.joints.rightKnee.setMotorSpeed(this.motorState.rightKnee);

        // // Passive arm swing based on torso tilt for comic balance.
        const torsoAngle = this.parts.body.sprite.angle;
        const armBias = Phaser.Math.Clamp(-torsoAngle * 2.5, -2.0, 2.0);
        this.parts.upperLeftArm.body.applyTorque(-armBias * 0.8, true);
        this.parts.upperRightArm.body.applyTorque(armBias * 0.8, true);

        // Arms move opposite legs
        const armSpeed = 1.8;

        this.joints.leftShoulder.setMotorSpeed(
            Phaser.Math.Clamp(-this.motorState.rightHip, -armSpeed, armSpeed)
        );

        this.joints.rightShoulder.setMotorSpeed(
            Phaser.Math.Clamp(-this.motorState.leftHip, -armSpeed, armSpeed)
        );
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