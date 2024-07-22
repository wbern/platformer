import {
  useRef,
  useContext,
  useEffect,
  createContext,
  FC,
  useState,
} from "react";
import { generateUniqueId } from "../utils/generateUniqueId";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { DirectionsComponent } from "../components/DirectionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidityComponent } from "../components/SolidityComponent";
import { EntityInfo } from "../utils/useEntityInfo";

type PossibleComponents = Partial<
  DimensionsComponent &
    DirectionsComponent &
    PositionComponent &
    SolidityComponent &
    VelocityComponent
>;

type Entity = EntityInfo & {
  components: PossibleComponents;
};

const ComponentRegistryContext = createContext<{
  registry: Array<Entity>;
  setRegistry: React.Dispatch<React.SetStateAction<Array<Entity>>>;
}>({
  registry: [],
  setRegistry: () => {},
});

export const EntityRegistryProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registry, setRegistry] = useState<Array<Entity>>([]);
  return (
    <ComponentRegistryContext.Provider value={{ registry, setRegistry }}>
      {children}
    </ComponentRegistryContext.Provider>
  );
};

export function useRegisterEntity(
  entityInfo: EntityInfo,
  components: PossibleComponents
) {
  const { setRegistry } = useContext(ComponentRegistryContext);

  useEffect(() => {
    const componentInstance = { ...entityInfo, components };
    setRegistry((prevRegistry) => [...prevRegistry, componentInstance]);

    return () => {
      setRegistry((prevRegistry) =>
        prevRegistry.filter((comp) => comp.id !== entityInfo.id)
      );
    };
    // don't subscribe to updates to components and entityInfo, it causes a lot of lag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRegistry]);
}

export function useRegisteredEntities() {
  const { registry } = useContext(ComponentRegistryContext);
  return {
    registry,
    getEntitiesOfType: (type: string) =>
      registry.filter((entity) => entity.id.split("-")[0] === type),
  };
}
