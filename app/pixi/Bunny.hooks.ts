import { useTick } from "@pixi/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const useVelocitySystem = (
  components: VelocityBaseComponent & DirectionsComponent & DimensionsComponent,
  stopLevel: number,
  initialVelocity = { x: 0.0, y: 0.1 },
  jumpVelocity = -10
) => {
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpActivated = useRef(false);

  useTick(() => {
    // console.log("Y", components.velocity.positionY);
    if (
      components.velocity.positionY > 200 &&
      components.velocity.positionY < 210
    ) {
      debugger;
    }

    if (components.velocity) {
      if (jumpActivated.current) {
        setIsGrounded(false);
        jumpActivated.current = false;
        components.velocity.setVelocityY(jumpVelocity);
      } else if (
        components.velocity.velocityY < 0 ||
        components.velocity.positionY <
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

        components.velocity.setPositionY(
          stopLevel - components.dimensions.topOffset
        );
        components.velocity.setVelocityY(0);
      }
    }

    // do the movement
    if (components.directions && components.velocity) {
      components.velocity.setPositionX((x) => {
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
      components.velocity.setPositionY((y) => {
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

export type VelocityBaseComponent = {
  velocity: {
    positionX: number;
    setPositionX: Dispatch<SetStateAction<number>>;
    positionY: number;
    setPositionY: Dispatch<SetStateAction<number>>;
    velocityX: number;
    setVelocityX: Dispatch<SetStateAction<number>>;
    velocityY: number;
    setVelocityY: Dispatch<SetStateAction<number>>;
    terminalVelocity: number;
    accelerationFactor: number;
    accelerationExponent: number;
  };
};

export const useVelocityBaseComponent = (
  startX: number,
  startY: number
): VelocityBaseComponent => {
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0.1);
  const [positionX, setPositionX] = useState(startX);
  const [positionY, setPositionY] = useState(startY);

  return {
    velocity: {
      positionX,
      setPositionX,
      positionY,
      setPositionY,
      velocityX,
      setVelocityX,
      velocityY,
      setVelocityY,
      terminalVelocity: 2,
      accelerationFactor: 0.3,
      accelerationExponent: 1.5,
    },
  };
};

type KeyState = {
  left: boolean;
  right: boolean;
  space: boolean; // Adding space key to our key state
};

export type DimensionsComponent = {
  dimensions: {
    width: number;
    height: number;
    leftOffset: number;
    topOffset: number;
  };
};

export const useDimensionsComponent = (
  dimensionsInput: Partial<DimensionsComponent["dimensions"]>
): DimensionsComponent => {
  const defaults = {
    width: 32,
    height: 32,
  };

  return {
    dimensions: {
      leftOffset: (dimensionsInput?.width ?? defaults.width) / 2,
      topOffset: (dimensionsInput?.height ?? defaults.height) / 2,
      ...defaults,
      ...dimensionsInput,
    },
  };
};

export type DirectionsComponent = {
  directions: {
    directionsInput: KeyState;
    setDirectionsInput: Dispatch<SetStateAction<KeyState>>;
    speedX: number;
    JUMP_VELOCITY: number;
  };
};

export const useDirectionsComponent = (): DirectionsComponent => {
  const [directionsInput, setDirectionsInput] = useState<KeyState>({
    left: false,
    right: false,
    space: false, // Initial state for space key
  });

  const speedX = 2; // Speed of horizontal movement
  const JUMP_VELOCITY = 10; // Define how much force to apply upwards during a jump

  return {
    directions: {
      directionsInput,
      setDirectionsInput,
      speedX,
      JUMP_VELOCITY,
    },
  };
};

export const useJumpSystem = (
  components: DirectionsComponent,
  coupledAndUglyVelocitySystem: ReturnType<typeof useVelocitySystem>
) => {
  const jumping = useRef(false);

  useEffect(() => {
    if (
      components.directions.directionsInput.space &&
      coupledAndUglyVelocitySystem.isGrounded &&
      !jumping.current
    ) {
      jumping.current = true;
      coupledAndUglyVelocitySystem.jump();
    }

    if (
      !components.directions.directionsInput.space &&
      jumping.current &&
      coupledAndUglyVelocitySystem.isGrounded
    ) {
      jumping.current = false;
    }
  }, [
    coupledAndUglyVelocitySystem,
    components.directions.directionsInput.space,
  ]);
};

export const useKeyboardSystem = (
  components: ReturnType<typeof useDirectionsComponent>
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            right: true,
          }));
          break;
        case "ArrowLeft":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            left: true,
          }));
          break;
        case " ":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            space: true,
          }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            right: false,
          }));
          break;
        case "ArrowLeft":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            left: false,
          }));
          break;
        case " ":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            space: false,
          }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};
