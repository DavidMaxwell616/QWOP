var game = new Phaser.Game(800, 500, Phaser.BOX2D, 'phaser-example', 
{ preload: preload,
  create: create, 
  update: update, 
  render: render });

function create() {
 
  game.stage.backgroundColor = '#124184';
  background = game.add.image(0, 0, 'background_slice');
  background.anchor.setTo(0, 0);
  background.width = CANVAS_WIDTH;
  background.height = CANVAS_HEIGHT;

  // Enable Box2D physics
  game.physics.startSystem(Phaser.Physics.BOX2D);
  
  game.physics.box2d.gravity.y = 500;
  game.physics.box2d.friction = 1;
  game.physics.box2d.restitution = 0.1;
  game.physics.box2d.debugDraw.joints = true;
  game.physics.box2d.setBoundsToWorld();
  
  ground = new Phaser.Physics.Box2D.Body(this.game, null, game.world.centerX, 490, 0);
  ground.setRectangle(800, 20, 0, 0, 0);
  ground.friction=1;

  createBodiesAndJoints();
  var font= "20pt Calibri";
  var color = "#ffffff";
  
  keyState = ''; 
  bestDistText = drawText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m',160,20,font,color);
  timeText = drawText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s',450,20,font, color);
  totalDistText = drawText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m',160,60,font, color);
  velocityText = drawText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s',450,60,font, color);
  KeyStateText = drawText('Keystate: ' + keyState,160,100,font,color);
  
  farthestDistTraveled = localStorage.getItem(localStorageName) == null ? 0 :
  localStorage.getItem(localStorageName);

  QKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  QKey.onDown.add(function(event) {
    handleQPressed(); }, this);  
  QKey.onUp.add(function(event) {
      handleQReleased(); }, this);  
  WKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  WKey.onDown.add(function(event) {
  handleWPressed();}, this);  
  WKey.onUp.add(function(event) {
    handleWReleased(); }, this);  
  OKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
  OKey.onDown.add(function(event) {
    handleOPressed();}, this);  
  OKey.onUp.add(function(event) {
      handleOReleased(); }, this);  
  PKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
  PKey.onDown.add(function(event) {
    handlePPressed();}, this);  
  PKey.onUp.add(function(event) {
      handlePReleased(); }, this);  
  SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  SpaceKey.onDown.add(function(event) {
    handleSpacePressed();}, this);  
    Q = game.add.image(20, 20, 'q');
    w = game.add.image(80, 20, 'w');
    o = game.add.image(670, 20, 'o');
    p = game.add.image(730, 20, 'p');
    marker1 = game.add.image(200, 400, 'marker');

    now = new Date().getTime();

}

function drawText(text, x, y, font, color) {
 var text = game.add.text(x, y, text, {
    fill: color,
    font: font,
  });
  text.setShadow(-5, 5, 'rgba(0,0,0,0.5)', 0);
  return text;
}
//Q right hip forward
//O right knee forward
//W left hip formward
//P left knee forward

function handleQPressed(){
  rightHip.SetMotorSpeed(walkSpeed);
  leftHip.SetMotorSpeed(-walkSpeed);
  leftShoulder.SetMotorSpeed(walkSpeed);
  rightShoulder.SetMotorSpeed(-walkSpeed);
  keyState = 'Q';
}

function handleQReleased(){
  rightHip.SetMotorSpeed(0);
  leftHip.SetMotorSpeed(0);
  leftShoulder.SetMotorSpeed(0);
  rightShoulder.SetMotorSpeed(-0);
  keyState = '';
}  

function handleOPressed(){
  leftKnee.SetMotorSpeed(walkSpeed);
  rightKnee.SetMotorSpeed(-walkSpeed);
  rightElbow.SetMotorSpeed(walkSpeed);
  leftElbow.SetMotorSpeed(-walkSpeed);
  keyState = 'O';
}

function handleOReleased(){
  leftKnee.SetMotorSpeed(0);
  rightKnee.SetMotorSpeed(0);
  rightElbow.SetMotorSpeed(0);
  leftElbow.SetMotorSpeed(0);
  keyState = '';
}  

function handleWPressed(){
  leftHip.SetMotorSpeed(walkSpeed);
  rightHip.SetMotorSpeed(-walkSpeed);
  rightShoulder.SetMotorSpeed(walkSpeed);
  leftShoulder.SetMotorSpeed(-walkSpeed);
  keyState = 'W';
}

function handleWReleased(){
  leftHip.SetMotorSpeed(0);
  rightHip.SetMotorSpeed(0);
  rightShoulder.SetMotorSpeed(0);
  leftShoulder.SetMotorSpeed(0);
 keyState = '';
}  

function handlePPressed(){
  rightKnee.SetMotorSpeed(walkSpeed);
  leftKnee.SetMotorSpeed(-walkSpeed);
  leftElbow.SetMotorSpeed(walkSpeed);
  rightElbow.SetMotorSpeed(-walkSpeed);
  keyState = 'P';
}

