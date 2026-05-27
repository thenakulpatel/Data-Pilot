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
        min-h-screen
        p-6
      "
    >

      <ProjectWorkspace
        projectId={projectId}
        apiKey={
          project.api_key
        }
      />

    </main>
  );
}