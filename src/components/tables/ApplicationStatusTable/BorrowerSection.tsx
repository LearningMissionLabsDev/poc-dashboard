// src/components/tables/ApplicationStatusTable/BorrowerSection.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ShieldCheck, ListChecks } from "lucide-react";
import type { SectionItem } from "./types";
import { buildBorrowerItems } from "./data/borrower";

// 🔽 new imports
import OfacAccordionItem from "./items/OfacAccordionItem";
import FactaAccordionItem from "./items/FactaAccordionItem";

interface BorrowerSectionProps {
  borrower: any;
}

const BorrowerSection: React.FC<BorrowerSectionProps> = ({ borrower }) => {
  const theme = useTheme();

  const items: SectionItem[] = buildBorrowerItems(borrower);
  const [ofacItem, factaItem] = items;

  // inject icons (UI-only)
  if (ofacItem) {
    ofacItem.icon = <ShieldCheck size={28} color="#5B21B6" />;
  }
  if (factaItem) {
    factaItem.icon = <ListChecks size={28} color="#5B21B6" />;
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
          Borrower
        </Typography>
      </Box>

      {ofacItem && <OfacAccordionItem item={ofacItem} />}
      {factaItem && <FactaAccordionItem item={factaItem} />}
    </Box>
  );
};

export default BorrowerSection;