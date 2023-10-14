import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useAcceleration, useKeyboard } from "./Bunny.hooks";
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

const JUMP_VELOCITY = 10; // Define how much force to apply upwards during a jump

export const Bunny = ({ startX, startY }: Props) => {
  const [x, setX] = useState(startX);
  const [y, setY] = useState(startY);
  const jumping = useRef(false);
  const [velocityY, setVelocityY] = useState(0); // Introduce a Y-velocity state

  const verticalAcceleration = useAcceleration(
    y,
    FLOOR_LEVEL - height / 2 - topOffset
  );
  const horizontalAcceleration = useAcceleration(x, 100, 0); // Assuming no initial X velocity

  const keyState = useKeyboard();

  useTick(() => {
    setX((x) => {
      let newX = x + horizontalAcceleration.velocity;
      // Here you might want to reset the x-velocity based on some conditions
      //   if (/* some condition */) {
      //     horizontalAcceleration.setVelocity(/* new velocity */);
      //   }
      if (keyState.right) {
        newX += speedX;
      }
      if (keyState.left) {
        newX -= speedX;
      }

      return newX;
    });

    setY((y) => {
      let newY = y + verticalAcceleration.velocity;
      return newY;
    });
  });

  // Handle Jump Logic (This could also be placed inside useTick for more real-time response)
  useEffect(() => {
    if (keyState.space && verticalAcceleration.isGrounded && !jumping.current) {
      jumping.current = true;
      verticalAcceleration.jump();
    }

    if (!keyState.space && jumping.current && verticalAcceleration.isGrounded) {
      jumping.current = false;
    }
  }, [keyState.space, verticalAcceleration]);

  return (
    <Sprite
      image={image}
      width={width}
      height={height}
      anchor={0.5}
      x={x + leftOffset}
      y={y + topOffset}
    />
  );
};
