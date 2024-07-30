import { useCallback } from "react";

export function AddSensor() {
  const addSensorCallback = useCallback(() => {
    const sensorId = prompt("New Sensor Id");
    if (sensorId !== null) {
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
