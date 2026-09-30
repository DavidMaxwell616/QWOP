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
   import flash.events.Event;
   import flash.geom.Point;
   import flash.utils.getDefinitionByName;
   
   public class Joint extends MovieClip
   {
      
      public var spring:Boolean = false;
      
      public var positionInBody:Point;
      
      public var lineParameter:String = "0x888888";
      
      public var lineStyle:String = "Line";
      
      public var springDamping:Number = 0;
      
      public var upperLimit:Number = 0;
      
      public var strength:Number = 0;
      
      public var speed:Number = 0;
      
      public var collideConnected:Boolean = false;
      
      public var pathReturns:Boolean = true;
      
      public var speedFlag:* = "";
      
      public var target:Joint;
      
      public var world:World;
      
      public var lowerLimit:Number = 0;
      
      public var bodyName:String = "";
      
      public var body2Name:String = "";
      
      public var type:String = "None";
      
      public var body:Body;
      
      public var joint:b2Joint;
      
      public var enableMotor:Boolean = false;
      
      public var b2body:b2Body;
      
      public var speed1:Number = 0;
      
      public var b2body2:b2Body;
      
      public var body2:Body;
      
      public var springConstant:Number = 0;
      
      public var speed2:Number = 0;
      
      public var targetName:String = "";
      
      public var length:Number;
      
      public var lineMC:MovieClip;
      
      public var lineColor:Number;
      
      public var enableLimit:Boolean = false;
      
      public function Joint()
      {
         super();
      }
      
      public function setSpeed(param1:Event) : void
      {
         speed = world.vars[speedFlag] ? speed2 : speed1;
         if(type == "Prismatic")
         {
            (joint as b2PrismaticJoint).SetMotorSpeed(speed);
         }
         else if(type == "Revolute" || type == "RevolutePin")
         {
            (joint as b2RevoluteJoint).SetMotorSpeed(speed);
         }
         b2body.WakeUp();
         if(b2body2)
         {
            b2body2.WakeUp();
         }
      }
      
      public function create() : void
      {
         var _loc1_:b2DistanceJointDef = null;
         var _loc2_:b2RevoluteJointDef = null;
         var _loc3_:b2PrismaticJointDef = null;
         var _loc4_:b2Vec2 = null;
         var _loc5_:b2RevoluteJointDef = null;
         var _loc6_:Class = null;
         switch(type)
         {
            case "Distance":
               _loc1_ = new b2DistanceJointDef();
               _loc1_.Initialize(b2body,target.b2body,new b2Vec2(x / world.scale,y / world.scale),new b2Vec2(target.x / world.scale,target.y / world.scale));
               joint = world.b2world.CreateJoint(_loc1_);
               break;
            case "Revolute":
               _loc2_ = new b2RevoluteJointDef();
               _loc2_.Initialize(b2body,target.b2body,new b2Vec2(x / world.scale,y / world.scale));
               _loc2_.lowerAngle = lowerLimit;
               _loc2_.upperAngle = upperLimit;
               _loc2_.maxMotorTorque = strength;
               _loc2_.enableLimit = enableLimit;
               _loc2_.enableMotor = enableMotor;
               joint = world.b2world.CreateJoint(_loc2_);
               break;
            case "Prismatic":
               _loc3_ = new b2PrismaticJointDef();
               _loc4_ = new b2Vec2((target.x - x) / world.scale,(target.y - y) / world.scale);
               _loc4_.Normalize();
               _loc3_.Initialize(b2body,target.b2body,new b2Vec2(x / world.scale,y / world.scale),_loc4_);
               _loc3_.lowerTranslation = lowerLimit / world.scale;
               _loc3_.upperTranslation = upperLimit / world.scale;
               _loc3_.maxMotorForce = strength;
               _loc3_.enableLimit = enableLimit;
               _loc3_.enableMotor = enableMotor;
               joint = world.b2world.CreateJoint(_loc3_);
               break;
            case "RevolutePin":
               _loc5_ = new b2RevoluteJointDef();
               _loc5_.Initialize(b2body,b2body2,new b2Vec2(x / world.scale,y / world.scale));
               _loc5_.lowerAngle = lowerLimit;
               _loc5_.upperAngle = upperLimit;
               _loc5_.maxMotorTorque = strength;
               _loc5_.enableLimit = enableLimit;
               _loc5_.enableMotor = enableMotor;
               joint = world.b2world.CreateJoint(_loc5_);
         }
         if(speedFlag != "")
         {
            world.addEventListener(speedFlag,setSpeed,false,0,true);
         }
         setSpeed(null);
         if(lineStyle == "Line")
         {
            lineColor = parseInt(lineParameter);
         }
         else if(lineStyle == "MovieClip")
         {
            _loc6_ = getDefinitionByName(lineParameter) as Class;
            lineMC = new _loc6_();
            addChild(lineMC);
         }
         world.addEventListener(Event.ENTER_FRAME,step,false,0,true);
         world.addEventListener("cleanUp",cleanUp,false,0,true);
      }
      
      public function anchor() : void
      {
         var _loc1_:Point = null;
         var _loc2_:Array = null;
         var _loc3_:Shape = null;
         var _loc4_:DisplayObject = null;
         rotation = 0;
         world = parent as World;
         _loc1_ = localToGlobal(new Point(0,0));
         if(bodyName)
         {
            body = world.getChildByName(bodyName) as Body;
         }
         if(body2Name)
         {
            body2 = world.getChildByName(body2Name) as Body;
         }
         if(!body || type == "RevolutePin" && !body2)
         {
            _loc2_ = world.getObjectsUnderPoint(world.globalToLocal(_loc1_));
            _loc3_ = null;
            for each(_loc4_ in _loc2_)
            {
               _loc3_ = null;
               while(Boolean(_loc4_) && !_loc3_)
               {
                  _loc3_ = _loc4_ as Shape;
                  _loc4_ = _loc4_.parent;
               }
               if(_loc3_)
               {
                  if(!body)
                  {
                     body = _loc3_.body;
                     if(type != "RevolutePin" || Boolean(body2))
                     {
                        break;
                     }
                  }
                  else if(_loc3_.body != body)
                  {
                     body2 = _loc3_.body;
                     break;
                  }
               }
            }
         }
         b2body = body ? body.b2body : world.b2world.m_groundBody;
         if(type == "RevolutePin")
         {
            b2body2 = body2 ? body2.b2body : world.b2world.m_groundBody;
         }
         else
         {
            target = parent.getChildByName(targetName) as Joint;
         }
         if(body)
         {
            positionInBody = body.globalToLocal(_loc1_);
         }
      }
      
      public function cleanUp(param1:Event) : *
      {
         world.removeEventListener(Event.ENTER_FRAME,step);
      }
      
      public function step(param1:Event) : void
      {
         var _loc2_:Number = NaN;
         var _loc3_:* = undefined;
         var _loc4_:b2RevoluteJoint = null;
         var _loc5_:Point = null;
         if(world.paused)
         {
            return;
         }
         if(spring)
         {
            if(type == "Prismatic")
            {
               _loc3_ = joint as b2PrismaticJoint;
               _loc2_ = Number(_loc3_.GetJointTranslation());
               _loc3_.SetMaxMotorForce(Math.abs(_loc2_ * springConstant + _loc3_.GetJointSpeed() * springDamping));
               _loc3_.SetMotorSpeed(_loc2_ > 0 ? -1000000 : 1000000);
            }
            else if(type == "Revolute" || type == "RevolutePin")
            {
               _loc4_ = joint as b2RevoluteJoint;
               _loc2_ = _loc4_.GetJointAngle();
               _loc4_.SetMaxMotorTorque(Math.abs(_loc2_ * springConstant + _loc4_.GetJointSpeed() * springDamping));
               _loc4_.SetMotorSpeed(_loc2_ > 0 ? -1000000 : 1000000);
            }
         }
         if(body)
         {
            _loc5_ = world.globalToLocal(body.localToGlobal(positionInBody));
            x = _loc5_.x;
            y = _loc5_.y;
         }
      }
   }
}

