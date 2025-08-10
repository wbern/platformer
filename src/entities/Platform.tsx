import { Sprite } from "@pixi/react";
import { useDimensionsComponent } from "../components/DimensionsComponent";
import { useDirectionsComponent } from "../components/DirectionsComponent";
import { SCALE } from "../constants";
import { usePositionComponent } from "../components/PositionComponent";
import { useSolidityComponent } from "../components/SolidityComponent";
import { useRegisterEntity } from "../providers/EntityRegistry";
import { useEntityInfo } from "../utils/useEntityInfo";

type Props = {
  startX: number;
  startY: number;
  id?: string;
};

export const Platform = ({ startX, startY, id }: Props) => {
  const entityInfo = useEntityInfo("platform", id);

  const dimensionsComponent = useDimensionsComponent({
    width: 32 * SCALE,
    height: 8 * SCALE,
  });

  const components = {
    ...dimensionsComponent,
    ...usePositionComponent(
      startX - dimensionsComponent.dimensions.leftOffset,
      startY - dimensionsComponent.dimensions.topOffset,
    ),
    ...useDirectionsComponent(),
    ...useSolidityComponent(),
  };

  useRegisterEntity(entityInfo, components);

  return (
    <Sprite
      image={"/platform.png"}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0.5}
      x={components.position.positionX}
      y={components.position.positionY}
    />
  );
};
