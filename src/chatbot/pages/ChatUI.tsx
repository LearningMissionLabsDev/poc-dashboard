import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Paper,
  Fade,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";
import type { ChatbotThemeConfig } from "../chatbotConfig";
import { useNavigate, useParams } from "react-router-dom";
import { BotMessageSquare } from "lucide-react";
import MuiMarkdown from 'mui-markdown';

interface MessageType {
  text: string;
  isUser: boolean;
}

interface MessageProps {
  isUser?: boolean;
}

const ChatContainer = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: "500px",         // ✅ Prevent shrinking on short messages
  minWidth: "500px",         // ✅ Enforce the width always
  height: "85vh",
  [theme.breakpoints.down("sm")]: {
    width: "90vw",
    height: "80vh"
  },
  boxSizing: "border-box",
  borderRadius: "12px",
  overflow: "hidden"
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  backgroundColor: theme.palette.mode === "light"
    ? theme.palette.grey[100]
    : theme.palette.grey[900],
  "&::-webkit-scrollbar": {
    width: "6px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light"
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
    borderRadius: "3px"
  }
}));

const Message = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser"
})<MessageProps>(({ theme, isUser }) => ({
  padding: "10px 16px",
  borderRadius: isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.mode === "light"
      ? theme.palette.text.primary
      : theme.palette.grey[300],
  maxWidth: "90%",
  marginBottom: "12px",
  marginLeft: isUser ? "auto" : "0",
  marginRight: isUser ? "0" : "auto",
  position: "relative",
  transition: "all 0.3s ease"
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  gap: "8px"
}));

