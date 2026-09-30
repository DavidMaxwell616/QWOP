package wck
{
   import Box2D.Collision.*;
   import Box2D.Collision.Shapes.*;
   import Box2D.Common.*;
   import Box2D.Common.Math.*;
   import Box2D.Dynamics.*;
   import Box2D.Dynamics.Contacts.*;
   import Box2D.Dynamics.Joints.*;
   import flash.display.MovieClip;
   import flash.events.Event;
   
   public class View extends MovieClip
   {
      
      public var orientToGravity:Boolean = true;
      
      public var world:*;
      
      public var world1:DemoWorld1;
      
      public function View()
      {
         super();
      }
      
      public function initialize() : void
      {
         var _loc1_:int = 0;
         _loc1_ = 0;
         while(_loc1_ < numChildren)
         {
            world = getChildAt(_loc1_) as World;
            if(world)
            {
               break;
            }
            _loc1_++;
         }
         world.create();
         addEventListener(Event.ENTER_FRAME,step,false,0,true);
      }
      
      public function step(param1:Event) : void
      {
         if(orientToGravity && Boolean(world.gravityRadial))
         {
            rotation = -90 * (world.gravityRadial / Math.abs(world.gravityRadial)) - Math.atan2(world.y,world.x) * 180 / Math.PI;
         }
      }
      
      public function cleanUp() : void
      {
         removeEventListener(Event.ENTER_FRAME,step);
         world.cleanUp();
      }
   }
}

