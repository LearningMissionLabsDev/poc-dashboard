import * as React from "react";
import { Box } from "@mui/material";
import Chart from "react-apexcharts";
import type { ChartConfig } from "../../types/chart";

const DEMO = [
  { x: "Bumper", y: 25 },
  { x: "Brake Pad", y: 18 },
  { x: "Headlight", y: 12 },
  { x: "Mirror", y: 9 },
];

type Props = {
  config: ChartConfig;
  height?: number | string;
  onClose?: () => void;
  showClose?: boolean;
};

export default function NeonAreaChartApex({
  config,
  height = 400,
}: Props) {
  const xKey = config?.x ?? "x";
  const yKey = Array.isArray(config?.y) ? config.y[0] : config?.y ?? "y";

 // --- Normalize Data (with progressive ordering)
const rows = React.useMemo(() => {
  const src =
    Array.isArray(config?.data) && config.data.length > 0
      ? config.data
      : DEMO;

  const normalized = src.map((r: any) => ({
    x: r?.[xKey] ?? r?.x,
    y: Number(r?.[yKey] ?? r?.y ?? 0),
  }));

  // ✅ Sort ascending (progress direction)
  return normalized.sort((a, b) => a.y - b.y);
}, [config, xKey, yKey]);

  const categories = rows.map((r) => r.x);
  const yValues = rows.map((r) => r.y);

  const series = [
    {
      name: yKey,
      data: yValues,
    },
  ];

  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const pad = Math.max(0.02 * (yMax - yMin || 1), 0.05);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 400 },
    },
    stroke: { curve: "smooth", width: 3, colors: ["#FB923C"] },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories,
      labels: { style: { colors: "#4B5563", fontSize: "12px" } },
      axisBorder: { color: "rgba(0,0,0,0.15)" },
      axisTicks: { color: "rgba(0,0,0,0.15)" },
    },
    yaxis: {
      min: yMin - pad,
      max: yMax + pad,
      labels: { style: { colors: "#4B5563", fontSize: "12px" } },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
      colors: ["#FB923C"],
    },
    grid: {
      borderColor: "rgba(0,0,0,0.08)",
      row: { colors: ["#f9f9f9", "transparent"], opacity: 0.5 },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => val.toFixed(1) },
    },
    title: {
      text: "Progress Area Chart",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#1E293B",
        fontWeight: 600,
      },
    },
    colors: ["#FB923C"],
  };

  return (
       <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 3,
        p: 2,
        color: "#111827",
        overflow: "hidden",
      }}
    >
      <Chart
        options={options}
        series={series}
        type="area"
        width="100%"
        height="100%"
      />
    </Box>
  );
}