import { PPM, px2m, SAND_PIT_WIDTH } from './config.js';
import { SAND_PIT_AT } from './Athletics.js';

// A choreographed demonstration, separate from scored Q/W/O/P physics play.
export class DemoRun {
    constructor(runner, groundY) {
        this.runner = runner;
        this.groundY = groundY;
        this.elapsed = 0;
        this.landingX = SAND_PIT_AT + SAND_PIT_WIDTH + 200;
        this.runSpeed = 5;
        this.slowdownDuration = 2;
        this.landingDistance = this.landingX / (PPM * 10);
        this.landingTime = this.landingDistance / this.runSpeed;
        this.targetDistance = this.landingDistance + this.runSpeed * this.slowdownDuration / 2;
        this.duration = this.landingTime + this.slowdownDuration;
        this.distance = 0;
        this.finished = false;
        this.controls = { Q: false, W: false, O: false, P: false };
        this.links = runner.allJoints.map(joint => {
            const a = joint.getBodyA(), b = joint.getBodyB();
            return { a, b, anchorA: a.getLocalPoint(joint.getAnchorA()), anchorB: b.getLocalPoint(joint.getAnchorB()) };
        });
        for (const part of runner.allParts) part.body.setType('kinematic');
        this.update(0);
    }

    update(dt) {
        if (this.finished) return;
        this.elapsed = Math.min(this.duration, this.elapsed + Math.max(0, dt));
        this.finished = this.elapsed >= this.duration;
        const u = Math.max(0, Math.min(1, (this.elapsed - this.landingTime) / this.slowdownDuration));
        // Smoothstep speed and its integral keep position and acceleration continuous.
        const pace = 1 - 3 * u * u + 2 * u * u * u;
        this.speed = this.runSpeed * pace;
        this.distance = this.elapsed <= this.landingTime ? this.elapsed * this.runSpeed
            : this.landingDistance + this.runSpeed * this.slowdownDuration * (u - u ** 3 + u ** 4 / 2);
        if (this.finished) this.distance = this.targetDistance;
        const phase = this.distance / this.runSpeed * Math.PI * 4;
        // Illustrative button presses follow the same clock as the staged stride.
        const forwardSwing = Math.cos(phase) >= 0;
        const kneeSwing = Math.sin(phase) >= 0;
        this.controls.Q = !this.finished && forwardSwing;
        this.controls.W = !this.finished && !forwardSwing;
        this.controls.O = !this.finished && kneeSwing;
        this.controls.P = !this.finished && !kneeSwing;
        const stride = Math.sin(phase) * pace;
        const lean = -0.08 * pace;
        const angles = {
            body: lean, pelvis: lean, head: lean,
            leftThigh: lean + stride * 0.32, rightThigh: lean - stride * 0.32,
            leftLeg: lean + stride * 0.32 + Math.max(0, stride) * 1.2,
            rightLeg: lean - stride * 0.32 + Math.max(0, -stride) * 1.2,
            upperLeftArm: lean - stride * 0.6, upperRightArm: lean + stride * 0.6,
            lowerLeftArm: lean - stride * 0.6 - 0.8 * pace, lowerRightArm: lean + stride * 0.6 - 0.8 * pace,
            leftFoot: lean + stride * 0.32 + Math.max(0, stride) * 0.7,
            rightFoot: lean - stride * 0.32 + Math.max(0, -stride) * 0.7
        };
        const bodyAngles = new Map(Object.entries(this.runner.parts).map(([name, part]) => [part.body, angles[name]]));
        const root = this.runner.body.body;
        root.setTransform(planck.Vec2(this.distance * 10, 0), lean);
        const placed = new Set([root]);
        const queue = [root];
        for (const parent of queue) {
            for (const link of this.links) {
                if (link.a !== parent && link.b !== parent) continue;
                const child = link.a === parent ? link.b : link.a;
                if (placed.has(child)) continue;
                const local = link.a === parent ? link.anchorB : link.anchorA;
                const anchor = parent.getWorldPoint(link.a === parent ? link.anchorA : link.anchorB);
                const angle = bodyAngles.get(child);
                const c = Math.cos(angle), s = Math.sin(angle);
                child.setTransform(planck.Vec2(anchor.x - c * local.x + s * local.y,
                    anchor.y - s * local.x - c * local.y), angle);
                placed.add(child);
                queue.push(child);
            }
        }
        let bottom = -Infinity;
        for (const foot of [this.runner.leftFoot, this.runner.rightFoot]) {
            for (const vertex of foot.fix.getShape().m_vertices) bottom = Math.max(bottom, foot.body.getWorldPoint(vertex).y);
        }
        // Clear the 50 m hurdle using a short, visible jump arc.
        const hurdleOffset = (this.distance - 50) * PPM * 10;
        const hurdleLift = Math.abs(hurdleOffset) < 700 ? 340 * Math.cos(hurdleOffset / 700 * Math.PI / 2) : 0;
        // Leave room for both feet before takeoff and beyond the far edge.
        const takeoffX = SAND_PIT_AT - 200;
        const landingX = this.landingX;
        const jumpProgress = (this.distance * PPM * 10 - takeoffX) / (landingX - takeoffX);
        const sandLift = jumpProgress > 0 && jumpProgress < 1 ? 180 * Math.sin(Math.PI * jumpProgress) : 0;
        const lift = Math.max(hurdleLift, sandLift);
        const dy = px2m(this.groundY - lift) - bottom;
        for (const part of this.runner.allParts) {
            const p = part.body.getPosition();
            part.body.setTransform(planck.Vec2(p.x, p.y + dy), part.body.getAngle());
        }
    }
}
