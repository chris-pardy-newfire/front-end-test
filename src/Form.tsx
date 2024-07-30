import { useCallback, useRef, useState } from "react";
import { useGetApi } from "./use-api";
import { z } from "zod";

export type FormEvent = {
  sensorId?: string;
  from?: Date;
  to?: Date;
};

export type FormProps = {
  onFormChange: (data: FormEvent) => void;
};

const sensorApiSchema = z.object({ sensorIds: z.array(z.string()) });

export function Form({ onFormChange }: FormProps) {
  // Get the SensorIds from the API
  const { data: { sensorIds } = { sensorIds: [] } } = useGetApi({
    url: "/api/sensors",
    schema: sensorApiSchema,
  });

  const sensorIdRef = useRef<HTMLSelectElement | null>(null);
  const fromTimeRef = useRef<HTMLInputElement | null>(null);
  const toTimeRef = useRef<HTMLInputElement | null>(null);
  const emitFormChange = useCallback(() => {
    const sensorId = sensorIdRef.current!.value;
    const from = fromTimeRef.current!.value;
    const to = toTimeRef.current!.value;
    onFormChange({
      sensorId: sensorId === "" ? undefined : sensorId,
      from: from === "" ? undefined : new Date(from),
      to: to === "" ? undefined : new Date(to),
    });
  }, [sensorIdRef, fromTimeRef, toTimeRef, onFormChange]);

  return (
    <form className="bg-[#616B7D] text-white grid grid-cols-2 p-2 gap-y-1">
      <label className="col-span-2">
        Sensor Id&nbsp;
        <select
          name="sensorId"
          className="text-black"
          ref={sensorIdRef}
          onChange={emitFormChange}
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
          ref={fromTimeRef}
          type="datetime-local"
          onChange={emitFormChange}
        />
      </label>
      <label>
        To&nbsp;
        <input
          className="text-black"
          name="to"
          ref={toTimeRef}
          type="datetime-local"
          onChange={emitFormChange}
        />
      </label>
    </form>
  );
}
