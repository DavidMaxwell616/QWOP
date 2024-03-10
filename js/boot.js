const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
var takingRightStep = true;
var takingLeftStep =  false;
var ground;
var body;
var head;
var rightThigh;
var rightLeg;
var rightHip;
var rightFoot;
var upperRightArm;
var lowerRightArm;
var leftThigh;
var leftLeg;
var leftHip;
var leftFoot;
var upperLeftArm;
var lowerLeftArm;
var originX=150;
var originY=250;//265;
var hipLimits = [-40,40];
var kneeLimits = [0,40];
var ankleLimits = [-5,20];
var elbowLimits = [-40,0];
var shoulderLimits = [-20,20];
var CATEGORY_BODYPARTS = 0x0001;  // 0000000000000001 in binary
var CATEGORY_GROUND = 0x0002; // 0000000000000010 in binary
var MASK_BODYPARTS = CATEGORY_GROUND;
var MASK_GROUND = -1; 
var thighMaxAngle = 15;
var walkSpeed = 1;
var motorTorque = 40;
var bestDistText;
var timeText;
var totalDistText;
var velocityText;
var KeyStateText;
var PctErrText;
var IterationsText;
var qText;

var Qkey;
var Wkey;
var OKey;
var PKey;
var SpaceKey;
var farthestDistTraveled = 0;
var elapsedTime = 0;
var totalDistTraveled = 0;
var curVelX =0;
var keyState;
var now;
var localStorageName = "QWOP";
var Q;
var W;
var O;
var P;
var marker1;
var marker2;
