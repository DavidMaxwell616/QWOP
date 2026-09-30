package wck
{
   import Box2D.Collision.*;
   import Box2D.Collision.Shapes.*;
   import Box2D.Common.*;
   import Box2D.Common.Math.*;
   import Box2D.Dynamics.*;
   import Box2D.Dynamics.Contacts.*;
   import Box2D.Dynamics.Joints.*;
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.events.*;
   import flash.media.SoundChannel;
   import flash.media.SoundTransform;
   import flash.net.*;
   import flash.text.*;
   
   public class Athletics extends MovieClip
   {
      
      public var def:b2BodyDef;
      
      public var GameOver:Boolean;
      
      public var view1:DemoView1;
      
      public var HSval:*;
      
      public var pointer:DemoCursor;
      
      public var Mute:MovieClip;
      
      public var cofchannel:SoundChannel;
      
      public var P:MovieClip;
      
      public var W:MovieClip;
      
      public var Q:MovieClip;
      
      public var O:MovieClip;
      
      public var Intro_mc:Intro;
      
      public var seg0:Body;
      
      public var seg1:Body;
      
      public var Help_btn:MovieClip;
      
      public var seg2:Body;
      
      public var joint:Joint;
      
      public var SpeedArray:Array;
      
      public var QDOWN:Boolean;
      
      public var currentHurdle:Body;
      
      public var score:int;
      
      public var view:View;
      
      public var currentJoint:Joint;
      
      public var worldScale:int;
      
      public var SandPitAt:Number;
      
      public var PitCreated:Boolean;
      
      public var PDOWN:Boolean;
      
      public var currentHurdleTop:Body;
      
      public var TField:*;
      
      public var j2:b2RevoluteJoint;
      
      public var HZ:*;
      
      public var tracksCreated:int;
      
      public var scoreval:*;
      
      public var help_mc:Help;
      
      public var cricketball:b2Body;
      
      public var ODOWN:Boolean;
      
      public var WDOWN:Boolean;
      
      public var world:World;
      
      public var Secure:Boolean;
      
      public var hurdleLocation:Number;
      
      public var shape:Shape;
      
      public var Launched:Boolean;
      
      public var GotFocus:Boolean;
      
      public var HelpUp:Boolean;
      
      public var needHurdle:Boolean;
      
      public function Athletics()
      {
         var _loc1_:XML = null;
         var _loc2_:String = null;
         var _loc3_:URLRequest = null;
         var _loc4_:URLLoader = null;
         var _loc5_:COF = null;
         var _loc6_:SoundTransform = null;
         scoreval = new TextField();
         HSval = new TextField();
         TField = new TextField();
         HZ = new MovieClip();
         Intro_mc = new Intro();
         seg0 = new Body();
         seg1 = new Body();
         seg2 = new Body();
         currentHurdle = new Body();
         currentHurdleTop = new Body();
         currentJoint = new Joint();
         needHurdle = new Boolean();
         hurdleLocation = new Number();
         tracksCreated = new int();
         cofchannel = new SoundChannel();
         SandPitAt = new Number();
         PitCreated = new Boolean();
         HelpUp = new Boolean();
         help_mc = new Help();
         Secure = new Boolean();
         SpeedArray = new Array();
         super();
         PitCreated = false;
         worldScale = 40;
         SandPitAt = 100 * worldScale * 10;
         initView("view1");
         hurdleLocation = worldScale * 10 * 50;
         Intro_mc.x = 126;
         Intro_mc.y = 110;
         stage.addChild(Intro_mc);
         view.world.paused = true;
         GotFocus = false;
         HelpUp = false;
         Secure = false;
         _loc1_ = new XML();
         _loc2_ = "dontstealthisgame.xml";
         _loc3_ = new URLRequest(_loc2_);
         _loc4_ = new URLLoader(_loc3_);
         _loc4_.addEventListener("complete",xmlLoaded);
         addEventListener(Event.ENTER_FRAME,initialize,false,0,true);
         GlobalVars.vars.Muted = false;
         GlobalVars.vars.highScore = 0;
         GlobalVars.vars.HSDistance = 0;
         GlobalVars.vars.timeElapsed = 0;
         GlobalVars.vars.lastBallTime = 0;
         GlobalVars.vars.SandPitAt = SandPitAt;
         _loc5_ = new COF();
         _loc6_ = new SoundTransform();
         _loc6_.volume = 0;
         cofchannel = _loc5_.play(0,9999999,_loc6_);
      }
      
      public function restart(param1:KeyboardEvent) : void
      {
         var _loc2_:b2Body = null;
         var _loc3_:* = undefined;
         var _loc4_:* = undefined;
         var _loc5_:* = undefined;
         var _loc6_:* = undefined;
         var _loc7_:b2Body = null;
         var _loc8_:* = undefined;
         if(GlobalVars.vars.GameOver == true || param1.keyCode == 82)
         {
            if(param1.keyCode == 82)
            {
               EndGame();
            }
            stage.removeChild(DisplayObject(HZ));
            if(view.world.getChildByName("Pit_mc"))
            {
               _loc3_ = view.world.getChildByName("Pit_mc");
               _loc4_ = view.world.getChildByName("Board_mc");
               view.world.removeChild(_loc3_);
               view.world.removeChild(_loc4_);
            }
            if(view.world.getChildByName("Sline"))
            {
               _loc5_ = view.world.getChildByName("Sline");
               view.world.removeChild(_loc5_);
            }
            if(view.world.getChildByName("hsLine"))
            {
               _loc6_ = view.world.getChildByName("hsLine");
               view.world.removeChild(_loc6_);
            }
            _loc2_ = view.world.b2world.GetBodyList();
            while(_loc2_)
            {
               _loc7_ = _loc2_;
               _loc2_ = _loc2_.GetNext();
               if(_loc7_.m_userData)
               {
                  _loc8_ = _loc7_.m_userData;
                  if(_loc8_ is DisplayObject)
                  {
                     if(_loc8_.parent)
                     {
                        _loc7_.m_userData.parent.removeChild(_loc8_);
                        _loc7_.m_userData = null;
                     }
                  }
               }
               view.world.b2world.DestroyBody(_loc7_);
               _loc7_ = null;
            }
            view.cleanUp();
            world = null;
            view = null;
            view = new DemoView1();
            view.x = 275;
            view.y = 200;
            view.width = 1919.3;
            view.height = 367.8;
            view.name = "view1";
            stage.addChild(view);
            view.initialize();
            initialize(param1);
         }
      }
      
      public function everyFrame(param1:Event) : void
      {
         var _loc2_:Joint = null;
         var _loc3_:Joint = null;
         var _loc4_:Joint = null;
         var _loc5_:Joint = null;
         var _loc6_:Body = null;
         var _loc7_:b2Vec2 = null;
         var _loc8_:Number = NaN;
         var _loc9_:Number = NaN;
         var _loc10_:int = 0;
         var _loc11_:SoundTransform = null;
         var _loc12_:Body = null;
         var _loc13_:MovieClip = null;
         var _loc14_:b2Vec2 = null;
         var _loc15_:* = undefined;
         var _loc16_:b2BodyDef = null;
         var _loc17_:b2Body = null;
         var _loc18_:b2BodyDef = null;
         var _loc19_:b2Body = null;
         var _loc20_:b2BodyDef = null;
         var _loc21_:b2Body = null;
         var _loc22_:b2RevoluteJointDef = null;
         var _loc23_:b2Joint = null;
         var _loc24_:SandBoard = null;
         var _loc25_:SandPit = null;
         if(GlobalVars.vars.JumpLanded == true && GlobalVars.vars.GameOver == false)
         {
            view.world.paused = true;
            GlobalVars.vars.GameOver = true;
            EndGame();
         }
         else if(GlobalVars.vars.JumpLanded == false && GlobalVars.vars.GameOver == true && GlobalVars.vars.GameEnding == false)
         {
            GlobalVars.vars.GameEnding = true;
            EndGame();
         }
         _loc2_ = view.world.getChildByName("lankle") as Joint;
         _loc3_ = view.world.getChildByName("rankle") as Joint;
         _loc4_ = view.world.getChildByName("rtjoint") as Joint;
         _loc5_ = view.world.getChildByName("rtjoint") as Joint;
         if(_loc3_.x < _loc4_.x)
         {
            view.world.setVar("rightAnkleFlag",true);
         }
         else
         {
            view.world.setVar("rightAnkleFlag",false);
         }
         if(_loc2_.x < _loc5_.x)
         {
            view.world.setVar("leftAnkleFlag",true);
         }
         else
         {
            view.world.setVar("leftAnkleFlag",false);
         }
         _loc6_ = view.world.getChildByName("cbody") as Body;
         _loc6_ = view.world.getChildByName("chead") as Body;
         _loc6_.b2body.ApplyTorque(-400 * (_loc6_.b2body.GetAngle() + 0.2));
         _loc7_ = new b2Vec2();
         _loc7_ = _loc6_.b2body.GetLinearVelocity();
         SpeedArray.push(_loc7_.x);
         if(SpeedArray.length > 30)
         {
            SpeedArray.shift();
         }
         _loc8_ = new Number();
         _loc8_ = 0;
         _loc9_ = new Number();
         _loc10_ = 0;
         while(_loc10_ < SpeedArray.length)
         {
            _loc8_ += SpeedArray[_loc10_];
            _loc10_++;
         }
         _loc9_ = _loc8_ / SpeedArray.length;
         _loc11_ = new SoundTransform();
         if(GlobalVars.vars.Muted == false)
         {
            _loc11_.volume = Math.min(Math.max((_loc9_ - 2) / 15,0),1);
         }
         else
         {
            _loc11_.volume = 0;
         }
         cofchannel.soundTransform = _loc11_;
         _loc12_ = view.world.getChildByName("cbody") as Body;
         _loc13_ = view.world.getChildByName("viewtarget");
         _loc14_ = _loc12_.b2body.GetWorldCenter();
         _loc13_.x = _loc14_.x * worldScale;
         if(GlobalVars.vars.GameOver == false)
         {
            GlobalVars.vars.score = Math.round(_loc13_.x / worldScale) / 10;
         }
         scoreval.text = GlobalVars.vars.score.toString() + " metres";
         _loc15_ = Math.floor(_loc13_.x / 1366);
         if(tracksCreated < _loc15_ + 1 && seg0.x < -10 + 144 + Math.floor((_loc15_ + 1) / 3) * 1366 * 3)
         {
            seg0.b2body.DestroyShape(seg0.b2body.GetShapeList());
            view.world.removeChild(seg0);
            _loc16_ = new b2BodyDef();
            _loc16_.userData = new Track();
            _loc16_.userData.width = 1366;
            _loc16_.userData.height = 146.8;
            _loc16_.userData.shapeCategoryBits = 1;
            _loc16_.userData.shapeMaskBits = 65535;
            _loc16_.userData.shapeRestitution = 0.2;
            _loc16_.userData.shapeFriction = 1;
            _loc16_.userData.bodyIsStatic = true;
            _loc16_.userData.x = 144 + Math.floor((_loc15_ + 1) / 3) * 1366 * 3;
            _loc16_.userData.y = 429.8;
            _loc16_.userData.name = "track";
            _loc17_ = view.world.b2world.CreateBody(_loc16_) as b2Body;
            _loc17_.SetMassFromShapes();
            view.world.addChildAt(_loc16_.userData,0);
            _loc16_.userData.create();
            seg0 = view.world.getChildByName("track");
            ++tracksCreated;
         }
         if(tracksCreated < _loc15_ + 2 && seg1.x < -10 + 144 + 1366 + Math.floor(_loc15_ / 3) * 1366 * 3)
         {
            seg1.b2body.DestroyShape(seg2.b2body.GetShapeList());
            view.world.removeChild(seg1);
            _loc16_ = new b2BodyDef();
            _loc16_.userData = new Track();
            _loc16_.userData.width = 1366;
            _loc16_.userData.height = 146.8;
            _loc16_.userData.shapeCategoryBits = 1;
            _loc16_.userData.shapeMaskBits = 65535;
            _loc16_.userData.shapeRestitution = 0.2;
            _loc16_.userData.shapeFriction = 1;
            _loc16_.userData.bodyIsStatic = true;
            _loc16_.userData.x = 144 + 1366 + Math.floor(_loc15_ / 3) * 1366 * 3;
            _loc16_.userData.y = 429.8;
            _loc16_.userData.name = "track1";
            _loc17_ = view.world.b2world.CreateBody(_loc16_) as b2Body;
            _loc17_.SetMassFromShapes();
            view.world.addChildAt(_loc16_.userData,0);
            _loc16_.userData.create();
            seg1 = view.world.getChildByName("track1");
            ++tracksCreated;
         }
         if(tracksCreated < _loc15_ && seg2.x < -10 + 144 - 1366 + Math.floor((_loc15_ + 2) / 3) * 1366 * 3)
         {
            seg2.b2body.DestroyShape(seg2.b2body.GetShapeList());
            view.world.removeChild(seg2);
            _loc16_ = new b2BodyDef();
            _loc16_.userData = new Track();
            _loc16_.userData.width = 1366;
            _loc16_.userData.height = 146.8;
            _loc16_.userData.shapeCategoryBits = 1;
            _loc16_.userData.shapeMaskBits = 65535;
            _loc16_.userData.shapeRestitution = 0.2;
            _loc16_.userData.shapeFriction = 1;
            _loc16_.userData.bodyIsStatic = true;
            _loc16_.userData.x = 144 - 1366 + Math.floor((_loc15_ + 2) / 3) * 1366 * 3;
            _loc16_.userData.y = 429.8;
            _loc16_.userData.name = "track2";
            _loc17_ = view.world.b2world.CreateBody(_loc16_) as b2Body;
            _loc17_.SetMassFromShapes();
            view.world.addChildAt(_loc16_.userData,0);
            _loc16_.userData.create();
            seg2 = view.world.getChildByName("track2");
            ++tracksCreated;
         }
         if(_loc13_.x > hurdleLocation - 1000 && needHurdle == true)
         {
            needHurdle = false;
            if(view.world.getChildByName("hurdle0"))
            {
               currentHurdle.b2body.DestroyShape(currentHurdle.b2body.GetShapeList());
               view.world.removeChild(currentHurdle);
               currentHurdleTop.b2body.DestroyShape(currentHurdle.b2body.GetShapeList());
               view.world.removeChild(currentHurdleTop);
            }
            _loc18_ = new b2BodyDef();
            _loc18_.userData = new HurdleBase();
            _loc18_.userData.width = 134;
            _loc18_.userData.height = 24;
            _loc18_.userData.shapeCategoryBits = 4;
            _loc18_.userData.shapeMaskBits = 65529;
            _loc18_.userData.bodyIsSleeping = true;
            _loc18_.userData.x = hurdleLocation;
            _loc18_.userData.y = 343;
            _loc18_.userData.name = "hurdle0";
            _loc19_ = view.world.b2world.CreateBody(_loc18_) as b2Body;
            _loc19_.SetMassFromShapes();
            view.world.addChild(_loc18_.userData);
            _loc18_.userData.create();
            currentHurdle = view.world.getChildByName("hurdle0");
            _loc20_ = new b2BodyDef();
            _loc20_.userData = new HurdleTop();
            _loc20_.userData.width = 43;
            _loc20_.userData.height = 292;
            _loc20_.userData.shapeCategoryBits = 4;
            _loc20_.userData.shapeMaskBits = 65531;
            _loc20_.userData.bodyIsSleeping = true;
            _loc20_.userData.x = hurdleLocation + 34.6;
            _loc20_.userData.y = 194.3;
            _loc20_.userData.name = "hurdle1";
            _loc21_ = view.world.b2world.CreateBody(_loc20_) as b2Body;
            _loc21_.SetMassFromShapes();
            view.world.addChild(_loc20_.userData);
            _loc20_.userData.create();
            currentHurdleTop = view.world.getChildByName("hurdle1");
            _loc22_ = new b2RevoluteJointDef();
            _loc22_.userData = new Joint();
            _loc22_.body1 = currentHurdleTop.b2body;
            _loc22_.body2 = currentHurdle.b2body;
            _loc22_.localAnchor1.Set(7.2 / worldScale,149.2 / worldScale);
            _loc22_.localAnchor2.Set(41.8 / worldScale,0.5 / worldScale);
            _loc22_.enableLimit = true;
            _loc22_.userData.x = hurdleLocation + 41.8;
            _loc22_.userData.y = 343.5;
            _loc22_.userData.name = "hjoint";
            _loc23_ = view.world.b2world.CreateJoint(_loc22_) as b2Joint;
            view.world.addChild(_loc22_.userData);
            currentJoint = view.world.getChildByName("hjoint");
         }
         if(_loc13_.x > SandPitAt - 1300 && PitCreated == false)
         {
            _loc24_ = new SandBoard();
            _loc24_.x = SandPitAt;
            _loc24_.y = 353.4;
            _loc24_.width = 374.1;
            _loc24_.height = 109.4;
            _loc24_.name = "Board_mc";
            view.world.addChildAt(_loc24_,4);
            _loc25_ = new SandPit();
            _loc25_.x = SandPitAt;
            _loc25_.y = 353.1;
            _loc25_.width = 1913.1;
            _loc25_.height = 80.9;
            _loc25_.name = "Pit_mc";
            view.world.addChildAt(_loc25_,4);
            PitCreated = true;
         }
         if(QDOWN == true)
         {
            view.world.setVar("thighFlag",true);
            view.world.setVar("armFlag",true);
         }
         else if(WDOWN == true)
         {
            view.world.setVar("thighFlag",false);
            view.world.setVar("armFlag",false);
         }
         else
         {
            joint = view.world.getChildByName("rtjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            joint = view.world.getChildByName("ltjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            joint = view.world.getChildByName("rajoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            joint = view.world.getChildByName("lajoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
         }
         if(ODOWN == true)
         {
            view.world.setVar("calfFlag",true);
            joint = view.world.getChildByName("ltjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetLimits(-1,1);
            joint = view.world.getChildByName("rtjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetLimits(-1.3,0.7);
         }
         else if(PDOWN == true)
         {
            view.world.setVar("calfFlag",false);
            joint = view.world.getChildByName("ltjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetLimits(-1.5,0.5);
            joint = view.world.getChildByName("rtjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetLimits(-0.8,1.2);
         }
         else
         {
            joint = view.world.getChildByName("rcjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            joint = view.world.getChildByName("lcjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
         }
      }
      
      public function xmlLoaded(param1:Event) : void
      {
         Secure = true;
      }
      
      public function getfocus(param1:MouseEvent) : void
      {
         if(!GotFocus)
         {
            stage.removeChild(DisplayObject(Intro_mc));
            view.world.paused = false;
            GotFocus = true;
         }
         if(HelpUp == true && Boolean(stage.getChildByName("help_instance")))
         {
            stage.removeChild(DisplayObject(help_mc));
            view.world.paused = false;
            HelpUp = false;
         }
      }
      
      public function EndGame() : void
      {
         var _loc1_:TextFormat = null;
         var _loc2_:Font = null;
         var _loc3_:MovieClip = null;
         joint = view.world.getChildByName("rtjoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableMotor(false);
         joint = view.world.getChildByName("ltjoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableMotor(false);
         joint = view.world.getChildByName("rcjoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableLimit(false);
         j2.EnableMotor(false);
         joint = view.world.getChildByName("lcjoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableLimit(false);
         j2.EnableMotor(false);
         joint = view.world.getChildByName("rajoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableLimit(false);
         j2.EnableMotor(false);
         joint = view.world.getChildByName("lajoint") as Joint;
         j2 = joint.joint as b2RevoluteJoint;
         j2.SetMotorSpeed(0);
         j2.EnableLimit(false);
         j2.EnableMotor(false);
         if(GlobalVars.vars.GameEnded == false && GlobalVars.vars.JumpLanded == true)
         {
            HZ = new JumpEnding();
            GlobalVars.vars.GameEnded = true;
         }
         else if(GlobalVars.vars.GameEnded == false && GlobalVars.vars.JumpLanded == false)
         {
            HZ = new Howzat();
            GlobalVars.vars.GameEnded = true;
         }
         if(GlobalVars.vars.score > GlobalVars.vars.highScore && GlobalVars.vars.GameOver == true)
         {
            GlobalVars.vars.highScore = GlobalVars.vars.score;
            _loc3_ = view.world.getChildByName("viewtarget");
            GlobalVars.vars.HSDistance = GlobalVars.vars.score * worldScale * 10;
            HSval.text = "Best: " + GlobalVars.vars.highScore.toString() + "m";
            TField.text = HSval.text;
            HSval.x = GlobalVars.vars.HSDistance - HSval.width / 2;
         }
         stage.addChild(HZ);
         _loc1_ = new TextFormat();
         _loc1_.bold = false;
         _loc1_.size = 20;
         _loc1_.align = "center";
         _loc2_ = new GS1();
         _loc1_.font = _loc2_.fontName;
         HZ.ScoreSlot.textColor = 15592941;
         HZ.ScoreSlot.embedFonts = true;
         HZ.ScoreSlot.defaultTextFormat = _loc1_;
         HZ.ScoreSlot.text = GlobalVars.vars.score.toString() + " metres";
         HZ.x = 130;
         HZ.y = 100;
      }
      
      public function ku(param1:KeyboardEvent) : void
      {
         if(param1.keyCode == 81)
         {
            QDOWN = false;
            Q.gotoAndStop(1);
         }
         if(param1.keyCode == 87)
         {
            WDOWN = false;
            W.gotoAndStop(1);
         }
         if(param1.keyCode == 79)
         {
            ODOWN = false;
            O.gotoAndStop(1);
         }
         if(param1.keyCode == 80)
         {
            PDOWN = false;
            P.gotoAndStop(1);
         }
      }
      
      public function kd(param1:KeyboardEvent) : void
      {
         if(Launched == false)
         {
            Launched = true;
         }
         if(param1.keyCode == 81)
         {
            QDOWN = true;
            Q.gotoAndStop(2);
         }
         if(param1.keyCode == 87)
         {
            WDOWN = true;
            W.gotoAndStop(2);
         }
         if(param1.keyCode == 79)
         {
            ODOWN = true;
            O.gotoAndStop(2);
         }
         if(param1.keyCode == 80)
         {
            PDOWN = true;
            P.gotoAndStop(2);
         }
         if(param1.keyCode == 32 || param1.keyCode == 82)
         {
            restart(param1);
         }
      }
      
      public function initialize(param1:Event) : *
      {
         var _loc2_:SoundTransform = null;
         var _loc3_:int = 0;
         var _loc4_:TextFormat = null;
         var _loc5_:Font = null;
         var _loc6_:TextFormat = null;
         var _loc7_:TextFormat = null;
         var _loc8_:WhiteLine = null;
         if(Secure == true)
         {
            _loc2_ = new SoundTransform();
            _loc2_.volume = 0;
            cofchannel.soundTransform = _loc2_;
            GlobalVars.vars.timeElapsed = 0;
            GlobalVars.vars.lastBallTime = 0;
            tracksCreated = 0;
            removeEventListener(Event.ENTER_FRAME,initialize);
            needHurdle = true;
            PitCreated = false;
            addEventListener(Event.ENTER_FRAME,everyFrame,false,0,true);
            stage.addEventListener(MouseEvent.CLICK,getfocus,false,0,true);
            stage.addEventListener(KeyboardEvent.KEY_DOWN,kd);
            stage.addEventListener(KeyboardEvent.KEY_UP,ku);
            Mute.addEventListener(MouseEvent.MOUSE_UP,ToggleMute);
            Help_btn.addEventListener(MouseEvent.MOUSE_DOWN,GetHelp);
            GlobalVars.vars.score = 0;
            GlobalVars.vars.GameOver = false;
            GlobalVars.vars.GameEnded = false;
            GlobalVars.vars.GameEnding = false;
            GlobalVars.vars.Jumped = false;
            GlobalVars.vars.JumpLanded = false;
            GlobalVars.vars.BallCount = 0;
            GlobalVars.vars.BallPlayedCount = 0;
            GlobalVars.vars.TotalScore = 0;
            _loc3_ = 0;
            while(_loc3_ < SpeedArray.length)
            {
               SpeedArray.pop();
               _loc3_++;
            }
            Launched = false;
            scoreval.x = 160;
            scoreval.y = 22;
            scoreval.width = 300;
            scoreval.height = 340;
            scoreval.textColor = 16777215;
            scoreval.selectable = false;
            scoreval.embedFonts = true;
            HSval.width = 300;
            HSval.height = 100;
            HSval.x = GlobalVars.vars.HSDistance - HSval.width / 2;
            HSval.y = 130;
            HSval.width = 300;
            HSval.height = 100;
            HSval.textColor = 16777215;
            HSval.selectable = false;
            HSval.embedFonts = true;
            TField.width = 205.1;
            TField.height = 24;
            TField.x = 34.9;
            TField.y = 1;
            TField.embedFonts = true;
            TField.selectable = false;
            TField.textColor = 16777215;
            _loc4_ = new TextFormat();
            _loc4_.bold = false;
            _loc4_.italic = false;
            _loc4_.size = 30;
            _loc4_.leading = 20;
            _loc4_.align = "center";
            _loc5_ = new GS1();
            _loc4_.font = _loc5_.fontName;
            _loc6_ = new TextFormat();
            _loc6_.bold = false;
            _loc6_.italic = false;
            _loc6_.size = 50;
            _loc6_.leading = 20;
            _loc6_.align = TextFormatAlign.CENTER;
            _loc6_.font = _loc5_.fontName;
            _loc7_ = new TextFormat();
            _loc7_.bold = false;
            _loc7_.italic = false;
            _loc7_.size = 14;
            _loc7_.leading = 20;
            _loc7_.align = TextFormatAlign.LEFT;
            _loc7_.font = _loc5_.fontName;
            scoreval.setTextFormat(_loc4_);
            scoreval.defaultTextFormat = _loc4_;
            TField.setTextFormat(_loc7_);
            TField.defaultTextFormat = _loc7_;
            HSval.setTextFormat(_loc6_);
            HSval.defaultTextFormat = _loc6_;
            joint = view.world.getChildByName("rtjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            joint = view.world.getChildByName("ltjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            joint = view.world.getChildByName("rcjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            joint = view.world.getChildByName("lcjoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            joint = view.world.getChildByName("rajoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            joint = view.world.getChildByName("lajoint") as Joint;
            j2 = joint.joint as b2RevoluteJoint;
            j2.SetMotorSpeed(0);
            j2.EnableLimit(true);
            j2.EnableMotor(true);
            scoreval.text = GlobalVars.vars.score.toString() + " metres";
            stage.addChild(scoreval);
            stage.addChild(TField);
            if(GlobalVars.vars.HSDistance > 1 * worldScale * 10)
            {
               view.world.addChildAt(HSval,0);
               _loc8_ = new WhiteLine();
               _loc8_.x = GlobalVars.vars.HSDistance;
               _loc8_.y = 277.4;
               _loc8_.width = 67.5;
               _loc8_.height = 158.8;
               _loc8_.name = "hsLine";
               view.world.addChildAt(_loc8_,0);
            }
            seg0 = view.world.getChildByName("track");
            seg1 = view.world.getChildByName("track1");
            seg2 = view.world.getChildByName("track2");
         }
      }
      
      public function GetHelp(param1:MouseEvent) : void
      {
         if(HelpUp == false)
         {
            view.world.paused = true;
            help_mc.x = 126;
            help_mc.y = 102;
            help_mc.name = "help_instance";
            stage.addChild(help_mc);
            HelpUp = true;
         }
      }
      
      public function ToggleMute(param1:MouseEvent) : void
      {
         if(GlobalVars.vars.Muted == false)
         {
            GlobalVars.vars.Muted = true;
            Mute.gotoAndStop(2);
         }
         else if(GlobalVars.vars.Muted == true)
         {
            GlobalVars.vars.Muted = false;
            Mute.gotoAndStop(1);
         }
      }
      
      public function initView(param1:*) : void
      {
         if(view)
         {
            view.cleanUp();
         }
         view = getChildByName(param1) as View;
         view.initialize();
      }
   }
}

