package
{
   import wck.World;
   
   [Embed(source="/_assets/assets.swf", symbol="symbol119")]
   public dynamic class DemoWorld1 extends World
   {
      
      public var __id0_:ConcreteBlock;
      
      public var __id1_:BatsmanJoint;
      
      public var __id2_:BatsmanJoint;
      
      public var __id3_:BatsmanJoint;
      
      public function DemoWorld1()
      {
         super();
         __setProp_rajoint_DemoWorld1_Joints_1();
         __setProp_lajoint_DemoWorld1_Joints_1();
         __setProp_cbody_DemoWorld1_Layer1_1();
         __setProp_lankle_DemoWorld1_Joints_1();
         __setProp_clfarm_DemoWorld1_Layer1_1();
         __setProp_ltjoint_DemoWorld1_Joints_1();
         __setProp_clfoot_DemoWorld1_Layer1_1();
         __setProp_rtjoint_DemoWorld1_Joints_1();
         __setProp___id0__DemoWorld1_Layer1_1();
         __setProp_crfoot_DemoWorld1_Layer1_1();
         __setProp_crfarm_DemoWorld1_Layer1_1();
         __setProp_crcalf_DemoWorld1_Layer1_1();
         __setProp_track1_DemoWorld1_Ground_1();
         __setProp_crthigh_DemoWorld1_Layer1_1();
         __setProp_cruarm_DemoWorld1_Layer1_1();
         __setProp_track_DemoWorld1_Ground_1();
         __setProp___id1__DemoWorld1_Joints_1();
         __setProp___id3__DemoWorld1_Joints_1();
         __setProp_lcjoint_DemoWorld1_Joints_1();
         __setProp_rankle_DemoWorld1_Joints_1();
         __setProp_track2_DemoWorld1_Ground_1();
         __setProp_clthigh_DemoWorld1_Layer1_1();
         __setProp_clcalf_DemoWorld1_Layer1_1();
         __setProp_rcjoint_DemoWorld1_Joints_1();
         __setProp___id2__DemoWorld1_Joints_1();
         __setProp_chead_DemoWorld1_Layer1_1();
         __setProp_cluarm_DemoWorld1_Layer1_1();
      }
      
      internal function __setProp_cruarm_DemoWorld1_Layer1_1() : *
      {
         try
         {
            cruarm["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         cruarm.bodyAllowSleep = true;
         cruarm.bodyAngularDamping = 0;
         cruarm.bodyApplyGravity = true;
         cruarm.bodyFixedRotation = false;
         cruarm.bodyIsBullet = false;
         cruarm.bodyIsSleeping = false;
         cruarm.bodyIsStatic = false;
         cruarm.bodyLinearDamping = 0;
         cruarm.shapeCategoryBits = "0x0002";
         cruarm.shapeDensity = 1;
         cruarm.shapeFriction = 0.2;
         cruarm.shapeGroupIndex = 0;
         cruarm.shapeIsSensor = false;
         cruarm.shapeMaskBits = "0xFFFD";
         cruarm.shapeRestitution = 0;
         try
         {
            cruarm["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_cluarm_DemoWorld1_Layer1_1() : *
      {
         try
         {
            cluarm["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         cluarm.bodyAllowSleep = true;
         cluarm.bodyAngularDamping = 0;
         cluarm.bodyApplyGravity = true;
         cluarm.bodyFixedRotation = false;
         cluarm.bodyIsBullet = false;
         cluarm.bodyIsSleeping = false;
         cluarm.bodyIsStatic = false;
         cluarm.bodyLinearDamping = 0;
         cluarm.shapeCategoryBits = "0x0002";
         cluarm.shapeDensity = 1;
         cluarm.shapeFriction = 0.2;
         cluarm.shapeGroupIndex = 0;
         cluarm.shapeIsSensor = false;
         cluarm.shapeMaskBits = "0xFFFD";
         cluarm.shapeRestitution = 0;
         try
         {
            cluarm["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_clcalf_DemoWorld1_Layer1_1() : *
      {
         try
         {
            clcalf["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         clcalf.bodyAllowSleep = true;
         clcalf.bodyAngularDamping = 0;
         clcalf.bodyApplyGravity = true;
         clcalf.bodyFixedRotation = false;
         clcalf.bodyIsBullet = false;
         clcalf.bodyIsSleeping = false;
         clcalf.bodyIsStatic = false;
         clcalf.bodyLinearDamping = 0;
         clcalf.shapeCategoryBits = "0x0002";
         clcalf.shapeDensity = 1;
         clcalf.shapeFriction = 0.2;
         clcalf.shapeGroupIndex = 0;
         clcalf.shapeIsSensor = false;
         clcalf.shapeMaskBits = "0xFFFD";
         clcalf.shapeRestitution = 0;
         try
         {
            clcalf["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_rtjoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            rtjoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         rtjoint.body2Name = "cbody";
         rtjoint.bodyName = "crthigh";
         rtjoint.collideConnected = false;
         rtjoint.enableLimit = true;
         rtjoint.enableMotor = true;
         rtjoint.lineParameter = "0x888888";
         rtjoint.lineStyle = "Line";
         rtjoint.lowerLimit = -1.3;
         rtjoint.pathReturns = false;
         rtjoint.speed1 = -2.5;
         rtjoint.speed2 = 2.5;
         rtjoint.speedFlag = "thighFlag";
         rtjoint.spring = false;
         rtjoint.springConstant = 15;
         rtjoint.springDamping = 0.5;
         rtjoint.strength = 6000;
         rtjoint.targetName = "";
         rtjoint.type = "RevolutePin";
         rtjoint.upperLimit = 0.7;
         try
         {
            rtjoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_crcalf_DemoWorld1_Layer1_1() : *
      {
         try
         {
            crcalf["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         crcalf.bodyAllowSleep = true;
         crcalf.bodyAngularDamping = 0;
         crcalf.bodyApplyGravity = true;
         crcalf.bodyFixedRotation = false;
         crcalf.bodyIsBullet = false;
         crcalf.bodyIsSleeping = false;
         crcalf.bodyIsStatic = false;
         crcalf.bodyLinearDamping = 0;
         crcalf.shapeCategoryBits = "0x0002";
         crcalf.shapeDensity = 1;
         crcalf.shapeFriction = 0.2;
         crcalf.shapeGroupIndex = 0;
         crcalf.shapeIsSensor = false;
         crcalf.shapeMaskBits = "0xFFFD";
         crcalf.shapeRestitution = 0;
         try
         {
            crcalf["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_cbody_DemoWorld1_Layer1_1() : *
      {
         try
         {
            cbody["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         cbody.bodyAllowSleep = true;
         cbody.bodyAngularDamping = 0;
         cbody.bodyApplyGravity = true;
         cbody.bodyFixedRotation = false;
         cbody.bodyIsBullet = false;
         cbody.bodyIsSleeping = false;
         cbody.bodyIsStatic = false;
         cbody.bodyLinearDamping = 0;
         cbody.shapeCategoryBits = "0x0002";
         cbody.shapeDensity = 1;
         cbody.shapeFriction = 0.2;
         cbody.shapeGroupIndex = 0;
         cbody.shapeIsSensor = false;
         cbody.shapeMaskBits = "0xFFFD";
         cbody.shapeRestitution = 0;
         try
         {
            cbody["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_crthigh_DemoWorld1_Layer1_1() : *
      {
         try
         {
            crthigh["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         crthigh.bodyAllowSleep = true;
         crthigh.bodyAngularDamping = 0;
         crthigh.bodyApplyGravity = true;
         crthigh.bodyFixedRotation = false;
         crthigh.bodyIsBullet = false;
         crthigh.bodyIsSleeping = false;
         crthigh.bodyIsStatic = false;
         crthigh.bodyLinearDamping = 0;
         crthigh.shapeCategoryBits = "0x0002";
         crthigh.shapeDensity = 1;
         crthigh.shapeFriction = 0.2;
         crthigh.shapeGroupIndex = 0;
         crthigh.shapeIsSensor = false;
         crthigh.shapeMaskBits = "0xFFFD";
         crthigh.shapeRestitution = 0;
         try
         {
            crthigh["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_lajoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            lajoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         lajoint.body2Name = "cbody";
         lajoint.bodyName = "cluarm";
         lajoint.collideConnected = false;
         lajoint.enableLimit = true;
         lajoint.enableMotor = true;
         lajoint.lineParameter = "0x888888";
         lajoint.lineStyle = "Line";
         lajoint.lowerLimit = -2;
         lajoint.pathReturns = false;
         lajoint.speed1 = -2;
         lajoint.speed2 = 2;
         lajoint.speedFlag = "armFlag";
         lajoint.spring = false;
         lajoint.springConstant = 15;
         lajoint.springDamping = 0.5;
         lajoint.strength = 1000;
         lajoint.targetName = "";
         lajoint.type = "RevolutePin";
         lajoint.upperLimit = 0;
         try
         {
            lajoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp___id1__DemoWorld1_Joints_1() : *
      {
         try
         {
            __id1_["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         __id1_.body2Name = "cruarm";
         __id1_.bodyName = "crfarm";
         __id1_.collideConnected = false;
         __id1_.enableLimit = true;
         __id1_.enableMotor = false;
         __id1_.lineParameter = "0x888888";
         __id1_.lineStyle = "Line";
         __id1_.lowerLimit = -0.1;
         __id1_.pathReturns = false;
         __id1_.speed1 = 10;
         __id1_.speed2 = -10;
         __id1_.speedFlag = "armFlag";
         __id1_.spring = true;
         __id1_.springConstant = 1;
         __id1_.springDamping = 0;
         __id1_.strength = 100000;
         __id1_.targetName = "";
         __id1_.type = "RevolutePin";
         __id1_.upperLimit = 0.5;
         try
         {
            __id1_["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_track1_DemoWorld1_Ground_1() : *
      {
         try
         {
            track1["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         track1.bodyAllowSleep = true;
         track1.bodyAngularDamping = 0;
         track1.bodyApplyGravity = true;
         track1.bodyFixedRotation = false;
         track1.bodyIsBullet = false;
         track1.bodyIsSleeping = false;
         track1.bodyIsStatic = true;
         track1.bodyLinearDamping = 0;
         track1.shapeCategoryBits = "0x0001";
         track1.shapeDensity = 1;
         track1.shapeFriction = 1;
         track1.shapeGroupIndex = 0;
         track1.shapeIsSensor = false;
         track1.shapeMaskBits = "0xFFFF";
         track1.shapeRestitution = 0.2;
         try
         {
            track1["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_rankle_DemoWorld1_Joints_1() : *
      {
         try
         {
            rankle["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         rankle.body2Name = "crcalf";
         rankle.bodyName = "crfoot";
         rankle.collideConnected = false;
         rankle.enableLimit = true;
         rankle.enableMotor = false;
         rankle.lineParameter = "0x888888";
         rankle.lineStyle = "Line";
         rankle.lowerLimit = -0.5;
         rankle.pathReturns = false;
         rankle.speed1 = 2;
         rankle.speed2 = -2;
         rankle.speedFlag = "rightAnkleFlag";
         rankle.spring = false;
         rankle.springConstant = 30;
         rankle.springDamping = 0.8;
         rankle.strength = 2000;
         rankle.targetName = "";
         rankle.type = "RevolutePin";
         rankle.upperLimit = 0.5;
         try
         {
            rankle["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_lcjoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            lcjoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         lcjoint.body2Name = "clthigh";
         lcjoint.bodyName = "clcalf";
         lcjoint.collideConnected = false;
         lcjoint.enableLimit = true;
         lcjoint.enableMotor = true;
         lcjoint.lineParameter = "0x888888";
         lcjoint.lineStyle = "Line";
         lcjoint.lowerLimit = -1.6;
         lcjoint.pathReturns = false;
         lcjoint.speed1 = 2.5;
         lcjoint.speed2 = -2.5;
         lcjoint.speedFlag = "calfFlag";
         lcjoint.spring = false;
         lcjoint.springConstant = 15;
         lcjoint.springDamping = 0.5;
         lcjoint.strength = 3000;
         lcjoint.targetName = "";
         lcjoint.type = "RevolutePin";
         lcjoint.upperLimit = 0;
         try
         {
            lcjoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_track_DemoWorld1_Ground_1() : *
      {
         try
         {
            track["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         track.bodyAllowSleep = true;
         track.bodyAngularDamping = 0;
         track.bodyApplyGravity = true;
         track.bodyFixedRotation = false;
         track.bodyIsBullet = false;
         track.bodyIsSleeping = false;
         track.bodyIsStatic = true;
         track.bodyLinearDamping = 0;
         track.shapeCategoryBits = "0x0001";
         track.shapeDensity = 1;
         track.shapeFriction = 1;
         track.shapeGroupIndex = 0;
         track.shapeIsSensor = false;
         track.shapeMaskBits = "0xFFFF";
         track.shapeRestitution = 0.2;
         try
         {
            track["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_rajoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            rajoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         rajoint.body2Name = "cbody";
         rajoint.bodyName = "cruarm";
         rajoint.collideConnected = false;
         rajoint.enableLimit = true;
         rajoint.enableMotor = true;
         rajoint.lineParameter = "0x888888";
         rajoint.lineStyle = "Line";
         rajoint.lowerLimit = -0.5;
         rajoint.pathReturns = false;
         rajoint.speed1 = 2;
         rajoint.speed2 = -2;
         rajoint.speedFlag = "armFlag";
         rajoint.spring = false;
         rajoint.springConstant = 15;
         rajoint.springDamping = 0.5;
         rajoint.strength = 1000;
         rajoint.targetName = "";
         rajoint.type = "RevolutePin";
         rajoint.upperLimit = 1.5;
         try
         {
            rajoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_clfarm_DemoWorld1_Layer1_1() : *
      {
         try
         {
            clfarm["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         clfarm.bodyAllowSleep = true;
         clfarm.bodyAngularDamping = 0;
         clfarm.bodyApplyGravity = true;
         clfarm.bodyFixedRotation = false;
         clfarm.bodyIsBullet = false;
         clfarm.bodyIsSleeping = false;
         clfarm.bodyIsStatic = false;
         clfarm.bodyLinearDamping = 0;
         clfarm.shapeCategoryBits = "0x0002";
         clfarm.shapeDensity = 1;
         clfarm.shapeFriction = 0.2;
         clfarm.shapeGroupIndex = 0;
         clfarm.shapeIsSensor = false;
         clfarm.shapeMaskBits = "0xFFFD";
         clfarm.shapeRestitution = 0;
         try
         {
            clfarm["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_crfarm_DemoWorld1_Layer1_1() : *
      {
         try
         {
            crfarm["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         crfarm.bodyAllowSleep = true;
         crfarm.bodyAngularDamping = 0;
         crfarm.bodyApplyGravity = true;
         crfarm.bodyFixedRotation = false;
         crfarm.bodyIsBullet = false;
         crfarm.bodyIsSleeping = false;
         crfarm.bodyIsStatic = false;
         crfarm.bodyLinearDamping = 0;
         crfarm.shapeCategoryBits = "0x0002";
         crfarm.shapeDensity = 1;
         crfarm.shapeFriction = 0.2;
         crfarm.shapeGroupIndex = 0;
         crfarm.shapeIsSensor = false;
         crfarm.shapeMaskBits = "0xFFFD";
         crfarm.shapeRestitution = 0;
         try
         {
            crfarm["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_rcjoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            rcjoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         rcjoint.body2Name = "crthigh";
         rcjoint.bodyName = "crcalf";
         rcjoint.collideConnected = false;
         rcjoint.enableLimit = true;
         rcjoint.enableMotor = true;
         rcjoint.lineParameter = "0x888888";
         rcjoint.lineStyle = "Line";
         rcjoint.lowerLimit = -1.3;
         rcjoint.pathReturns = false;
         rcjoint.speed1 = -2.5;
         rcjoint.speed2 = 2.5;
         rcjoint.speedFlag = "calfFlag";
         rcjoint.spring = false;
         rcjoint.springConstant = 15;
         rcjoint.springDamping = 0.5;
         rcjoint.strength = 3000;
         rcjoint.targetName = "";
         rcjoint.type = "RevolutePin";
         rcjoint.upperLimit = 0.3;
         try
         {
            rcjoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_clfoot_DemoWorld1_Layer1_1() : *
      {
         try
         {
            clfoot["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         clfoot.bodyAllowSleep = true;
         clfoot.bodyAngularDamping = 0;
         clfoot.bodyApplyGravity = true;
         clfoot.bodyFixedRotation = false;
         clfoot.bodyIsBullet = false;
         clfoot.bodyIsSleeping = false;
         clfoot.bodyIsStatic = false;
         clfoot.bodyLinearDamping = 0;
         clfoot.shapeCategoryBits = "0x0002";
         clfoot.shapeDensity = 3;
         clfoot.shapeFriction = 1.5;
         clfoot.shapeGroupIndex = 0;
         clfoot.shapeIsSensor = false;
         clfoot.shapeMaskBits = "0xFFFD";
         clfoot.shapeRestitution = 0;
         try
         {
            clfoot["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_crfoot_DemoWorld1_Layer1_1() : *
      {
         try
         {
            crfoot["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         crfoot.bodyAllowSleep = true;
         crfoot.bodyAngularDamping = 0;
         crfoot.bodyApplyGravity = true;
         crfoot.bodyFixedRotation = false;
         crfoot.bodyIsBullet = false;
         crfoot.bodyIsSleeping = false;
         crfoot.bodyIsStatic = false;
         crfoot.bodyLinearDamping = 0;
         crfoot.shapeCategoryBits = "0x0002";
         crfoot.shapeDensity = 3;
         crfoot.shapeFriction = 1.5;
         crfoot.shapeGroupIndex = 0;
         crfoot.shapeIsSensor = false;
         crfoot.shapeMaskBits = "0xFFFD";
         crfoot.shapeRestitution = 0;
         try
         {
            crfoot["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp___id2__DemoWorld1_Joints_1() : *
      {
         try
         {
            __id2_["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         __id2_.body2Name = "cluarm";
         __id2_.bodyName = "clfarm";
         __id2_.collideConnected = false;
         __id2_.enableLimit = true;
         __id2_.enableMotor = false;
         __id2_.lineParameter = "0x888888";
         __id2_.lineStyle = "Line";
         __id2_.lowerLimit = -0.1;
         __id2_.pathReturns = false;
         __id2_.speed1 = 10;
         __id2_.speed2 = -10;
         __id2_.speedFlag = "armFlag";
         __id2_.spring = true;
         __id2_.springConstant = 1;
         __id2_.springDamping = 0;
         __id2_.strength = 100000;
         __id2_.targetName = "";
         __id2_.type = "RevolutePin";
         __id2_.upperLimit = 0.5;
         try
         {
            __id2_["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_chead_DemoWorld1_Layer1_1() : *
      {
         try
         {
            chead["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         chead.bodyAllowSleep = true;
         chead.bodyAngularDamping = 0;
         chead.bodyApplyGravity = true;
         chead.bodyFixedRotation = false;
         chead.bodyIsBullet = false;
         chead.bodyIsSleeping = false;
         chead.bodyIsStatic = false;
         chead.bodyLinearDamping = 0;
         chead.shapeCategoryBits = "0x0002";
         chead.shapeDensity = 1;
         chead.shapeFriction = 0.2;
         chead.shapeGroupIndex = 0;
         chead.shapeIsSensor = false;
         chead.shapeMaskBits = "0xFFFD";
         chead.shapeRestitution = 0;
         try
         {
            chead["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_clthigh_DemoWorld1_Layer1_1() : *
      {
         try
         {
            clthigh["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         clthigh.bodyAllowSleep = true;
         clthigh.bodyAngularDamping = 0;
         clthigh.bodyApplyGravity = true;
         clthigh.bodyFixedRotation = false;
         clthigh.bodyIsBullet = false;
         clthigh.bodyIsSleeping = false;
         clthigh.bodyIsStatic = false;
         clthigh.bodyLinearDamping = 0;
         clthigh.shapeCategoryBits = "0x0002";
         clthigh.shapeDensity = 1;
         clthigh.shapeFriction = 0.2;
         clthigh.shapeGroupIndex = 0;
         clthigh.shapeIsSensor = false;
         clthigh.shapeMaskBits = "0xFFFD";
         clthigh.shapeRestitution = 0;
         try
         {
            clthigh["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp___id3__DemoWorld1_Joints_1() : *
      {
         try
         {
            __id3_["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         __id3_.body2Name = "cbody";
         __id3_.bodyName = "chead";
         __id3_.collideConnected = false;
         __id3_.enableLimit = true;
         __id3_.enableMotor = false;
         __id3_.lineParameter = "0x888888";
         __id3_.lineStyle = "Line";
         __id3_.lowerLimit = -0.5;
         __id3_.pathReturns = false;
         __id3_.speed1 = 0;
         __id3_.speed2 = 0;
         __id3_.speedFlag = "";
         __id3_.spring = true;
         __id3_.springConstant = 15;
         __id3_.springDamping = 5;
         __id3_.strength = 0;
         __id3_.targetName = "";
         __id3_.type = "RevolutePin";
         __id3_.upperLimit = 0;
         try
         {
            __id3_["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_ltjoint_DemoWorld1_Joints_1() : *
      {
         try
         {
            ltjoint["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         ltjoint.body2Name = "cbody";
         ltjoint.bodyName = "clthigh";
         ltjoint.collideConnected = false;
         ltjoint.enableLimit = true;
         ltjoint.enableMotor = true;
         ltjoint.lineParameter = "0x888888";
         ltjoint.lineStyle = "Line";
         ltjoint.lowerLimit = -1.5;
         ltjoint.pathReturns = false;
         ltjoint.speed1 = 2.5;
         ltjoint.speed2 = -2.5;
         ltjoint.speedFlag = "thighFlag";
         ltjoint.spring = false;
         ltjoint.springConstant = 15;
         ltjoint.springDamping = 0.5;
         ltjoint.strength = 6000;
         ltjoint.targetName = "";
         ltjoint.type = "RevolutePin";
         ltjoint.upperLimit = 0.5;
         try
         {
            ltjoint["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_lankle_DemoWorld1_Joints_1() : *
      {
         try
         {
            lankle["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         lankle.body2Name = "clcalf";
         lankle.bodyName = "clfoot";
         lankle.collideConnected = false;
         lankle.enableLimit = true;
         lankle.enableMotor = false;
         lankle.lineParameter = "0x888888";
         lankle.lineStyle = "Line";
         lankle.lowerLimit = -0.5;
         lankle.pathReturns = false;
         lankle.speed1 = 2;
         lankle.speed2 = -2;
         lankle.speedFlag = "leftAnkleFlag";
         lankle.spring = false;
         lankle.springConstant = 30;
         lankle.springDamping = 0.5;
         lankle.strength = 2000;
         lankle.targetName = "";
         lankle.type = "RevolutePin";
         lankle.upperLimit = 0.5;
         try
         {
            lankle["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp___id0__DemoWorld1_Layer1_1() : *
      {
         try
         {
            __id0_["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         __id0_.bodyAllowSleep = true;
         __id0_.bodyAngularDamping = 0;
         __id0_.bodyApplyGravity = false;
         __id0_.bodyFixedRotation = false;
         __id0_.bodyIsBullet = false;
         __id0_.bodyIsSleeping = false;
         __id0_.bodyIsStatic = true;
         __id0_.bodyLinearDamping = 0;
         __id0_.shapeCategoryBits = "0x0001";
         __id0_.shapeDensity = 1;
         __id0_.shapeFriction = 0.2;
         __id0_.shapeGroupIndex = 0;
         __id0_.shapeIsSensor = false;
         __id0_.shapeMaskBits = "0xFFFF";
         __id0_.shapeRestitution = 0;
         try
         {
            __id0_["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
      
      internal function __setProp_track2_DemoWorld1_Ground_1() : *
      {
         try
         {
            track2["componentInspectorSetting"] = true;
         }
         catch(e:Error)
         {
         }
         track2.bodyAllowSleep = true;
         track2.bodyAngularDamping = 0;
         track2.bodyApplyGravity = true;
         track2.bodyFixedRotation = false;
         track2.bodyIsBullet = false;
         track2.bodyIsSleeping = false;
         track2.bodyIsStatic = true;
         track2.bodyLinearDamping = 0;
         track2.shapeCategoryBits = "0x0001";
         track2.shapeDensity = 1;
         track2.shapeFriction = 1;
         track2.shapeGroupIndex = 0;
         track2.shapeIsSensor = false;
         track2.shapeMaskBits = "0xFFFF";
         track2.shapeRestitution = 0.2;
         try
         {
            track2["componentInspectorSetting"] = false;
         }
         catch(e:Error)
         {
         }
      }
   }
}

