import { Box, Typography } from "@mui/material";
import Chart from "react-apexcharts";

type Props = {
  height?: number | string;
  precision?: number;
};

const fmtNum = (n: number) => n.toLocaleString();
const orangePair = ["#FB923C", "#FED7AA"]; // vivid orange + soft peach

export default function NeonDonutApplicationsApex({
  height = 360,
  precision = 1,
}: Props) {
  // 🎲 Random data
  const processed = Math.floor(Math.random() * 8000 + 2000);
  const pending = Math.floor(Math.random() * 2000 + 500);
  const total = processed + pending;
  const pctProcessed = ((processed / total) * 100).toFixed(precision);

  const series = [processed, pending];
  const labels = ["Processed", "Pending"];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    colors: orangePair,
    labels,
    stroke: { colors: ["#fff"], width: 2 },
    legend: {
      position: "bottom",
      labels: { colors: "#374151" },
      fontSize: "13px",
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => fmtNum(val) },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        startAngle: 90,
        endAngle: 450,
        donut: {
          size: "70%",
          labels: { show: false }, // we render our own center text
        },
      },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: 438,
        height: 453,
        backgroundColor: "#fff",
        borderRadius: 3,
        p: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <Typography
        fontWeight={700}
        fontSize={22}
        color="#1E293B"
        textAlign="center"
        sx={{ mb: 1 }}
      >
        Applications
      </Typography>

      {/* 🍩 Donut chart */}
      <Box sx={{ position: "relative", width: "100%", height: height }}>
        <Chart options={options} series={series} type="donut" height="100%" />

        {/* 💬 Custom center label */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            fontWeight={900}
            fontSize={{ xs: 40, sm: 40, md: 48 }}
            color="#1E293B"
            lineHeight={1}
          >
            {pctProcessed}%
          </Typography>
          <Typography fontSize={18} color="#4B5563" mt={1}>
            Processed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
