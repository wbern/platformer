import { useTick } from "@pixi/react";
import { useRef } from "react";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidityComponent } from "../components/SolidityComponent";
import { EntityInfo } from "../utils/useEntityInfo";
import { CollisionComponent } from "../components/CollisionComponent";

export const useVelocitySystem = (
  entityInfo: EntityInfo,
  components: VelocityComponent &
    CollisionComponent &
    DirectionsComponent &
    DimensionsComponent &
    PositionComponent &
    SolidityComponent,
  stopLevel: number,
  initialVelocity = { x: 0, y: 0.1 },
) => {
  const jumpActivated = useRef(false);

  useTick(() => {
    if (components.velocity) {
      if (
        !components.collision.isGrounded &&
        (components.velocity.velocityY < 0 ||
          components.position.positionY <
            stopLevel - components.dimensions.topOffset)
      ) {
        // character is falling and has not reached ground
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
                    components.velocity.accelerationExponent,
                  );
            } else {
              // character is moving downwards or is stationary, normal acceleration
              newVelocity = Math.max(
                Math.min(
                  prev +
                    components.velocity.accelerationFactor *
                      Math.pow(
                        Math.abs(prev),
                        components.velocity.accelerationExponent,
                      ),
                  components.velocity.terminalVelocity,
                ),
                initialVelocity.y,
              );
            }

            return newVelocity;
          }
          return prev;
        });
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

    if (components.velocity && !components.collision.isGrounded) {
      components.position.setPositionY((y) => {
        const newY = y + components.velocity.velocityY;
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
    jump,
    move,
  };
};
