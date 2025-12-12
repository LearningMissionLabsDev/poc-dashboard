import React from "react";
import type { SectionItem } from "../types";
import ApplicationAccordionItem from "./ApplicationAccordionItem";

interface Props {
  item: SectionItem;
}

const OfacAccordionItem: React.FC<Props> = ({ item }) => {
  return <ApplicationAccordionItem item={item} />;
};

export default OfacAccordionItem;