import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UploadJsonSchema
from "./UploadJsonSchema";

interface Props {
  projectId: string;

  onUploaded: () => void;
}

export default function
EmptyProjectState({
  projectId,
  onUploaded,
}: Props) {

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          No schema yet
        </CardTitle>

      </CardHeader>

      <CardContent
        className="
          space-y-4
        "
      >

        <p
          className="
            text-muted-foreground
          "
        >
          Upload a schema to start
          generating your backend.
        </p>

        <UploadJsonSchema
          projectId={projectId}
          onUploaded={onUploaded}
        />

      </CardContent>

    </Card>
  );
}