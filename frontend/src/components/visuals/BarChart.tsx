import  { useEffect, useRef } from "react";

import * as echarts from "echarts";

type Props = {
  data:number[];
  title?: string;
  children?: React.ReactNode;
};

export default function BinChart({ data, title, children }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!chartRef.current) return;

    // init chart once
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    const bands=["0-20%","20-40%","40-60%","60-80%","80-100%"]
    
    const option: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    data:bands
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data:data,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
};
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