interface ChatUIProps {
  config: any;
  themeConfig: ChatbotThemeConfig;
}
const ChatUI: React.FC<ChatUIProps> = ({ themeConfig }: ChatUIProps) => {
 const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const looksAnalytic = (q: string) => {
    const s = q.toLowerCase();
    return (
      /\b(x|y)\s*[:=]\s*\w+/.test(s) ||                 // x: date, y: count
      /\b(by|group\s+by|per)\s+[a-z0-9_.-]+/.test(s) || // by owner, group by model
      /\b(vs|versus|compare|breakdown|distribution|trend|histogram)\b/.test(s) ||
      /\b(count|sum|total|avg|average|min|max|rank|top\s*\d+)\b/.test(s) ||
      /\b(daily|weekly|monthly|quarterly|yearly|over\s+time)\b/.test(s) ||
      /\b(chart|graph|plot|visuali[sz]e)\b/.test(s)
    );
  };

  const parseJSONSafe = (raw: string): any | null => {
    if (raw == null) return null;

    // strip BOM + trim
    let s = String(raw).replace(/^\uFEFF/, "").trim();

    // strip Angular/CSRF prelude like ")]}',"
    s = s.replace(/^\)\]\}',?\s*/, "");

    // 1) direct parse
    try { return JSON.parse(s); } catch { }

    // 2) quoted-JSON case: "\"{\\\"config\\\":{...}}\""
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      const unquoted = s.slice(1, -1);
      // unescape common sequences
      const unescaped = unquoted
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      try { return JSON.parse(unescaped); } catch { }
    }

    // 3) extract first balanced {...} or [...]
    const extractBalanced = (text: string): string | null => {
      const tryOne = (opener: "{" | "[", closer: "}" | "]") => {
        const start = text.indexOf(opener);
        if (start === -1) return null;
        let depth = 0, inStr = false, esc = false;
        for (let i = start; i < text.length; i++) {
          const ch = text[i];
          if (esc) { esc = false; continue; }
          if (ch === "\\") { esc = true; continue; }
          if (ch === '"') inStr = !inStr;
          if (inStr) continue;
          if (ch === opener) depth++;
          else if (ch === closer) {
            depth--;
            if (depth === 0) return text.slice(start, i + 1);
          }
        }
        return null;
      };
      return tryOne("{", "}") ?? tryOne("[", "]");
    };

    const frag = extractBalanced(s);
    if (frag) { try { return JSON.parse(frag); } catch { } }

    return null;
  };

  /* ---------- INSERTED HELPERS: chart type normalization ---------- */
  const SUPPORTED_TYPES = ["line", "pie", "area"] as const;

  const TYPE_ALIAS: Record<string, typeof SUPPORTED_TYPES[number]> = {
    bar: "line",
    histogram: "line",
    column: "line",
    pie: "pie",
    area: "area",
    scatter: "line",
  };

  function normalizeChartTypes(list?: string[] | null): string[] {
    const mapped = (list ?? [])
      .map((t) => TYPE_ALIAS[t] ?? t)
      .filter((t): t is typeof SUPPORTED_TYPES[number] => SUPPORTED_TYPES.includes(t as any));
    return Array.from(new Set(mapped)); // dedupe, keep order
  }

  function ensurePossibleCharts(cfg: any): string[] {
    let types = normalizeChartTypes(cfg?.possible_charts);
    if (!types.length) {
      const multiSeries = Array.isArray(cfg?.y);
      types = multiSeries ? ["area", "pie", "line"] : ["pie", "line", "area"];
    }
    return types;
  }
  /* ---------------------------------------------------------------- */

  // --- main send
  const handleSend = async () => {
    const msg = newMessage.trim();
    if (!msg) return;
if (messages.length === 0) {
  setMessages([{ text: msg, isUser: true }]);
} else {
  setMessages((prev) => [...prev, { text: msg, isUser: true }]);
}
    setNewMessage("");
    setIsTyping(true);

    const API_BASE = "https://uai.plat.ai/webhook/chat";
    const wantsAnalytics = looksAnalytic(msg);
    const endpoint = wantsAnalytics ? "/analytics" : "/";

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const pathname = window.location.pathname; // e.g. "/applications/test-12345"
      const id = pathname.split("/").pop(); // "test-12345"


      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },

        body: JSON.stringify({ chatInput: msg, application_id: id }),
        // signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} — ${errBody.slice(0, 200) || res.statusText}`);
      }

      const ct = res.headers.get("content-type") || "";
      let data: any = null;

      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        const raw = await res.text();
        data = parseJSONSafe(raw);
        console.debug("Non-JSON analytics response", { ct, preview: raw.slice(0, 200) });
      }

      if (!data) {
        setMessages((prev) => [...prev, { text: "No answer found.", isUser: false }]);
        return;
      }

      // --- analytics branch
      if (wantsAnalytics) {
        let config: any = data?.config;
        if (!config && Array.isArray(data?.data)) config = { data: data.data };
        if (!config && Array.isArray(data)) config = { data };

        if (config) {
          // ✅ normalize/alias to names your renderer supports
          config.possible_charts = ensurePossibleCharts(config);

          const detail = { question: msg, cypher: data?.cypher, config };
          try { sessionStorage.setItem("tirus_analytics_last", JSON.stringify(detail)); } catch { }
          navigate("/analytics", { state: detail });

          setMessages((p) => [...p, { text: "Analytics generated — opening Analytics page 📊", isUser: false }]);
          return;
        }
      }

      // --- normal Q&A
      const answer = String(data?.result ?? data?.answer ?? data?.output ?? "").trim();
      setMessages((prev) => [...prev, { text: answer || "No answer found.", isUser: false }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: `Error: ${(err as Error).message}`, isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

 return (
  <ChatContainer role="region" aria-label="Chat interface" sx={{ backgroundColor: themeConfig.chatContainerBg }}>

    <MessageContainer>
      {/* ✅ Show welcome message only when no messages sent */}
      {messages.length === 0 && (
        <Fade in timeout={500}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2, gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: themeConfig.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BotMessageSquare size={22} color="#fff" strokeWidth={1.8} />
            </Box>

            <Message isUser={false}>
              Hi! How can I assist you today? Feel free to ask a question.
            </Message>
          </Box>
        </Fade>
      )}

      {/* ✅ MAIN MESSAGE RENDER LOOP */}
      {messages.map((message, index) => (
        <Fade in key={index} timeout={500}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2, gap: 1 }}>
            {!message.isUser && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: themeConfig.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BotMessageSquare size={22} color="#fff" strokeWidth={1.8} />
              </Box>
            )}

            <Message isUser={message.isUser} sx={{ maxWidth: message.isUser ? "80%" : "90%" }}>
              <Box
                sx={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",

                  // ✅ Normalized Title Sizes
                  "& h1, & h2": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: "10px 0 6px",
                    color: "#111827",
                  },
                  "& h3, & h4, & h5, & h6": {
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    margin: "8px 0 4px",
                    color: "#111827",
                  },

                  "& p": {
                    marginBottom: "4px",
                    fontSize: "0.9rem",
                    lineHeight: 1.38,
                  },

                  "& strong": {
                    fontWeight: 600,
                    color: "#111827",
                  },

                  "& ul, & ol": {
                    paddingLeft: "18px",
                  },
                  "& li": {
                    fontSize: "0.9rem",
                    marginBottom: "3px",
                  }
                }}
              >
                <MuiMarkdown options={{ forceBlock: true }}>
                  {message.text}
                </MuiMarkdown>
              </Box>
            </Message>
          </Box>
        </Fade>
      ))}

      {isTyping && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 5 }}>
          <CircularProgress size={20} />
          <Typography variant="caption">Bot is typing...</Typography>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </MessageContainer>

    {/* ✅ Input Section */}
    <InputContainer>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        size="small"
        aria-label="Message input"
        multiline
        maxRows={3}
      />
      <IconButton
        onClick={handleSend}
        disabled={!newMessage.trim()}
        aria-label="Send message"
        sx={{
          background: themeConfig.buttonColor,
          color: "#fff",
          "&:hover": {
            background: themeConfig.buttonHoverColor,
            transform: "scale(1.02)",
          },
          "&:active": { transform: "scale(0.98)" },
          "&.Mui-disabled": {
            filter: "grayscale(60%) brightness(0.85)",
            opacity: 0.8,
            background: themeConfig.buttonColor,
            color: "#eee",
          },
          width: 44,
          height: 44,
          transition: "all 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {themeConfig.sendIcon}
      </IconButton>
    </InputContainer>

  </ChatContainer>
);
};

export default ChatUI;