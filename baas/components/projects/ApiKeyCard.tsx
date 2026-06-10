"use client";

import { useState }
  from "react";

import {
  Copy,
  Check,
} from "lucide-react";

interface Props {
  apiKey: string;
}

export default function
ApiKeyCard({
  apiKey,
}: Props) {

  const [copied,
    setCopied] =
    useState(false);

  async function copy() {

    await navigator
      .clipboard
      .writeText(apiKey);

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);
  }

  return (
    <div
      className="
        glass-card

        rounded-[32px]

        border
        border-white/10

        p-6
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
        "
      >

        <div
          className="
            min-w-0
            flex-1
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
            Project API Key
          </p>

          <h3
            className="
              mt-2

              text-xl
              font-semibold

              text-white
            "
          >
            Authentication Token
          </h3>

          <p
            className="
              mt-2

              text-sm

              text-white/50
            "
          >
            Use this key to authenticate
            requests to your generated APIs.
          </p>

          <div
            className="
              mt-5

              overflow-x-auto

              rounded-2xl

              border
              border-white/10

              bg-black/20

              px-4
              py-4
            "
          >

            <code
              className="
                text-sm

                text-white/70

                break-all
              "
            >
              {apiKey}
            </code>

          </div>

        </div>

        <button
          onClick={copy}
          className="
            flex

            h-12
            w-12

            shrink-0

            items-center
            justify-center

            rounded-full

            border
            border-white/10

            bg-white/[0.04]

            transition-all
            duration-300

            hover:scale-105
            hover:bg-white/[0.08]
          "
        >

          {copied ? (

            <Check
              className="
                h-5
                w-5

                text-green-400
              "
            />

          ) : (

            <Copy
              className="
                h-5
                w-5

                text-white/70
              "
            />

          )}

        </button>

      </div>

      {copied && (

        <div
          className="
            mt-4

            rounded-xl

            border
            border-green-500/20

            bg-green-500/10

            px-4
            py-3

            text-sm

            text-green-400
          "
        >
          API key copied to clipboard
        </div>

      )}

    </div>
  );
}