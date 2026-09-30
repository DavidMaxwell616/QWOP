package wck
{
   public class FootBox extends Box
   {
      
      public var score_added:Boolean = false;
      
      public var fallen:Boolean = false;
      
      public function FootBox()
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
         var _loc4_:Burst_o = null;
         _loc2_ = param1.cp.shape1.GetUserData();
         _loc3_ = param1.cp.shape2.GetUserData();
         if(GlobalVars.vars.GameOver == false)
         {
            if(fallen == false)
            {
               if(_loc3_.name == "track" || _loc3_.name == "track2" || _loc3_.name == "track1")
               {
                  if(_loc2_.name == "clfoot" || _loc2_.name == "crfoot")
                  {
                     if(param1.cp.velocity.Length() > 10)
                     {
                     }
                     if(GlobalVars.vars.Jumped == false && param1.cp.position.x * 40 > GlobalVars.vars.SandPitAt - 220)
                     {
                        GlobalVars.vars.Jumped = true;
                     }
                     if(GlobalVars.vars.Jumped == true && GlobalVars.vars.JumpLanded == false)
                     {
                        if(param1.cp.position.x * 40 > GlobalVars.vars.SandPitAt)
                        {
                           GlobalVars.vars.JumpLanded = true;
                           _loc4_ = new Burst_o();
                           _loc4_.x = param1.cp.position.x * 40;
                           _loc4_.y = param1.cp.position.y * 40;
                           _loc4_.height = 80;
                           _loc4_.width = 80;
                           world.addChild(_loc4_);
                        }
                        GlobalVars.vars.score = Math.round(param1.cp.position.x) / 10;
                     }
                  }
               }
            }
         }
      }
   }
}

