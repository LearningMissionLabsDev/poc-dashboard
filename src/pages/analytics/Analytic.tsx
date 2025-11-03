// import * as React from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Box, Card, CardHeader, CardContent,
//   Typography, Stack, Button, Divider, Alert
// } from "@mui/material";
// import { alpha } from "@mui/material/styles";
// import MultiChartRenderer from "../charts/MultiChartRenderer";
// import type { ChartConfig } from "../types/chart";
// import PieChartRenderer from "../charts/renderers/PieChartRenderer";

// type AnalyticsEventDetail = {
//   question: string;
//   cypher?: string;
//   config: Partial<ChartConfig> & { data?: any[] };
// };

// function normalizeConfig(cfg: Partial<ChartConfig>): ChartConfig {
//   const rows = Array.isArray(cfg.data) ? cfg.data : [];

//   let x = (cfg as any).x as string | undefined;
//   let y = (cfg as any).y as string | string[] | undefined;

//   if (!x || !y) {
//     const first = rows[0] ?? {};
//     const keys = Object.keys(first);
//     x = x || (keys.includes("x") ? "x" : keys[0]);
//     if (!y) {
//       if (keys.includes("y")) y = "y";
//       else {
//         const numericKeys = keys.filter(k => typeof (first as any)[k] === "number");
//         y = numericKeys.length > 1 ? numericKeys.slice(0, 2)
//           : (numericKeys[0] || keys.find(k => k !== x) || keys[1] || keys[0]);
//       }
//     }
//   }

//   const sampleX = rows[0]?.[x!];
//   const isDateish =
//     typeof sampleX === "string" &&
//     (sampleX.includes("-") || sampleX.includes("/") || sampleX.length === 10 || sampleX.length === 7);

//   const hasYArray = Array.isArray(y);
//   const fallbackTypes: ChartConfig["possible_charts"] =
//     hasYArray
//       ? ["line", "wave_bar"]
//       : isDateish
//         ? ["line"]
//         : ["donut", "wave_bar"];

//   const sortedRows = [...rows];
//   if (isDateish) {
//     try { sortedRows.sort((a, b) => new Date(a[x!]).getTime() - new Date(b[x!]).getTime()); } catch { }
//   }

//   return {
//     x: x as string,
//     y: y as any,
//     possible_charts: (cfg.possible_charts?.length ? cfg.possible_charts : fallbackTypes) as ChartConfig["possible_charts"],
//     data: sortedRows,
//   };
// }

// function validateConfig(cfg: ChartConfig): string | null {
//   if (!cfg) return "Missing config.";
//   if (!cfg.x) return "Config is missing 'x' field.";
//   if (!cfg.y) return "Config is missing 'y' field(s).";
//   if (!Array.isArray(cfg.data)) return "'data' must be an array.";
//   if (cfg.data.length > 0) {
//     const hasX = cfg.data.every((row) => Object.prototype.hasOwnProperty.call(row, cfg.x));
//     if (!hasX) return `Some rows are missing x='${cfg.x}' field.`;
//     const yKeys = Array.isArray(cfg.y) ? cfg.y : [cfg.y];
//     for (const yKey of yKeys) {
//       const hasY = cfg.data.every((row) => Object.prototype.hasOwnProperty.call(row, yKey as string));
//       if (!hasY) return `Some rows are missing y='${yKey}' field.`;
//     }
//   }
//   return null;
// }

// function pickNoPieFallback(cfg: ChartConfig): ChartConfig["possible_charts"] {
//   const rows = Array.isArray(cfg.data) ? cfg.data : [];
//   const first = rows[0] ?? {};
//   const x = cfg.x || Object.keys(first)[0];
//   const y = cfg.y;

//   const sampleX = rows[0]?.[x as string];
//   const isDateish =
//     typeof sampleX === "string" &&
//     (sampleX.includes("-") || sampleX.includes("/") || sampleX.length === 10 || sampleX.length === 7);

//   if (Array.isArray(y) && rows.length === 1) return ["donut", "wave_bar", "line"];
//   if (isDateish) return ["line", "wave_bar", "donut"];
//   return ["wave_bar", "donut", "line"];
// }

// export default function Analytic() {
//   const { state } = useLocation() as { state?: AnalyticsEventDetail | null };
//   const [isAnyChartVisible, setIsAnyChartVisible] = React.useState(true);

//   let live: AnalyticsEventDetail | null = state ?? null;
//   if (!live) {
//     try {
//       const cached = sessionStorage.getItem("tirus_analytics_last");
//       if (cached) live = JSON.parse(cached) as AnalyticsEventDetail;
//     } catch { }
//   }

//   const normalized = React.useMemo(
//     () => (live?.config ? normalizeConfig(live.config) : null),
//     [live]
//   );
//   const error = React.useMemo(
//     () => (normalized ? validateConfig(normalized) : null),
//     [normalized]
//   );

