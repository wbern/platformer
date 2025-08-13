import { Dispatch, SetStateAction, useState } from "react";
import { GRAVITY, TERMINAL_VELOCITY } from "../constants";

export type VelocityComponent = {
  velocity: {
    velocityX: number;
    setVelocityX: Dispatch<SetStateAction<number>>;
    velocityY: number;
    setVelocityY: Dispatch<SetStateAction<number>>;
    terminalVelocity: number;
    accelerationFactor: number;
    accelerationExponent: number;
  };
};

export const useVelocityComponent = (): VelocityComponent => {
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0.1);

  // Use window overrides for testing if available
  const gravity = (window as any).GAME_GRAVITY || GRAVITY;
  const terminalVelocity =
    (window as any).GAME_TERMINAL_VELOCITY || TERMINAL_VELOCITY;

  return {
    velocity: {
      velocityX,
      setVelocityX,
      velocityY,
      setVelocityY,
      terminalVelocity: terminalVelocity,
      accelerationFactor: gravity,
      accelerationExponent: 1.5,
    },
  };
};
