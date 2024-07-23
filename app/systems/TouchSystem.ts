import { useEffect, useRef } from "react";
import { DirectionsComponent } from "../components/DirectionsComponent";

const deltaTimeRequirement = 100;
const deltaSwipeRequirement = 30;

export const useTouchSystem = (
  e: unknown,
  components: DirectionsComponent
): void => {
  const moveEvents = useRef<{ time: number; touch: Touch }[]>([]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      moveEvents.current = [];

      const touch = event.touches[0];
      const screenWidth = window.innerWidth;

      if (touch.clientX < screenWidth / 2) {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          left: true,
          right: false,
        }));
      } else {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          right: true,
          left: false,
        }));
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      const screenWidth = window.innerWidth;
      const time = new Date().getTime();

      moveEvents.current.push({ touch, time });

      if (touch.clientX < screenWidth / 2) {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          left: true,
          right: false,
        }));
      } else {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          right: true,
          left: false,
        }));
      }

      const lastWithinDelta = moveEvents.current?.find(
        (event) => time - event.time > deltaTimeRequirement
      );

      const deltaY =
        (lastWithinDelta?.touch?.clientY ?? touch.clientY) - touch.clientY;

      const isQuickSwipeUp = Math.abs(deltaY) > deltaSwipeRequirement;

      if (isQuickSwipeUp) {
        moveEvents.current = [];

        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          space: true,
        }));
      } else if (components.directions.directionsInput.space) {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          space: false,
        }));
      }
    };

    const handleTouchEnd = (event: any) => {
      event.preventDefault();
      moveEvents.current = [];

      components.directions.setDirectionsInput((prev) => ({
        ...prev,
        left: false,
        right: false,
        space: false,
      }));
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [components.directions]);
};
