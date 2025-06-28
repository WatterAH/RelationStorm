import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface SchemaAlertProps {
  title?: string;
  description: string;
}

const SchemaAlert = ({ title = "Error", description }: SchemaAlertProps) => {
  return (
    <Alert variant="destructive" className="mt-4 flex items-start gap-3">
      <AlertCircleIcon className="h-5 w-5 mt-1" />
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
};

export default SchemaAlert;