import { TilingSprite } from "@pixi/react";
import { useDimensionsComponent } from "../components/DimensionsComponent";
import { HEIGHT, WIDTH } from "../constants";
import { usePositionComponent } from "../components/PositionComponent";
import { useRegisterEntity } from "../providers/EntityRegistry";
import { useEntityInfo } from "../utils/useEntityInfo";
import backgroundImg from "../../public/background.jpg";

const image = backgroundImg;

export const Background = () => {
  const entityInfo = useEntityInfo("bunny");

  const components = {
    ...useDimensionsComponent({
      width: WIDTH,
      height: HEIGHT,
    }),
    ...usePositionComponent(0, 0),
  };

  useRegisterEntity(entityInfo, components);

  return (
    <TilingSprite
      tilePosition={{ x: 0, y: 0 }}
      image={image}
      width={components.dimensions.width}
      height={components.dimensions.height}
      anchor={0}
      x={components.position.positionX}
      y={components.position.positionY}
    />
  );
};
