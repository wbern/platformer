import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Stage } from "@pixi/react";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { Bunny } from "../entities/Bunny";
import { Platform } from "../entities/Platform";
import { EntityRegistryProvider } from "../providers/EntityRegistry";

const GameWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityRegistryProvider>
      <Stage
        width={400}
        height={400}
        options={{
          backgroundColor: 0x87ceeb,
          antialias: true,
        }}
      >
        {children}
      </Stage>
    </EntityRegistryProvider>
  );
};

const meta = {
  title: "Game/Bunny Jump Test",
  component: GameWrapper,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GameWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeJumps: Story = {
  render: () => (
    <GameWrapper>
      <Container>
        <Platform startX={200} startY={200} />
        <Bunny startX={180} startY={130} />
      </Container>
    </GameWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for game to initialize
    await waitFor(() => {
      expect(canvasElement).toBeInTheDocument();
    });

    // Wait a bit for physics to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Jump 1
    await userEvent.keyboard(" ");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Jump 2
    await userEvent.keyboard(" ");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Jump 3
    await userEvent.keyboard(" ");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};
