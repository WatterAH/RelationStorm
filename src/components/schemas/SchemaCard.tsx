import { colors } from "@/constants/Colors";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Database } from "lucide-react";
import type { Base } from "@/interfaces/Schema";

const SchemaCard: React.FC<Base> = ({ id, title, color, description }) => {
  const URL = `/schema/${id}`;
  return (
    <a href={URL}>
      <Card className="h-25 cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-0 shadow-md">
        <CardHeader className="text-xl">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardAction
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colors[color]} flex items-center justify-center`}
          >
            <Database className="h-7 w-7 text-white" />
          </CardAction>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </a>
  );
};

export default SchemaCard;
