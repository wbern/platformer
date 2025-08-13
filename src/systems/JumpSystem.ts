import { useEffect } from "react";
import { useVelocitySystem } from "./VelocitySystem";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { EntityInfo } from "../utils/useEntityInfo";
import { JumpComponent } from "../components/JumpComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { JUMP_FORCE } from "../constants";

export const useJumpSystem = (
  entityInfo: EntityInfo,
  components: DirectionsComponent &
    JumpComponent &
    CollisionComponent &
    VelocityComponent,
  coupledAndUglyVelocitySystem: ReturnType<typeof useVelocitySystem>,
) => {
  useEffect(() => {
    if (
      components.directions.directionsInput.space &&
      components.collision.isGrounded
    ) {
      // TODO: setJumpActivated is not really used here
      components.jump.setJumpActivated(true);
      components.collision.setIsGrounded(false);
      // Use window override for testing if available
      const jumpForce = (window as any).GAME_JUMP_FORCE || JUMP_FORCE;
      components.velocity.setVelocityY(jumpForce);
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
