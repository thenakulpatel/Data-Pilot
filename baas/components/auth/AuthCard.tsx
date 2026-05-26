import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {

  return (
    <Card
      className="
        w-full
        max-w-md
      "
    >

      <CardHeader>

        <CardTitle
          className="
            text-2xl
            font-semibold
          "
        >
          {title}
        </CardTitle>

      </CardHeader>

      <CardContent>
        {children}
      </CardContent>

    </Card>
  );
}