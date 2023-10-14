import { useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

export const useAcceleration = (
  position: number,
  stopLevel: number,
  initialVelocity = 0.1
) => {
  const [isGrounded, setIsGrounded] = useState(true); // To track whether we're on the ground

  const [velocity, setVelocity] = useState(initialVelocity);
  const jumpActivated = useRef(false);

  const dampingFactor = 0.95; // Example value, adjust for your needs
  const terminalVelocity = 2;
  const accelerationFactor = 0.3;
  const accelerationExponent = 1.5;

  useTick(() => {
    if (jumpActivated.current) {
      setIsGrounded(false);
      jumpActivated.current = false;
      setVelocity(-10);
    } else if (velocity < 0 || position < stopLevel) {
      setIsGrounded(false);
      setVelocity((prev) => {
        let newVelocity;

        if (prev < -0.5) {
          // character is moving upwards, adjust the acceleration factor for a smoother jump
          newVelocity =
            prev +
            (accelerationFactor / 4) *
              Math.pow(Math.abs(prev), accelerationExponent);

          console.log("newVelocity", newVelocity);
        } else {
          // character is moving downwards or is stationary, normal acceleration
          newVelocity = Math.max(
            Math.min(
              prev +
                accelerationFactor *
                  Math.pow(Math.abs(prev), accelerationExponent),
              terminalVelocity
            ),
            initialVelocity
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
      setVelocity(0);
    }
  });

  return { isGrounded, velocity, jump: () => (jumpActivated.current = true) };
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
