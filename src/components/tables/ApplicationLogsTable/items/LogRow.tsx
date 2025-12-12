// LogRow.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { getEventIcon, formatDate } from "../helpers/helpers";

interface LogRowProps {
  log: any;
}

export const LogRow: React.FC<LogRowProps> = ({ log }) => {
  const theme = useTheme();
  const json = JSON.stringify(log.data, null, 2);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { md: "160px 1fr", lg: "165px 1fr", xl: "180px 1fr" },
        alignItems: "flex-start",
        gap: 1,
        mb: 2,
      }}
    >
      {/* Timestamp */}
      <Typography
        sx={{
          ...theme.typography.body2,
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

      {/* Accordion */}
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
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {getEventIcon(log)}
            <Box>
              <Typography
                sx={{
                  ...theme.typography.body2,
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 600,
                  color: "#000000CC",
                }}
              >
                {log.event}
              </Typography>
              <Typography
                sx={{
                  ...theme.typography.body2,
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 400,
                  color: "#000000CC",
                  lineHeight: 1.4,
                }}
              >
                {log.description}
              </Typography>
            </Box>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ backgroundColor: "#fff", px: 0, pt: 0, pb: 3 }}>
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
                ...theme.typography.body1,
                borderRadius: 8,
                padding: "16px",
                maxHeight: 350,
                margin: 0,
                overflow: "auto",
                background: "#F8FAFC",
              }}
            >
              {json}
            </SyntaxHighlighter>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};