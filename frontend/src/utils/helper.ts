

import type { Organisation } from "../../../types";
import { API_PATH } from "./apiPaths";
import axiosInstance from "./axiosInstance";

// };
export const getColorFromName = (name: string): string => {
  let hash = 0;

  // Create a simple hash from the string
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map the hash value to a hue (0–360)
  const hue = Math.abs(hash) % 360;

  // Fixed saturation and lightness for good readability
  return `hsl(${hue}, 65%, 55%)`;
};



