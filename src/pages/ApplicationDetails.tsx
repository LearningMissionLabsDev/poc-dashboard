import { useEffect, useState } from "react";
import {
  Box, Typography, Divider, Tabs, Tab, useTheme,
  CircularProgress
} from "@mui/material";
import { useParams } from "react-router-dom";
import ApplicationStatusTable from "../components/tables/ApplicationStatusTable/ApplicationStatusTable";
import ApplicationLogsTable from "../components/tables/ApplicationLogsTable/ApplicationLogsTable";

const API_URL = "https://uai.plat.ai/webhook";

export default function ApplicationDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem("applicationDetailsTab");
    if (savedTab !== null) setTab(Number(savedTab));
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    localStorage.setItem("applicationDetailsTab", String(newValue));
  };

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`${API_URL}/e9e15919-397e-482d-a344-420eccc3d8b9/apps/${id}`, { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`${API_URL}/e9e15919-397e-482d-a344-420eccc3d8b9/app/${id}/log`, { cache: "no-store" });
        const json = await res.json();
        setLogs(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <CircularProgress size={70} thickness={4} />
      </Box>
    );

  if (!data)
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No application data available</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        px: 4,
        pt: 2,
        pb: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* === HEADER === */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography
          sx={{
            ...theme.typography.h5,
            fontFamily: "Poppins,sans-serif",
            fontWeight: 500,
            color: "#1A253B",
            mb: 1,
          }}
        >
          Application {id}
        </Typography>
        <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }} />
      </Box>

      {/* === TABS === */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="inherit"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          mb: 2,
          p: 1.25,
          "& .MuiTabs-flexContainer": {
            gap: 1.5,
          },
        }}
      >
        {["Status", "Logs"].map((label, index) => (
          <Tab
            key={label}
            label={label}
            disableRipple
           sx={{
     ...theme.typography.body2,
     fontFamily: "Poppins,sans-serif",
     fontWeight: 500,
     textTransform: "none",
     minHeight: 10,
     py: 1,
     px: 3,
     borderRadius: "20px",
     border: `1px solid ${tab === index ? "#4C8EF7" : "#c3dbebff"}`,
     backgroundColor: tab === index ? "#4C8EF7" : "#fdfdfdff",
     color: tab === index ? "#FFFFFF" : "#000000",
     "&:hover": {
                backgroundColor: tab === index ? "#4C8EF7" : "#e6edf6ff",
                borderColor: "#4C8EF7",
              },
              transition: "all 0.2s ease-in-out",
            }}
          />
        ))}
      </Tabs>


      {/* === STATUS TAB === */}
      {tab === 0 && <ApplicationStatusTable data={data} />}

      {/* === LOGS TAB === */}
      {tab === 1 && <ApplicationLogsTable data={logs} />}
    </Box>
  );
}