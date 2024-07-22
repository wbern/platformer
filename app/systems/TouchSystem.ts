import { useEffect } from "react";
import { DirectionsComponent } from "../components/DirectionsComponent";

export const useTouchSystem = (e: unknown, components: DirectionsComponent): void => {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = new Date().getTime();

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

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = new Date().getTime() - startTime;

      const isQuickSwipeUp = Math.abs(deltaY) > 50 && deltaTime < 300;

      if (isQuickSwipeUp) {
        components.directions.setDirectionsInput((prev) => ({
          ...prev,
          space: true,
        }));
        
        // Reset the jump after a short delay to simulate a jump action
        setTimeout(() => {
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            space: false,
          }));
        }, 100);
      }
    };

    const handleTouchEnd = () => {
      components.directions.setDirectionsInput((prev) => ({
        ...prev,
        left: false,
        right: false,
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
