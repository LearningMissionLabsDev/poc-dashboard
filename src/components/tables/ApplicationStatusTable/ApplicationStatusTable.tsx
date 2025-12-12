import React from "react";
import { Box } from "@mui/material";
import type { ApplicationStatusTableProps } from "./types";
import BorrowerSection from "./BorrowerSection";
import PropertySection from "./PropertySection";
import DocumentsSection from "./DocumentsSection";
import AIUnderwriterDecision from "../../ui/AIUnderwriterDecision";

const ApplicationStatusTable: React.FC<ApplicationStatusTableProps> = ({ data }) => {
  const borrower = data?.borrower ?? {};
  const property = data?.property ?? {};
  const documents = data?.documents ?? {};

  const highestEstimate: number | undefined =
    property?.summary?.highest_estimate;

  const aiSummary = {
    verdict: data?.application?.verdict ?? "Pending",
    reason: data?.application?.reason ?? "AI review not completed",
    score: data?.application?.score ?? 0,
  };

  return (
    <>
      {/* Main card with all sections */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
          p: 3,
        }}
      >
        <BorrowerSection borrower={borrower} />
        <PropertySection
          property={property}
          highestEstimate={highestEstimate}
        />
        <DocumentsSection documents={documents} />
      </Box>

      {/* Underwriter decision panel */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 4,
          width: "100%",
        }}
      >
        <AIUnderwriterDecision
          verdict={aiSummary.verdict}
          reason={aiSummary.reason}
          score={aiSummary.score}
          onSubmit={(decision, reason) => {
            console.log("Underwriter Decision Sent:", { decision, reason });
          }}
        />
      </Box>
    </>
  );
};

export default ApplicationStatusTable;