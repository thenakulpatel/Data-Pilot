import {
    NextRequest,
    NextResponse,
} from "next/server";

import Groq
    from "groq-sdk";

import {
    searchRows,
}
    from "@/lib/rag/searchRows";

import { pool }
    from "@/lib/db";

import {
    classifyIntent,
}
    from "@/lib/ai/classifyIntent";

import { authorizeApiAccess }
    from "@/lib/auth/authorizeApiAccess";

import { getProjectSchema }
    from "@/lib/schema/getProjectSchema";

import { getPhysicalTableName }
    from "@/lib/schema/getPhysicalTableName";

import { validateTable }
    from "@/lib/schema/runtimeValidator";

import { validateGeneratedSql }
    from "@/lib/sql/validateGeneratedSql";

const groq =
    new Groq({
        apiKey:
            process.env.GROQ_API_KEY,
    });

export async function POST(
    req: NextRequest,
    context: {
        params: Promise<{
            projectId: string;
        }>;
    }
) {

    try {

        // ================================================
        // PARAMS
        // ================================================

        const {
            projectId,
        } = await context.params;

        // ================================================
        // AUTH
        // ================================================

        const auth =
            await authorizeApiAccess(
                req,
                projectId
            );

        if ("error" in auth) {

            return NextResponse.json(
                {
                    error: auth.error,
                },
                {
                    status: auth.status,
                }
            );
        }

        // ================================================
        // BODY
        // ================================================

        const body =
            await req.json();

        const {
            tableName,
            question,
            messages = [],
        } = body;

        const intent =
            await classifyIntent(
                question
            );

        console.log(
            "INTENT:",
            intent
        );

        // ==========================================
        // VECTOR SEARCH
        // ==========================================

        if (
            intent === "vector"
        ) {

            const rows =
                await searchRows({

                    projectId,

                    tableName,

                    question,

                    limit: 5,
                });

            // console.log(
            //     JSON.stringify(rows, null, 2)
            // );

            if (
                rows.length === 0
            ) {

                return NextResponse.json({

                    answer:
                        "I could not find any relevant information.",

                    intent,
                });
            }

            const contextText =
                rows
                    .map(
                        (
                            row: any,
                            index: number
                        ) =>

                            `Record ${index + 1}:
${JSON.stringify(
                                row.row_data
                            )}`
                    )
                    .join("\n\n");

            const completion =
                await groq.chat.completions.create({

                    model:
                        "llama-3.1-8b-instant",

                    temperature: 0,

                    messages: [

                        {
                            role: "system",

                            content: `

You are a database assistant.

Answer ONLY using
the provided records.

If the answer
cannot be determined,
say:

"I could not find that information."

`,
                        },

                        {
                            role: "user",

                            content: `

Question:

${question}

Records:

${contextText}

`,
                        },
                    ],
                });

            return NextResponse.json({

                answer:
                    completion
                        .choices[0]
                        .message
                        .content,

                intent,
            });
        }

        if (
            !tableName ||
            !question
        ) {

            return NextResponse.json(
                {
                    error:
                        "tableName and question are required",
                },
                {
                    status: 400,
                }
            );
        }

        // ================================================
        // LOAD SCHEMA
        // ================================================

        const schema =
            await getProjectSchema(
                projectId
            );

        if (!schema) {

            return NextResponse.json(
                {
                    error:
                        "Schema not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ================================================
        // VALIDATE TABLE
        // ================================================

        const validTable =
            validateTable(
                schema,
                tableName
            );

        if (!validTable) {

            return NextResponse.json(
                {
                    error:
                        "Invalid table",
                },
                {
                    status: 400,
                }
            );
        }

        // ================================================
        // FIND TABLE
        // ================================================

        const table =
            schema.tables.find(
                (
                    table: {
                        name: string;
                        fields: any[];
                    }
                ) =>
                    table.name ===
                    tableName
            );

        if (!table) {

            return NextResponse.json(
                {
                    error:
                        "Table not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ================================================
        // PHYSICAL TABLE
        // ================================================

        const physicalTableName =
            getPhysicalTableName(
                projectId,
                tableName
            );

        // ================================================
        // FIELD CONTEXT
        // ================================================

        const fields =
            table.fields
                .map(
                    (
                        field: {
                            name: string;
                            type: string;
                        }
                    ) =>
                        `${field.name} (${field.type})`
                )
                .join("\n");

        const writeKeywords = [

            "add",
            "insert",
            "create",
            "delete",
            "remove",
            "update",
            "edit",
            "modify",

        ];
        const normalizedQuestion =
            question.toLowerCase();

        const isWriteOperation =
            writeKeywords.some(
                keyword =>
                    normalizedQuestion.includes(
                        keyword
                    )
            );

        if (isWriteOperation) {

            return NextResponse.json(
                {
                    error:
                        "This assistant supports data querying only."
                },
                {
                    status: 400
                }
            );
        }
        const history =

            messages
                .slice(-10)

                .map(

                    (
                        message: {
                            role: string;
                            content: string;
                        }
                    ) =>

                        `${message.role}: ${message.content}`
                )

                .join("\n");
        // ================================================
        // GENERATE SQL
        // ================================================
        const sampleRows =
            await pool.query(
                `
                    SELECT *
                    FROM ${physicalTableName}
                    LIMIT 3
                    `
            );

        const sqlCompletion =
            await groq.chat.completions.create({

                model:
                    "llama-3.1-8b-instant",

                temperature: 0,

                messages: [

                    {
                        role: "system",

                        content: `

                    You are a PostgreSQL expert.

                    Generate ONLY a PostgreSQL SELECT query.

                    Physical table:

                    ${physicalTableName}

                    Columns:

                    ${fields}

                    Sample Data:

                    ${JSON.stringify(
                            sampleRows.rows,
                            null,
                            2
                        )}  

                    Rules:

                    - Return ONLY SQL
                    - Only SELECT queries
                    - Never INSERT
                    - Never UPDATE
                    - Never DELETE
                    - Never DROP
                    - Never ALTER
                    - Never CREATE
                    - Never TRUNCATE
                    - No markdown
                    - No explanation
                    - Use exact column names

                    `,
                    },

                    {
                        role: "user",
                        content: `
                        Conversation History:
                        ${history}
                        Current Question:
                        ${question}

                        `,
                    },
                ],
            });

        const sql =
            sqlCompletion
                .choices[0]
                .message
                .content
                ?.trim();

        if (!sql) {

            return NextResponse.json(
                {
                    error:
                        "Failed to generate SQL",
                },
                {
                    status: 500,
                }
            );
        }
        let safeSql = sql;
        if (
            !safeSql
                .toUpperCase()
                .includes("LIMIT")
        ) {

            safeSql +=
                " LIMIT 100";
        }
        // ================================================
        // VALIDATE SQL
        // ================================================

        validateGeneratedSql(
            sql,
            physicalTableName
        );

        // ================================================
        // EXECUTE QUERY
        // ================================================

        const queryResult =
            await pool.query(
                sql
            );

        const rows =
            queryResult.rows;
        if (
            rows.length === 0
        ) {

            return NextResponse.json({

                sql,

                rows,

                answer:
                    "No matching records found.",
            });
        }
        // ================================================
        // GENERATE ANSWER
        // ================================================

        const answerCompletion =
            await groq.chat.completions.create({

                model:
                    "llama-3.1-8b-instant",

                temperature: 0,

                messages: [

                    {
                        role: "system",

                        content: `

You are a helpful data analyst.

Answer naturally.

Keep answers concise.

If there are multiple rows,
summarize them clearly.

`,
                    },

                    {
                        role: "user",

                        content: `

Question:

${question}

SQL Result:

${JSON.stringify(
                            rows,
                            null,
                            2
                        )}

`,
                    },
                ],
            });

        const answer =
            answerCompletion
                .choices[0]
                .message
                .content;

        // ================================================
        // RESPONSE
        // ================================================

        return NextResponse.json({

            answer,

            sql,

            rows,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "AI query failed",
            },
            {
                status: 500,
            }
        );
    }
}