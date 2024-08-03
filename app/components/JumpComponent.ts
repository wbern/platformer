import { Dispatch, SetStateAction, useState } from "react";

export type JumpComponent = {
  jump: {
    jumpActivated: boolean;
    setJumpActivated: Dispatch<SetStateAction<boolean>>;
  };
};

export const useJumpComponent = (): JumpComponent => {
  const [jumpActivated, setJumpActivated] = useState(false);

  return {
    jump: {
      jumpActivated,
      setJumpActivated,
    },
  };
};
