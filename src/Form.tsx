import { useCallback, useRef } from "react";

export type FormProps = {
    sensors: string[];
    onFormChange: (data: { sensorId: string, from?: Date, to?: Date }) => void;
}

export function Form({ sensors, onFormChange }: FormProps) {
    const sensorIdRef = useRef<HTMLSelectElement | null>(null);
    const fromTimeRef = useRef<HTMLInputElement | null>(null);
    const toTimeRef = useRef<HTMLInputElement | null>(null);
    const emitFormChange = useCallback(() => {
        const sensorId = sensorIdRef.current!.value;
        const from = fromTimeRef.current!.value;
        const to = toTimeRef.current!.value;
        onFormChange({ sensorId, from: from === "" ? undefined : new Date(from), to: to === "" ? undefined : new Date(to) })
    }, [sensorIdRef, fromTimeRef, toTimeRef, onFormChange])
    return <form style={{textAlign: "start"}}>
        <div>
            <label>Sensor Id&nbsp;
            <select name="sensorId" ref={sensorIdRef} onChange={emitFormChange}>
                { sensors.map(sensor => <option value={sensor} key={sensor}>{sensor}</option>)}
            </select>
            </label>
        </div>
        <div>
            <label>From&nbsp;
                <input name="from" ref={fromTimeRef} type="datetime-local" onChange={emitFormChange} />
            </label>
            <label>To&nbsp;
                <input name="to" ref={toTimeRef} type="datetime-local" onChange={emitFormChange} />
            </label>
        </div>
    </form>
}