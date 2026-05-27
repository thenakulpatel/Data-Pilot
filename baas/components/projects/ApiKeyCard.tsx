interface Props {
  apiKey: string;
}

export default function
ApiKeyCard({
  apiKey,
}: Props) {

  async function copy() {

    await navigator
      .clipboard
      .writeText(apiKey);
  }

  return (
    <div
      className="
        border
        rounded-md
        p-4
        space-y-2
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
            "
          >
            Project API Key
          </p>

          <code
            className="
              text-sm
              break-all
            "
          >
            {apiKey}
          </code>

        </div>

        <button
          onClick={copy}
          className="
            border
            rounded-md
            px-3
            py-1
            text-sm
          "
        >
          Copy
        </button>

      </div>

    </div>
  );
}