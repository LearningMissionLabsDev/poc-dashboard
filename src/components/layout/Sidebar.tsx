import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  LayoutList,
  ChartNoAxesCombined,
  CircleQuestionMark,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Application List", icon: <LayoutList size={open ? 20 : 23} />, path: "/" },
    { label: "Analytics", icon: <ChartNoAxesCombined size={open ? 20 : 23} />, path: "/analytics" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 72,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          borderRight: "1px solid #eee",
        },
      }}
    >
      {/* Logo & Toggle */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={open ? "space-between" : "center"}
        px={2}
        py={open ? 0 : 1.5}
      >
        {open && (
          <Box display="flex" alignItems="center" py={2}>
            <Box
              component="img"
              src="/assets/platAI_logo.png"
              alt="PlatAI Logo"
              sx={{ height: 32, width: "auto" }}
            />
          </Box>
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            width: 40,
            height: 40,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          {open ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
        </IconButton>
      </Box>

      <Divider />

      {/* User Info */}
      {open && (
        <Box
          px={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: "#3B2ED0" }}>AA</Avatar>
            <Box lineHeight={1}>
              <Typography
                sx={{ ...theme.typography.body1, fontWeight: 500, lineHeight: 1.1 }}
                color="#1a1a1aff"
              >
                Hello, admin
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.1, fontSize: "14px" }}
              >
                Admin
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={() => console.log("Notification clicked!")}
            size="large"
            sx={{ color: "text.secondary" }}
          >
            <Badge
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ "& .MuiBadge-dot": { backgroundColor: "#FF7A00" } }}
            >
              <Bell size={22} />
            </Badge>
          </IconButton>
        </Box>
      )}

      {/* Menu Items */}
      <Box flexGrow={1} overflow="auto" mt={open ? 0 : 2}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "12px",
                    mx: 2,
                    my: 0.5,
                    backgroundColor: isActive
                      ? "rgba(99,102,241,0.1)"
                      : "transparent",
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #6366F1 0%, #5B21B6 100%)",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color: "#fff",
                      },
                    },
                    "&.Mui-selected:hover": {
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(99,102,241,0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: isActive ? "#fff" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            ...theme.typography.body1,
                            fontFamily: "Poppins,sans-serif",
                            fontWeight: 400,
                            color: isActive ? "#fff" : "text.primary",
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Support + Logout */}
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => console.log("Support clicked!")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              borderRadius: "12px",
              mx: 2,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(99,102,241,0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "text.secondary",
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              <CircleQuestionMark size={20} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Support"
                slotProps={{
                  primary: {
                    sx: {
                      ...theme.typography.body1,
                      fontFamily: "Poppins,sans-serif",
                      fontWeight: 400,
                      color: "text.primary",
                    },
                  },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => console.log("Logout clicked!")}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              borderRadius: "12px",
              mx: 2,
              my: 0.5,
              "&:hover": {
                backgroundColor: "rgba(99,102,241,0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "text.secondary",
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              <LogOut size={20} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Logout"
                slotProps={{
                  primary: {
                    sx: {
                      ...theme.typography.body1,
                      fontFamily: "Poppins,sans-serif",
                      fontWeight: 400,
                      color: "text.primary",
                    },
                  },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}