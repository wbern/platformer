import { Stage, Sprite, Container, useTick } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useVelocityComponent } from "../components/VelocityComponent";
import { useDimensionsComponent } from "../components/DimensionsComponent";
import { useDirectionsComponent } from "../components/DirectionsComponent";
import { useKeyboardSystem } from "../systems/KeyboardSystem";
import { useJumpSystem } from "../systems/JumpSystem";
import { useVelocitySystem } from "../systems/VelocitySystem";
import { FLOOR_LEVEL, HEIGHT } from "../constants";
import { usePositionComponent } from "../components/PositionComponent";
import { useSolidityComponent } from "../components/SolidityComponent";
import { useRegisterEntity } from "../providers/EntityRegistry";
import { useEntityInfo } from "../utils/useEntityInfo";

type Props = {
  startX: number;
  startY: number;
};

export const Platform = ({ startX, startY }: Props) => {
  const entityInfo = useEntityInfo("platform");

  const components = {
    ...useDimensionsComponent({
      width: 64,
      height: 24,
    }),
    ...usePositionComponent(startX, startY),
    ...useDirectionsComponent(),
    ...useSolidityComponent(),
  };

  useRegisterEntity(entityInfo, components);

  return (
    <Sprite
      image={"/platform.png"}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0.5}
      x={components.position.positionX}
      y={components.position.positionY - components.dimensions.topOffset}
    />
  );
};
