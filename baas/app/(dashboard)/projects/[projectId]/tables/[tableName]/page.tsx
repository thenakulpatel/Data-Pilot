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
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-widest
              text-white/40
            "
          >
            Table
          </p>

          <h1
            className="
              mt-2
              text-5xl
              font-bold
            "
          >
            {tableName}
          </h1>

        </div>

      </div>

      {/* EXISTING CONTENT */}

      <LiveTableViewer
        projectId={projectId}
        tableName={tableName}
      />

      <TableChat
        projectId={projectId}
        tableName={tableName}
      />

    </div>
  );
}