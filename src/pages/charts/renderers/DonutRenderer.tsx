import * as React from "react";
import { Box } from "@mui/material";
import Chart from "react-apexcharts";
import type { ChartConfig } from "../../types/chart";

/* --- Demo fallback data --- */
const DEMO = [
  { x: "Processed", y: 65 },
  { x: "Pending", y: 25 },
  { x: "Failed", y: 10 },
];

type Props = {
  config: ChartConfig;
  height?: number | string;
  onClose?: () => void;
  showClose?: boolean;
};

export default function NeonPieChartApex({
  config,
  height = 500, // 🔸 increased default height
}: Props) {
  const xKey = config?.x ?? "x";
  const yKey = Array.isArray(config?.y) ? config.y[0] : config?.y ?? "y";

  const rows = React.useMemo(() => {
    const src =
      Array.isArray(config?.data) && config.data.length ? config.data : DEMO;
    return src.map((r: any) => ({
      x: r?.[xKey] ?? r?.x,
      y: Number(r?.[yKey] ?? r?.y),
    }));
  }, [config, xKey, yKey]);

  const labels = rows.map((r) => r.x);
  const series = rows.map((r) => r.y);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    labels,
    colors: ["#FB923C", "#FDBA74", "#FCD34D", "#FBBF24", "#F97316"],
    legend: {
      show: true,
      position: "bottom",
      labels: { colors: "#374151" },
      fontSize: "15px",
      fontWeight: 500,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
      style: {
        colors: ["#1E293B"],
        fontSize: "15px",
        fontWeight: 600,
      },
      dropShadow: { enabled: false },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => `${val.toFixed(1)}%` },
    },
    stroke: { colors: ["#fff"], width: 3 },
    plotOptions: {
      pie: {
        expandOnClick: true,
        dataLabels: { offset: -5 },
      },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        p: 3, // 🔸 more padding
        color: "#111827",
        overflow: "hidden",
      }}
    >
      <Chart options={options} series={series} type="pie" width="100%" height="100%" />
    </Box>
  );
}
