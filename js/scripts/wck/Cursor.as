package wck
{
   import Box2D.Common.Math.b2Vec2;
   import Box2D.Dynamics.Joints.b2MouseJoint;
   import Box2D.Dynamics.Joints.b2MouseJointDef;
   import flash.display.MovieClip;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.geom.Point;
   
   public class Cursor extends MovieClip
   {
      
      public var bat:Bat;
      
      public var joint:b2MouseJoint;
      
      public var world:World;
      
      public var shape:Shape;
      
      public function Cursor()
      {
         super();
      }
      
      public function position(param1:MouseEvent) : void
      {
         x = param1.stageX;
         y = param1.stageY;
      }
      
      public function lock() : *
      {
         var _loc1_:Point = null;
         var _loc2_:b2MouseJointDef = null;
         stage.removeEventListener(Event.ENTER_FRAME,updateJoint);
         if(Boolean(world) && !world.paused)
         {
            shape = world.getChildByName("bat") as Bat;
            _loc1_ = world.globalToLocal(new Point(x,y));
            if(shape)
            {
               _loc2_ = new b2MouseJointDef();
               _loc2_.body1 = world.b2world.m_groundBody;
               _loc2_.body2 = shape.body.b2body;
               _loc2_.target = new b2Vec2(-102 / world.scale,121 / world.scale);
               _loc2_.maxForce = 200 * shape.body.b2body.m_mass;
               _loc2_.timeStep = 1 / 40;
               joint = world.b2world.CreateJoint(_loc2_) as b2MouseJoint;
               stage.addEventListener(Event.ENTER_FRAME,updateJoint,false,0,true);
            }
         }
      }
      
      public function updateJoint(param1:Event) : void
      {
         var _loc2_:Point = null;
         _loc2_ = world.globalToLocal(new Point(x,y));
         joint.SetTarget(new b2Vec2(_loc2_.x / world.scale,_loc2_.y / world.scale));
      }
      
      public function initialize() : *
      {
         mouseEnabled = false;
         stage.addEventListener(MouseEvent.MOUSE_MOVE,position,false,0,true);
      }
   }
}

