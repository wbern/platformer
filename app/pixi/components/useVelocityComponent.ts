import { Dispatch, SetStateAction, useState } from "react";

export type VelocityComponent = {
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

export const useVelocityComponent = (
  startX: number,
  startY: number
): VelocityComponent => {
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

export type KeyState = {
  left: boolean;
  right: boolean;
  space: boolean; // Adding space key to our key state
};
