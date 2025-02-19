"use client";
import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import { use, useEffect, useMemo, useState } from "react";
import Grid from "./Grid";
import { Bunny } from "./entities/Bunny";
import { GRID_SIZE, HEIGHT, WIDTH } from "./constants";
import { snapSingleCoordToGrid } from "./utils";
import { Platform } from "./entities/Platform";
import { EntityRegistryProvider } from "./providers/EntityRegistry";
import { Background } from "./entities/Background";
import { Spawner } from "./entities/Spawner";

const Pixi = () => {
  const [show, setShow] = useState(false);
  const blurFilter = useMemo(() => (show ? new BlurFilter(4) : null), [show]);

  useEffect(() => {
    setShow(true);
  }, [show, setShow]);

  return (
    show && (
      <Stage
        //  the random key helps redraw the grid on hot reload
        key={Math.random()}
        options={{
          // backgroundColor: 0xffffff,
          backgroundColor: 0xccccff,
        }}
        width={WIDTH}
        height={HEIGHT}
      >
        <Grid
          hideGrid
          color={[0.95, 0.95, 0.95]}
          lineThickness={1}
          width={WIDTH}
          height={HEIGHT}
          pitch={{ x: GRID_SIZE, y: GRID_SIZE }}
        />
        <EntityRegistryProvider>
          <Container>
            <Background />
            <Bunny
              startX={snapSingleCoordToGrid(GRID_SIZE, WIDTH / 2)}
              startY={snapSingleCoordToGrid(GRID_SIZE, HEIGHT - GRID_SIZE * 1)}
            />
            <Platform
              startX={GRID_SIZE * 18}
              startY={snapSingleCoordToGrid(GRID_SIZE, HEIGHT - GRID_SIZE * 1)}
            />
            <Spawner
              type={Platform as React.ComponentType<unknown>}
              spawnLimit={20}
              minDistanceX={70}
              maxDistanceX={150}
              minDistanceY={50}
              maxDistanceY={50}
            />
          </Container>
        </EntityRegistryProvider>
      </Stage>
    )
  );
};

export default Pixi;
