import React from "react";
import { Toaster } from "sonner";
interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default Providers;
