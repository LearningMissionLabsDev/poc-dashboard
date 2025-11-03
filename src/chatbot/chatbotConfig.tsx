import { alpha, createTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { BotMessageSquare } from "lucide-react";

export interface ChatbotThemeConfig {
  primary: string;
  secondary: string;
  buttonColor: string;
  buttonHoverColor: string;
  userMessageBg: string;
  botMessageBg: string;
  botAvatarBg: string;
  chatContainerBg: string;
  robotIcon?: React.ReactNode;
  sendIcon?: React.ReactNode;
}

export const C = {
  bg: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceHi: "#F3F4F6",
  border: "rgba(0, 0, 0, 0.08)",
  borderHi: "rgba(0, 0, 0, 0.15)",
  text: "#1E293B",
  textDim: "#6B7280",
  accent: "#6366F1",
  accentDark: "#5B21B6",
  accentGradient: "linear-gradient(135deg, #6366F1 0%, #5B21B6 100%)",
  orange: "#FF7A00",
};

export const defaultChatbotTheme: ChatbotThemeConfig = {
  primary: C.accent,
  secondary: C.accentDark,
  buttonColor: C.accent,
  buttonHoverColor: "#655edfff",
  userMessageBg: C.accentGradient,
  botMessageBg: C.surfaceHi,
  botAvatarBg: C.accent,
  chatContainerBg: C.surface,
robotIcon: (
  <BotMessageSquare
    size={38}
    color="#F8FAFC"
    strokeWidth={1.6}
    style={{
      display: "block",
      margin: "auto",
      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
    }}
  />
),
  sendIcon: (
    <SendIcon
      sx={{
        color: "#fff",
        width: 20,
        height: 20,
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.02)" },
      }}
    />
  ),
};

export const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: C.accent },
    secondary: { main: C.accentDark },
    background: { default: C.bg, paper: C.surface },
    text: { primary: C.text, secondary: C.textDim },
    divider: C.border,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: C.surface,
          color: C.text,
          border: `1px solid ${C.border}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: C.accentGradient,
          color: "#fff",
          boxShadow: "0 3px 10px rgba(99,102,241,0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
          },
        },
        outlined: {
          borderColor: C.borderHi,
          color: C.text,
          "&:hover": {
            borderColor: C.accent,
            backgroundColor: alpha(C.accent, 0.08),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: C.surfaceHi,
            color: C.text,
            "& fieldset": { borderColor: C.border },
            "&:hover fieldset": { borderColor: C.accent },
            "&.Mui-focused fieldset": { borderColor: C.accent },
          },
          "& .MuiInputBase-input": { color: C.text },
          "& .MuiInputLabel-root": { color: C.textDim },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: C.text,
          "&:hover": { backgroundColor: alpha(C.accent, 0.08) },
          outline: "none",
          border: "none",
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.surfaceHi,
          color: C.text,
          border: `1px solid ${C.borderHi}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.border },
      },
    },
  },
});