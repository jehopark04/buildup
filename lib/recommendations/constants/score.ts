import type { FitState } from "../types";

export const fitScoreMap: Record<
  FitState,
  {
    grade: number;
    level: number;
  }
> = {
  fit: {
    grade: 4,
    level: 5,
  },
  near: {
    grade: 1,
    level: 2,
  },
  far: {
    grade: -5,
    level: -6,
  },
  unknown: {
    grade: 0.5,
    level: 1,
  },
};

export const statusWeight = 0.5;
export const openStatusBonus = 0.5;
export const activityTypeMatchBonus = 0.5;
