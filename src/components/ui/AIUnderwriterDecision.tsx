import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import theme from "../../theme";

interface Props {
  verdict: string;
  reason: string;
  score?: number;
  onSubmit?: (decision: "approve" | "reject", reason?: string) => void;
}

export default function AIUnderwriterDecision({
  verdict,
  reason,
  score = 50,
  onSubmit,
}: Props) {
  const [decision, setDecision] = useState<"approve" | "reject" | "">("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!decision) return;
    onSubmit?.(decision, comment);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#F5F7FA",
        pb: 2
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          width: "100%",
        }}
      >
        {/* === LEFT: AI Decision === */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            p: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            minHeight: "292px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Typography
              sx={{
                ...theme.typography.body1,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: "#000",
              }}>
              AI {verdict}
            </Typography>

            <Typography
              sx={{
                ...theme.typography.miniBody,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                color: "#000000CC"
              }}>
              {reason}
            </Typography>
            <Chip
              label={`${score}%`}
              size="small"
              sx={{
                ...theme.typography.miniBody,
                fontFamily: "Poppins,sans-serif",
                backgroundColor:
                  score < 50
                    ? "#FEE2E2"
                    : score < 75
                      ? "#FEF3C7"
                      : "#C3F2D1E5",

                border:
                  score < 50
                    ? "1px solid #fa9d9dff"
                    : score < 75
                      ? "1px solid #f3bc93ff"
                      : "1px solid #84DA9E",

                color: "#000000CC",
                fontWeight: 400,
                width: "fit-content",
                alignSelf: "center",
                borderRadius: "6px",
                py: 1,
              }}
            />
          </Box>
        </Box>

        {/* === RIGHT: Underwriter Decision === */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            minHeight: "292px",
            p: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              ...theme.typography.body1,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: "#000",
              textAlign: "center",
              mb: "16px",
            }}
          >
            Underwriter’s Decision
          </Typography>

          {/* ✅ Limit inner width like Figma */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <RadioGroup
              value={decision}
              onChange={(e) => setDecision(e.target.value as any)}
              sx={{
                display: "flex",
                flexDirection: "column", // ✅ separate rows
                width: "auto", // ✅ prevent full stretch
              }}
            >
              <FormControlLabel
                value="approve"
                label="Approve"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...theme.typography.miniBody,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                  },
                  color: "#000",
                  width: "fit-content",
                  m: 0,
                }}
                control={
                  <Radio
                    sx={{
                      color: "#2A8038",
                      "&.Mui-checked": { color: "#2A8038" },
                    }}
                  />
                }
              />
              <FormControlLabel
                value="reject"
                label="Reject"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...theme.typography.miniBody,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                  },
                  width: "fit-content",
                  m: 0,
                  color: "#000",
                }}
                control={
                  <Radio
                    sx={{
                      color: red[600],
                      "&.Mui-checked": { color: red[600] },
                    }}
                  />
                }
              />
            </RadioGroup>
            <TextField
              placeholder="Reason"
              fullWidth
              multiline
              minRows={1}
              maxRows={2}
              sx={{
                "& .MuiInputBase-input": {
                  ...theme.typography.miniBody,
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiInputBase-root": {
                  ...theme.typography.miniBody,
                  height: "54px",
                  maxHeight: "54px",
                  padding: "6px 14px",
                  alignItems: "flex-start",
                  fontFamily: "Poppins, sans-serif",
                },
                "& textarea": {
                  padding: "0",
                  margin: "0",
                  lineHeight: "20px",
                  resize: "none",
                  color: "#070707"
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              disabled={!decision}
              sx={{
                ...theme.typography.button,
                backgroundColor: "#2A8038",
                color: "#070707",
                "&:hover": { backgroundColor: "#2a7737ff" },
                borderRadius: "8px",
                fontWeight: 400,
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                p: "5px",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}