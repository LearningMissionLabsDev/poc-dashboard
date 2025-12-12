import React from "react";
import type { SectionItem } from "../types";
import ApplicationAccordionItem from "./ApplicationAccordionItem";

interface Props {
  item: SectionItem;
  highestEstimate?: number; // kept for compatibility if it's used by callers
}

const ZillowAccordionItem: React.FC<Props> = ({ item }) => {
  return <ApplicationAccordionItem item={item} />;
};

export default ZillowAccordionItem;