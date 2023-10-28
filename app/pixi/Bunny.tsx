import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import {
  useVelocitySystem,
  useVelocityBaseComponent,
  useDirectionsComponent,
  useKeyboardSystem,
  useJumpSystem,
  useDimensionsComponent,
} from "./Bunny.hooks";
import { FLOOR_LEVEL, HEIGHT } from "./constants";

type Props = {
  startX: number;
  startY: number;
};

const image = "https://pixijs.io/pixi-react/img/bunny.png";

export const Bunny = ({ startX, startY }: Props) => {
  const components = {
    ...useDimensionsComponent({
      width: 16,
      height: 22.5,
    }),
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
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0.5}
      x={components.velocity.positionX}
      y={components.velocity.positionY}
    />
  );
};
