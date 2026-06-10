import LiveTableViewer
  from "@/components/projects/LiveTableViewer";

import TableChat
  from "@/components/projects/TableChat";

interface Props {

  params: Promise<{
    projectId: string;
    tableName: string;
  }>;
}

export default async function
  TablePage({
    params,
  }: Props) {

  const {
    projectId,
    tableName,
  } = await params;

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        space-y-8
        px-8
      "
    >

      {/* HEADER */}
      <div
        className="
    flex
    flex-col

    gap-6

    md:flex-row
    md:items-center
    md:justify-between
  "
      >
        <div>

          <p
            className="
      text-sm

      uppercase

      tracking-[0.25em]

      text-white/40
    "
          >
            Table Workspace
          </p>

          <h1
            className="
      mt-3

      text-5xl
      font-bold

      text-white
    "
          >
            {tableName}
          </h1>

          <p
            className="
      mt-4

      text-white/50
    "
          >
            Browse records, test APIs
            and interact with your data.
          </p>

        </div>
      </div>

      {/* EXISTING CONTENT */}

      <div
        className="
    space-y-4
  "
      >

        <div>

          <p
            className="
        text-sm

        uppercase

        tracking-[0.2em]

        text-white/40
      "
          >
            Data
          </p>

          <h2
            className="
        mt-2

        text-3xl
        font-semibold

        text-white
      "
          >
            Table Records
          </h2>

        </div>

        <LiveTableViewer
          projectId={projectId}
          tableName={tableName}
        />

      </div>

      <div
        className="
    pt-6
  "
      >

        <div
          className="
      mb-6
    "
        >

          <p
            className="
        text-sm

        uppercase

        tracking-[0.2em]

        text-white/40
      "
          >
            AI Assistant
          </p>

          <h2
            className="
        mt-2

        text-3xl
        font-semibold

        text-white
      "
          >
            Query Your Data
          </h2>

          <p
            className="
        mt-3

        text-white/50
      "
          >
            Ask questions about
            your table and generate
            queries instantly.
          </p>

        </div>

        <TableChat
          projectId={projectId}
          tableName={tableName}
        />

      </div>

    </div>
  );
}