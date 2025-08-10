import { Dispatch, SetStateAction, useState } from "react";

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

  return {
    velocity: {
      velocityX,
      setVelocityX,
      velocityY,
      setVelocityY,
      terminalVelocity: 3,
      accelerationFactor: 0.3,
      accelerationExponent: 1.5,
    },
  };
};
