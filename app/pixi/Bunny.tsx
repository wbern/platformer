import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import {
  useVelocitySystem,
  useKeyboard,
  useVelocityBaseComponent,
} from "./Bunny.hooks";
import { FLOOR_LEVEL, HEIGHT } from "./constants";

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
  const jumping = useRef(false);

  const components = { velocity: useVelocityBaseComponent(startX, startY) };

  const velocitySystem = useVelocitySystem(components, HEIGHT);

  const keyState = useKeyboard();

  useTick(() => {
    components.velocity.setPositionX((x) => {
      let newX = x + components.velocity.velocityX;
      if (keyState.right) {
        newX += speedX;
      }
      if (keyState.left) {
        newX -= speedX;
      }

      return newX;
    });

    components.velocity.setPositionY((y) => {
      let newY = y + components.velocity.velocityY;
      return newY;
    });
  });

  // Handle Jump Logic (This could also be placed inside useTick for more real-time response)
  useEffect(() => {
    if (keyState.space && velocitySystem.isGrounded && !jumping.current) {
      jumping.current = true;
      velocitySystem.jump();
    }

    if (!keyState.space && jumping.current && velocitySystem.isGrounded) {
      jumping.current = false;
    }
  }, [velocitySystem, keyState.space]);

  return (
    <Sprite
      image={image}
      width={width}
      height={height}
      anchor={0.5}
      x={components.velocity.positionX + leftOffset}
      y={components.velocity.positionY + topOffset}
    />
  );
};
