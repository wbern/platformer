import { useRef } from "react";
import { generateUniqueId } from "./generateUniqueId";

export type EntityInfo = {
  id: string;
};

export const useEntityInfo = (name: string, existingId?: string) => {
  const id = useRef(existingId ?? generateUniqueId(name)).current;

  return {
    id,
  };
};
