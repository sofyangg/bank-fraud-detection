import  { useEffect, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts"
import * as echarts from "echarts";

type Props = {
  data: number[];
  title?: string;
};

export default function PolarBarChart({ data, title }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const debouncedResize = useDebounceCallback(() => {
    chartInstanceRef.current?.resize();
  }, 150);
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
        max: Math.max(...data.map((d) => d), 1),
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
      },
      animation: true,
    };

    chart.setOption(option);

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [data, title, debouncedResize]);

  return <div ref={chartRef} style={{ width: "100%", height: 400 }} />;
}