//   const liveNoPie: ChartConfig | null = React.useMemo(() => {
//     if (!normalized) return null;
//     const asked = normalized.possible_charts ?? [];
//     const filtered = asked.filter((c) => c !== "pie") as ChartConfig["possible_charts"];
//     const next = filtered.length ? filtered : pickNoPieFallback(normalized);
//     return { ...normalized, possible_charts: next };
//   }, [normalized]);

//   const designConfig: ChartConfig = {
//     x: "name",
//     y: "value",
//     possible_charts: ["pie"],
//     data: [],
//   };

//   const handleCloseChart = (chartType: string) => {
//     sessionStorage.removeItem(`${chartType}_data`);

//     setVisibleCharts((prev) => prev.filter((type) => type !== chartType));

//     if (visibleCharts.length === 1) {
//       sessionStorage.setItem("chartsVisible", "false");
//     }
//   };

//   const [visibleCharts, setVisibleCharts] = React.useState<ChartConfig["possible_charts"]>([]);

//   React.useEffect(() => {
//     if (live?.config?.possible_charts) {
//       setVisibleCharts(live.config.possible_charts);
//     }
//   }, [live?.config]);

//   const effectiveConfig: ChartConfig | null = liveNoPie
//     ? { ...liveNoPie, possible_charts: visibleCharts }
//     : designConfig;

//   const handleDownload = React.useCallback(() => {
//     if (!effectiveConfig) return;
//     const blob = new Blob([JSON.stringify(effectiveConfig, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "analytics_config.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   }, [effectiveConfig]);

//   React.useEffect(() => {
//     setIsAnyChartVisible(visibleCharts.length > 0);
//   }, [visibleCharts]);

//   const handleClear = React.useCallback(() => {
//     try { sessionStorage.removeItem("tirus_analytics_last"); } catch { }
//     window.history.replaceState({}, "", window.location.pathname);
//     window.location.reload();
//   }, []);

//   const bgStart = "#0B0A1A";
//   const bgMid = "#121129";
//   const bgEnd = "#1B1942";
//   const ring = "rgba(255,255,255,0.18)";
//   const textPri = "#FFFFFF";

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         p: { xs: 2, md: 3 },
//         background: `radial-gradient(1200px 600px at 10% -10%, ${alpha("#6A5AE0", 0.22)} 0%, transparent 60%),
//                      radial-gradient(900px 500px at 90% 0%, ${alpha("#6A5AE0", 0.18)} 0%, transparent 60%),
//                      linear-gradient(160deg, ${bgStart} 0%, ${bgMid} 45%, ${bgEnd} 100%)`,
//       }}
//     >
//       <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 1 }}>
//         <Box>
//           <Typography variant="h4" fontWeight={700} sx={{ color: textPri, letterSpacing: 0.3 }}>
//             Analytics
//           </Typography>
//         </Box>
//       </Stack>

//       {normalized && error && (
//         <Alert severity="warning" variant="filled" sx={{ bgcolor: alpha("#FFB020", 0.25), color: textPri, mb: 1 }}>
//           {error}
//         </Alert>
//       )}

//       <Divider sx={{ borderColor: alpha("#FFFFFF", 0.12), my: 1 }} />

//       <Box sx={{ p: { xs: 1, md: 3 } }}>
//         <Box sx={{ width: "100%", height: { xs: 260, md: 340 } }}>
//           <PieChartRenderer agenticTimeMin={63} agenticCost={5.79} humanPayRate={22} />
//         </Box>
//       </Box>

