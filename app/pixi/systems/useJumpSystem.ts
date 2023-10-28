import { useEffect, useRef } from "react";
import { useVelocitySystem } from "./useVelocitySystem";
import { DirectionsComponent } from "../components/useDirectionsComponent";

export const useJumpSystem = (
  components: DirectionsComponent,
  coupledAndUglyVelocitySystem: ReturnType<typeof useVelocitySystem>
) => {
  const jumping = useRef(false);

  useEffect(() => {
    if (
      components.directions.directionsInput.space &&
      coupledAndUglyVelocitySystem.isGrounded &&
      !jumping.current
    ) {
      jumping.current = true;
      coupledAndUglyVelocitySystem.jump();
    }

    if (
      !components.directions.directionsInput.space &&
      jumping.current &&
      coupledAndUglyVelocitySystem.isGrounded
    ) {
      jumping.current = false;
    }
  }, [
    coupledAndUglyVelocitySystem,
    components.directions.directionsInput.space,
  ]);
};
