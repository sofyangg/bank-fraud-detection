import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import PolarBarChart from "@/components/visuals/polar"
import HeatMaps from "@/components/visuals/heatmap"
import ExConButton from "@/components/visuals/ExpandContractButton"
import BinChart from "@/components/visuals/BarChart"
import SankeyD from "@/components/visuals/SankeyDiagram"
import { useState } from "react";
import { VisualsService } from "@/client"



function getCharts() {
  return {
    queryFn: () => VisualsService.readKpis(),
    queryKey: ["kpis"],
  }
}




export default function Dashboard() {
  const {data: { RadialPolar,HeatMap,Barchart,Sankey }}= useSuspenseQuery(getCharts())

  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  
  const handleToggle = (id: string) => {
    setExpandedChart(() => (expandedChart? null:id));
  };
  
  return(<div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
  <PolarBarChart data={RadialPolar.Hours}>
    <ExConButton onToggleExpand={handleToggle} id="PolarBarChart" IsExpanded={expandedChart}/>
  </PolarBarChart>
  <HeatMaps data={HeatMap.heat}>
    <ExConButton onToggleExpand={handleToggle} id="HeatMap" IsExpanded={expandedChart}/>
  </HeatMaps>
  <BinChart data={Barchart.bands}>
    <ExConButton onToggleExpand={handleToggle} id="Barchart" IsExpanded={expandedChart}/>
  </BinChart>
  <SankeyD data={Sankey.Links}>
    <ExConButton onToggleExpand={handleToggle} id="Sankey" IsExpanded={expandedChart}/>
  </SankeyD>
  </div>)
  
}



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

