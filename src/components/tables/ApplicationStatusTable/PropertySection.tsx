// src/components/tables/ApplicationStatusTable/PropertySection.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  Home,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  User,
} from "lucide-react";
import type { SectionItem } from "./types";
import { buildPropertyItems } from "./data/property";
import BlackKnightAccordionItem from "./items/BlackKnightAccordionItem";
import ZillowAccordionItem from "./items/ZillowAccordionItem";
import RentCastAccordionItem from "./items/RentCastAccordionItem";

interface PropertySectionProps {
  property: any;
  highestEstimate?: number;
}

const PropertySection: React.FC<PropertySectionProps> = ({
  property,
  highestEstimate,
}) => {
  const theme = useTheme();

  const items: SectionItem[] = buildPropertyItems(property);
  const [blackKnight, zillow, rentCast] = items;

  // 🔹 Black Knight icons
  if (blackKnight) {
    blackKnight.icon = <Building2 size={28} color="#5B21B6" />;

    const blackKnightChipIcons = [
      <MapPin size={16} style={{ color: "#0369A1" }} />,
    ];

    blackKnight.chips?.forEach((chip, index) => {
      if (blackKnightChipIcons[index]) {
        chip.icon = blackKnightChipIcons[index];
      }
    });
  }

  // 🔹 Zillow icons
  if (zillow) {
    zillow.icon = <Home size={28} color="#5B21B6" />;

    const zillowChipIcons = [
      <MapPin size={16} style={{ color: "#0369A1" }} />,
      <Bath size={16} style={{ color: "#6B21A8" }} />,
      <BedDouble size={16} style={{ color: "#6B21A8" }} />,
      <Ruler size={16} style={{ color: "#9D174D" }} />,
    ];

    zillow.chips?.forEach((chip, index) => {
      if (zillowChipIcons[index]) {
        chip.icon = zillowChipIcons[index];
      }
    });
  }

  // 🔹 RentCast icons
  if (rentCast) {
    rentCast.icon = <Building2 size={28} color="#5B21B6" />;

    const rentCastChipIcons = [
      <MapPin size={16} style={{ color: "#0369A1" }} />,
      <User size={16} style={{ color: "#1D4ED8" }} />,
      <Bath size={16} style={{ color: "#6B21A8" }} />,
      <BedDouble size={16} style={{ color: "#6B21A8" }} />,
      <Ruler size={16} style={{ color: "#9D174D" }} />,
    ];

    rentCast.chips?.forEach((chip, index) => {
      if (rentCastChipIcons[index]) {
        chip.icon = rentCastChipIcons[index];
      }
    });
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          backgroundColor: "#F5F9FF",
          borderRadius: "6px",
          px: 1.5,
          py: 0.7,
          my: 2,
        }}
      >
        <Typography
          sx={{
            ...theme.typography.body2,
            fontFamily: "Poppins,sans-serif",
            fontWeight: 600,
            color: "#000000",
            fontSize: "0.9rem",
            letterSpacing: "0.2px",
          }}
        >
          Property
        </Typography>
      </Box>

      {blackKnight && (
        <BlackKnightAccordionItem
          item={blackKnight}
          highestEstimate={highestEstimate}
        />
      )}

      {zillow && (
        <ZillowAccordionItem
          item={zillow}
          highestEstimate={highestEstimate}
        />
      )}

      {rentCast && (
        <RentCastAccordionItem
          item={rentCast}
          highestEstimate={highestEstimate}
        />
      )}
    </Box>
  );
};

export default PropertySection;