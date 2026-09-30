package wck
{
   import Box2D.Collision.Shapes.b2Shape;
   import Box2D.Collision.b2ContactPoint;
   import Box2D.Common.Math.b2Vec2;
   import flash.events.Event;
   
   public class Contact extends Event
   {
      
      public var normalForce:Number = 0;
      
      public var separation:Number = 0;
      
      public var bias:int = 0;
      
      public var key:Number = 0;
      
      public var tangentForce:Number = 0;
      
      public var position:b2Vec2 = null;
      
      public var cp:b2ContactPoint;
      
      public var normal:b2Vec2 = null;
      
      public var shape1:b2Shape = null;
      
      public var shape2:b2Shape = null;
      
      public function Contact(param1:String, param2:b2ContactPoint, param3:int)
      {
         super(param1);
         cp = param2;
         bias = param3;
      }
      
      public function freeze() : void
      {
         shape1 = bias == 1 ? cp.shape1 : cp.shape2;
         shape2 = bias == 1 ? cp.shape2 : cp.shape1;
         normal = cp.normal.Copy();
         normal.Multiply(bias);
         position = cp.position.Copy();
         separation = cp.separation;
         key = cp.id._key;
      }
      
      public function applyForce(param1:*) : *
      {
         var _loc2_:b2Vec2 = null;
         _loc2_ = normal.Copy();
         _loc2_.Multiply(-param1);
         shape1.m_body.ApplyImpulse(_loc2_,position);
         _loc2_.Multiply(-1);
         shape2.m_body.ApplyImpulse(_loc2_,position);
      }
   }
}

