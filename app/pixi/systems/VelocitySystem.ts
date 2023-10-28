import { useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PositionComponent } from "../components/PositionComponent";

export const useVelocitySystem = (
  components: VelocityComponent &
    DirectionsComponent &
    DimensionsComponent &
    PositionComponent,
  stopLevel: number,
  initialVelocity = { x: 0, y: 0.1 },
  jumpVelocity = -10
) => {
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpActivated = useRef(false);

  useTick(() => {
    if (components.velocity) {
      if (jumpActivated.current) {
        setIsGrounded(false);
        jumpActivated.current = false;
        components.velocity.setVelocityY(jumpVelocity);
      } else if (
        components.velocity.velocityY < 0 ||
        components.position.positionY <
          stopLevel - components.dimensions.topOffset
      ) {
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
        setIsGrounded(true);

        components.position.setPositionY(
          stopLevel - components.dimensions.topOffset
        );
        components.velocity.setVelocityY(0);
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
