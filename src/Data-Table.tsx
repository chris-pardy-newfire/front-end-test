import { z } from "zod";
import "./Data-Table.css";
import { useGetApi } from "./use-api";

export function DataTable() {
  const {
    loading,
    error,
    data: { readings } = { readings: [] },
  } = useGetApi({
    // readings API can take query parameters to limit the results
    // sensorId - limit to specific sensor
    // from - ISO DateTime to set an earliest date
    // to - ISO DateTime to set a latest date
    url: "/api/readings",
    schema: z.object({
      readings: z.array(
        z.object({
          sensorId: z.string(),
          timestamp: z.string(),
          temperature: z.number(),
        }),
      ),
    }),
  });

  if (loading) {
    return "LOADING...";
  }
  if (error) {
    return "ERROR!";
  }

  // TODO: render the list of temperature readings
  return null;
}
