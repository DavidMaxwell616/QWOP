package
{
   import flash.display.MovieClip;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol43")]
   public dynamic class Burst_o extends MovieClip
   {
      
      public function Burst_o()
      {
         super();
         addFrameScript(19,frame20);
      }
      
      internal function frame20() : *
      {
         this.parent.removeChild(this);
         stop();
      }
   }
}

