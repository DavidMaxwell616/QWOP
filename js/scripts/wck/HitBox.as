package wck
{
   import Box2D.Common.Math.b2Vec2;
   import flash.media.SoundChannel;
   
   public class HitBox extends Box
   {
      
      public var score_added:Boolean = false;
      
      public var fallen:Boolean = false;
      
      public function HitBox()
      {
         super();
         fallen = false;
         score_added = false;
         addEventListener("addContact",contactAdded,false,0,true);
      }
      
      public function contactAdded(param1:Contact) : void
      {
         var _loc2_:* = undefined;
         var _loc3_:* = undefined;
         var _loc4_:b2Vec2 = null;
         var _loc5_:* = undefined;
         var _loc6_:Burst_o = null;
         var _loc7_:Crunch_sound = null;
         var _loc8_:SoundChannel = null;
         var _loc9_:Ehh_sound = null;
         _loc2_ = param1.cp.shape1.GetUserData();
         _loc3_ = param1.cp.shape2.GetUserData();
         if(GlobalVars.vars.GameOver == false)
         {
            if(fallen == false)
            {
               if(_loc3_.name == "track" || _loc3_.name == "track2" || _loc3_.name == "track1")
               {
                  if(_loc2_.name == "crfarm" || _loc2_.name == "chead" || _loc2_.name == "clfarm" || _loc2_.name == "cruarm")
                  {
                     fallen = true;
                     GlobalVars.vars.GameOver = true;
                     GlobalVars.vars.score = Math.round(param1.cp.position.x) / 10;
                     _loc4_ = param1.cp.velocity;
                     _loc5_ = _loc4_.Length();
                     if(_loc5_ > 5)
                     {
                        if(GlobalVars.vars.Muted == false)
                        {
                           _loc7_ = new Crunch_sound();
                           _loc8_ = _loc7_.play();
                        }
                     }
                     else if(GlobalVars.vars.Muted == false)
                     {
                        _loc9_ = new Ehh_sound();
                        _loc8_ = _loc9_.play();
                     }
                     _loc6_ = new Burst_o();
                     _loc6_.x = param1.cp.position.x * 40;
                     _loc6_.y = param1.cp.position.y * 40;
                     _loc6_.height = 80;
                     _loc6_.width = 80;
                     world.addChild(_loc6_);
                     if(GlobalVars.vars.Jumped == true && GlobalVars.vars.JumpLanded == false)
                     {
                        GlobalVars.vars.JumpLanded = true;
                     }
                  }
               }
            }
         }
      }
   }
}

