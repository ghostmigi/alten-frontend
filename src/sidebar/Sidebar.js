import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Email,
} from "@mui/icons-material";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as LogoDGSSI } from "../../src/assets/logo.svg";

const getCurrentUserRole = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Products", icon: <ArtTrackIcon />, path: "/products" },
    {
      text: "Contact",
      icon: <Email sx={{ fontSize: 28, color: "#fff" }} />,
      path: "/contact",
    },
  ];

  const location = useLocation();
  const role = getCurrentUserRole();

  return (
    <>
      {isMobile && (
        <IconButton
          sx={{
            position: "fixed",
            top: theme.spacing(2),
            left: theme.spacing(2),
            zIndex: 1200,
            color: "#fff",
          }}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => isMobile && setOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 280,
            boxSizing: "border-box",
            backgroundColor: "#0E1321",
            color: "#fff",
          },
        }}
      >
        <Box
          sx={{
            padding: "16px",
            textAlign: "center",
            backgroundColor: "#111827",
          }}
        >
          <LogoDGSSI style={{ width: 220, height: 60, marginBottom: 8 }} />
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            Alten app
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#444", margin: "0px 0" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <List
            sx={{
              width: "100%",
              padding: 0,
              margin: 2,
            }}
          >
            {menuItems
              .filter((item) => !item.role || item.role === role)
              .map((item, index) => (
                <ListItem
                  key={index}
                  component={Link}
                  to={item.path}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "8px",
                    gap: "0px",
                    padding: "4px 10px",
                    color: "#fff",
                    backgroundColor:
                      location.pathname === item.path
                        ? "#635bff"
                        : "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    marginBottom: "8px",
                    cursor: "pointer",
                    fontFamily: "Quicksand, sans-serif",
                    "&:hover": {
                      textDecoration: "none",
                      backgroundColor:
                        location.pathname === item.path ? "#fff" : "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
