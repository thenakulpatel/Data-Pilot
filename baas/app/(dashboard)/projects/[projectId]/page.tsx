import ProjectWorkspace
from "@/components/projects/ProjectWorkspace";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function
ProjectPage({
  params,
}: Props) {

  const { projectId } =
    await params;

  return (
    <main
      className="
        min-h-screen
        p-6
      "
    >

      <ProjectWorkspace
        projectId={projectId}
      />

    </main>
  );
}