//       <Box sx={{ px: { xs: 1, md: 2 }, py: { xs: 2, md: 4 } }}>
//         <Card
//           sx={{
//             width: "100%",
//             background: `linear-gradient(180deg, ${alpha("#FFFFFF", 0.06)}, ${alpha("#FFFFFF", 0.03)})`,
//             borderRadius: 3,
//             border: `1px solid ${ring}`,
//             backdropFilter: "blur(8px)",
//             boxShadow: `0 12px 50px ${alpha("#000", 0.35)}`,
//             overflow: "hidden",
//           }}
//         >
//           <CardHeader
//             title={
//               isAnyChartVisible ? (
//                 <Box>
//                   {live?.question && (
//                     <Typography variant="body2" sx={{ mt: 1, color: textPri }}>
//                       <b>Q:</b> {live.question}
//                     </Typography>
//                   )}
//                   {/* {live?.cypher && (
//                   <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: textSec }}>
//                     Cypher: {live.cypher}
//                   </Typography>
//                 )} */}
//                 </Box>
//               ) : (
//                 <Typography variant="h6" sx={{ color: textPri, fontWeight: 700 }}>
//                   Ask the AI and get charts generated in real time.
//                 </Typography>
//               )
//             }
//             sx={{
//               borderBottom: `1px solid ${alpha("#FFFFFF", 0.08)}`,
//               px: { xs: 2, md: 3 },
//               py: 2,
//             }}
//             action={
//               <Stack direction="row" spacing={2} justifyContent="flex-start">
//                 <Button
//                   variant="outlined"
//                   onClick={handleClear}
//                   sx={{
//                     color: textPri,
//                     borderColor: ring,
//                     "&:hover": { borderColor: alpha("#FFFFFF", 0.35), background: alpha("#FFFFFF", 0.06) },
//                     "&.Mui-disabled": {
//                       backgroundColor: alpha("#8B7CFF", 0.25),
//                       borderColor: alpha("#8B7CFF", 0.4),
//                       color: alpha("#FFFFFF", 0.5),
//                     },
//                   }}
//                   disabled={!live?.question}
//                 >
//                   CLEAR
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleDownload}
//                   sx={{
//                     bgcolor: alpha("#8B7CFF", 0.28),
//                     color: textPri,
//                     border: `1px solid ${ring}`,
//                     backdropFilter: "blur(6px)",
//                     boxShadow: `0 1px 40px ${alpha("#8B7CFF", 0.25)}`,
//                     "&:hover": { bgcolor: alpha("#8B7CFF", 0.3), boxShadow: `0 1px 30px ${alpha("#8B7CFF", 0.25)}` },
//                     "&.Mui-disabled": {
//                       bgcolor: alpha("#8B7CFF", 0.25),
//                       color: alpha("#FFFFFF", 0.5),
//                     },
//                   }}
//                   disabled={!live?.question}
//                 >
//                   Download JSON
//                 </Button>
//               </Stack>
//             }
//           />
//           <CardContent sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
//             <MultiChartRenderer config={effectiveConfig} onClose={handleCloseChart} />
//           </CardContent>
//         </Card>
//       </Box>
//     </Box>
//   );
// }

import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import MultiChartRenderer from "../charts/MultiChartRenderer";
import type { ChartConfig } from "../types/chart";
import PieChartRenderer from "../charts/renderers/PieChartRenderer";

/* ---------------------- Types ---------------------- */
type AnalyticsEventDetail = {
  question: string;
  cypher?: string;
  config: Partial<ChartConfig> & { data?: any[] };
};

/* ---------------------- Helpers ---------------------- */
function normalizeConfig(cfg: Partial<ChartConfig>): ChartConfig {
  const rows = Array.isArray(cfg.data) ? cfg.data : [];
  let x = (cfg as any).x as string | undefined;
  let y = (cfg as any).y as string | string[] | undefined;

  if (!x || !y) {
    const first = rows[0] ?? {};
    const keys = Object.keys(first);
    x = x || (keys.includes("x") ? "x" : keys[0]);
    if (!y) {
      if (keys.includes("y")) y = "y";
      else {
        const numericKeys = keys.filter((k) => typeof (first as any)[k] === "number");
        y =
          numericKeys.length > 1
            ? numericKeys.slice(0, 2)
            : numericKeys[0] || keys.find((k) => k !== x) || keys[1] || keys[0];
      }
    }
  }

  const sampleX = rows[0]?.[x!];
  const isDateish =
    typeof sampleX === "string" &&
    (sampleX.includes("-") ||
      sampleX.includes("/") ||
      sampleX.length === 10 ||
      sampleX.length === 7);

  const hasYArray = Array.isArray(y);
  const fallbackTypes: ChartConfig["possible_charts"] = hasYArray
    ? ["line", "wave_bar"]
    : isDateish
    ? ["line"]
    : ["donut", "wave_bar"];

  const sortedRows = [...rows];
  if (isDateish) {
    try {
      sortedRows.sort(
        (a, b) => new Date(a[x!]).getTime() - new Date(b[x!]).getTime()
      );
    } catch {}
  }

  return {
    x: x as string,
    y: y as any,
    possible_charts: cfg.possible_charts?.length
      ? cfg.possible_charts
      : fallbackTypes,
    data: sortedRows,
  };
}

function validateConfig(cfg: ChartConfig): string | null {
  if (!cfg) return "Missing config.";
  if (!cfg.x) return "Config is missing 'x' field.";
  if (!cfg.y) return "Config is missing 'y' field(s).";
  if (!Array.isArray(cfg.data)) return "'data' must be an array.";
  if (cfg.data.length > 0) {
    const hasX = cfg.data.every((r) => Object.prototype.hasOwnProperty.call(r, cfg.x));
    if (!hasX) return `Some rows are missing x='${cfg.x}' field.`;
    const yKeys = Array.isArray(cfg.y) ? cfg.y : [cfg.y];
    for (const yKey of yKeys) {
      const hasY = cfg.data.every((r) =>
        Object.prototype.hasOwnProperty.call(r, yKey as string)
      );
      if (!hasY) return `Some rows are missing y='${yKey}' field.`;
    }
  }
  return null;
}

