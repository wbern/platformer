import { DimensionsComponent } from "../components/DimensionsComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidityComponent } from "../components/SolidityComponent";
import { EntityInfo } from "../utils/useEntityInfo";

export type SolidEntity = EntityInfo & {
  components: SolidityComponent & PositionComponent & DimensionsComponent;
};
