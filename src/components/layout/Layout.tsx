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
          minWidth: 0,   // ✅ prevents DataGrid from pushing layout
          backgroundColor: "#F5F9FF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          overflow: "hidden", // ✅ stop global scroll-x
          transition: "padding-left .3s ease",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;