import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { LogsFilterBar } from "./items/LogsFilterBar";
import { LogRow } from "./items/LogRow";

export default function ApplicationLogsTable({ data }: any) {
  const theme = useTheme();
  const logs = Array.isArray(data) ? data : data?.logs ?? [];

  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [value, setValue] = useState("all");

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setFilter(newValue);
  };

  const filterLogs = (logs: any[]) => {
    if (filter === "all") return logs;

    const logTime = (ts: string) => new Date(ts);

    switch (filter) {
      case "today": {
        const nowUTC = new Date();
        const startUTC = new Date(
          Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate())
        );
        const endUTC = new Date(
          Date.UTC(
            nowUTC.getUTCFullYear(),
            nowUTC.getUTCMonth(),
            nowUTC.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        return logs.filter((log) => {
          const ts = new Date(log.timestamp);
          return ts >= startUTC && ts <= endUTC;
        });
      }

      case "7days": {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return logs.filter((log) => logTime(log.timestamp) >= sevenDaysAgo);
      }

      case "30days": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return logs.filter((log) => logTime(log.timestamp) >= thirtyDaysAgo);
      }

      case "custom": {
        if (!customStart || !customEnd) return logs;
        return logs.filter(
          (log) =>
            logTime(log.timestamp) >= new Date(customStart) &&
            logTime(log.timestamp) <= new Date(customEnd + "T23:59:59")
        );
      }

      default:
        return logs;
    }
  };

  const visibleLogs = filterLogs(logs);

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
      <LogsFilterBar
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        value={value}
        onTabChange={handleTabChange}
        customStart={customStart}
        customEnd={customEnd}
        onChangeCustomStart={(val) => {
          setCustomStart(val);
          setFilter("custom");
          setValue("custom");
        }}
        onChangeCustomEnd={(val) => {
          setCustomEnd(val);
          setFilter("custom");
          setValue("custom");
        }}
      />

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
              ...theme.typography.body2,
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
        visibleLogs.map((log: any, idx: number) => <LogRow key={idx} log={log} />)
      )}
    </Box>
  );
}