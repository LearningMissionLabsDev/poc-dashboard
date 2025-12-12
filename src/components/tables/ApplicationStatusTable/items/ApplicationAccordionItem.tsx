// src/components/tables/ApplicationStatusTable/ApplicationAccordionItem.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Stack,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FileDown } from "lucide-react";
import type { SectionItem } from "../types";
import { getConfidenceColor } from "../utils";

interface Props {
  item: SectionItem;
}

const ApplicationAccordionItem: React.FC<Props> = ({ item }) => {
  const theme = useTheme();

  const numericConfidence =
    typeof item.confidence === "string"
      ? parseInt(item.confidence) || 0
      : item.confidence ?? 0;

  const hasPrice = item.price !== undefined && item.price !== null;

  // Chip label: price wins; otherwise confidence
  const chipLabel = hasPrice ? item.price : item.confidence;

  // Chip colors:
  // - if we're displaying confidence -> use confidence colors
  // - if price -> neutral gray chip
  const confidenceColors = getConfidenceColor(numericConfidence);
  const chipColors = hasPrice
    ? { bg: "#F3F4F6", border: "#9c9c9cff" }
    : { bg: confidenceColors.bg, border: confidenceColors.text };

  return (
    <Accordion
      sx={{
        mb: 2,
        border: "1px solid #E5E7EB",
        borderRadius: "8px !important",
        "&:before": { display: "none" },
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#6B7280" }} />}
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          "& .MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {item.icon}
          <Box>
            <Typography
              sx={{
                ...theme.typography.body2,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 600,
                color: "#000000CC",
              }}
            >
              {item.title}
            </Typography>
            {item.description && (
              <Typography
                sx={{
                  ...theme.typography.body2,
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 400,
                  color: "#000000CC",
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </Typography>
            )}
          </Box>
        </Stack>

        {chipLabel && (
          <Chip
            label={chipLabel}
            size="small"
            sx={{
              ...theme.typography.body2,
              fontFamily: "Poppins,sans-serif",
              backgroundColor: chipColors.bg,
              border: `1px solid ${chipColors.border}`,
              color: "#000000CC",
              fontWeight: 400,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.1,
            }}
          />
        )}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          backgroundColor: "#FFFFFF",
          pt: 0,
        }}
      >
        {/* Download button (BankStatement, W2, etc.) */}
        {item.downloadUrl && (
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <Button
              startIcon={<FileDown size={18} color="#FFFFFF" />}
              variant="contained"
              size="small"
              component="a"
              href={item.downloadUrl}
              download
              target="_blank"
              sx={{
                ...theme.typography.body2,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 500,
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "8px",
                backgroundColor: "#DC2626",
                "&:hover": {
                  backgroundColor: "#B91C1C",
                  boxShadow: "none",
                },
              }}
            >
              Download PDF
            </Button>
          </Box>
        )}

        {/* Details list (BankStatement, W2, FACTA, OFAC, etc.) */}
        {item.details?.map((d, k) => (
          <Box key={k}>
            <Typography
              sx={{
                ...theme.typography.body2,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 400,
                color: "#000000CC",
                display: "inline",
              }}
              component="span"
            >
              {d.label}:{" "}
            </Typography>
            <Typography
              sx={{
                ...theme.typography.body2,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 400,
                color: "#000000CC",
                display: "inline",
              }}
              component="span"
            >
              {Array.isArray(d.value) ? d.value.join(", ") : d.value}
            </Typography>
          </Box>
        ))}

        {/* Chips (Zillow, RentCast, BlackKnight, etc.) */}
        {item.chips && item.chips.length > 0 && (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ mt: item.details?.length ? 2 : 0, pt: 0 }}
          >
            {item.chips.map((chip, k) => (
              <Box
                key={k}
                sx={{
                  ...theme.typography.body2,
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.5,
                  color: "#000000CC",
                  justifyContent: "center",
                  lineHeight: 1.1,
                }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </Box>
            ))}
          </Stack>
        )}

        {/* Links (Zillow) */}
        {item.links && item.links.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            {item.links.map((link, idx) => (
              <Button
                key={idx}
                href={link.href}
                target="_blank"
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  fontFamily: "Poppins,sans-serif",
                  fontSize: "0.8rem",
                  px: 0,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ApplicationAccordionItem;