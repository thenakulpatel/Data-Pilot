"use client";

import Link
    from "next/link";

import { Trash2 }
    from "lucide-react";

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

    const [currentPage, setCurrentPage] =
        useState(1);

    const PROJECTS_PER_PAGE = 3;

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");
    const totalPages =
        Math.ceil(
            projects.length /
            PROJECTS_PER_PAGE
        );

    const startIndex =
        (currentPage - 1) *
        PROJECTS_PER_PAGE;

    const paginatedProjects =
        projects.slice(
            startIndex,
            startIndex +
            PROJECTS_PER_PAGE
        );

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
            setCurrentPage(1);

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

    async function handleDelete(
        projectId: string
    ) {

        const confirmed =
            window.confirm(
                "Delete this project?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const token =
                getToken();

            const response =
                await fetch(
                    `/api/projects/${projectId}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.error ||
                    "Failed to delete project"
                );

                return;
            }

            fetchProjects();

        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong"
            );
        }
    }

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
            {!loading &&
                projects.length === 0 && (

                    <Card
                        className="
      border-white/10
      bg-white/[0.03]
    "
                    >
                        <CardContent
                            className="
        py-16
        text-center
      "
                        >
                            <h3
                                className="
    text-3xl
    font-semibold
    text-white
  "
                            >
                                No projects yet
                            </h3>

                            <p
                                className="
    mt-4
    text-white/50
  "
                            >
                                Create your first backend
                                project and start generating
                                APIs instantly.
                            </p>

                            <p
                                className="
          mt-3
          text-white/50
        "
                            >
                                Create your first backend
                                project to get started.
                            </p>
                        </CardContent>
                    </Card>
                )}
            <div
                className="
    grid
    gap-6

    sm:grid-cols-2
    xl:grid-cols-3
  "
            >

                {paginatedProjects.map(
                    (project) => (

                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                        >
                            <Card
                                className="
      group
      cursor-pointer

      border-white/10

      bg-white/[0.03]

      transition-all
      duration-300

      hover:-translate-y-1
      hover:border-white/20
      hover:bg-white/[0.05]
    "
                            >
                                <CardContent
                                    className="
        p-6
      "
                                >
                                    <div
                                        className="
          flex
          items-start
          justify-between
        "
                                    >
                                        <div>
                                            <h2
                                                className="
              text-lg
              font-semibold
              text-white
            "
                                            >
                                                {project.name}
                                            </h2>

                                            <p
                                                className="
              mt-2
              text-sm
              text-white/50
            "
                                            >
                                                Backend Project
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => {

                                                e.preventDefault();

                                                handleDelete(
                                                    project.id
                                                );
                                            }}
                                            className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-full

            bg-white/5

            text-lg

            transition-all

            hover:bg-red-500/20
          "
                                        >
                                            <Trash2
                                                className="
    h-4
    w-4
  "
                                            />
                                        </button>
                                    </div>

                                    <div
                                        className="
          mt-8
          flex
          items-center
          justify-between
        "
                                    >
                                        <span
                                            className="
            text-xs
            text-white/40
          "
                                        >
                                            Click to open
                                        </span>

                                        <span
                                            className="
            text-xl
            text-white/60

            transition-transform

            group-hover:translate-x-1
          "
                                        >
                                            →
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                )}

            </div>
            {totalPages > 1 && (

                <div
                    className="
      mt-8

      flex
      items-center
      justify-center

      gap-2
    "
                >

                    <button
                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                        className="
        rounded-full

        border
        border-white/10

        bg-white/5

        px-4
        py-2

        text-sm
        text-white

        disabled:opacity-30
      "
                    >
                        Previous
                    </button>

                    {Array.from(
                        { length: totalPages }
                    ).map((_, index) => {

                        const page =
                            index + 1;

                        return (
                            <button
                                key={page}
                                onClick={() =>
                                    setCurrentPage(page)
                                }
                                className={`
            h-10
            w-10

            rounded-full

            text-sm

            transition-all

            ${page === currentPage
                                        ? "bg-white text-black"
                                        : "bg-white/5 text-white"
                                    }
          `}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() =>
                            setCurrentPage(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage === totalPages
                        }
                        className="
        rounded-full

        border
        border-white/10

        bg-white/5

        px-4
        py-2

        text-sm
        text-white

        disabled:opacity-30
      "
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}