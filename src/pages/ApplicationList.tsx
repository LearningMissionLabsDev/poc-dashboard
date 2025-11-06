import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  useTheme,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import type {} from '@mui/x-data-grid/themeAugmentation';

const API_URL = "https://uai.plat.ai/webhook/apps";

export default function ApplicationList() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");

  // ✅ Fetch applications from API
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const items = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : json.application
            ? [json]
            : [];

      const formatted = items.map((item: any) => ({
        id: item.application_id,
        application_id: item.application_id,
        borrower_id: item.borrower_name,
        updated_at: item.updated_at?.replace("T", " ").replace("Z", "") ?? "—",
        verdict: item.verdict ?? "—",
        score: item.score ?? "—",
        status: item.verdict ?? "—",
        underwriter_id: item.underwriter_name ?? "—",
      }));

      setRows(formatted);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  function formatISO(iso: string = "") {
    if (!iso) return "N/A";
    return iso.replace("T", " ").replace("Z", "").split(".")[0];
  }

  // ✅ Search filter
  const filteredRows = rows?.filter((row) =>
    row.application_id.toLowerCase().includes(searchId.toLowerCase())
  );

  // ✅ Table columns
  const columns: GridColDef[] = [
    { field: "application_id", headerName: "Application ID", flex: 1, },
    { field: "borrower_id", headerName: "Borrower", flex: 1.3 },
    {
      field: "updated_at",
      headerName: "Last Updated",
      flex: 1,
      valueFormatter: (params) => formatISO(String(params ?? "")),
    },
    { field: "status", headerName: "Status", flex: 0.8 },
    { field: "score", headerName: "Confidence Score", flex: 0.6 },
    { field: "underwriter_id", headerName: "Underwriter", flex: 1.3 },
  ];

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 3 },
        pt: 4.5,
        pb: 2,
      }}
    >
      {/* === Page Title === */}
      <Typography
        sx={{
          ...theme.typography.h5,
          fontWeight: 500,
          color: "#1A253B",
          mb: 2,
          letterSpacing: "0.3px",
        }}
      >
        Manual Review List
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* === Data Grid === */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        loading={loading}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        showToolbar
        onRowClick={(params) => navigate(`/applications/${params.row.application_id}`)}
        sx={{
          border: "none",
          // ✅ Header Styles
          "& .MuiDataGrid-columnHeaders": {
            ...theme.typography.body2,
            fontFamily: "Poppins,sans-serif",
            backgroundColor: "#C8D1D7 !important",
            color: "#000000",
            fontWeight: 600,
            height: "45px !important",
            minHeight: "40px !important",
          },

          "& .MuiDataGrid-columnHeaders, \
     & .MuiDataGrid-columnHeadersInner, \
     & .MuiDataGrid-columnHeader": {
            backgroundColor: "#C8D1D7 !important",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            color: "#000000",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none !important",
            backgroundColor: "#fff",
          },
          // ✅ Row Styles
          "& .MuiDataGrid-row": {
            cursor: "pointer",
            borderBottom: "1px solid black !important",
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "#F3F4F6 !important",
            },
          },

          // ✅ Cell text always black
          "& .MuiDataGrid-cell": {
            ...theme.typography.body2,
            fontWeight: 400,
            fontFamily: "Poppins,sans-serif",
            display: "flex",
            alignItems: "center",
            lineHeight: "normal",
            color: "#000000 !important",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          },

          "& .MuiDataGrid-footerContainer, & .MuiTablePagination-root, & .MuiTablePagination-toolbar, & .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-menuItem": {
            ...theme.typography.body2,
            fontFamily: "Poppins,sans-serif !important",
            color: "#000000 !important",
          },
         
          "& .MuiMenuItem-root.Mui-selected": {
            backgroundColor: "#E5ECF7 !important",
            color: "#000 !important",
          },

          "& .MuiMenuItem-root.Mui-selected:hover": {
            backgroundColor: "#D7E3F3 !important",
          },
          // ✅ Remove focus / outline highlight
          "& .MuiDataGrid-row:focus, & .MuiDataGrid-cell:focus": {
            outline: "none !important",
          },
        }}
      />
    </Box>
  );
}

const CustomNoRowsOverlay = () => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#1A253B",
    }}
  >
    <Typography sx={{ ...theme.typography.h6, fontFamily: "Poppins,sans-serif", fontWeight: 600 }}>
      No applications found
    </Typography>
    <Typography sx={{ ...theme.typography.body2, fontFamily: "Poppins,sans-serif", fontWeight: 500, mt: 1, opacity: 0.75 }}>
      Try adjusting your filters or search input.
    </Typography>
  </Box>
);