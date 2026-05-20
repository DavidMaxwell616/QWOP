export const W = 800;
export const H = 600;
export const SCALE = 120;

export const PPM = 30;

export const px2m = (px) => px / PPM;
export const originX = W * .3;
export const originY = 295;

// --- Controls / tuning ---
export const WALK_SPEED = 4;
export const MOTOR_TORQUE = 420;

export const CATEGORY_BODYPARTS = 0x0002;
export const CATEGORY_GROUND = 0x0004;

export const MASK_BODYPARTS = CATEGORY_GROUND;
export const MASK_GROUND = CATEGORY_BODYPARTS;

