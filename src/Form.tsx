import { useEffect } from "react";
import {
  loadSensors,
  sensorsIds as sensorIdsSelector,
  setFrom,
  setSensorId,
  setTo,
} from "./redux";
import { useAppDispatch, useAppSelector } from "./redux-hooks";

export function Form() {
  // Get the SensorIds from the API
  const dispatch = useAppDispatch();
  useEffect(() => {
    const d = dispatch(loadSensors());
    return () => d.abort();
  }, [dispatch]);
  const sensorIds = useAppSelector(sensorIdsSelector);

  return (
    <form className="bg-[#616B7D] text-white grid grid-cols-2 p-2 gap-y-1">
      <label className="col-span-2">
        Sensor Id&nbsp;
        <select
          name="sensorId"
          className="text-black"
          onChange={({ target }) => dispatch(setSensorId(target.value))}
        >
          <option value={""}>All</option>
          {sensorIds.map((sensorId) => (
            <option value={sensorId} key={sensorId}>
              {sensorId}
            </option>
          ))}
        </select>
      </label>
      <label>
        From&nbsp;
        <input
          name="from"
          className="text-black"
          type="datetime-local"
          onChange={({ target }) => dispatch(setFrom(target.value))}
        />
      </label>
      <label>
        To&nbsp;
        <input
          className="text-black"
          name="to"
          type="datetime-local"
          onChange={({ target }) => dispatch(setTo(target.value))}
        />
      </label>
    </form>
  );
}
