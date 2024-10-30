import { Outlet, NavLink, Link, useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { getAccountById, getAvatar } from "../../services/CustomerService";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

const drawerWidth = 240;

const Layout = () => {
  const [account, setAccount] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null); 
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      const accountId = localStorage.getItem("accountId");
      if (accountId) {
        try {
          const accountData = await getAccountById(accountId);
          setAccount(accountData);

          const fetchedAvatarUrl = await getAvatar(accountId);
          setAvatarUrl(fetchedAvatarUrl); // Set the fetched avatar URL

          const avatar = await getAvatar(accountId);
          setAvatarUrl(avatar);
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      }
    };
    fetchAccount();
  }, []);

  const handleAvatarHover = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("accountId");
    setAnchorEl(null);
    navigate("/");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#161A31",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="Logo-Koi\Order.png"
          alt="Logo"
          sx={{
            width: "80%",
            height: "120px",
            borderRadius: "12px",
            mt: 2,
            mb: 1,
            objectFit: "cover",
          }}
        />

        {/* Button */}
        <Button
          variant="contained"
          sx={{
            width: "80%",
            borderRadius: "12px",
            mt: 2,
            mb: 2,
            bgcolor: "#F8A02F",
            ":hover": {
              bgcolor: "#1565C0",
            },
          }}
          component={Link}
          to="/form"
          startIcon={<AddCircleOutlineRoundedIcon />}
        >
          Tạo đơn
        </Button>

        {/* Navigation Links */}
        <List sx={{ width: "100%" }}>
          <ListItem
            component={NavLink}
            to="/order-report"
            sx={{ "&.active": { bgcolor: "#2f386a" } }}
          >
            <HomeIcon sx={{ mr: 1, color: "#FFFFFF" }} />
            <ListItemText
              primary="Lịch sử đơn hàng"
              sx={{
                color: "#FFFFFF",
              }}
            />
          </ListItem>
          <ListItem
            component={NavLink}
            to="/"
            sx={{ "&.active": { bgcolor: "#2f386a" } }}
          >
            <HelpIcon sx={{ mr: 1, color: "#FFFFFF" }} />
            <ListItemText
              primary="Trợ giúp"
              sx={{
                color: "#FFFFFF",
              }}
            />
          </ListItem>
          <ListItem
            component={NavLink}
            to="/user"
            sx={{ "&.active": { bgcolor: "#2f386a" } }}
          >
            <PersonOutlineRoundedIcon sx={{ mr: 1, color: "#FFFFFF" }} />
            <ListItemText
              primary="Trang cá nhân"
              sx={{
                color: "#FFFFFF",
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "#171B36",
            borderBottom: "2px solid #0F132B",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              KoiFish Delivery
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                color="inherit"
                component={Link}
                to="/customer"
                startIcon={<HomeIcon />}
              >
                Trang chủ
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/order-report"
                startIcon={<SupportAgentIcon />}
              >
                Dịch vụ
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/order-report"
                startIcon={<HelpIcon />}
              >
                Giới thiệu
              </Button>

              {/* Avatar with Hover Menu */}
              <Avatar
                src={avatarUrl} // Display the avatar dynamically
                alt={account?.userName || "Account Avatar"}
                onMouseEnter={handleAvatarHover}
                sx={{ cursor: "pointer" }}
              />

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                onMouseLeave={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle1">
                    {account?.userName || "Unknown User"}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        <Toolbar />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            bgcolor: "#eeeeee",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet context={{ account }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
