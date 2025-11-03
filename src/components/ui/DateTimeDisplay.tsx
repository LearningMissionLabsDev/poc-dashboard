import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <Box display="flex" alignItems="center">
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, color: "#1a1a1aff", mr: 0.5 }}
      >
        {dateStr}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        {timeStr} EDT
      </Typography>
    </Box>
  );
}