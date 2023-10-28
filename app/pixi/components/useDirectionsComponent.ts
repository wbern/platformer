import { Dispatch, SetStateAction, useState } from "react";
import { KeyState } from "./useVelocityComponent";


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
