import { NextResponse, NextRequest } from "next/server";

import { authorizeProject }
    from "@/lib/auth/authorizeProject";

import { getProjectSchema } from "@/lib/schema/getProjectSchema";

import { generateSQL } from "@/lib/schema/sqlGenerator";

import { executeQueries } from "@/lib/schema/executeSQL";

export async function POST(
    req: NextRequest,
    context: {
        params: Promise<{
            projectId: string;
        }>;
    }
) {
    try {
        const { projectId } =
            await context.params;

        const auth =
            await authorizeProject(
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

        // Fetch schema
        const schema =
            await getProjectSchema(projectId);

        if (!schema) {
            return NextResponse.json(
                {
                    error: "Schema not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Generate SQL
        const queries = generateSQL(
            schema,
            projectId
        );

        // Execute SQL
        await executeQueries(queries);

        return NextResponse.json({
            message:
                "Project deployed successfully",
            queries,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Deployment failed",
            },
            {
                status: 500,
            }
        );
    }
}