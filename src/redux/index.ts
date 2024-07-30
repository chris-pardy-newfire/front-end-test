import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { slice as sensorsSlice } from "./sensors";
import { slice as readingsSlice } from "./readings";
import { slice as formSlice } from "./form";

export const store = configureStore({
  reducer: combineSlices(sensorsSlice, readingsSlice, formSlice),
});

export { load as loadSensors, sensorsIds } from "./sensors";
export {
  load as loadReadings,
  isLoading as areReadingsLoading,
  isError as isReadingError,
  data as readingData,
} from "./readings";
export { setSensorId, setFrom, setTo, formData } from "./form";
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
