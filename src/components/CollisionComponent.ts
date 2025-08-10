import { Dispatch, SetStateAction, useState } from "react";

export type CollisionComponent = {
  collision: {
    isGrounded: boolean;
    setIsGrounded: Dispatch<SetStateAction<boolean>>;
  };
};

export const useCollisionComponent = (): CollisionComponent => {
  const [isGrounded, setIsGrounded] = useState(false);

  return {
    collision: {
      isGrounded,
      setIsGrounded,
    },
  };
};
