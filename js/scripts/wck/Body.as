package wck
{
   import Box2D.Dynamics.b2Body;
   import Box2D.Dynamics.b2BodyDef;
   import flash.display.MovieClip;
   import flash.events.Event;
   
   public class Body extends MovieClip
   {
      
      public var bodyIsStatic:Boolean = false;
      
      public var bodyAngularDamping:Number = 0;
      
      public var bodyIsSleeping:Boolean = false;
      
      public var bodyAllowSleep:Boolean = true;
      
      public var bodyFixedRotation:Boolean = false;
      
      public var bodyIsBullet:Boolean = false;
      
      public var world:World;
      
      public var bodyLinearDamping:Number = 0;
      
      public var b2body:b2Body;
      
      public var bodyApplyGravity:Boolean = true;
      
      public function Body()
      {
         super();
      }
      
      public function create() : void
      {
         var _loc1_:b2BodyDef = null;
         var _loc2_:Number = NaN;
         var _loc3_:Shape = null;
         var _loc4_:int = 0;
         world = parent as World;
         _loc1_ = new b2BodyDef();
         _loc1_.userData = this;
         _loc1_.linearDamping = bodyLinearDamping;
         _loc1_.angularDamping = bodyAngularDamping;
         _loc1_.allowSleep = bodyAllowSleep;
         _loc1_.isSleeping = bodyIsSleeping;
         _loc1_.fixedRotation = bodyFixedRotation;
         _loc1_.isBullet = bodyIsBullet;
         _loc2_ = rotation;
         rotation = 0;
         _loc1_.position.Set(x / world.scale,y / world.scale);
         _loc1_.angle = _loc2_ * Math.PI / 180;
         rotation = _loc2_;
         b2body = world.b2world.CreateBody(_loc1_);
         _loc3_ = this as Shape;
         if(_loc3_)
         {
            _loc3_.createShape();
         }
         _loc4_ = 0;
         while(_loc4_ < numChildren)
         {
            _loc3_ = getChildAt(_loc4_) as Shape;
            if(_loc3_)
            {
               _loc3_.createShape();
            }
            _loc4_++;
         }
         if(!bodyIsStatic)
         {
            b2body.SetMassFromShapes();
         }
         world.addEventListener(Event.ENTER_FRAME,step,false,0,true);
         world.addEventListener("cleanUp",cleanUp,false,0,true);
      }
      
      public function step(param1:Event) : void
      {
         if(!world.paused)
         {
            x = b2body.GetPosition().x * world.scale;
            y = b2body.GetPosition().y * world.scale;
            rotation = b2body.GetAngle() * 180 / Math.PI % 360;
         }
      }
      
      public function cleanUp(param1:Event = null) : void
      {
         world.removeEventListener(Event.ENTER_FRAME,step);
      }
   }
}

