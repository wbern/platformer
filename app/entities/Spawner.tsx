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
import {
  SpawnComponentInputProps,
  useSpawnComponent,
} from "../components/SpawnComponent";
import { Platform } from "./Platform";
import { useSpawnSystem } from "../systems/SpawnSystem";

export const Spawner = <T extends React.ComponentType<unknown>>(
  props: SpawnComponentInputProps<T>
) => {
  const entityInfo = useEntityInfo("spawner");

  const components = {
    ...useSpawnComponent(props),
  };

  useSpawnSystem(entityInfo, components);

  return components?.spawn?.spawns.map((Spawn) => Spawn);
};
