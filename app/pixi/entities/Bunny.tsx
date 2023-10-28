import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useVelocityComponent } from "../components/useVelocityComponent";
import { useDimensionsComponent } from "../components/useDimensionsComponent";
import { useDirectionsComponent } from "../components/useDirectionsComponent";
import { useKeyboardSystem } from "../systems/useKeyboardSystem";
import { useJumpSystem } from "../systems/useJumpSystem";
import { useVelocitySystem } from "../systems/useVelocitySystem";
import { FLOOR_LEVEL, HEIGHT } from "../constants";

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
    ...useVelocityComponent(startX, startY),
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
