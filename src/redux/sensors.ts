import { z } from "zod";
import { createAppSlice } from "./create-slice";

const sensorGetResponse = z.object({ sensorIds: z.array(z.string()) });

export const slice = createAppSlice({
  name: "sensors",
  initialState: {
    loading: false,
    error: false,
    sensorIds: [] as string[],
  },
  reducers: (creator) => ({
    load: creator.asyncThunk(
      async (_: never, { signal }) => {
        const result = await fetch("/api/sensors", { method: "GET", signal });
        if (!result.ok) {
          throw new Error(`Error fetching sensors ${result.status}`);
        }
        return sensorGetResponse.parse(await result.json());
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state) => {
          state.loading = false;
          state.error = true;
        },
        fulfilled: (state, { payload: { sensorIds } }) => {
          state.loading = false;
          state.error = false;
          state.sensorIds = sensorIds;
        },
      },
    ),
  }),
  selectors: {
    sensorsIds: ({ loading, error, sensorIds }) => {
      if (loading || error) {
        return [];
      }
      return sensorIds;
    },
  },
});

export const {
  actions: { load },
  selectors: { sensorsIds },
} = slice;
