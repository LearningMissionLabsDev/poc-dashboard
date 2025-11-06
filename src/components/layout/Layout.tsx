import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F9FF",
        alignItems: "stretch",
      }}
    >
      <CssBaseline />

      <Sidebar open={open} onToggle={() => setOpen((prev) => !prev)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;