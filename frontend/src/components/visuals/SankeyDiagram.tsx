import  { useEffect, useRef } from "react";
import { Sankey_Link } from "@/client"
import * as echarts from "echarts";

type Props = {
  data:Sankey_Link[];
  title?: string;
  children?: React.ReactNode;
};

export default function SankeyD({ data, title, children }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!chartRef.current) return;

    // init chart once
    if (!chartInstanceRef.current) {
    chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    
    const nodes=[{ "name": "Transactions" },{ "name": "Bank Transfer" },{ "name": "ATM withdrawal" },
        { "name": "Online" },{ "name": "Point of Sale" },{ "name": "Mobile" },
        { "name": "Tablet" },{ "name": "Laptop" },{ "name": "High Risk" },
        { "name": "Medium Risk" },{ "name": "Low Risk" }];
    
    const echartsLinks = data.map(item => ({
    source: item.From,
    target: item.To,
    value: item.Value
}));
    const option: echarts.EChartsOption = {
      title: {
        text: 'Sankey Diagram'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: nodes,
          links: echartsLinks,
          emphasis: {
            focus: 'adjacency'
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: '#fbb4ae'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: '#b3cde3'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: '#ccebc5'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: '#decbe4'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }
          ],
          lineStyle: {
            curveness: 0.5
          }
        }
      ]
    }

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize({
        animation: { duration: 0 }
      });
    });
    
    if (chartRef.current.parentElement) {
      resizeObserver.observe(chartRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [data, title]);

  return (<div style={{ position: "relative", width: "100%", height: "100%", minHeight: "350px" }}>
  {children}
  <div ref={chartRef} style={{position: "absolute", width: "100%", height: "100%" }} />
  </div>);
}