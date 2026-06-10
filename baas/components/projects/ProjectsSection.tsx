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

    const PROJECTS_PER_PAGE = 1;

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

    const paginationItems = [];

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {
        const isFirst =
            page <= 2;

        const isLast =
            page >= totalPages - 1;

        const isNearCurrent =
            Math.abs(
                page - currentPage
            ) <= 1;

        if (
            isFirst ||
            isLast ||
            isNearCurrent
        ) {
            paginationItems.push(page);
        } else {

            const previous =
                paginationItems[
                paginationItems.length - 1
                ];

            if (previous !== "...") {
                paginationItems.push("...");
            }
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
                            <div
                                className="
    flex
    flex-col
    items-center
    text-center
  "
                            >

                                <div
                                    className="
      flex
      h-20
      w-20

      items-center
      justify-center

      rounded-full

      bg-white/[0.05]

      text-3xl
    "
                                >
                                    🚀
                                </div>

                                <h3
                                    className="
      mt-6

      text-3xl
      font-bold

      text-white
    "
                                >
                                    No Projects Yet
                                </h3>

                                <p
                                    className="
      mt-4

      max-w-md

      text-white/50
    "
                                >
                                    Create your first backend workspace and start generating databases, APIs and authentication instantly.
                                </p>

                            </div>
                        </CardContent>
                    </Card>
                )}

            <div
                className="
    flex
    items-end
    justify-between
  "
            >
                <div>

                    <p
                        className="
        text-xs
        uppercase
        tracking-[0.3em]
        text-white/40
      "
                    >
                        Workspace
                    </p>

                    <h2
                        className="
        mt-3
        text-4xl
        font-bold
        text-white
      "
                    >
                        Projects
                    </h2>

                    <p
                        className="
        mt-3
        text-lg
        text-white/50
      "
                    >
                        Manage databases, APIs and backend infrastructure.
                    </p>

                </div>

                <div
                    className="
      hidden
      md:flex

      items-center
      gap-3

      rounded-full

      border
      border-white/10

      bg-white/[0.03]

      px-4
      py-2
    "
                >
                    <div
                        className="
        h-2
        w-2
        rounded-full
        bg-green-400
      "
                    />

                    <span
                        className="
        text-sm
        text-white/60
      "
                    >
                        Active Workspace
                    </span>
                </div>
            </div>
            <div
                className="
   grid
gap-8

md:grid-cols-2
xl:grid-cols-3
2xl:grid-cols-4
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
glass-panel

      transition-all
      duration-300

      hover:-translate-y-1
      hover:border-white/20
     glass-panel

hover:scale-[1.02]
hover:border-white/20

hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]
    
      hover:border-white/20
    "
                            >
                                <CardContent
                                    className="
    flex
    flex-col
    justify-between

    p-7

    min-h-[220px]
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
                                            <div
                                                className="
    mb-5

    flex
    h-14
    w-14

    items-center
    justify-center

    rounded-2xl

    border
    border-white/10

    bg-white/[0.04]

    text-xl
  "
                                            >
                                                🚀
                                            </div>
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

   glass-panel

            text-lg

            transition-all
hover:scale-110
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
                                            Open Workspace
                                        </span>

                                        <span
                                            className="
            text-2xl
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
            <div
                className="
    mt-12
    flex
    justify-center
  "
            >
                {totalPages > 1 && (

                    <div
                        className="
        flex
        items-center
        gap-3
        rounded-full
        p-2
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

  bg-white/[0.03]

  px-5
  py-2.5

  text-sm
  font-medium

  text-white/70

  transition-all

  hover:bg-white/[0.08]
  hover:text-white

  disabled:opacity-30
"
                        >
                            Previous
                        </button>

                        {paginationItems.map(
                            (item, index) => {

                                if (item === "...") {

                                    return (
                                        <span
                                            key={index}
                                            className="
            px-2
            text-white/40
          "
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                const page =
                                    item as number;

                                return (
                                    <button
                                        key={page}
                                        onClick={() =>
                                            setCurrentPage(page)
                                        }
                                        className={`
          h-11
          w-11

          rounded-full

          text-sm
          font-medium

          transition-all

          ${page === currentPage
                                                ? `
                glass-panel
                text-white
                shadow-[0_0_25px_rgba(255,255,255,0.12)]
              `
                                                : `
                bg-white/[0.03]
                text-white/60
                hover:bg-white/[0.08]
                hover:text-white
              `
                                            }
        `}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                        )}

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

  bg-white/[0.03]

  px-5
  py-2.5

  text-sm
  font-medium

  text-white/70

  transition-all

  hover:bg-white/[0.08]
  hover:text-white

  disabled:opacity-30
      "
                        >
                            Next
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}