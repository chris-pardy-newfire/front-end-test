import { Form } from "./Form";
import { DataTable } from "./Data-Table";
import { AddSensor } from "./Add-Sensor";

function App() {
  return (
    <>
      <Form onFormChange={console.log} />
      <DataTable />
      <AddSensor />
    </>
  );
}

export default App;
