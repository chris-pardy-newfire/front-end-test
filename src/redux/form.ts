import { createAppSlice } from "./create-slice";

export const slice = createAppSlice({
  name: "form",
  initialState: {
    sensorId: undefined as string | undefined,
    from: undefined as string | undefined,
    to: undefined as string | undefined,
  },
  reducers: (create) => ({
    setSensorId: create.reducer<string>((state, { payload }) => {
      if (payload === "") {
        state.sensorId = undefined;
      } else {
        state.sensorId = payload;
      }
    }),
    setFrom: create.reducer<string>((state, { payload }) => {
      if (payload === "") {
        state.from = undefined;
      } else {
        state.from = payload;
      }
    }),
    setTo: create.reducer<string>((state, { payload }) => {
      if (payload === "") {
        state.to = undefined;
      } else {
        state.to = payload;
      }
    }),
  }),
  selectors: {
    formData: (state) => {
      return {
        sensorId: state.sensorId,
        from: state.from === undefined ? state.from : new Date(state.from),
        to: state.to === undefined ? state.to : new Date(state.to),
      };
    },
  },
});

export const {
  actions: { setSensorId, setFrom, setTo },
  selectors: { formData },
} = slice;