function handlePReleased(){
  rightKnee.SetMotorSpeed(0);
  leftKnee.SetMotorSpeed(0);
  leftElbow.SetMotorSpeed(0);
  rightElbow.SetMotorSpeed(0);
  keyState = '';
}  

function handleSpacePressed(){
  ResetBody();
}

function createBodiesAndJoints(){
  upperLeftArm = game.add.sprite(originX, originY, 'upperArm');

upperLeftArm = game.add.sprite(originX, originY, 'upperArm');
game.physics.box2d.enable(upperLeftArm);
upperLeftArm.body.setRectangle(25, 80, 0, 0, 0);

lowerLeftArm = game.add.sprite(originX, originY, 'lowerArm');
game.physics.box2d.enable(lowerLeftArm);
lowerLeftArm.body.setRectangle(25, 80, 0, 0, 0);

leftFoot = game.add.sprite(originX, originY+200, 'foot');
game.physics.box2d.enable(leftFoot);
leftFoot.body.setRectangle(50, 15, 0, 0, 0);

leftLeg = game.add.sprite(originX, originY+160, 'leg');
game.physics.box2d.enable(leftLeg);
leftLeg.body.setRectangle(25, 80, 0, 0, 0);
    
 leftThigh = game.add.sprite(originX, originY, 'thigh');
 game.physics.box2d.enable(leftThigh);
 leftThigh.body.setRectangle(25, 80, 0, 0, 0);

 head = game.add.sprite(originX+20, originY-10, 'head');
game.physics.box2d.enable(head);
head.body.setCircle(35);

rightLeg = game.add.sprite(originX, originY+160, 'leg');
game.physics.box2d.enable(rightLeg);
rightLeg.body.setRectangle(25, 80, 0, 0, 0);

rightFoot = game.add.sprite(originX, originY+200, 'foot');
game.physics.box2d.enable(rightFoot);
rightFoot.body.setRectangle(50, 15, 0, 0, 0);


rightThigh = game.add.sprite(originX, originY, 'thigh');
game.physics.box2d.enable(rightThigh);
rightThigh.body.setRectangle(25, 80, 0, 0, 0);

body = game.add.sprite(originX, originY, 'body');
game.physics.box2d.enable(body);
body.body.setRectangle(50, 140, 0, 0, 0);

lowerRightArm = game.add.sprite(originX, originY, 'lowerArm');
game.physics.box2d.enable(lowerRightArm);
lowerRightArm.body.setRectangle(25, 80, 0, 0, 0);

upperRightArm = game.add.sprite(originX, originY, 'upperArm');
game.physics.box2d.enable(upperRightArm);
upperRightArm.body.setRectangle(25, 80, 0, 0, 0);

 //Revolute Joint Parameters:
 //bodyA, 
 //bodyB, 
 //ax, 
 //ay, 
 //bx, 
 //by, 
 //motorSpeed, 
 //motorTorque, 
 //motorEnabled, 
 //lowerLimit, 
 //upperLimit, 
 //limitEnabled

 //JOINTS
 var neck = game.physics.box2d.weldJoint(head, body, 10,60,10,-27);
 rightElbow = game.physics.box2d.revoluteJoint(upperRightArm,lowerRightArm, 20, 40, 10, -20,0,motorTorque,false,elbowLimits[0],elbowLimits[1],true);
 rightHip = game.physics.box2d.revoluteJoint(body, rightThigh, 0, 40, 0, -50,0,motorTorque,true,hipLimits[0], hipLimits[1], true);
 rightShoulder = game.physics.box2d.revoluteJoint(upperRightArm, body, 30, -30, 10, -50,0,motorTorque,true,shoulderLimits[0],shoulderLimits[1],true);
 rightAnkle = game.physics.box2d.revoluteJoint(rightLeg, rightFoot, 0, 40, -20, 0,0,motorTorque,true,ankleLimits[0], ankleLimits[1], true);
 rightKnee = game.physics.box2d.revoluteJoint(rightThigh, rightLeg, 0, 30, 0, -40,0,motorTorque,true,kneeLimits[0],kneeLimits[1],true);
 leftKnee = game.physics.box2d.revoluteJoint(leftThigh, leftLeg, 0, 30, 0, -40,0,motorTorque,true,kneeLimits[0],kneeLimits[1],true);
 leftHip = game.physics.box2d.revoluteJoint(body, leftThigh, 0, 40, 0, -50,0,motorTorque,true,hipLimits[0], hipLimits[1], true);
 leftShoulder = game.physics.box2d.revoluteJoint(upperLeftArm, body, 10, -30, 10, -50,0,motorTorque,true,shoulderLimits[0],shoulderLimits[1],true);
 leftAnkle = game.physics.box2d.revoluteJoint(leftLeg, leftFoot, 0, 40, -20, 0,0,motorTorque,true,ankleLimits[0], ankleLimits[1], true);
 leftElbow = game.physics.box2d.revoluteJoint(upperLeftArm,lowerLeftArm,  10, 50, -10, -30,0,motorTorque,false,elbowLimits[0],elbowLimits[1],true);


 //setup collision categories
 leftFoot.body.setCollisionCategory(CATEGORY_BODYPARTS);
 upperLeftArm.body.setCollisionCategory(CATEGORY_BODYPARTS);
 lowerLeftArm.body.setCollisionCategory(CATEGORY_BODYPARTS);
 leftLeg.body.setCollisionCategory(CATEGORY_BODYPARTS);
 leftThigh.body.setCollisionCategory(CATEGORY_BODYPARTS);

 rightFoot.body.setCollisionCategory(CATEGORY_BODYPARTS);
 upperRightArm.body.setCollisionCategory(CATEGORY_BODYPARTS);
 lowerRightArm.body.setCollisionCategory(CATEGORY_BODYPARTS);
 rightLeg.body.setCollisionCategory(CATEGORY_BODYPARTS);
 rightThigh.body.setCollisionCategory(CATEGORY_BODYPARTS);

 body.body.setCollisionCategory(CATEGORY_BODYPARTS);
 head.body.setCollisionCategory(CATEGORY_BODYPARTS);
 ground.setCollisionCategory(CATEGORY_GROUND);

 leftFoot.body.setCollisionMask(MASK_BODYPARTS);
 upperLeftArm.body.setCollisionMask(MASK_BODYPARTS);
 lowerLeftArm.body.setCollisionMask(MASK_BODYPARTS);
 leftLeg.body.setCollisionMask(MASK_BODYPARTS);
 leftThigh.body.setCollisionMask(MASK_BODYPARTS);

 rightFoot.body.setCollisionMask(MASK_BODYPARTS);
 upperRightArm.body.setCollisionMask(MASK_BODYPARTS);
 lowerRightArm.body.setCollisionMask(MASK_BODYPARTS);
 rightLeg.body.setCollisionMask(MASK_BODYPARTS);
 rightThigh.body.setCollisionMask(MASK_BODYPARTS);

 body.body.setCollisionMask(MASK_BODYPARTS);
 head.body.setCollisionMask(MASK_BODYPARTS);
 ground.setCollisionMask(MASK_GROUND);

}

