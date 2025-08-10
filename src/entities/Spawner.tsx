import { useEntityInfo } from "../utils/useEntityInfo";
import {
  SpawnComponentInputProps,
  useSpawnComponent,
} from "../components/SpawnComponent";
import { useSpawnSystem } from "../systems/SpawnSystem";

export const Spawner = <T extends React.ComponentType<unknown>>(
  props: SpawnComponentInputProps<T>,
) => {
  const entityInfo = useEntityInfo("spawner");

  const components = {
    ...useSpawnComponent(props),
  };

  useSpawnSystem(entityInfo, components);

  return components?.spawn?.spawns.map((Spawn) => Spawn);
};
