import {
  Card,
  CardContent,
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
    glass-card
    mx-auto
    w-full
    max-w-xl
    p-6
    sm:p-8
  "
    >
      <CardContent
        className="
          space-y-8
          pt-2
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            text-center
            space-y-4
          "
        >

          <div className="space-y-2">
            <h1
              className="
                text-4xl
    font-bold
    tracking-tight
    text-white
              "
            >
              {title}
            </h1>
          </div>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}