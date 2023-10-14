"use client";
import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import { use, useEffect, useMemo, useState } from "react";
import Grid from "./Grid";
import { Bunny } from "./Bunny";
import { GRID_SIZE } from "./constants";
import { snapSingleCoordToGrid } from "./utils";

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
        <Container>
          <Bunny
            startX={0}
            startY={snapSingleCoordToGrid(GRID_SIZE, height - GRID_SIZE * 2)}
          />
          {/* <Sprite
            image="https://pixijs.io/pixi-react/img/bunny.png"
            width={16}
            height={16}
            x={200}
            y={100}
            anchor={{ x: 0.5, y: 0.5 }}
          /> */}
        </Container>
      </Stage>
    )
  );
};

export default Pixi;
