import * as React from "react";
import { Box } from "@mui/material";

export default function ChartShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        p: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      {children}
    </Box>
  );
}

