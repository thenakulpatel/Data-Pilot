"use client";

import { useRouter }
    from "next/navigation";

import { Trash2 } from "lucide-react";

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
            className="
    flex

    h-11
    w-11

    items-center
    justify-center

    rounded-full

    border
    border-white/10

    bg-white/[0.04]

    text-white/60

    transition-all

    hover:scale-105
    hover:bg-red-500/10
    hover:text-red-300
  "
            variant="destructive"
            onClick={deleteTable}
        >
            <Trash2
                className="
      h-4
      w-4
    "
            />
        </Button>

    );
}