import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Security";
import CallIcon from "@mui/icons-material/Call";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ErrorIcon from "@mui/icons-material/Error";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { JSX } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Filter } from "lucide-react";
import Collapse from "@mui/material/Collapse";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material";

export default function ApplicationLogsTable({ data }: any) {
  const logs = Array.isArray(data) ? data : data?.logs ?? [];
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters(!showFilters);
  const [filter, setFilter] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [value, setValue] = useState("all");
  const theme = useTheme();

  const applyFilter = (f: string) => {
    setFilter(f);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    applyFilter(newValue);
  };

  const filterLogs = (logs: any[]) => {
    if (filter === "all") return logs;

    const now = new Date();
    const logTime = (ts: string) => new Date(ts);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const parseUTC = (ts: string) => {
      // If timestamp has no timezone, force UTC
      if (!ts.endsWith("Z")) ts = ts + "Z";
      return new Date(ts);
    };
    switch (filter) {
      case "today": {
        const nowUTC = new Date(); // current time in UTC implicitly
        const startUTC = new Date(Date.UTC(
          nowUTC.getUTCFullYear(),
          nowUTC.getUTCMonth(),
          nowUTC.getUTCDate()
        ));
        const endUTC = new Date(Date.UTC(
          nowUTC.getUTCFullYear(),
          nowUTC.getUTCMonth(),
          nowUTC.getUTCDate(),
          23, 59, 59, 999
        ));

        return logs.filter(log => {
          const ts = new Date(log.timestamp); // already UTC from DB
          return ts >= startUTC && ts <= endUTC;
        });
      }

      case "7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return logs.filter((log) => logTime(log.timestamp) >= sevenDaysAgo);

      case "30days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return logs.filter((log) => logTime(log.timestamp) >= thirtyDaysAgo);

      case "custom":
        if (!customStart || !customEnd) return logs;
        return logs.filter(
          (log) =>
            logTime(log.timestamp) >= new Date(customStart) &&
            logTime(log.timestamp) <= new Date(customEnd + "T23:59:59")
        );

      default:
        return logs;
    }
  };

  const visibleLogs = filterLogs(logs);

  const formatDate = (ts: string) =>
    ts.replace("T", " ").replace("Z", "").slice(0, 19);

  const EVENT_ICONS: Record<string, JSX.Element> = {
    "application created": <ErrorIcon sx={{ color: "#3B82F6" }} />,
    "document uploaded": <PictureAsPdfIcon sx={{ color: "#DC2626" }} />,
    "book created for borrower": (
      <MenuBookIcon sx={{ color: "#7C3AED" }} />
    ),
    underwriter: <AccountBalanceIcon sx={{ color: "#0EA5E9" }} />,
    borrower: <PersonIcon sx={{ color: "#A855F7" }} />,
    property: <HouseIcon sx={{ color: "#6366F1" }} />,
    facta: <CallIcon sx={{ color: "#F59E0B" }} />,
    ofac: <ShieldIcon sx={{ color: "#10B981" }} />,
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "7days", label: "Last 7 Days" },
    { key: "30days", label: "Last 30 Days" }
  ];

  const getEventIcon = (log: any) => {
    const desc = log?.description?.toLowerCase().trim() || "";
    const evt = log?.event?.toLowerCase().trim() || "";

    // ✅ Exact matches first
    if (EVENT_ICONS[desc]) return EVENT_ICONS[desc];

    // ✅ Keyword-based detection
    if (desc.includes("application")) return EVENT_ICONS["application created"];
    if (desc.includes("book")) return EVENT_ICONS["book created for borrower"];
    if (desc.includes("document")) return EVENT_ICONS["document uploaded"];
    if (desc.includes("property")) return EVENT_ICONS["property"];
    if (desc.includes("ofac")) return EVENT_ICONS["ofac"];
    if (desc.includes("facta")) return EVENT_ICONS["facta"];
    if (desc.includes("underwriter")) return EVENT_ICONS["underwriter"];
    if (desc.includes("borrower")) return EVENT_ICONS["borrower"];

    // ✅ Last fallback → event name
    if (EVENT_ICONS[evt]) return EVENT_ICONS[evt];

    // ✅ Final safety fallback
    return <ErrorIcon sx={{ color: "#9CA3AF" }} />;
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
        p: 3,
        height: "calc(100dvh - 180px)",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#D1D5DB",
          borderRadius: "10px",
        },
      }}
    >
      {/* Filter Toggle Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={toggleFilters}
          startIcon={<Filter size={18} />}
          sx={{
            ...theme.typography.miniBody,
            fontFamily: "Poppins,sans-serif",
            fontWeight: 400,
            borderRadius: "12px",
            textTransform: "none",
            px: 2.8,
            py: 1,
            boxShadow: "none",
            backgroundColor: "#4C8EF7",
            "&:hover": { backgroundColor: "#2563EB" },
            "& svg": { fill: "#fff" },
          }}
        >
          Filter
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box
          sx={{
            mb: 3,
            p: 2.4,
            borderRadius: "14px",
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 2.5,
            transition: "opacity .3s ease",
          }}
        >
          {/* ✅ Quick Filters Left Side */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="primary"
              TabIndicatorProps={{ style: { display: "none" } }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="filter tabs"
              sx={{
                display: "flex",
                alignItems: "center",
                "& .MuiTabs-flexContainer": {
                  gap: 2,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {filterOptions.map((option, index) => (
                <Tab
                  key={option.key}
                  label={option.label}
                  disableRipple
                  value={option.key}
                  sx={{
                    ...theme.typography.miniBody,
                    fontFamily: "Poppins,sans-serif",
                    fontWeight: 400,
                    textTransform: "none",
                    minHeight: 10,
                    py: 1,
                    px: 3,
                    borderRadius: "16px",
                    transition: "all .25s",
                    backgroundColor: value === option.key ? "#4C8EF7" : "#D7E3F3",
                    color: value === option.key ? "#FFFFFF" : "#334155",
                    "&.Mui-selected": { color: "#FFFFFF" },
                    "& .MuiTab-wrapper": { color: "inherit" },
                    "&:hover": {
                      backgroundColor: value === option.key ? "#4C8EF7" : "#C9D8EB",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
          {/* ✅ Date Range Right Side */}
          <Stack direction="row" spacing={1.5}>
            <TextField
              type="date"
              size="small"
              value={customStart}
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  height: "34px", // optional: reduce height if needed
                },
                "& .MuiInputBase-input": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  padding: "6px 10px !important", // reduce extra padding
                },
                "& .MuiInputLabel-root": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                },
                "& input::placeholder": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  opacity: 0.7,
                },
              }}
              onChange={(e) => {
                setCustomStart(e.target.value);
                setFilter("custom");
              }}
            />
            <TextField
              type="date"
              size="small"
              value={customEnd}
              label="End Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  height: "34px",
                },
                "& .MuiInputBase-input": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  padding: "6px 10px !important",
                },
                "& .MuiInputLabel-root": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                },
                "& input::placeholder": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif !important",
                  opacity: 0.7,
                },
              }}
              onChange={(e) => {
                setCustomEnd(e.target.value);
                setFilter("custom");
              }}
            />
          </Stack>
        </Box>
      </Collapse>

      {visibleLogs.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 6,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.miniBody,
              fontFamily: "Poppins,sans-serif",
              fontWeight: 500,
              color: "#64748B",
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            No logs found for the selected date range.
          </Typography>
        </Box>
      ) : (
        visibleLogs.map((log: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              alignItems: "flex-start",
              gap: 1,
              mb: 2,
            }}
          >
            {/* ✅ Timestamp OUTSIDE the accordion */}
            <Typography
              sx={{
                ...theme.typography.miniBody,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 400,
                color: "#000000CC",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              {formatDate(log.timestamp)}
            </Typography>

            {/* ✅ Accordion for event details */}
            <Accordion
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px !important",
                backgroundColor: "#FFFFFF",
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#6B7280" }} />}
                sx={{
                  "& .MuiAccordionSummary-content": {
                    gap: 1.5,
                    alignItems: "center",
                    minHeight: 48,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} >
                  {getEventIcon(log)}
                  <Box>
                    <Typography sx={{
                      ...theme.typography.miniBody,
                      fontFamily: "Poppins,sans-serif",
                      fontWeight: 600,
                      color: "#000000CC",
                    }}>
                      {log.event}
                    </Typography>
                    <Typography sx={{
                      ...theme.typography.miniBody,
                      fontFamily: "Poppins,sans-serif",
                      fontWeight: 400,
                      color: "#000000CC",
                      lineHeight: 1.4,
                    }}>
                      {log.description}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ backgroundColor: "#fff", px: 0, pt: 0, pb: 3, }}>
                {(() => {
                  const json = JSON.stringify(log.data, null, 2);
                  return (
                    <Box sx={{ position: "relative", width: "100%" }}>
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", right: 10, top: 10, zIndex: 2 }}
                        onClick={() => navigator.clipboard.writeText(json)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>

                      <SyntaxHighlighter
                        language="json"
                        wrapLongLines
                        style={atomOneLight}
                        customStyle={{
                          borderRadius: 8,
                          padding: "16px",
                          fontSize: "13px",
                          maxHeight: 350,
                          margin: 0,
                          overflow: "auto",
                          background: "#F8FAFC",
                        }}
                      >
                        {json}
                      </SyntaxHighlighter>
                    </Box>
                  );
                })()}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))
      )}
    </Box>
  )
}; 