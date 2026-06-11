import Groq
from "groq-sdk";

const groq =
  new Groq({

    apiKey:
      process.env
        .GROQ_API_KEY,
  });

export async function
classifyIntent(
  question: string
): Promise<"sql" | "vector"> {

  const completion =
    await groq.chat.completions.create({

      model:
        "llama-3.1-8b-instant",

      temperature: 0,

      messages: [

        {
          role: "system",

          content: `

You classify database questions.

Return ONLY one word:

sql

or

vector

Use sql when the question requires:

- count
- average
- maximum
- minimum
- sorting
- filtering
- aggregations
- exact database operations

Examples:

How many users are there?
-> sql

What is the average salary?
-> sql

Who is the oldest employee?
-> sql

Use vector when the question requires:

- semantic meaning
- associations
- contextual understanding
- natural language retrieval

Examples:

Which player comes from South America?
-> vector

Who is associated with France?
-> vector

Tell me about the footballer from Portugal.
-> vector

Return only:

sql

or

vector

`,
        },

        {
          role: "user",

          content:
            question,
        },
      ],
    });

  const result =
    completion
      .choices[0]
      .message
      .content
      ?.trim()
      .toLowerCase();

  if (
    result === "sql"
  ) {

    return "sql";
  }

  return "vector";
}