package wck
{
   import Box2D.Collision.b2ContactPoint;
   import Box2D.Dynamics.b2ContactListener;
   import flash.events.EventDispatcher;
   
   public class ContactListener extends b2ContactListener
   {
      
      public function ContactListener()
      {
         super();
      }
      
      override public function Persist(param1:b2ContactPoint) : void
      {
         dispatch(param1,"persistContact");
      }
      
      override public function Add(param1:b2ContactPoint) : void
      {
         dispatch(param1,"addContact");
      }
      
      public function dispatch(param1:b2ContactPoint, param2:String) : *
      {
         var _loc3_:EventDispatcher = null;
         var _loc4_:EventDispatcher = null;
         _loc3_ = param1.shape1.GetUserData() as EventDispatcher;
         _loc4_ = param1.shape2.GetUserData() as EventDispatcher;
         _loc3_ && _loc3_.dispatchEvent(new Contact(param2,param1,1));
         _loc4_ && _loc4_.dispatchEvent(new Contact(param2,param1,-1));
      }
      
      override public function Remove(param1:b2ContactPoint) : void
      {
         dispatch(param1,"removeContact");
      }
   }
}

