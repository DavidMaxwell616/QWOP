package wck
{
   public class Box extends Shape
   {
      
      public function Box()
      {
         super();
      }
      
      override public function addShapes(param1:Array) : void
      {
         param1.push(boxDef());
         super.addShapes(param1);
      }
   }
}

