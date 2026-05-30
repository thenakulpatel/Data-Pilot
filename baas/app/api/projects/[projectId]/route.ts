import {
    NextRequest,
    NextResponse,
} from "next/server";

import { pool }
    from "@/lib/db";

import { getUser }
    from "@/lib/auth/getUser";

import { getPhysicalTableName }
    from "@/lib/schema/getPhysicalTableName";

interface Props {
    params: Promise<{
        projectId: string;
    }>;
}

export async function DELETE(
    req: NextRequest,
    { params }: Props
) {

    try {

        // ================================================
        // PARAMS
        // ================================================

        const { projectId } =
            await params;

        // ================================================
        // AUTH
        // ================================================

        const authHeader =
            req.headers.get(
                "authorization"
            );

        if (!authHeader) {

            return NextResponse.json(
                {
                    error:
                        "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const token =
            authHeader.replace(
                "Bearer ",
                ""
            );

        const user =
            await getUser(
                token
            );

        if (!user) {

            return NextResponse.json(
                {
                    error:
                        "Invalid token",
                },
                {
                    status: 401,
                }
            );
        }

        // ================================================
        // VERIFY OWNERSHIP
        // ================================================

        const projectResult =
            await pool.query(
                `
        SELECT *
        FROM projects
        WHERE id = $1
        AND user_id = $2
        `,
                [
                    projectId,
                    user.id,
                ]
            );

        if (
            projectResult.rows.length === 0
        ) {

            return NextResponse.json(
                {
                    error:
                        "Project not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ================================================
        // LOAD SCHEMA
        // ================================================

        const schemaResult =
            await pool.query(
                `
        SELECT schema
        FROM schemas
        WHERE project_id = $1
        `,
                [projectId]
            );

        // ================================================
        // DROP PHYSICAL TABLES
        // ================================================

        if (
            schemaResult.rows.length > 0
        ) {

            const schema =
                schemaResult.rows[0]
                    .schema;

            for (
                const table
                of schema.tables || []
            ) {

                const physicalTableName =
                    getPhysicalTableName(
                        projectId,
                        table.name
                    );

                // console.log(
                //     "Dropping:",
                //     physicalTableName
                // );

                await pool.query(
                    `
          DROP TABLE IF EXISTS
          ${physicalTableName}
          CASCADE
          `
                );
            }
        }

        // ================================================
        // DELETE SCHEMA
        // ================================================

        await pool.query(
            `
      DELETE FROM schemas
      WHERE project_id = $1
      `,
            [projectId]
        );

        // ================================================
        // DELETE PROJECT
        // ================================================

        await pool.query(
            `
      DELETE FROM projects
      WHERE id = $1
      `,
            [projectId]
        );

        // ================================================
        // SUCCESS
        // ================================================

        return NextResponse.json(
            {
                success: true,
            }
        );

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Failed to delete project",
            },
            {
                status: 500,
            }
        );
    }
}