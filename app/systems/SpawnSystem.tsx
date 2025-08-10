import { ComponentType, useEffect, useRef, useState } from "react";
import { useVelocitySystem } from "./VelocitySystem";
import { DirectionsComponent } from "../components/DirectionsComponent";
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
  componentInfo: SpawnComponent<any>
) => {
  const creations: {
    element: React.JSX.Element;
    startX: number;
    startY: number;
  }[] = [];
  let direction: "right" | "left" = "right";

  for (let i = 0; i < spawnCount; i++) {
    const lastCreatedEntity = creations[creations.length - 1];
    const sortedEntitiesYAsc = solidEntities.sort((a, b) => {
      return (
        (b as any).components.position.positionY -
        (a as any).components.position.positionY
      );
    });

    const sortedEntitiesXDesc = solidEntities.sort((a, b) => {
      return (
        (b as any).components.position.positionX -
        (a as any).components.position.positionX
      );
    });

    let deltaX = snapSingleCoordToGrid(
      GRID_SIZE,
      Math.floor(
        Math.random() *
          (componentInfo.spawn.maxDistanceX -
            componentInfo.spawn.minDistanceX) +
          componentInfo.spawn.minDistanceX
      )
    );

    let deltaY = snapSingleCoordToGrid(
      GRID_SIZE,
      Math.floor(
        Math.random() *
          (componentInfo.spawn.maxDistanceY -
            componentInfo.spawn.minDistanceY) +
          componentInfo.spawn.minDistanceY
      )
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
              2
        )
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
              2
        )
      );
    } else if (direction === "right") {
      startX = startX + deltaX;
    } else if (direction === "left") {
      startX = startX - deltaX;
    }

    let startY = (lastCreatedEntity?.startY ?? HEIGHT) - deltaY;

    const id = generateUniqueId("platform");

    creations.push({
      element: <Component startX={startX} startY={startY} key={id} id={id} />,
      startX,
      startY,
    });
  }

  return creations.map((c) => c.element);
};

export const getSpawnedComponent = (
  solidEntities: Entity[],
  Component: React.ComponentType<any>,
  componentInfo: SpawnComponent<any>
) => {
  const sortedEntitiesYAsc = solidEntities.sort((a, b) => {
    return (
      (b as any).components.position.positionY -
      (a as any).components.position.positionY
    );
  });

  const sortedEntitiesXDesc = solidEntities.sort((a, b) => {
    return (
      (b as any).components.position.positionX -
      (a as any).components.position.positionX
    );
  });

  const highestEntity = sortedEntitiesYAsc[0];
  const rightmostEntity = sortedEntitiesXDesc[0];

  let deltaX = snapSingleCoordToGrid(
    GRID_SIZE,
    Math.floor(
      Math.random() *
        (componentInfo.spawn.maxDistanceX - componentInfo.spawn.minDistanceX) +
        componentInfo.spawn.minDistanceX
    )
  );

  let startX = highestEntity?.components?.position?.positionX ?? 0;

  if (
    startX + deltaX > WIDTH - componentInfo.spawn.minDistanceX &&
    rightmostEntity.id === highestEntity.id
  ) {
    startX = startX - deltaX;
  } else if (rightmostEntity.id === highestEntity.id) {
    startX = startX + deltaX;
  } else {
    startX = startX - deltaX;
  }

  let startY =
    (highestEntity?.components?.position?.positionY ?? HEIGHT) -
    snapSingleCoordToGrid(
      GRID_SIZE,
      Math.floor(
        Math.random() *
          (componentInfo.spawn.maxDistanceY -
            componentInfo.spawn.minDistanceY) +
          componentInfo.spawn.minDistanceY
      )
    );

  return <Component startX={startX} startY={startY} />;
};

export const useSpawnSystem = <
  T extends React.ComponentType<unknown> = React.ComponentType<unknown>
>(
  entityInfo: EntityInfo,
  components: SpawnComponent<T>
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
          components
        ),
      ]);
    }
  }, [spawnCount, setSpawnCount]);
};
