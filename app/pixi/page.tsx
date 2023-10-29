"use client";
import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import { use, useEffect, useMemo, useState } from "react";
import Grid from "./Grid";
import { Bunny } from "./entities/Bunny";
import { GRID_SIZE } from "./constants";
import { snapSingleCoordToGrid } from "./utils";
import { Platform } from "./entities/Platform";
import { EntityRegistryProvider } from "./providers/EntityRegistry";

export const Pixi = () => {
  const width = 416;
  const height = 224;

  const [show, setShow] = useState(false);
  const blurFilter = useMemo(() => new BlurFilter(4), []);

  useEffect(() => {
    setShow(true);
  }, [show, setShow]);

  return (
    show && (
      <Stage
        //  the random key helps redraw the grid on hot reload
        key={Math.random()}
        options={{
          backgroundColor: 0xffffff,
        }}
        width={width}
        height={height}
      >
        <Grid
          color={[0.95, 0.95, 0.95]}
          lineThickness={1}
          width={width}
          height={height}
          pitch={{ x: GRID_SIZE, y: GRID_SIZE }}
        />
        <EntityRegistryProvider>
          <Container>
            <Bunny
              startX={0}
              startY={snapSingleCoordToGrid(GRID_SIZE, height - GRID_SIZE * 2)}
            />
            <Platform
              startX={100}
              startY={snapSingleCoordToGrid(GRID_SIZE, height)}
            />
          </Container>
        </EntityRegistryProvider>
      </Stage>
    )
  );
};

export default Pixi;