/* ---------------------- Component ---------------------- */
export default function Analytic() {
  const theme = useTheme();
  const { state } = useLocation() as { state?: AnalyticsEventDetail | null };
  const [visibleCharts, setVisibleCharts] = React.useState<
    ChartConfig["possible_charts"]
  >([]);
  const [isAnyChartVisible, setIsAnyChartVisible] = React.useState(true);

  let live: AnalyticsEventDetail | null = state ?? null;
  if (!live) {
    try {
      const cached = sessionStorage.getItem("tirus_analytics_last");
      if (cached) live = JSON.parse(cached) as AnalyticsEventDetail;
    } catch {}
  }

  const normalized = React.useMemo(
    () => (live?.config ? normalizeConfig(live.config) : null),
    [live]
  );
  const error = React.useMemo(
    () => (normalized ? validateConfig(normalized) : null),
    [normalized]
  );

  const handleCloseChart = (chartType: string) => {
    sessionStorage.removeItem(`${chartType}_data`);
    setVisibleCharts((prev) => prev.filter((type) => type !== chartType));
  };

  const effectiveConfig: ChartConfig | null = normalized
    ? { ...normalized, possible_charts: visibleCharts }
    : { x: "name", y: "value", possible_charts: ["pie"], data: [] };

  const handleDownload = React.useCallback(() => {
    if (!effectiveConfig) return;
    const blob = new Blob([JSON.stringify(effectiveConfig, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics_config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [effectiveConfig]);

  const handleClear = React.useCallback(() => {
    try {
      sessionStorage.removeItem("tirus_analytics_last");
    } catch {}
    window.history.replaceState({}, "", window.location.pathname);
    window.location.reload();
  }, []);

  React.useEffect(() => {
    if (live?.config?.possible_charts) {
      setVisibleCharts(live.config.possible_charts);
    }
  }, [live?.config]);

  React.useEffect(() => {
    setIsAnyChartVisible(visibleCharts.length > 0);
  }, [visibleCharts]);

  /* ---------------------- UI ---------------------- */
  return (
    <Box
      sx={{
       minHeight: "100vh",
      p: { xs: 2, md: 3 },
      backgroundColor: "#F5F9FF",
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ color: "#1A253B", letterSpacing: 0.3 }}
        >
          Analytics
        </Typography>
      </Stack>

      {normalized && error && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            borderColor: alpha(theme.palette.warning.main, 0.4),
            backgroundColor: alpha(theme.palette.warning.light, 0.15),
            color: "#7A4F01",
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Sample Chart */}
       <Box
      sx={{
        display: "flex",
        mb: 4,
        width: "100%",
      }}
    >
      <Box sx={{ width: "fit-content" }}>
        <PieChartRenderer />
      </Box>
    </Box>
      {/* Chart Card */}
     <Card
  sx={{
    width: "100%",
    height: "auto",
    maxHeight: "100%",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 3,
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
  }}
>
  <CardHeader
    title={
      isAnyChartVisible ? (
        <Box>
          {live?.question && (
            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: "#1A253B", fontWeight: 500 }}
            >
              <b>Q:</b> {live.question}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography
          variant="h6"
          sx={{
            color: "#1A253B",
            fontWeight: 600,
            textAlign: "left", // ⬅️ changed from center
          }}
        >
          Ask the AI and get charts generated in real time.
        </Typography>
      )
    }
    action={
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="outlined"
          onClick={handleClear}
          sx={{
            color: "#1A253B",
            borderColor: "rgba(0,0,0,0.25)",
            "&:hover": {
              borderColor: "#6366F1",
              backgroundColor: alpha("#6366F1", 0.08),
            },
          }}
          disabled={!live?.question}
        >
          CLEAR
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={!live?.question}
          sx={{
            backgroundColor: "#4F46E5",
            "&:hover": { backgroundColor: "#4338CA" },
          }}
        >
          DOWNLOAD JSON
        </Button>
      </Stack>
    }
    sx={{
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      px: { xs: 2, md: 3 },
      py: 2,
    }}
  />

  <CardContent
    sx={{
      px: { xs: 2, md: 3 },
      pb: 3,
      textAlign: "left", // ⬅️ also left-aligned content
    }}
  >
    {isAnyChartVisible ? (
      <MultiChartRenderer config={effectiveConfig} onClose={handleCloseChart} />
    ) : (
      <Typography
        sx={{
          color: "#6B7280",
          fontSize: 15,
          fontWeight: 400,
          mt: 1,
        }}
      >
        You can ask things like:{" "}
        <b>“Show applications by month”</b> or{" "}
        <b>“Total processed vs pending”</b>.
      </Typography>
    )}
  </CardContent>
</Card>

    </Box>
  );
}
