import Sidebar from "./components/sidebar/Sidebar";
import type { Row } from "./interfaces/Schema";
import { useState } from "react";
import { QueryInput } from "./components/query/QueryInput";
import DataTable from "./components/global/DataTable";

const App = () => {
  const [result, setResult] = useState<Row[]>([]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-100">
      <div className="w-80 border-r bg-white/50 backdrop-blur-sm min-h-screen sticky top-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <QueryInput setResult={setResult} />

        <DataTable data={result} />
      </div>
    </div>
  );
};

export default App;
