"use client";

import { useRouter }
    from "next/navigation";

import { Button }
    from "@/components/ui/button";

import { authenticatedFetch }
    from "@/lib/frontend/authenticatedFetch";
interface Props {

    projectId: string;

    tableName: string;

    onDeleted?: () => void;
}

export default function
    DeleteTableButton({
        projectId,
        tableName,
        onDeleted,
    }: Props) {

    const router =
        useRouter();

    async function deleteTable() {

        const confirmed =
            window.confirm(
                `Delete table "${tableName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await authenticatedFetch(
                    `/api/projects/${projectId}/tables/${tableName}`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {

                alert(
                    "Failed to delete table"
                );

                return;
            }

            if (onDeleted) {

                onDeleted();

            } else {

                router.push(
                    `/projects/${projectId}`
                );
            }

        } catch {

            alert(
                "Failed to delete table"
            );
        }
    }

    return (

        <Button
            variant="destructive"
            onClick={deleteTable}
        >
            Delete Table
        </Button>

    );
}