function update(){
  updateText();
  curVelX = head.body.velocity.x;
  totalDistTraveled = body.x-originX;
  if(farthestDistTraveled<totalDistTraveled)
    farthestDistTraveled = totalDistTraveled;
    var newNow = new Date().getTime();
    var distance = newNow - now;
    elapsedTime = Math.floor((distance % (1000 * 60)) / 1000);

  if(head.y>ground.y-60)
    ResetBody();
}

function ResetBody(){
 SetPosition(head,originX,originY-50);
 SetPosition(rightThigh.x,originX,originY+150);
 SetPosition(rightLeg,originX, originY+160);
 SetPosition(rightFoot, originX,originY+200);
 SetPosition(body,originX,originY);
 SetPosition(upperRightArm,originX, originY);
 SetPosition(lowerRightArm,originX, originY);
 SetPosition(leftThigh,originX, originY+150);
 SetPosition(leftLeg,originX, originY+160);
 SetPosition(leftFoot,originX,originY+200);
 SetPosition(upperLeftArm,originX, originY);
 SetPosition(lowerLeftArm,originX, originY);
 leftHip.SetMotorSpeed(0);
 rightHip.SetMotorSpeed(0);
 leftKnee.SetMotorSpeed(0);
 rightKnee.SetMotorSpeed(0);
 leftAnkle.SetMotorSpeed(0);
 rightAnkle.SetMotorSpeed(0);
 leftShoulder.SetMotorSpeed(0);
 rightShoulder.SetMotorSpeed(0);
 leftElbow.SetMotorSpeed(0);
 rightElbow.SetMotorSpeed(0);
 rightHip.m_lowerAngle=0;//.6981317007977318;
 rightHip.m_upperAngle=0;//.6981317007977318;
 now = new Date().getTime();
 if(farthestDistTraveled<totalDistTraveled)
   localStorage.setItem(localStorageName, farthestDistTraveled);
   
 }

function SetPosition(object,x,y){
   if(typeof object=="object"){
    object.body.x = x;
    object.body.y = y;
    object.body.angle =0;
    object.body.velocity.x=0;
    object.body.velocity.y=0;
  }
}

function updateText(){
  bestDistText.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
  timeText.setText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s');
  totalDistText.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
  velocityText.setText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s');
  KeyStateText.setText('Keystate: ' + keyState);
}

function render() {
  //game.debug.box2dWorld();
}
