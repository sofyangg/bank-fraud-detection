import  { useEffect, useRef } from "react";

import * as echarts from "echarts";

type Props = {
  data: number[];
  title?: string;
  children?: React.ReactNode;
};

export default function HeatMap({ data, title, children }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!chartRef.current) return;

    // init chart once
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    const option: echarts.EChartsOption = {
      title: [
        {
          text: title ?? "Radial Polar Bar Chart",
        },
      ],
      polar: {
        radius: [30, "80%"],
      },
      radiusAxis: {
        max: Math.max(...data.map((d) => d), 0.6),
      },
      angleAxis: {
        type: "category",
        data: ['Hour 1:','Hour 2:','Hour 3:','Hour 4:','Hour 5:','Hour 6:','Hour 7:','Hour 8:','Hour 9:','Hour 10:','Hour 11:','Hour 12:'
            ,'Hour 13:','Hour 14:','Hour 15:','Hour 16:','Hour 17:','Hour 18:','Hour 19:','Hour 20:','Hour 21:','Hour 22:','Hour 23:','Hour 24:'
        ],
        startAngle: 75,
      },
      tooltip: {},
      series: {
        type: "bar",
        coordinateSystem: "polar",
        data: data.map((d) => d),
        label: {
          show: true,
          position: "middle",
          formatter: "{b}:\n{c}",
        },
        barWidth:10
      },
      animation: true,
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