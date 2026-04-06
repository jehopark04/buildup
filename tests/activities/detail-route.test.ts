import { beforeEach, describe, expect, it, vi } from "vitest";

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("__not_found__");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound,
}));

import ActivityDetailPage from "../../app/activities/[id]/page";

describe("activity detail route guard", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it.each(["missing-activity", "", "   ", "<script>", "x".repeat(2048)])(
    "throws the notFound path for invalid activity ids: %s",
    async (id) => {
      await expect(
        ActivityDetailPage({
          params: Promise.resolve({ id }),
          searchParams: Promise.resolve({}),
        }),
      ).rejects.toThrow("__not_found__");

      expect(notFound).toHaveBeenCalledTimes(1);
      notFound.mockClear();
    },
  );

  it("renders known activities without using the notFound path", async () => {
    await expect(
      ActivityDetailPage({
        params: Promise.resolve({ id: "kau-project-x" }),
        searchParams: Promise.resolve({}),
      }),
    ).resolves.toBeTruthy();

    expect(notFound).not.toHaveBeenCalled();
  });
});
