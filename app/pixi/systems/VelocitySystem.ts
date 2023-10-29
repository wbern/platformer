import { useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidityComponent } from "../components/SolidityComponent";
import { useRegisteredEntities } from "../providers/EntityRegistry";
import { EntityInfo } from "../utils/useEntityInfo";

export const useVelocitySystem = (
  entityInfo: EntityInfo,
  components: VelocityComponent &
    DirectionsComponent &
    DimensionsComponent &
    PositionComponent &
    SolidityComponent,
  stopLevel: number,
  initialVelocity = { x: 0, y: 0.1 },
  jumpVelocity = -10
) => {
  const { registry, getEntitiesOfType } = useRegisteredEntities();
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpActivated = useRef(false);

  const stopMovement = () => {
    setIsGrounded(true);

    components.position.setPositionY(
      stopLevel - components.dimensions.topOffset
    );
    components.velocity.setVelocityY(0);
  };

  type SolidEntity = EntityInfo & {
    components: SolidityComponent & PositionComponent & DimensionsComponent;
  };

  const checkSolidEntityOverlap = () => {
    const solidEntities = registry.filter(
      (entity): entity is SolidEntity =>
        entity.components.solidity?.solid !== undefined &&
        entity.components.position !== undefined &&
        entity.components.dimensions !== undefined &&
        entityInfo.id !== entityInfo.id
    );

    const currentEntityBox = {
      left: components.position.positionX - components.dimensions.leftOffset,
      right: components.position.positionX + components.dimensions.leftOffset,
      top: components.position.positionY - components.dimensions.topOffset,
      bottom: components.position.positionY + components.dimensions.topOffset,
    };

    const hasOverlap = solidEntities.some((entity) => {
      const entityBox = {
        left:
          entity.components.position.positionX -
          entity.components.dimensions.leftOffset,
        right:
          entity.components.position.positionX +
          entity.components.dimensions.leftOffset,
        top:
          entity.components.position.positionY -
          entity.components.dimensions.topOffset,
        bottom:
          entity.components.position.positionY +
          entity.components.dimensions.topOffset,
      };

      return (
        currentEntityBox.left < entityBox.right &&
        currentEntityBox.right > entityBox.left &&
        currentEntityBox.top < entityBox.bottom &&
        currentEntityBox.bottom > entityBox.top
      );
    });

    return hasOverlap;
  };

  useTick(() => {
    if (components.velocity) {
      if (jumpActivated.current) {
        // character is going up (maybe because of a jump)
        setIsGrounded(false);
        jumpActivated.current = false;
        components.velocity.setVelocityY(jumpVelocity);
      } else if (checkSolidEntityOverlap()) {
        console.log("stop!");
        stopMovement();
      } else if (
        components.velocity.velocityY < 0 ||
        components.position.positionY <
          stopLevel - components.dimensions.topOffset
      ) {
        // character is falling and has not reached ground
        setIsGrounded(false);
        components.velocity.setVelocityY((prev) => {
          if (components.velocity) {
            let newVelocity;

            if (prev < -0.5) {
              // character is moving upwards, adjust the acceleration factor for a smoother jump
              newVelocity =
                prev +
                (components.velocity.accelerationFactor / 4) *
                  Math.pow(
                    Math.abs(prev),
                    components.velocity.accelerationExponent
                  );
            } else {
              // character is moving downwards or is stationary, normal acceleration
              newVelocity = Math.max(
                Math.min(
                  prev +
                    components.velocity.accelerationFactor *
                      Math.pow(
                        Math.abs(prev),
                        components.velocity.accelerationExponent
                      ),
                  components.velocity.terminalVelocity
                ),
                initialVelocity.y
              );
            }

            return newVelocity;
          }
          return prev;
        });
      } else {
        stopMovement();
      }
    }

    // do the movement
    if (components.directions && components.velocity) {
      components.position.setPositionX((x) => {
        if (components.directions && components.velocity) {
          let newX = x + components.velocity.velocityX;
          if (components.directions.directionsInput.right) {
            newX += components.directions.speedX;
          }
          if (components.directions.directionsInput.left) {
            newX -= components.directions.speedX;
          }

          return newX;
        }
        return x;
      });
    }

    if (components.velocity) {
      components.position.setPositionY((y) => {
        let newY = y + components.velocity.velocityY;
        return newY;
      });
    }
  });

  const jump = () => (jumpActivated.current = true);

  // Movement handling might include velocity adjustment
  const move = (axis: "x" | "y", value: number) => {
    if (axis === "x") {
      components.velocity.setVelocityX(value);
    } else {
      components.velocity.setVelocityY(value);
    }
  };

  return {
    isGrounded,
    jump,
    move,
  };
};
