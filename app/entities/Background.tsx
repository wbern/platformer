import { Stage, Sprite, Container, useTick, TilingSprite } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useVelocityComponent } from "../components/VelocityComponent";
import { useDimensionsComponent } from "../components/DimensionsComponent";
import { useDirectionsComponent } from "../components/DirectionsComponent";
import { useKeyboardSystem } from "../systems/KeyboardSystem";
import { useJumpSystem } from "../systems/JumpSystem";
import { useVelocitySystem } from "../systems/VelocitySystem";
import { FLOOR_LEVEL, HEIGHT, SCALE, WIDTH } from "../constants";
import { usePositionComponent } from "../components/PositionComponent";
import { useRegisterEntity } from "../providers/EntityRegistry";
import { useSolidityComponent } from "../components/SolidityComponent";
import { useEntityInfo } from "../utils/useEntityInfo";

const image = "/background.jpg";

export const Background = () => {
  const entityInfo = useEntityInfo("bunny");

  const components = {
    ...useDimensionsComponent({
      width: WIDTH,
      height: HEIGHT,
    }),
    ...usePositionComponent(0, 0),
  };

  useRegisterEntity(entityInfo, components);

  return (
    <TilingSprite
      tilePosition={{ x: 0, y: 0 }}
      image={image}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0}
      x={components.position.positionX}
      y={components.position.positionY}
    />
  );
};
