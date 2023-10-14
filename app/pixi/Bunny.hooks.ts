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

// Define a type for our keyState for TypeScript
type KeyState = {
  left: boolean;
  right: boolean;
};

// Define a custom hook that returns the current keyState
export const useKeyboard = (): KeyState => {
  // Define a state variable to hold our key states
  const [keyState, setKeyState] = useState<KeyState>({
    left: false,
    right: false,
  });

  // UseEffect to handle key presses and releases
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setKeyState((prev) => ({ ...prev, right: true }));
      } else if (e.key === "ArrowLeft") {
        setKeyState((prev) => ({ ...prev, left: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setKeyState((prev) => ({ ...prev, right: false }));
      } else if (e.key === "ArrowLeft") {
        setKeyState((prev) => ({ ...prev, left: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners when component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // Empty dependency array means this useEffect runs once when component mounts

  return keyState;
};
