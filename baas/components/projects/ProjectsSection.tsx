"use client";

import Link
    from "next/link";

import {
    useEffect,
    useState,
} from "react";

import { getToken }
    from "@/lib/frontend/auth";

import { Project }
    from "@/types/project";

import CreateProjectForm
    from "./CreateProjectForm";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

export default function
    ProjectsSection() {

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function fetchProjects() {

        try {

            setLoading(true);

            const token =
                getToken();

            const response =
                await fetch(
                    "/api/projects/list",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "Failed to fetch projects"
                );

                return;
            }

            // console.log(data);

            setProjects(data);

        } catch (error) {

            console.error(error);

            setError(
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div
            className="
        space-y-6
      "
        >

            <CreateProjectForm
                onProjectCreated={
                    fetchProjects
                }
            />

            {loading && (
                <p>
                    Loading projects...
                </p>
            )}

            {error && (
                <p
                    className="
            text-red-500
          "
                >
                    {error}
                </p>
            )}

            <div
                className="
          grid
          gap-4
        "
            >

                {projects.map(
                    (project) => (

                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                        >

                            <Card
                                className="
      hover:border-primary
      transition-colors
      cursor-pointer
    "
                            >

                                <CardContent
                                    className="
        p-4
      "
                                >

                                    <h2
                                        className="
          text-lg
          font-semibold
        "
                                    >
                                        {project.name}
                                    </h2>

                                </CardContent>

                            </Card>

                        </Link>
                    )
                )}

            </div>

        </div>
    );
}