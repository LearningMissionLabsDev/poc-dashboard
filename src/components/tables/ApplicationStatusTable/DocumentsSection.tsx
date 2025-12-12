import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { FileText } from "lucide-react";
import type { SectionItem } from "./types";
import { buildDocumentItems } from "./data/documents";
import W2AccordionItem from "./items/W2AccordionItem";
import BankStatementAccordionItem from "./items/BankStatementAccordionItem";

interface DocumentsSectionProps {
    documents: any;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
    const theme = useTheme();

    const items: SectionItem[] = buildDocumentItems(documents);

    items.forEach((item) => {
        item.icon = <FileText size={28} color="#5B21B6" />;
    });

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
                    Documents
                </Typography>
            </Box>

            {items.map((item, i) => {
                const title = (item.title || "").toLowerCase();

                if (title.includes("w2")) {
                    return <W2AccordionItem key={i} item={item} />;
                }

                if (title.includes("bank")) {
                    return <BankStatementAccordionItem key={i} item={item} />;
                }
            })}
        </Box>
    );
};

export default DocumentsSection;