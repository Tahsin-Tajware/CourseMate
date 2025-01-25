import React, { useState } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Avatar,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import { Notifications, Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationClick = (event) => {
    setNotificationOpen((prev) => !prev);
    setAnchorEl(event.currentTarget);
  };

  const handleClickAway = () => {
    setNotificationOpen(false);
  };

  return (
    <Box
      component="nav"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={2}
      bgcolor="#fafcfa"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={1000}
      sx={{ height: 72, borderBottom: "1px solid #e0e0e0" }}
    >
      {/* Logo */}
      <Typography
        variant="h4"
        fontWeight="bold"
        color="inherit"
        display="flex"
        alignItems="center"
        gap={0}
      >
        <span style={{ color: "#000" }}>Course</span>
        <span style={{ color: "#FF6D00" }}>Mate</span>
      </Typography>

      {/* Search Bar */}
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          width: { xs: "70%", sm: "50%", md: "40%" },
          borderRadius: "30px",
          backgroundColor: "#f0f0f0",
          px: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputBase
          sx={{ flex: 1, fontSize: "14px", color: "#666", pl: 2 }}
          placeholder="Search for questions or tags..."
          inputProps={{ "aria-label": "search" }}
        />
        <IconButton type="submit" sx={{ p: "10px", color: "#FF6D00" }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Profile and Notifications */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          onClick={handleProfileClick}
          alt="Profile"
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "#ccc",
            fontSize: "18px",
            color: "#fff",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#FF6D00",
              color: "#fff",
            },
          }}
        >
          P
        </Avatar>
        <IconButton
          onClick={handleNotificationClick}
          sx={{ color: "#555", "&:hover": { color: "#FF6D00" } }}
        >
          <Notifications />
        </IconButton>
      </Box>

      {/* Notification Popper */}
      <Popper
        open={notificationOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 1500 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box
            sx={{
              mt: 1,
              width: 300,
              maxHeight: 400,
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              p: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Notifications
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Example  */}
              <Typography variant="body2" color="text.secondary">
                🔔 You have a new message.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📅 Your assignment deadline is tomorrow.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🎉 New comment on your post.
              </Typography>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default Navbar;
