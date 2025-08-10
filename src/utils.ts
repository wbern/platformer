export const snapSingleCoordToGrid = (gridDimension: number, coord: number) => {
  const gridX = Math.floor(coord / gridDimension) * gridDimension;

  return gridX;
  // return coord;
};
