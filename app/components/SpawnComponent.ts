import { Dispatch, SetStateAction, useState } from "react";

export type SpawnComponentInputProps<T extends React.ComponentType<unknown>> = {
  type: React.ComponentType<T>;
  spawnLimit: number;
  minDistanceX: number;
  minDistanceY: number;
  maxDistanceX: number;
  maxDistanceY: number;
};

export type SpawnComponent<T extends React.ComponentType<unknown>> = {
  spawn: SpawnComponentInputProps<T> & {
    spawns: React.ReactNode[];
    setSpawns: Dispatch<SetStateAction<React.ReactNode[]>>;
  };
};

export const useSpawnComponent = <
  T extends React.ComponentType<unknown> = React.ComponentType<unknown>
>(
  props: SpawnComponentInputProps<T>
): SpawnComponent<T> => {
  const [spawns, setSpawns] = useState<React.ReactNode[]>([]);

  return {
    spawn: {
      ...props,
      spawns,
      setSpawns,
    },
  };
};
