import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/auth/signin");
  };

  let userId = null;
  const fetchCartItems = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.id;
        console.log(decodedToken);
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    } else {
      console.error("No token found in localStorage");
    }

    if (!userId || !token) {
      console.error("User ID or token is not available.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleCartClick = (event) => {
    fetchCartItems();
    handleMenuClick(event);  // Open the menu on cart icon click
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const getInitials = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub || "";
        return email.charAt(0).toUpperCase();
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
    return "?";
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        borderBottom: "1px solid #E0E0E0",
        fontFamily: '"Quicksand", sans-serif',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="default"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontWeight: 500,
          }}
        >
          My Application
        </Typography>
        <IconButton
          edge="end"
          color="default"
          aria-label="shopping-cart"
          sx={{ mr: 2 }}
          onClick={handleCartClick}
        >
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCart sx={{ color: "#FF8C00" }} />
          </Badge>
        </IconButton>
        <IconButton
          edge="end"
          color="default"
          aria-label="account"
          onClick={handleMenuClick}
        >
          {user ? (
            <Avatar
              sx={{
                backgroundColor: "#8395a7",
                color: "#FFFFFF",
                fontWeight: "bold",
                width: 40,
                height: 40,
                fontSize: "1.2rem",
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              {getInitials(user.sub)}
            </Avatar>
          ) : (
            <Avatar
              sx={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                fontWeight: "bold",
                width: 40,
                height: 40,
                fontSize: "1.2rem",
              }}
            >
              ?
            </Avatar>
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              minWidth: "240px",
              padding: "2px",
              fontFamily: '"Quicksand", sans-serif',
            },
            "& .MuiMenuItem-root": {
              padding: "6px 12px",
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500,
            },
            "& .MuiTypography-root": {
              fontSize: "0.875rem",
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500,
            },
            "& .MuiMenuItem-root.Mui-disabled": {
              opacity: 1,
              color: "#000000",
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500,
            },
            "& hr": {
              margin: "5px 0",
            },
          }}
        >
          {user ? (
            <>
              <MenuItem key="userName" disabled>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#000000",
                    fontWeight: "bold",
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: "1rem",
                  }}
                >
                  Name :
                  {` ${user.sub.charAt(0).toUpperCase() + user.sub.slice(1)} `}
                </Typography>
              </MenuItem>

              <hr style={{ width: "100%", border: "1px solid #E0E0E0" }} />
            </>
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>

        {/* Cart Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              minWidth: "240px",
              padding: "2px",
              fontFamily: '"Quicksand", sans-serif',
            },
          }}
        >
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <MenuItem key={product.id}>
                <Typography variant="body1">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No products in your cart.</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
