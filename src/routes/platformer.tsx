import { createFileRoute } from "@tanstack/react-router";
import { Game } from "../Game";

export const Route = createFileRoute("/platformer")({
  component: () => <Game />,
});
