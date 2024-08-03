import { DimensionsComponent } from "../components/DimensionsComponent";
import { PositionComponent } from "../components/PositionComponent";
import { Entity } from "../providers/EntityRegistry";
import { EntityInfo } from "../utils/useEntityInfo";
import { NeededCollisionSystemComponents } from "./CollisionSystem";
import { SolidEntity } from "./CollisionSystem.types";

export const getBoundingRect = (
  components: PositionComponent & DimensionsComponent
) => ({
  left: components.position.positionX - components.dimensions.leftOffset,
  right: components.position.positionX + components.dimensions.leftOffset,
  top: components.position.positionY - components.dimensions.topOffset,
  bottom: components.position.positionY + components.dimensions.topOffset,
});

export const getSolidEntityOverlap = (
  registry: Entity[],
  entityInfo: EntityInfo,
  components: NeededCollisionSystemComponents
) => {
  const solidEntities = registry.filter(
    (entity): entity is SolidEntity =>
      entity.components.solidity?.solid !== undefined &&
      entity.components.position !== undefined &&
      entity.components.dimensions !== undefined &&
      entityInfo.id !== entity.id
  );

  const ownEntityBox = getBoundingRect(components);

  const overlappingEntity = solidEntities.find((entity) => {
    const entityBox = getBoundingRect(entity.components);

    return (
      ownEntityBox.left + components.velocity.velocityX <= entityBox.right &&
      ownEntityBox.right + components.velocity.velocityX >= entityBox.left &&
      ownEntityBox.top + components.velocity.velocityY < entityBox.bottom &&
      ownEntityBox.bottom + components.velocity.velocityY >= entityBox.top
    );
  });

  if (!overlappingEntity) {
    return null;
  }

  return {
    entity: overlappingEntity,
    ownBoundingRect: ownEntityBox,
    boundingRect: getBoundingRect(overlappingEntity.components),
  };
};
