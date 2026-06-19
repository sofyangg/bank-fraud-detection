import  { useEffect, useRef } from "react";

import * as echarts from "echarts";

type Props = {
  data:number[][];
  title?: string;
  children?: React.ReactNode;
};

export default function HeatMaps({ data, title, children }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!chartRef.current) return;

    // init chart once
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;
    
    const TxTypes=["PoS","On","ATM ","Bank"];
    
    const device_types=["Laptop","Tablet","Mobile"];
    
    const option: echarts.EChartsOption = {
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    data: TxTypes,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: device_types,
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0.4,
    max: 0.45,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%'
  },
  series:[
    {
      name:'Punch Card',
      type:'heatmap',
      data: data,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
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