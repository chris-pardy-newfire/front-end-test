import { z } from "zod";
import { createAppSlice } from "./create-slice";

export type SensorData = {
  sensorId: string;
  timestamp: string;
  temperature: number;
};

const readingsPayload = z.object({
  readings: z.array(
    z.object({
      sensorId: z.string(),
      timestamp: z.string(),
      temperature: z.number(),
    }),
  ),
});

export const slice = createAppSlice({
  name: "readings",
  initialState: {
    loading: false,
    error: false,
    data: [] as SensorData[],
  },
  reducers: (creator) => ({
    load: creator.asyncThunk(
      async (_: never, { signal }) => {
        const result = await fetch("/api/readings", { method: "GET", signal });
        if (!result.ok) {
          throw new Error(`Error getting readings, ${result.status}`);
        }
        return readingsPayload.parse(await result.json());
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state) => {
          state.loading = false;
          state.error = true;
        },
        fulfilled: (state, { payload: { readings } }) => {
          state.loading = false;
          state.error = false;
          state.data = readings;
        },
      },
    ),
  }),
  selectors: {
    isLoading: ({ loading }) => loading,
    isError: ({ loading, error }) => !loading && error,
    data: ({ loading, error, data }) => {
      if (loading || error) {
        return [];
      }
      return data;
    },
  },
});

export const {
  actions: { load },
  selectors: { isLoading, isError, data },
} = slice;
