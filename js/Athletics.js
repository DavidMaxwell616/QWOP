// Port of js/scripts/wck/Athletics.as, HitBox.as and FootBox.as.
// Physics positions are Box2D/Planck units, not displayed metres.
export const WORLD_DEFAULTS = { scale: 40, timeStep: 0.025, iterations: 10, gravityX: 0, gravityY: 10 };
export const SAND_PIT_AT = 100 * WORLD_DEFAULTS.scale * 10;
const FALL_PARTS = new Set(['crfarm', 'chead', 'clfarm', 'cruarm']);
const FEET = new Set(['clfoot', 'crfoot']);
const TRACKS = new Set(['track', 'track1', 'track2']);

export class Athletics {
    constructor(highScore = 0) {
        this.highScore = highScore;
        this.score = 0;
        this.GameOver = false;
        this.Jumped = false;
        this.JumpLanded = false;
        this.timeElapsed = 0;
        this.speedHistory = [];
        this.Muted = false;
    }

    // ContactListener dispatches to both shapes; normalize their order here.
    contactAdded(part, other, position, speed = 0) {
        if (this.GameOver || !TRACKS.has(other)) return null;
        if (FALL_PARTS.has(part)) {
            this.GameOver = true;
            this.score = Math.round(position.x) / 10;
            if (this.Jumped && !this.JumpLanded) this.JumpLanded = true;
            return { burst: true, sound: this.Muted ? null : speed > 5 ? 'Crunch_sound' : 'Ehh_sound' };
        }
        if (FEET.has(part)) {
            const x = position.x * WORLD_DEFAULTS.scale;
            if (!this.Jumped && x > SAND_PIT_AT - 220) this.Jumped = true;
            if (this.Jumped && !this.JumpLanded) {
                this.JumpLanded = x > SAND_PIT_AT;
                this.score = Math.round(position.x) / 10;
                return { burst: this.JumpLanded, sound: null };
            }
        }
        return null;
    }

    everyFrame(torsoX, headSpeed) {
        // Athletics pauses only for a foot landing that precedes GameOver.
        if (this.JumpLanded && !this.GameOver) {
            this.GameOver = true;
            this.pausedOnLanding = true;
        }
        if (!this.GameOver) this.score = Math.round(torsoX) / 10;
        this.speedHistory.push(headSpeed);
        if (this.speedHistory.length > 30) this.speedHistory.shift();
        const average = this.speedHistory.reduce((a, b) => a + b, 0) / this.speedHistory.length;
        this.crowdVolume = this.Muted ? 0 : Math.min(Math.max((average - 2) / 15, 0), 1);
        if (this.GameOver) this.highScore = Math.max(this.highScore, this.score);
    }
}

// Joint.as:setSpeed: true selects speed2, false selects speed1.
export function setFlagSpeed(joint, flag, settings) {
    joint.setMotorSpeed(flag ? settings.speed2 : settings.speed1);
    joint.getBodyA().setAwake(true);
    joint.getBodyB().setAwake(true);
}

// Joint.as:step. Symbols may enable springs; no supplied symbol does so yet.
export function stepSpring(joint, settings) {
    if (!settings.spring) return;
    const angle = joint.getJointAngle();
    joint.setMaxMotorTorque(Math.abs(angle * settings.springConstant + joint.getJointSpeed() * settings.springDamping));
    joint.setMotorSpeed(angle > 0 ? -1000000 : 1000000);
}
