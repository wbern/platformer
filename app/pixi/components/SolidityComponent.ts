import { Dispatch, SetStateAction, useState } from "react";

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
