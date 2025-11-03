import * as React from "react";
import { Box } from "@mui/material";
import Chart from "react-apexcharts";
import type { ChartConfig } from "../../types/chart";

const DEMO = [
  { x: "A-8382-K8", y: 1 },
  { x: "B-8186-M1", y: 0.8 },
  { x: "B-9573-L4", y: 0.5 },
  { x: "B-7906-K2", y: 0.2 },
];

type Props = {
  config: ChartConfig;
  height?: number | string;
  onClose?: () => void;
  showClose?: boolean;
};

export default function NeonLineChartApex({
  config,
  height = "100%",
}: Props) {
  const xKey = config?.x ?? "x";
  const yKey = Array.isArray(config?.y) ? config.y[0] : config?.y ?? "y";

  // --- 1) Map raw rows
  const baseRows = React.useMemo(() => {
    const src = Array.isArray(config?.data) && config.data.length ? config.data : DEMO;
    return src.map((r: any) => ({
      x: r?.[xKey] ?? r?.x,
      y: r?.[yKey] ?? r?.y,
    }));
  }, [config, xKey, yKey]);

  // --- 2) Progress-only transform: flip if descending, then running max
  const rows = React.useMemo(() => {
    if (baseRows.length === 0) return baseRows;

    const ys = baseRows.map(r => Number(r.y) || 0);
    const first = ys[0];
    const last = ys[ys.length - 1];
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Flip if overall trend is down, so progress goes up visually
    const flip = last < first;
    const flipped = baseRows.map(r => ({
      x: r.x,
      y: flip ? (maxY - Number(r.y) + minY) : Number(r.y),
    }));

    // Enforce non-decreasing by taking a running max
    const monotone: typeof flipped = [];
    for (let i = 0; i < flipped.length; i++) {
      const prev = i === 0 ? -Infinity : monotone[i - 1].y;
      monotone.push({ x: flipped[i].x, y: Math.max(prev, flipped[i].y) });
    }

    return monotone;
  }, [baseRows]);

  const categories = rows.map(r => r.x);
  const yValues = rows.map(r => r.y);
  const series = [{ name: yKey, data: yValues }];

  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const pad = Math.max(0.02 * (yMax - yMin || 1), 0.05);

  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, animations: { enabled: true, speed: 400 } },
    stroke: { curve: "straight", width: 4, colors: ["#FB923C"] }, // sharp corners, orange
    markers: { size: 0 }, // no dots
    dataLabels: { enabled: false },
    grid: { borderColor: "rgba(0,0,0,0.08)", row: { colors: ["#f9f9f9", "transparent"], opacity: 0.5 } },
    xaxis: {
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
    tooltip: { theme: "light", y: { formatter: (val: number) => Number(val).toFixed(2) } },
    title: { text: "Progress Line Chart", align: "left", style: { fontSize: "16px", color: "#1E293B", fontWeight: 600 } },
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
      <Chart options={options} series={series} type="line" height="100%" />
    </Box>
  );
}