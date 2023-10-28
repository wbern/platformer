import { useEffect } from "react";
import { useDirectionsComponent } from "../components/useDirectionsComponent";

export const useKeyboardSystem = (
  components: ReturnType<typeof useDirectionsComponent>
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            right: true,
          }));
          break;
        case "ArrowLeft":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            left: true,
          }));
          break;
        case " ":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            space: true,
          }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            right: false,
          }));
          break;
        case "ArrowLeft":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            left: false,
          }));
          break;
        case " ":
          components.directions.setDirectionsInput((prev) => ({
            ...prev,
            space: false,
          }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [components.directions]);
};
