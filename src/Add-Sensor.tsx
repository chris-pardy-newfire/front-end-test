import { useCallback } from "react";

export function AddSensor() {
  const addSensorCallback = useCallback(() => {
    const sensorId = prompt("New Sensor Id");
    if (sensorId !== null) {
      // TODO add the sensor to the backend
      // post to /api/new-sensor with sensorId in the body to add
    }
  }, []);

  return (
    <div className="w-full flex justify-end p-1">
      <button
        className="rounded bg-[#F0953C] p-1 text-white text-lg"
        onClick={addSensorCallback}
      >
        Add new sensor
      </button>
    </div>
  );
}
