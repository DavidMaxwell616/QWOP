// wck/World.as defaults. DemoWorld1 timeline overrides are not supplied.
export const PPM = 40;
export const RUNNER_SCALE = 2;

export const SCALE = PPM;
export const m2px = (m) => m * PPM;
export const px2m = (px) => px / PPM;

// --- Controls / tuning ---
export const WALK_SPEED = 4;
export const MOTOR_TORQUE = 420;

export const CATEGORY_BODYPARTS = 0x0002;
export const CATEGORY_GROUND = 0x0001;
export const CATEGORY_HURDLE = 0x0004;

// Runner filtering is a fallback until the Flash symbol properties are available.
export const MASK_BODYPARTS = CATEGORY_GROUND | CATEGORY_HURDLE;
export const MASK_GROUND = 0xffff;

