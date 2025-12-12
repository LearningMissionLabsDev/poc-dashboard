import HouseIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Security";
import CallIcon from "@mui/icons-material/Call";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ErrorIcon from "@mui/icons-material/Error";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import type { JSX } from "react";

export const EVENT_ICONS: Record<string, JSX.Element> = {
  "application created": <ErrorIcon sx={{ color: "#3B82F6" }} />,
  "document uploaded": <PictureAsPdfIcon sx={{ color: "#DC2626" }} />,
  "book created for borrower": <MenuBookIcon sx={{ color: "#7C3AED" }} />,
  underwriter: <AccountBalanceIcon sx={{ color: "#0EA5E9" }} />,
  borrower: <PersonIcon sx={{ color: "#A855F7" }} />,
  property: <HouseIcon sx={{ color: "#6366F1" }} />,
  facta: <CallIcon sx={{ color: "#F59E0B" }} />,
  ofac: <ShieldIcon sx={{ color: "#10B981" }} />,
};

export const filterOptions = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
];

export const formatDate = (ts: string) =>
  ts.replace("T", " ").replace("Z", "").slice(0, 19);

export const getEventIcon = (log: any) => {
  const desc = log?.description?.toLowerCase().trim() || "";
  const evt = log?.event?.toLowerCase().trim() || "";

  // exact description
  if (EVENT_ICONS[desc]) return EVENT_ICONS[desc];

  // keyword-based
  if (desc.includes("application")) return EVENT_ICONS["application created"];
  if (desc.includes("book")) return EVENT_ICONS["book created for borrower"];
  if (desc.includes("document")) return EVENT_ICONS["document uploaded"];
  if (desc.includes("property")) return EVENT_ICONS["property"];
  if (desc.includes("ofac")) return EVENT_ICONS["ofac"];
  if (desc.includes("facta")) return EVENT_ICONS["facta"];
  if (desc.includes("underwriter")) return EVENT_ICONS["underwriter"];
  if (desc.includes("borrower")) return EVENT_ICONS["borrower"];

  if (EVENT_ICONS[evt]) return EVENT_ICONS[evt];

  return <ErrorIcon sx={{ color: "#9CA3AF" }} />;
};