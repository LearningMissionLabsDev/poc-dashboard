// import * as React from "react";
// import { Box } from "@mui/material";
// import type { ChartConfig, ChartType } from "../types/chart";
// import { renderChart } from "./ChartTypes";
// import ChartShell from "./ChartShell";

// type ChartTypeNoPie = Exclude<ChartType, "pie">;

// const ORDER: readonly ChartTypeNoPie[] = ["area", "pie", "line"] as const;

// function spanMd(type: ChartTypeNoPie): 6 | 12 {
//   switch (type) {
//     case "area":
//     case "line":
//       return 12;
//     case "pie":
//     default:
//       return 6;
//   }
// }

// type MultiChartRendererProps = {
//   config: ChartConfig;
//   onClose: (chartType: ChartTypeNoPie) => void;
// };

// export default function MultiChartRenderer({
//   config,
//   onClose,
// }: MultiChartRendererProps) {
//   const types = React.useMemo<ChartTypeNoPie[]>(() => {
//     const filtered = (config.possible_charts ?? []).filter(
//       (t): t is ChartTypeNoPie => t !== "pie"
//     );

//     const set = new Set<ChartTypeNoPie>(filtered);
//     const ordered = ORDER.filter((t) => set.has(t));
//     const leftovers = filtered.filter((t) => !ORDER.includes(t));

//     return [...ordered, ...leftovers];
//   }, [config.possible_charts]);

//   return (
// <Box
//   sx={{
//     display: "grid",
//     gap: { xs: 2, md: 8 },
//     gridTemplateColumns: {
//       xs: "1fr",
//       sm: "repeat(2, minmax(0, 1fr))",
//       md: "repeat(12, minmax(0, 1fr))",
//     },
//     alignItems: "stretch",
//     width: "100%", // ✅ make the entire grid span full container width
//   }}
// >
//       {types.map((type) => {
//         const mdCols = spanMd(type);
//         return (
// <Box
//   key={type}
//   sx={{
//     gridColumn: {
//       xs: "1 / -1",
//       sm: mdCols >= 12 ? "1 / -1" : "span 1",
//       md: `span ${mdCols}`,
//     },
//     display: "flex",
//     flexDirection: "column",
//     minWidth: 0,
//     width: "100%", // ✅ ensure full width per column
//   }}
// >
//             <ChartShell>
// <Box
//   sx={{
//     flex: 1,
//     width: "100%", // ✅ ensures chart fills horizontally
//     height: { xs: 340, md: 460 }, // ⬆️ slightly taller default
//     minHeight: 300,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   }}
// >
//                 {renderChart(type, config, { onClose: () => onClose(type) })}
//               </Box>
//             </ChartShell>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// }
import * as React from "react";
import { Box } from "@mui/material";
import type { ChartConfig, ChartType } from "../types/chart";
import { renderChart } from "./ChartTypes";
import ChartShell from "./ChartShell";

// ✅ We keep all three chart types here
const ORDER: readonly ChartType[] = ["area", "line", "pie"] as const;

// Responsive grid width setup per chart type
function spanMd(type: ChartType): 6 | 12 {
  switch (type) {
    case "area":
    case "line":
      return 12; // wide full-width layout
    case "pie":
    default:
      return 6; // half-width layout for smaller pie charts
  }
}

type MultiChartRendererProps = {
  config: ChartConfig;
  onClose: (chartType: ChartType) => void;
};

export default function MultiChartRenderer({
  config,
  onClose,
}: MultiChartRendererProps) {
  const types = React.useMemo<ChartType[]>(() => {
    const rawTypes = config?.possible_charts ?? [];

    // ✅ filter only supported chart types
    const valid: ChartType[] = rawTypes.filter((t): t is ChartType =>
      ORDER.includes(t as ChartType)
    );

    // ✅ keep defined order first, others next (if any)
    const ordered = ORDER.filter((t) => valid.includes(t));
    const leftovers = valid.filter((t) => !ORDER.includes(t));

    return [...ordered, ...leftovers];
  }, [config.possible_charts]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, md: 8 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(12, minmax(0, 1fr))",
        },
        alignItems: "stretch",
        width: "100%", // ✅ make the entire grid span full container width
      }}
    >
      {types.map((type) => {
        const mdCols = spanMd(type);
        return (
          <Box
            key={type}
            sx={{
              gridColumn: {
                xs: "1 / -1",
                sm: mdCols >= 12 ? "1 / -1" : "span 1",
                md: `span ${mdCols}`,
              },
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              width: "100%", // ✅ ensure full width per column
            }}
          >
            <ChartShell>
              <Box
                sx={{
                  flex: 1,
                  width: "100%", // ✅ ensures chart fills horizontally
                  height: { xs: 340, md: 460 }, // ⬆️ slightly taller default
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderChart(type, config, { onClose: () => onClose(type) })}
              </Box>
            </ChartShell>
          </Box>
        );
      })}
    </Box>
  );
}