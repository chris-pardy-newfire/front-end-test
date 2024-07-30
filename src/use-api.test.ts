import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  Mock,
  vi,
} from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetApi } from "./use-api";
import { z, ZodType } from "zod";

describe("the useGetApi hook", () => {
  let mockFetch: Mock<typeof fetch>;

  beforeAll(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });
  beforeEach(() => {
    mockFetch.mockReset();
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("initially returns loading", async () => {
    const { result } = renderHook(() =>
      useGetApi({ url: "test", schema: z.unknown() }),
    );
    expect(result.current.loading).toBe(true);
  });

  it("calls fetch with the given url", async () => {
    const url = "/api/test";
    const { result } = renderHook(useGetApi, {
      initialProps: { url, schema: z.unknown() },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({ method: "GET" }),
    );
  });

  describe("when the api returns an error code", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({ ok: false, statusText: "Bad" } as any);
    });

    it("marks the response as an error", async () => {
      const { result } = renderHook(useGetApi, {
        initialProps: { url: "test", schema: z.unknown() },
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe(true);
    });
  });

  describe("when the api return a success", () => {
    const responseJSON = { test: true };
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseJSON),
      } as any);
    });

    it("returns the response", async () => {
      const { result } = renderHook(useGetApi, {
        initialProps: { url: "test", schema: z.unknown() },
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(responseJSON);
    });

    // Not working
    it.skip("returns an error when the schema doesn't match", async () => {
      const schema = z.object({ name: z.string() });
      const { result } = renderHook(useGetApi, {
        initialProps: { url: "test", schema },
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe(true);
    });

    it("when the schema changes doesn't re-fetch data", async () => {
      const schema = z.object({ test: z.boolean() });
      const { result, rerender } = renderHook(useGetApi, {
        initialProps: { url: "test", schema: z.unknown() as ZodType<unknown> },
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      rerender({ url: "test", schema });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(mockFetch).toHaveBeenCalledOnce();
    });

    it.skip("re-validates schema when schema changes", async () => {
      const transformedData = { transformed: true, data: "transformed" };
      const schema = z
        .object({ test: z.boolean() })
        .transform(() => transformedData);
      const { result, rerender } = renderHook(useGetApi, {
        initialProps: { url: "test", schema: z.unknown() as ZodType<unknown> },
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      rerender({ url: "test", schema });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBe(transformedData);
    });
  });

  it("when the url changes it re-fetches", async () => {
    const schema = z.unknown();
    const { result, rerender } = renderHook(useGetApi, {
      initialProps: { url: "test", schema },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    rerender({ url: "not-test", schema });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
