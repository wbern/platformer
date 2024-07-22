import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useVelocityComponent } from "../components/VelocityComponent";
import { useDimensionsComponent } from "../components/DimensionsComponent";
import { useDirectionsComponent } from "../components/DirectionsComponent";
import { useKeyboardSystem } from "../systems/KeyboardSystem";
import { useJumpSystem } from "../systems/JumpSystem";
import { useVelocitySystem } from "../systems/VelocitySystem";
import { FLOOR_LEVEL, HEIGHT, SCALE } from "../constants";
import { usePositionComponent } from "../components/PositionComponent";
import { useRegisterEntity } from "../providers/EntityRegistry";
import { useSolidityComponent } from "../components/SolidityComponent";
import { useEntityInfo } from "../utils/useEntityInfo";
import { useTouchSystem } from "../systems/TouchSystem";

type Props = {
  startX: number;
  startY: number;
};

const image = "/bunny.png";

export const Bunny = ({ startX, startY }: Props) => {
  const entityInfo = useEntityInfo("bunny");

  const components = {
    ...useSolidityComponent(),
    ...useDimensionsComponent({
      width: 16 * SCALE,
      height: 22.5 * SCALE,
    }),
    ...usePositionComponent(startX, startY),
    ...useVelocityComponent(),
    ...useDirectionsComponent(),
  };

  useRegisterEntity(entityInfo, components);

  // useKeyboardSystem(entityInfo, components);
  useTouchSystem(entityInfo, components);
  const velocitySystem = useVelocitySystem(entityInfo, components, HEIGHT);
  useJumpSystem(entityInfo, components, velocitySystem);

  return (
    <Sprite
      image={image}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0.5}
      x={components.position.positionX}
      y={components.position.positionY}
    />
  );
};
