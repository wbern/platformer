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

const JUMP_VELOCITY = 10; // Define how much force to apply upwards during a jump

export const Bunny = ({ startX, startY }: Props) => {
  const [x, setX] = useState(startX);
  const [y, setY] = useState(startY);
  const [velocityY, setVelocityY] = useState(0); // Introduce a Y-velocity state
  const [isGrounded, setIsGrounded] = useState(true); // To track whether we're on the ground
  const gravity = useGravity(y, FLOOR_LEVEL - height / 2 - topOffset);
  const keyState = useKeyboard();

  useTick(() => {
    // Handling X movement
    setX((x) => {
      let newX = x;
      if (keyState.right) {
        newX += speedX;
      }
      if (keyState.left) {
        newX -= speedX;
      }
      return newX;
    });

    // Handling Y movement (including jumping)
    setY((y) => {
      let newY = y + velocityY + gravity; // Adjust Y-position according to current velocity and gravity
      if (newY >= FLOOR_LEVEL - height / 2 - topOffset) {
        newY = FLOOR_LEVEL - height / 2 - topOffset;
        setIsGrounded(true); // We're back on the ground
      } else {
        setIsGrounded(false); // We're in the air
      }
      return newY;
    });

    // Update velocity considering gravity
    setVelocityY((velocityY) => velocityY + gravity);
  });

  // Handle Jump Logic (This could also be placed inside useTick for more real-time response)
  useEffect(() => {
    if (keyState.space && isGrounded) {
      setVelocityY(-JUMP_VELOCITY); // Apply an upward force
    }
  }, [keyState.space, isGrounded]);

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
