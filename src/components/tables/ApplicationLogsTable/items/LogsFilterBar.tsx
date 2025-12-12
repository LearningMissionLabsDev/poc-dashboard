import React from "react";
import { Box, Button, Collapse, Stack, Tab, Tabs, TextField, useTheme } from "@mui/material";
import { Filter } from "lucide-react";
import type { SyntheticEvent } from "react";
import { filterOptions } from "../helpers/helpers";

interface LogsFilterBarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  value: string;
  onTabChange: (event: SyntheticEvent, newValue: string) => void;
  customStart: string;
  customEnd: string;
  onChangeCustomStart: (value: string) => void;
  onChangeCustomEnd: (value: string) => void;
}

export const LogsFilterBar: React.FC<LogsFilterBarProps> = ({
  showFilters,
  onToggleFilters,
  value,
  onTabChange,
  customStart,
  customEnd,
  onChangeCustomStart,
  onChangeCustomEnd,
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Filter Toggle Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={onToggleFilters}
          startIcon={<Filter size={18} />}
          sx={{
            ...theme.typography.body2,
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
          {/* Quick Filters */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Tabs
              value={value}
              onChange={onTabChange}
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
              {filterOptions.map((option) => (
                <Tab
                  key={option.key}
                  label={option.label}
                  disableRipple
                  value={option.key}
                  sx={{
                    ...theme.typography.body2,
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

          {/* Date Range */}
          <Stack direction="row" spacing={1.5}>
            <TextField
              type="date"
              size="small"
              value={customStart}
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  height: "41px",
                },
                "& .MuiInputBase-input": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  padding: "6px 10px !important",
                },
                "& .MuiInputLabel-root": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                },
                "& input::placeholder": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  opacity: 0.7,
                },
              }}
              onChange={(e) => onChangeCustomStart(e.target.value)}
            />
            <TextField
              type="date"
              size="small"
              value={customEnd}
              label="End Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  height: "41px",
                },
                "& .MuiInputBase-input": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  padding: "6px 10px !important",
                },
                "& .MuiInputLabel-root": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                },
                "& input::placeholder": {
                  ...theme.typography.body2,
                  fontFamily: "Poppins, sans-serif !important",
                  opacity: 0.7,
                },
              }}
              onChange={(e) => onChangeCustomEnd(e.target.value)}
            />
          </Stack>
        </Box>
      </Collapse>
    </>
  );
};