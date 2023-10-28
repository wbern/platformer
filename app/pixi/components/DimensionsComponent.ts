
export type DimensionsComponent = {
  dimensions: {
    width: number;
    height: number;
    leftOffset: number;
    topOffset: number;
  };
};

export const useDimensionsComponent = (
  dimensionsInput: Partial<DimensionsComponent["dimensions"]>
): DimensionsComponent => {
  const defaults = {
    width: 32,
    height: 32,
  };

  return {
    dimensions: {
      leftOffset: (dimensionsInput?.width ?? defaults.width) / 2,
      topOffset: (dimensionsInput?.height ?? defaults.height) / 2,
      ...defaults,
      ...dimensionsInput,
    },
  };
};
