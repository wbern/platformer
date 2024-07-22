import { useRef } from "react";
import { generateUniqueId } from "./generateUniqueId";

export type EntityInfo = {
  id: string;
};

export const useEntityInfo = (name: string) => {
  const id = useRef(generateUniqueId(name)).current;

  return {
    id,
  };
};
