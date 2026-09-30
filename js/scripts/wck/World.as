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
   
   public class World extends MovieClip
   {
      
      public var ltjoint:BatsmanJoint;
      
      public var gravityRadial:Number = 0;
      
      public var keepCenteredOn:String = "";
      
      public var clfarm:CLFARM;
      
      public var vars:Object = {};
      
      public var lajoint:BatsmanJoint;
      
      public var clcalf:CLCALF;
      
      public var track1:Track;
      
      public var clfoot:CLFOOT;
      
      public var boundsLeft:Number = -10000000000;
      
      public var track2:Track;
      
      public var boundsTop:Number = 10000000000;
      
      public var boundsRight:Number = 10000000000;
      
      public var viewtarget:MovieClip;
      
      public var cbody:CBODY;
      
      public var rankle:BatsmanJoint;
      
      public var cruarm:CRUARM;
      
      public var chead:CHEAD;
      
      public var Sline:WhiteLine;
      
      public var lankle:BatsmanJoint;
      
      public var rcjoint:BatsmanJoint;
      
      public var crthigh:CRTHIGH;
      
      public var doSleep:Boolean = true;
      
      public var centerOn:DisplayObject;
      
      public var crfarm:CRFARM;
      
      public var paused:Boolean;
      
      public var iterations:int = 10;
      
      public var timeStep:Number = 0.025;
      
      public var crcalf:CRCALF;
      
      public var clthigh:CLTHIGH;
      
      public var boundsBottom:Number = -10000000000;
      
      public var track:Track;
      
      public var crfoot:CRFOOT;
      
      public var scale:Number = 40;
      
      public var lcjoint:BatsmanJoint;
      
      public var b2world:b2World;
      
      public var rtjoint:BatsmanJoint;
      
      public var cluarm:CLUARM;
      
      public var rajoint:BatsmanJoint;
      
      public var gravityX:Number = 0;
      
      public var gravityY:Number = 10;
      
      public function World()
      {
         super();
      }
      
      public function cleanUp() : void
      {
         dispatchEvent(new Event("cleanUp"));
         removeEventListener(Event.ENTER_FRAME,step);
      }
      
      public function step(param1:Event) : void
      {
         var _loc2_:b2Vec2 = null;
         var _loc3_:b2Vec2 = null;
         var _loc4_:b2Body = null;
         if(!paused)
         {
            b2world.Step(timeStep,iterations);
            GlobalVars.vars.timeElapsed += timeStep;
            if(gravityRadial)
            {
               _loc4_ = b2world.GetBodyList();
               while(_loc4_)
               {
                  if(!_loc4_.IsStatic() && !_loc4_.IsSleeping())
                  {
                     _loc2_ = _loc4_.GetWorldCenter().Copy();
                     _loc2_.Normalize();
                     _loc2_.Multiply(gravityRadial);
                     _loc3_ = _loc4_.GetLinearVelocity();
                     _loc3_.x += timeStep * _loc2_.x;
                     _loc3_.y += timeStep * _loc2_.y;
                  }
                  _loc4_ = _loc4_.GetNext();
               }
            }
         }
         if(centerOn)
         {
            x = -centerOn.x * 0.92;
            y = -centerOn.y;
         }
      }
      
      public function create() : void
      {
         var _loc1_:b2AABB = null;
         var _loc2_:Body = null;
         var _loc3_:Joint = null;
         var _loc4_:Array = null;
         var _loc5_:int = 0;
         _loc1_ = new b2AABB();
         _loc1_.lowerBound.Set(boundsLeft,boundsBottom);
         _loc1_.upperBound.Set(boundsRight,boundsTop);
         b2world = new b2World(_loc1_,new b2Vec2(gravityX,gravityY),doSleep);
         b2world.SetContactListener(new ContactListener());
         _loc4_ = [];
         _loc5_ = 0;
         while(_loc5_ < numChildren)
         {
            _loc2_ = getChildAt(_loc5_) as Body;
            if(_loc2_)
            {
               _loc2_.create();
            }
            else
            {
               _loc3_ = getChildAt(_loc5_) as Joint;
               if(_loc3_)
               {
                  _loc3_.anchor();
                  _loc4_.push(_loc3_);
               }
            }
            _loc5_++;
         }
         for each(_loc3_ in _loc4_)
         {
            _loc3_.create();
         }
         if(keepCenteredOn)
         {
            centerOn = getChildByName(keepCenteredOn);
         }
         addEventListener(Event.ENTER_FRAME,step,false,0,true);
      }
      
      public function setVar(param1:String, param2:*) : *
      {
         vars[param1] = param2;
         dispatchEvent(new Event(param1));
      }
   }
}

