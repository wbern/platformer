import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import {
  useVelocitySystem,
  useVelocityBaseComponent,
  useDirectionsComponent,
  useKeyboardSystem,
  useJumpSystem,
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

export const Bunny = ({ startX, startY }: Props) => {
  const components = {
    ...useVelocityBaseComponent(startX, startY),
    ...useDirectionsComponent(),
  };

  useKeyboardSystem(components);

  const velocitySystem = useVelocitySystem(components, HEIGHT);

  useJumpSystem(components, velocitySystem);
  // Handle Jump Logic (This could also be placed inside useTick for more real-time response)

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
