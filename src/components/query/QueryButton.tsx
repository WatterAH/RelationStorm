import React from "react";

interface Props {
  onInsert: (value: string) => void;
  value: string;
  symbol: string;
  color: string;
}

const QueryButton: React.FC<Props> = ({ onInsert, value, symbol, color }) => {
  return (
    <button
      onClick={() => onInsert(value)}
      className={`text-black text-4xl w-14 bg-gradient-to-r ${color} shadow-sm pb-2 cursor-pointer hover:shadow-md px-3 border rounded-lg active:scale-95 transition-transform ease-in-out`}
    >
      {symbol}
    </button>
  );
};

export default QueryButton;
