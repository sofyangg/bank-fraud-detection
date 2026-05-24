import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import PolarBarChart from "@/components/visuals/polar"
import ExConButton from "@/components/visuals/ExpandContractButton"
import { useState } from "react";
import { VisualsService } from "@/client"



function getCharts() {
  return {
    queryFn: () => VisualsService.readKpis(),
    queryKey: ["kpis"],
  }
}




export default function Dashboard() {
  const {data: { RadialPolar }}= useSuspenseQuery(getCharts())

  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  
  const handleToggle = (id: string) => {
    setExpandedChart(() => (expandedChart? null:id));
  };
  
  return(<div style={{ position: "absolute", width: "100%", height: "100%", minHeight: "350px" }} >
  <PolarBarChart data={RadialPolar.Hours}>
    <ExConButton onToggleExpand={handleToggle} id="PolarBarChart" IsExpanded={expandedChart}/>
  </PolarBarChart>
  </div>)
  
}
/*
    const [expandedChart, setExpandedChart] = useState<string | null>(null);
    


    return((
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Analytics Workspace</h1>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "400px",
          gap: "24px",
          marginTop: "24px",
          position: "relative"
        }}
      >
        
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            boxSizing: "border-box",
            
            // 2. THE SMOOTH ANIMATION MAGIC:
            // If expanded, this card overrides the grid layout to span ALL columns and rows
            gridColumn: expandedChart === "chart-one" ? "1 / -1" : "auto",
            gridRow: expandedChart === "chart-one" ? "1 / span 2" : "auto",
            
            // This forces ECharts container height to stretch dynamically
            height: "100%", 
            
            // Elevate the expanded item above other cards during animation
            zIndex: expandedChart === "chart-one" ? 10 : 1,
            
            // Hardware-accelerated transitions for smooth sizing
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", 
          }}
        >
          <PolarBarChart data={} title="Regional Distribution">
            <button
              onClick={() => setExpandedChart(expandedChart === "chart-one" ? null : "chart-one")}
              style={buttonStyle}
            >
              {expandedChart === "chart-one" ? "✕ Minimize" : "⤢ Expand"}
            </button>
          </PolarBarChart>
        </div>

        
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            boxSizing: "border-box",
            gridColumn: expandedChart === "chart-two" ? "1 / -1" : "auto",
            gridRow: expandedChart === "chart-two" ? "1 / span 2" : "auto",
            height: "100%",
            zIndex: expandedChart === "chart-two" ? 10 : 1,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <PolarBarChart data={} title="User Conversion Metrics">
            <ExConButton/>
          </PolarBarChart>
        </div>
      </div>
    </div>
  ));
}




*/





export const Route = createFileRoute("/_layout/graphs")({
component: Dashboard,
head: () => ({
    meta: [
    {
        title: "Graphs Sphynx",
    },
    ],
    }),
})

