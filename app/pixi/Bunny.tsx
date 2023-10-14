import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect } from "react";
import { useGravity, useKeyboard } from "./Bunny.hooks";
import { FLOOR_LEVEL } from "./constants";

type Props = {
  startX: number;
  startY: number;
};

const image = "https://pixijs.io/pixi-react/img/bunny.png";

const width = 16;
const height = 22.5;
const leftOffset = 15.5;
const topOffset = 1;
const speedX = 2; // Speed of horizontal movement

export const Bunny = ({ startX, startY }: Props) => {
  const [x, setX] = useState(startX);
  const [y, setY] = useState(startY);
  const [rotation, setRotation] = useState(0);
  const keyState = useKeyboard();
  const gravity = useGravity(y, FLOOR_LEVEL - height / 2 - topOffset);

  // UseEffect to handle key presses and releases
  // UseTick to handle consistent movement
  useTick(() => {
    setX((x) => {
      let newX = x;
      if (keyState.right) newX += speedX;
      if (keyState.left) newX -= speedX;
      return newX;
    });

    setY((y) => {
      return y + gravity;
    });
  });

  return (
    <Sprite
      image={image}
      width={width}
      height={height}
      anchor={0.5}
      x={x + leftOffset}
      y={y + topOffset}
      rotation={rotation}
    />
  );
};
