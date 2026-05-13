import { createFileRoute } from "@tanstack/react-router"


export const Route = createFileRoute("/_layout/graphs")({
component: Graphs,
head: () => ({
    meta: [
    {
        title: "Graphs - FastAPI Cloud",
    },
    ],
    }),
})


export function Graphs() {
    return <p>graph section</p>
}
