import React from "react";
import { Toaster } from "sonner";
import { SchemaProvider } from "./context/SchemaContext";
interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    
    <SchemaProvider>
      {children}
    <Toaster richColors position="bottom-right" />
    </SchemaProvider>

  );
};

export default Providers;
