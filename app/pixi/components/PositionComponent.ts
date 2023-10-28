import { Dispatch, SetStateAction, useState } from "react";

export type PositionComponent = {
  position: {
    positionX: number;
    setPositionX: Dispatch<SetStateAction<number>>;
    positionY: number;
    setPositionY: Dispatch<SetStateAction<number>>;
  };
};

export const usePositionComponent = (
  startX: number,
  startY: number
): PositionComponent => {
  const [positionX, setPositionX] = useState(startX);
  const [positionY, setPositionY] = useState(startY);

  return {
    position: {
      positionX,
      setPositionX,
      positionY,
      setPositionY,
    },
  };
};
