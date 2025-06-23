import React from "react";
import { Toaster } from "sonner";
import { SchemaProvider } from "./context/SchemaContext";

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <SchemaProvider>{children}</SchemaProvider>
    </>
  );
};

export default Providers;
