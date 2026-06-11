import { notFound }
  from "next/navigation";

import ProjectWorkspace
  from "@/components/projects/ProjectWorkspace";

import { pool }
  from "@/lib/db";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function
  ProjectPage({
    params,
  }: Props) {

  // ================================================
  // PARAMS
  // ================================================

  const { projectId } =
    await params;

  // ================================================
  // FETCH PROJECT
  // ================================================

  const result =
    await pool.query(
      `
      SELECT *
      FROM projects
      WHERE id = $1
      `,
      [projectId]
    );

  const project =
    result.rows[0];

  // ================================================
  // NOT FOUND
  // ================================================

  if (!project) {
    notFound();
  }

  // ================================================
  // PAGE
  // ================================================

  return (
    <main
      className="
    mx-auto
    max-w-7xl

    px-6
    py-10

    space-y-10
  "
    >
      <div>

        <p
          className="
        text-sm
        uppercase
        tracking-[0.3em]

        text-white/40
      "
        >
          Project Workspace
        </p>

        <h1
          className="
        mt-3

        text-6xl
        font-bold

        tracking-tight

        text-white
      "
        >
          {project.name}
        </h1>

        <p
          className="
        mt-4

        max-w-2xl

        text-lg

        text-white/50
      "
        >
          Design schemas, generate APIs,
          manage tables and deploy your backend.
        </p>

      </div>

      <ProjectWorkspace
        projectId={projectId}
        apiKey={project.api_key}
      />
    </main>
  );
}