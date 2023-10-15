import { useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

export const useVelocitySystem = (
  components: { velocity: ReturnType<typeof useVelocityBaseComponent> },
  stopLevel: number,
  initialVelocity = { x: 0.0, y: 0.1 },
  jumpVelocity = -10
) => {
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpActivated = useRef(false);

  useTick(() => {
    if (jumpActivated.current) {
      setIsGrounded(false);
      jumpActivated.current = false;
      components.velocity.setVelocityY(jumpVelocity);
    } else if (
      components.velocity.velocityY < 0 ||
      components.velocity.positionY < stopLevel
    ) {
      setIsGrounded(false);
      components.velocity.setVelocityY((prev) => {
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
        // let res = Math.max(
        //   Math.min(newVelocity, terminalVelocity),
        //   initialVelocity
        // );
        // return res;
      });
    } else {
      setIsGrounded(true);
      components.velocity.setVelocityY(0);
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

export const useVelocityBaseComponent = (startX: number, startY: number) => {
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0.1);
  const [positionX, setPositionX] = useState(startX);
  const [positionY, setPositionY] = useState(startY);

  return {
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
  };
};

type KeyState = {
  left: boolean;
  right: boolean;
  space: boolean; // Adding space key to our key state
};

export const useKeyboard = (): KeyState => {
  const [keyState, setKeyState] = useState<KeyState>({
    left: false,
    right: false,
    space: false, // Initial state for space key
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          setKeyState((prev) => ({ ...prev, right: true }));
          break;
        case "ArrowLeft":
          setKeyState((prev) => ({ ...prev, left: true }));
          break;
        case " ":
          setKeyState((prev) => ({ ...prev, space: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          setKeyState((prev) => ({ ...prev, right: false }));
          break;
        case "ArrowLeft":
          setKeyState((prev) => ({ ...prev, left: false }));
          break;
        case " ":
          setKeyState((prev) => ({ ...prev, space: false }));
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

  return keyState;
};
