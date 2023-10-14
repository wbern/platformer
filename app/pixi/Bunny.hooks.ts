import { useTick } from "@pixi/react";
import { useEffect, useState } from "react";

export const useGravity = (y: number, floorLevel: number) => {
  const [gravity, setGravity] = useState(0.1); // Increased initial gravity
  const maxGravity = 0.5;
  const gravityFactor = 0.1; // Increased gravity factor
  const gravityExp = 1.5; // Non-integer exponent to increase gravity moderately fast

  useTick(() => {
    if (y < floorLevel) {
      setGravity((prev) => {
        const newGravity = prev + gravityFactor * Math.pow(prev, gravityExp);
        return Math.min(newGravity, maxGravity);
      });
    } else {
      setGravity(0);
    }
  });

  return gravity;
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
