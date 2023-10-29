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
  let sizeDefaults = {
    width: 32,
    height: 32,
  };

  let offsetDefaults = {
    leftOffset: (dimensionsInput?.width ?? sizeDefaults.width) / 2,
    topOffset: (dimensionsInput?.height ?? sizeDefaults.height) / 2,
  };

  const defaults: DimensionsComponent["dimensions"] = {
    ...sizeDefaults,
    ...offsetDefaults,
  };

  return {
    dimensions: {
      ...defaults,
      ...dimensionsInput,
    },
  };
};
