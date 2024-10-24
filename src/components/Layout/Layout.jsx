import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
const drawerWidth = 180;

const Layout = () => {
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
            bgcolor: "#161A31", // Darker sidebar background
            color: "#FFFFFF",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <List>
            <ListItem button component={Link} to="/">
              <HomeIcon sx={{ mr: 1 }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/help">
              <HelpIcon sx={{ mr: 1 }} />
              <ListItemText primary="Help" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "#171B36", // Navbar color
            borderBottom: "2px solid #0F132B",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              KoiFish Delivery
            </Typography>
            <Stack direction="row" spacing={4} alignItems="center">
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<HomeIcon />} // Add the Home icon
              >
                Trang chủ
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/order-report"
                startIcon={<HelpIcon />} // Add the Help icon
              >
                Order
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Toolbar for spacing adjustment */}
        <Toolbar />

        {/* Content rendered via Outlet */}
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
