import { useRef, useContext, createContext, FC, MutableRefObject } from "react";
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

export type Entity = EntityInfo & {
  components: PossibleComponents;
};

const ComponentRegistryContext = createContext<{
  registry: MutableRefObject<Array<Entity>>;
}>({
  registry: { current: [] },
});

export const EntityRegistryProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const registry = useRef<Array<Entity>>([]);
  return (
    <ComponentRegistryContext.Provider value={{ registry }}>
      {children}
    </ComponentRegistryContext.Provider>
  );
};

export function useRegisterEntity(
  entityInfo: EntityInfo,
  components: PossibleComponents,
) {
  const { registry } = useContext(ComponentRegistryContext);

  if (registry.current.some((entity) => entity.id === entityInfo.id)) {
    return;
  }

  registry.current.push({ ...entityInfo, components });
}

export function useRegisteredEntities() {
  const { registry } = useContext(ComponentRegistryContext);
  return {
    registry,
    getEntitiesOfType: (type: string) =>
      registry.current.filter((entity) => entity.id.split("-")[0] === type),
    getSolidEntities: () =>
      registry.current.filter(
        (
          entity,
        ): entity is Entity & {
          components: Entity["components"] &
            PositionComponent &
            SolidityComponent;
        } =>
          !!entity.components?.solidity?.solid && !!entity.components?.position,
      ),
  };
}
