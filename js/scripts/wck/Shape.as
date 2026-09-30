package wck
{
   import Box2D.Collision.Shapes.b2CircleDef;
   import Box2D.Collision.Shapes.b2PolygonDef;
   import Box2D.Collision.Shapes.b2ShapeDef;
   import Box2D.Common.Math.b2Vec2;
   import flash.geom.Point;
   
   public class Shape extends Body
   {
      
      public var shapeDensity:Number = 1;
      
      public var shapeRestitution:Number = 0;
      
      public var b2shapes:Array = [];
      
      public var shapeGroupIndex:int = 0;
      
      public var selfBody:Boolean;
      
      public var shapeIsSensor:Boolean = false;
      
      public var shapeCategoryBits:String = "0x0001";
      
      public var body:Body;
      
      public var shapeFriction:Number = 0.2;
      
      public var shapeMaskBits:String = "0xFFFF";
      
      public function Shape()
      {
         super();
      }
      
      public function createShape() : void
      {
         body = parent as Body;
         if(!body)
         {
            body = this;
            selfBody = true;
         }
         else
         {
            world = body.world;
         }
         addShapes([]);
      }
      
      public function addShapes(param1:Array) : void
      {
         var _loc2_:b2ShapeDef = null;
         for each(_loc2_ in param1)
         {
            b2shapes.push(body.b2body.CreateShape(_loc2_));
         }
      }
      
      public function circleDef(param1:Number = -1, param2:Number = 0, param3:Number = 0) : b2CircleDef
      {
         var _loc4_:b2CircleDef = null;
         _loc4_ = new b2CircleDef();
         initializeDef(_loc4_);
         _loc4_.localPosition = b2Position(param2,param3);
         _loc4_.radius = (param1 == -1 ? width / 2 : param1 * scaleX) * (selfBody ? 1 : body.scaleX) / world.scale;
         return _loc4_;
      }
      
      public function initializeDef(param1:b2ShapeDef) : void
      {
         param1.userData = this;
         param1.friction = shapeFriction;
         param1.restitution = shapeRestitution;
         param1.density = shapeDensity;
         param1.filter.categoryBits = parseInt(shapeCategoryBits);
         param1.filter.maskBits = parseInt(shapeMaskBits);
         param1.filter.groupIndex = shapeGroupIndex;
         param1.isSensor = shapeIsSensor;
      }
      
      public function b2Position(param1:* = 0, param2:* = 0) : b2Vec2
      {
         var _loc3_:Point = null;
         if(selfBody)
         {
            return new b2Vec2(param1 * scaleX / world.scale,param2 * scaleY / world.scale);
         }
         _loc3_ = body.globalToLocal(localToGlobal(new Point(param1,param2)));
         return new b2Vec2(_loc3_.x * body.scaleX / world.scale,_loc3_.y * body.scaleY / world.scale);
      }
      
      public function polygonDef(param1:Array) : b2PolygonDef
      {
         var _loc2_:b2PolygonDef = null;
         var _loc3_:Array = null;
         _loc2_ = new b2PolygonDef();
         initializeDef(_loc2_);
         _loc2_.vertices = [];
         for each(_loc3_ in param1)
         {
            _loc2_.vertices.push(b2Position(_loc3_[0],_loc3_[1]));
         }
         _loc2_.vertexCount = _loc2_.vertices.length;
         return _loc2_;
      }
      
      public function boxDef(param1:Number = -1, param2:Number = -1, param3:Number = 0, param4:Number = 0, param5:Number = 0) : b2PolygonDef
      {
         var _loc6_:b2PolygonDef = null;
         var _loc7_:Number = NaN;
         _loc6_ = new b2PolygonDef();
         initializeDef(_loc6_);
         _loc7_ = rotation;
         rotation = 0;
         _loc6_.SetAsOrientedBox((param1 == -1 ? width / 2 : param1 * scaleX) * (selfBody ? 1 : body.scaleX) / world.scale,(param2 == -1 ? height / 2 : param2 * scaleY) * (selfBody ? 1 : body.scaleY) / world.scale,b2Position(param3,param4),((selfBody ? 0 : _loc7_) + param5) * Math.PI / 180);
         rotation = _loc7_;
         return _loc6_;
      }
      
      public function polygonListDef(param1:Array) : Array
      {
         var _loc2_:Array = null;
         var _loc3_:Array = null;
         _loc2_ = [];
         for each(_loc3_ in param1)
         {
            _loc2_.push(polygonDef(_loc3_));
         }
         return _loc2_;
      }
   }
}

