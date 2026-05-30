import LogoutButton
  from "@/components/dashboard/LogoutButton";

import ProjectsSection
  from "@/components/projects/ProjectsSection";

export default function DashboardPage() {

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


      {/* <LogoutButton /> */}

      <section
        className="
    space-y-6
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
            Backend Infrastructure Platform
          </p>

          <h1
            className="
        mt-2

        text-5xl
        font-bold

        text-white
      "
          >
            Your Projects
          </h1>

          <p
            className="
        mt-4

        max-w-2xl

        text-lg

        text-white/50
      "
          >
            Create, manage and deploy backend
            infrastructure from a single workspace.
          </p>

        </div>

      </section>
      <div
        className="
    flex
    flex-wrap
    gap-3
  "
      >

        <div
          className="
      rounded-full

      border
      border-white/10

      bg-white/[0.03]

      px-4
      py-2

      text-sm
      text-white/70
    "
        >
          7 Projects
        </div>

        <div
          className="
      rounded-full

      border
      border-white/10

      bg-white/[0.03]

      px-4
      py-2

      text-sm
      text-white/70
    "
        >
          12 Tables
        </div>

      </div>
      <ProjectsSection />

    </main>
  );
}