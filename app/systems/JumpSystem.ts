import { useEffect, useRef } from "react";
import { useVelocitySystem } from "./VelocitySystem";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { EntityInfo } from "../utils/useEntityInfo";
import { JumpComponent } from "../components/JumpComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { VelocityComponent } from "../components/VelocityComponent";

export const useJumpSystem = (
  entityInfo: EntityInfo,
  components: DirectionsComponent &
    JumpComponent &
    CollisionComponent &
    VelocityComponent,
  coupledAndUglyVelocitySystem: ReturnType<typeof useVelocitySystem>
) => {
  useEffect(() => {
    if (
      components.directions.directionsInput.space &&
      components.collision.isGrounded
    ) {
      // TODO: setJumpActivated is not really used here
      components.jump.setJumpActivated(true);
      console.log("JumpSystem -> components.collision.setIsGrounded(false)")
      components.collision.setIsGrounded(false);
      components.velocity.setVelocityY(-10);
    }
  }, [
    components.collision,
    components.collision.isGrounded,
    components.directions.directionsInput.space,
    components.jump,
    components.velocity,
    coupledAndUglyVelocitySystem,
  ]);
};
