import QueryButton from "./QueryButton";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { operators } from "@/constants/Operators";
import { useSchemas } from "@/context/SchemaContext";
import { evaluate, parseExpression } from "@/lib/query";
import type { Row } from "@/interfaces/Schema";

interface Props {
  setResult: (value: Row[]) => void;
}

export const QueryInput: React.FC<Props> = ({ setResult }) => {
  const { data, schemas } = useSchemas();
  const [expression, setExpression] = useState("");

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById(
      "mainInput"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = expression.substring(0, start);
    const after = expression.substring(end);

    const newText = before + text + after;
    setExpression(newText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const execute = () => {
    try {
      const query = parseExpression(expression, schemas);
      const { rows } = evaluate(query, data, schemas);

      setResult(rows);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <textarea
          id="mainInput"
          className="w-full h-12 overflow-hidden py-2 text-center rounded-lg font-bold text-lg resize-none bg-gray-100 outline-none border font-mono"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Button type="button" onClick={execute} className="h-10">
          <Play />
          Ejecutar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {operators.map((op) => (
          <QueryButton key={op.name} onInsert={insertAtCursor} {...op} />
        ))}
      </div>
    </div>
  );
};
