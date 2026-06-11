export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        bg-[#191818]
        relative
        overflow-hidden
      "
    >
      {/* Background blobs */}

      <div
        className="
          absolute
          left-[5%]
          top-[5%]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#5b5858]
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          right-[5%]
          bottom-[5%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#000000]
          blur-[150px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-6
          lg:px-12
        "
      >
        {/* LEFT PANEL */}

        <div
          className="
    hidden
    lg:flex
    lg:w-1/2
    flex-col
    justify-center
    pr-16
  "
        >

          <div
            className="
      mb-8
      w-fit
      rounded-full
      border
      border-white/10
      bg-white/5
      px-5
      py-2
      text-sm
      text-white/70
      backdrop-blur-xl
    "
          >
            Backend Infrastructure Platform
          </div>

          <h1
            className="
      max-w-3xl
      text-7xl
      font-bold
      leading-[0.95]
      tracking-tight
      text-white
    "
          >
            Build your backend,
            <br />
            not your boilerplate.
          </h1>

          <p
            className="
      mt-8
      max-w-xl
      text-xl
      leading-relaxed
      text-white/60
    "
          >
            Generate databases, APIs,
            authentication and schemas
            from spreadsheets, JSON or AI.
          </p>
          <div
            className="
    mt-12
    grid
    max-w-2xl
    grid-cols-2
    gap-4
  "
          >

            <div className="glass-panel rounded-3xl p-5">
              <div className="mb-2 text-lg">
                ⚡
              </div>

              <h3 className="font-semibold text-white">
                Instant CRUD APIs
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Ready-to-use REST endpoints.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-5">
              <div className="mb-2 text-lg">
                🗄
              </div>

              <h3 className="font-semibold text-white">
                Database Generation
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Production-ready schemas.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-5">
              <div className="mb-2 text-lg">
                🔐
              </div>

              <h3 className="font-semibold text-white">
                Authentication
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Built-in user management.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-5">
              <div className="mb-2 text-lg">
                🤖
              </div>

              <h3 className="font-semibold text-white">
                AI Schema Builder
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Generate structures from prompts.
              </p>
            </div>

          </div>

        </div>
        {/* RIGHT PANEL */}

        <div
          className="
            w-full
            lg:w-1/2
            flex
            justify-center
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="
          mt-1
          h-3
          w-3
          rounded-full
          bg-white/70
        "
      />

      <div>
        <h3
          className="
            font-medium
            text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-white/50
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}