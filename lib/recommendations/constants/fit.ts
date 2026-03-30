import type { Grade, Level } from "@/lib/profile";

export const gradeRank: Record<Grade, number> = {
  freshman: 1,
  sophomore: 2,
  junior: 3,
  senior: 4,
};

export const levelRank: Record<Level, number> = {
  explore: 1,
  basic: 2,
  project: 3,
  ready: 4,
};
