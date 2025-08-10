import { useTick } from "@pixi/react";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidityComponent } from "../components/SolidityComponent";
import { useRegisteredEntities } from "../providers/EntityRegistry";
import { EntityInfo } from "../utils/useEntityInfo";
import { getSolidEntityOverlap } from "./CollisionSystem.utils";
import { CollisionComponent } from "../components/CollisionComponent";

export type NeededCollisionSystemComponents = CollisionComponent &
  VelocityComponent &
  DirectionsComponent &
  DimensionsComponent &
  PositionComponent &
  SolidityComponent;

export const useCollisionSystem = (
  entityInfo: EntityInfo,
  components: NeededCollisionSystemComponents,
) => {
  const { registry } = useRegisteredEntities();

  const stopMovement = (yToStopAt: number) => {
    components.collision.setIsGrounded(true);

    components.position.setPositionY(
      yToStopAt - components.dimensions.topOffset,
    );
    components.velocity.setVelocityY(0);
  };

  useTick(() => {
    if (components.velocity) {
      const overlappingEntity = getSolidEntityOverlap(
        registry.current,
        entityInfo,
        components,
      );

      if (!components.collision.isGrounded && overlappingEntity) {
        stopMovement(overlappingEntity.boundingRect.top);
      } else if (components.collision.isGrounded && !overlappingEntity) {
        components.collision.setIsGrounded(false);
      }
    }
  });
};
