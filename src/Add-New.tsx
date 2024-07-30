import { useCallback } from "react";

export type AddNewSensorProps = {
    onNewSensorAdded: (event: {sensor: string }) => void;
}

export function AddNewSensor({ onNewSensorAdded }: AddNewSensorProps) {
    const addSensor = useCallback(() => {
        const sensor = window.prompt("Sensor Id");
        if (sensor !== null) {
            onNewSensorAdded({ sensor });
        }
    }, [onNewSensorAdded])
    return <>
        <button onClick={addSensor}>+</button>
    </>
}