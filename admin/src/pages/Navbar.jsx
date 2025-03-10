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
  Collapse,
} from "@mui/material";
import {
  Notifications,
  Search as SearchIcon,
  Menu as MenuIcon,
  VerifiedUser,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  // const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  // const [auth] = useAuth();
  // const handleProfileClick = () => {
  //   navigate("/profile");
  // };

  // const handleNotificationClick = (event) => {
  //   setNotificationOpen((prev) => !prev);
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleNotificationMouseLeave = () => {
  //   if (!notificationOpen) {
  //     setAnchorEl(null);
  //   }
  // };

  const handleClickAway = () => {
    setNotificationOpen(false);
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    setIsSearchExpanded(false);
  };

  return (
    <Box
      component="nav"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={2}
      bgcolor="#171617"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={1000}
      sx={{ height: 75, borderBottom: "1px solid #333" }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={onToggleSidebar}
        sx={{ mr: 2, display: { sm: "none" }, color: "#fff" }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ cursor: "pointer" }}
        onClick={handleLogoClick}
      >
        <VerifiedUser sx={{ color: "#4CAF50", fontSize: "24px" }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          color="inherit"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: "#fff",
          }}
        >
          <span style={{ color: "#fff" }}>Course</span>
          <span style={{ color: "#FF6D00" }}>Mate</span>
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: 0.3,
        }}
      >
        <IconButton
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "#444",
            },
          }}
          onClick={handleSearchClick}
        >
          <SearchIcon fontSize="medium" />
        </IconButton>
        {/* <IconButton
          onClick={handleNotificationClick}
          onMouseLeave={handleNotificationMouseLeave}
          sx={{ color: "#555", "&:hover": { color: "#FF6D00" } }}
        >
          <Notifications />
        </IconButton> */}
        {/* <Avatar
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
          {auth?.user?.name?.charAt(0)}
        </Avatar> */}
      </Box>

      <Collapse in={isSearchExpanded} timeout="auto" unmountOnExit>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "30px",
            backgroundColor: "#444",
            px: 2,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            mt: 2,
            position: "fixed",
            top: 72,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <InputBase
            sx={{
              flex: 1,
              fontSize: "14px",
              color: "#fff",
              pl: 2,
            }}
            placeholder="Search for questions or tags..."
            inputProps={{ "aria-label": "search" }}
            onBlur={handleSearchBlur}
            autoFocus
          />
          <IconButton type="submit" sx={{ p: "10px", color: "#FF6D00" }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Collapse>

      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "70%",
            borderRadius: "30px",
            backgroundColor: "#444",
            px: 2,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <IconButton type="submit" sx={{ p: "10px", color: "#fff" }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              flex: 1,
              fontSize: "14px",
              color: "#fff",
              pl: 2,
            }}
            placeholder="Search for questions or tags..."
            inputProps={{ "aria-label": "search" }}
          />
        </Paper>
      </Box>

      {/* <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ flexShrink: 0, display: { xs: "none", sm: "flex" } }}
      >
        <IconButton
          onClick={handleNotificationClick}
          onMouseLeave={handleNotificationMouseLeave}
          sx={{ color: "#555", "&:hover": { color: "#FF6D00" } }}
        >
          <Notifications />
        </IconButton>
        {auth?.user?.name ?
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
            {auth?.user?.name?.charAt(0)}
          </Avatar> :
          <Link to='/login' className=" font-semibold hover:text-orange-600 "> Sign In</Link>
        }
      </Box> */}

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
        disablePortal
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            sx={{
              mt: 1,
              p: 2,
              width: 300,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* <Typography variant="body1">No new notifications</Typography> */}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default Navbar;
