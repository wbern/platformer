import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useVelocityComponent } from "../components/useVelocityComponent";
import { useDimensionsComponent } from "../components/useDimensionsComponent";
import { useDirectionsComponent } from "../components/useDirectionsComponent";
import { useKeyboardSystem } from "../systems/useKeyboardSystem";
import { useJumpSystem } from "../systems/useJumpSystem";
import { useVelocitySystem } from "../systems/useVelocitySystem";
import { FLOOR_LEVEL, HEIGHT } from "../constants";
import { usePositionComponent } from "../components/usePositionComponent";

type Props = {
  startX: number;
  startY: number;
};

export const Platform = ({ startX, startY }: Props) => {
  const components = {
    ...useDimensionsComponent({
      width: 16,
      height: 22.5,
    }),
    ...usePositionComponent(startX, startY),
    ...useDirectionsComponent(),
  };

  return (
    <Sprite
      image={"/platform.png"}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0.5}
      x={components.position.positionX}
      y={components.position.positionY}
    />
  );
};
