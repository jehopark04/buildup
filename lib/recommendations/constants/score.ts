import type { FitState } from "../types";

export const fitScoreMap: Record<
  FitState,
  {
    grade: number;
    level: number;
  }
> = {
  fit: {
    grade: 6,
    level: 5,
  },
  near: {
    grade: 2,
    level: 1,
  },
  far: {
    grade: -6,
    level: -5,
  },
};

export const statusWeight = 0.5;
export const openStatusBonus = 0.5;
export const activityTypeMatchBonus = 0.5;
