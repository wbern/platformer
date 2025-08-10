import { useEffect, useState } from "react";
import { EntityInfo } from "../utils/useEntityInfo";
import { SpawnComponent } from "../components/SpawnComponent";
import { GRID_SIZE, HEIGHT, WIDTH } from "../constants";
import { Entity, useRegisteredEntities } from "../providers/EntityRegistry";
import { snapSingleCoordToGrid } from "../utils";
import { generateUniqueId } from "../utils/generateUniqueId";

export const getSpawnedComponents = (
  solidEntities: Entity[],
  spawnCount: number,
  Component: React.ComponentType<any>,
  componentInfo: SpawnComponent<any>,
) => {
  const creations: {
    element: React.JSX.Element;
    startX: number;
    startY: number;
  }[] = [];
  let direction: "right" | "left" = "right";

  for (let i = 0; i < spawnCount; i++) {
    const lastCreatedEntity = creations[creations.length - 1];
    const _sortedEntitiesYAsc = solidEntities.sort((a, b) => {
      return (
        (b as any).components.position.positionY -
        (a as any).components.position.positionY
      );
    });

    const _sortedEntitiesXDesc = solidEntities.sort((a, b) => {
      return (
        (b as any).components.position.positionX -
        (a as any).components.position.positionX
      );
    });

    const deltaX = snapSingleCoordToGrid(
      GRID_SIZE,
      Math.floor(
        Math.random() *
          (componentInfo.spawn.maxDistanceX -
            componentInfo.spawn.minDistanceX) +
          componentInfo.spawn.minDistanceX,
      ),
    );

    let deltaY = snapSingleCoordToGrid(
      GRID_SIZE,
      Math.floor(
        Math.random() *
          (componentInfo.spawn.maxDistanceY -
            componentInfo.spawn.minDistanceY) +
          componentInfo.spawn.minDistanceY,
      ),
    );

    let startX = lastCreatedEntity?.startX ?? componentInfo.spawn.minDistanceX;

    if (direction === "right" && startX + deltaX > WIDTH - 15) {
      direction = "left";
      startX = startX - componentInfo.spawn.maxDistanceX;
      deltaY = snapSingleCoordToGrid(
        GRID_SIZE,
        Math.floor(
          componentInfo.spawn.minDistanceY +
            (componentInfo.spawn.maxDistanceY -
              componentInfo.spawn.minDistanceY) /
              2,
        ),
      );
    } else if (direction === "left" && startX - deltaX < 15) {
      direction = "right";
      startX = startX + componentInfo.spawn.maxDistanceX;
      deltaY = snapSingleCoordToGrid(
        GRID_SIZE,
        Math.floor(
          componentInfo.spawn.minDistanceY +
            (componentInfo.spawn.maxDistanceY -
              componentInfo.spawn.minDistanceY) /
              2,
        ),
      );
    } else if (direction === "right") {
      startX = startX + deltaX;
    } else if (direction === "left") {
      startX = startX - deltaX;
    }

    const startY = (lastCreatedEntity?.startY ?? HEIGHT) - deltaY;

    const id = generateUniqueId("platform");

    creations.push({
      element: <Component startX={startX} startY={startY} key={id} id={id} />,
      startX,
      startY,
    });
  }

  return creations.map((c) => c.element);
};

export const useSpawnSystem = <
  T extends React.ComponentType<unknown> = React.ComponentType<unknown>,
>(
  _entityInfo: EntityInfo,
  components: SpawnComponent<T>,
) => {
  const [spawnCount, setSpawnCount] = useState(0);
  const { getEntitiesOfType } = useRegisteredEntities();

  useEffect(() => {
    if (spawnCount < components.spawn.spawnLimit) {
      setSpawnCount(components.spawn.spawnLimit);
      components.spawn.setSpawns((prev) => [
        ...prev,
        ...getSpawnedComponents(
          getEntitiesOfType("platform"),
          components.spawn.spawnLimit - spawnCount,
          components.spawn.type,
          components,
        ),
      ]);
    }
  }, [spawnCount, setSpawnCount]);
};
