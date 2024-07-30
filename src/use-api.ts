import { useEffect, useMemo, useState } from "react";
import type { ZodType, ZodTypeDef } from "zod";

type UseGetApiParams<T> = {
  url: string;
  schema: ZodType<T, ZodTypeDef, unknown>;
};

type ApiResponse<T> =
  | { loading: true; error: false; data?: undefined }
  | { loading: false; error: true; data?: undefined }
  | { loading: false; error: false; data: T };

export function useGetApi<T>({ url }: UseGetApiParams<T>): ApiResponse<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [json, setJson] = useState<unknown>();
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    +(async function () {
      const r = await fetch(url, { method: "GET", signal: controller.signal });
      if (!r.ok) {
        throw new Error(`Error fetching from ${url}: ${r.statusText}`);
      }
      const data = await r.json();
      controller.signal.throwIfAborted();
      setJson(data);
      setError(false);
    })()
      .catch((err) => {
        console.error(err);
        setError(true);
        setJson(undefined);
      })
      .finally(() => setLoading(false));
    return () => controller.abort(new Error("Aborting"));
  }, [setJson, setError, setLoading, url]);
  return useMemo(() => {
    if (loading) {
      return {
        loading: true,
        error: false,
      };
    }
    if (error) {
      return {
        loading: false,
        error: true,
      };
    }
    return {
      loading: false,
      error: false,
      data: json as T,
    };
  }, [loading, error, json]);
}
