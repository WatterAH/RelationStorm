import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface SchemaAlertProps {
  title?: string;
  description: string;
}

const SchemaAlert = ({ title = "Error", description }: SchemaAlertProps) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircleIcon className="h-5 w-5" />
      <div className="flex flex-col">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
};

export default SchemaAlert;
