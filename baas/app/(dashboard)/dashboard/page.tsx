import LogoutButton
from "@/components/dashboard/LogoutButton";

import ProjectsSection
from "@/components/projects/ProjectsSection";

export default function DashboardPage() {

  return (
    <main
      className="
        min-h-screen
        p-6
        space-y-8
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Dashboard
        </h1>

        <LogoutButton />

      </div>

      <ProjectsSection />

    </main>
  );
}