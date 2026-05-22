import { createFileRoute } from "@tanstack/react-router"

/*
import { useState } from "react";

export default function ExpandableQuadrants() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const panels = [
    {
      id: 1,
      title: "1",
      color: "bg-red-500",
      position: "top-0 left-0",
    },
    {
      id: 2,
      title: "2",
      color: "bg-blue-500",
      position: "top-0 right-0",
    },
    {
      id: 3,
      title: "3",
      color: "bg-green-500",
      position: "bottom-0 left-0",
    },
    {
      id: 4,
      title: "4",
      color: "bg-yellow-500",
      position: "bottom-0 right-0",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {panels.map((panel) => {
        const isExpanded = expanded === panel.id;
        const isHidden = expanded !== null && expanded !== panel.id;

        return (
          <div
            key={panel.id}
            onClick={() => {
              if (expanded === null) {
                setExpanded(panel.id);
              }
            }}
            className={`
              absolute
              flex
              items-center
              justify-center
              text-white
              text-4xl
              font-bold
              cursor-pointer
              transition-all
              duration-500
              overflow-hidden
              ${panel.color}

              ${
                isExpanded
                  ? "w-screen h-screen top-0 left-0 z-20"
                  : "w-1/2 h-1/2"
              }

              ${!isExpanded ? panel.position : ""}

              ${
                isHidden
                  ? "opacity-0 scale-90 pointer-events-none"
                  : "opacity-100 scale-100"
              }
            `}
          >
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(null);
                }}
                className="
                  absolute
                  top-5
                  left-5
                  w-12
                  h-12
                  rounded-full
                  bg-white/20
                  backdrop-blur-md
                  text-white
                  text-2xl
                  flex
                  items-center
                  justify-center
                  hover:bg-white/30
                  transition
                "
              >
                ←
              </button>
            )}

            {panel.title}
          </div>
        );
      })}
    </div>
  );
}


*/




export default function Graphs() {
            return (
    <div
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 100px)",
        gridTemplateRows: "repeat(2, 100px)",
        gap: "10px"
        justifyContent:"center",
        alignItems:"center"
    }}
>
<p style={{justifyContent:"center",
        alignItems:"center"}}>first</p>
<p style={{justifyContent:"center",
        alignItems:"center"}}>second</p>
<p style={{justifyContent:"center",
        alignItems:"center"}}>third</p>
<p style={{justifyContent:"center",
        alignItems:"center"}}>fourth</p>
    </div>)


}








export const Route = createFileRoute("/_layout/graphs")({
component: Graphs,
head: () => ({
    meta: [
    {
        title: "Graphs Sphynx",
    },
    ],
    }),
})

