import ProjectsSection
  from "@/components/projects/ProjectsSection";

export default function DashboardPage() {

  return (
    <main
      className="
        mx-auto
        max-w-7xl

        px-6
        py-1

        space-y-12
      "
    >

      <section
        className="
          max-w-4xl
        "
      >

        <h1
          className="
            mt-8

            text-6xl
            font-bold

            leading-[0.95]
            tracking-tight

            text-white
          "
        >
          Build and manage
          <br />
          your backend.
        </h1>

        <p
          className="
            mt-8

            max-w-2xl

            text-lg
            leading-relaxed

            text-white/55
          "
        >
          Create projects, generate schemas,
          deploy APIs and manage your data
          from a single workspace.
        </p>

      </section>

      <ProjectsSection />

    </main>
  );
}