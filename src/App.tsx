import { useEffect, useState } from 'react'
import './App.css'
import { Form } from './Form'

function App() {

  // Get the SensorIds from the API
  const [sensors, setSensors] = useState<string[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    +async function() {
      const result = await fetch('/api/sensors', { method: 'get', signal: controller.signal});
      if (!result.ok) {
        throw new Error(`Error fetching! ${result.status}`);
      }
      const { sensorIds } = await result.json();
      setSensors(sensorIds);
    }().catch(error => console.error(error));
    return () => controller.abort('stopping');
  }, [setSensors])

  // Sensor Data is available from the /api/readings api, it takes a sensorId (string) and optional to and from parameters (iso date strings)
  // Sensor Data is returned as { readings: {timestamp: ISO Date, temperature: number }[] }

  return (
    <>
      <div style={{width: '100vw', margin: 0}}>
        <Form sensors={sensors} onFormChange={(evt) => console.log(evt)} />
          {/* TODO: Fetch Data for Sensor From API and display it here */}
      </div>
    </>
  )
}

export default App
