export const PPM = 30;
export const RUNNER_SCALE = 2;

export const SCALE = PPM;
export const m2px = (m) => m * PPM;
export const px2m = (px) => px / PPM;

// --- Controls / tuning ---
export const WALK_SPEED = 4;
export const MOTOR_TORQUE = 420;

export const CATEGORY_BODYPARTS = 0x0002;
export const CATEGORY_GROUND = 0x0004;

export const MASK_BODYPARTS = CATEGORY_GROUND;
export const MASK_GROUND = CATEGORY_BODYPARTS;

