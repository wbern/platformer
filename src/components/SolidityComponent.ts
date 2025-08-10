export type SolidityComponent = {
  solidity: {
    solid: true;
  };
};

export const useSolidityComponent = (): SolidityComponent => {
  return {
    solidity: {
      solid: true,
    },
  };
};
