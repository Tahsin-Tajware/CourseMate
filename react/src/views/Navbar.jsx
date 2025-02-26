import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Avatar,
  Popper,
  ClickAwayListener,
  Collapse, Menu, MenuItem, Tooltip
} from "@mui/material";
import {
  Notifications,
  Search as SearchIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axiosPrivate from "../api/axiosPrivate";
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import { format } from "date-fns";
import CircleIcon from '@mui/icons-material/Circle';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [auth] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [count_unread, setCountUnread] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationClick = (event) => {
    setNotificationOpen((prev) => !prev);
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationMouseLeave = () => {
    if (!notificationOpen) {
      setAnchorEl(null);
    }
  };

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
  const fetchNotifications = async () => {
    try {
      if (auth?.user) {
        const res = await axiosPrivate.get('/notification ')
        setNotifications(res.data);
      }

    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const fetchUnreadNotifications = async () => {
    try {
      if (auth?.user) {
        const res = await axiosPrivate.get('/notification/unread')
        setNotifications(res.data);
        return res.data
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
    handleMenuClose();
  }
  useEffect(() => {
    if (auth?.user) {
      const unreadCount = async () => {
        const res = await axiosPrivate.get('/notification/count');
        setCountUnread(res.data.count);
      }
      unreadCount();
    }

  }, [auth?.user])

  const handleMarkAllAsRead = async () => {
    try {
      await axiosPrivate.post('/notification/mark-all-as-read')
      fetchNotifications();

    } catch (error) {
      console.log(error)
    }
    handleMenuClose();
  }

  const handleNavigatePostById = (post_id, noti_id) => {
    navigate(`/post/${post_id}`);
    handleMarkAsRead(noti_id);
  }
  const handleMarkAsRead = async (id) => {
    try {
      await axiosPrivate.post(`/notification/mark-as-read/${id}`)
      fetchNotifications()
    } catch (error) {
      console.log(error)
    }
  }
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const dateKey = format(new Date(notification.created_at), "MMMM dd, yyyy"); // Format date
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(notification);
    return acc;
  }, {});

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
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={onToggleSidebar}
        sx={{ mr: 2, display: { sm: "none" }, color: "black" }}
      >
        <MenuIcon />
      </IconButton>

      <Typography
        variant="h4"
        fontWeight="bold"
        color="inherit"
        onClick={handleLogoClick}
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem" },
          cursor: "pointer",
        }}
      >
        <span style={{ color: "#000" }}>Course</span>
        <span style={{ color: "#FF6D00" }}>Mate</span>
      </Typography>

      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: 0.3,
        }}
      >
        <IconButton
          sx={{
            color: "grey",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={handleSearchClick}
        >
          <SearchIcon fontSize="medium" />
        </IconButton>
        <IconButton
          onClick={() => handleNotificationClick}
          onMouseLeave={handleNotificationMouseLeave}
          sx={{ color: "#555", "&:hover": { color: "#FF6D00" } }}
        >
          <Notifications />
        </IconButton>
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
        </Avatar>
      </Box>

      <Collapse in={isSearchExpanded} timeout="auto" unmountOnExit>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "30px",
            backgroundColor: "#f0f0f0",
            px: 2,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
              color: "#666",
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
            backgroundColor: "#f0f0f0",
            px: 2,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <IconButton type="submit" sx={{ p: "10px", color: "#666" }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              flex: 1,
              fontSize: "14px",
              color: "#666",
              pl: 2,
            }}
            placeholder="Search for questions or tags..."
            inputProps={{ "aria-label": "search" }}
          />
        </Paper>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ flexShrink: 0, display: { xs: "none", sm: "flex" } }}
      >
        <IconButton
          onClick={handleNotificationClick}
          onMouseLeave={handleNotificationMouseLeave}
          sx={{ color: "#555", "&:hover": { color: "#FF6D00" }, ...(notificationOpen && { color: "#FF6D00" }) }}
        >
          <Badge badgeContent={count_unread} color="error">
            {
              !notificationOpen ?
                <NotificationsNoneOutlinedIcon fontSize="medium" />
                :
                <Notifications fontSize="medium" />
            }

          </Badge>

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
      </Box>

      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-end" disablePortal>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            sx={{
              mt: 1,
              width: 300,
              maxHeight: 600, // Set max height for scroll
              //overflowY: "auto", // Enable scrolling
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#fff",
              padding: '5px',
            }}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>

              {/* Three-dot Menu */}
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    maxHeight: 200,
                    width: "160px",
                    //backgroundColor: ''
                  },
                }}
              >
                <MenuItem sx={{
                  color: 'orangered', "&:hover": {
                    backgroundColor: "#ffeddf",
                  },
                }} onClick={handleMarkAllAsRead}>Mark All as Read</MenuItem>
                <MenuItem sx={{
                  color: 'orangered', "&:hover": {
                    backgroundColor: "#ffeddf",
                  },
                }} onClick={fetchUnreadNotifications}>Show Unread</MenuItem>
              </Menu>
            </div>

            <ul className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="text-gray-500 text-sm p-3">No new notifications</li>
              ) : (
                Object.entries(groupedNotifications).map(([date, notiList]) => (
                  <div key={date}>
                    <h3 className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold">
                      {date}
                    </h3>
                    {notiList.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-3  cursor-pointer flex text-start justify-stretch items-center transition duration-200 
              group ${"bg-white hover:bg-gray-200 hover:rounded-xl"}`}
                        onClick={() => handleNavigatePostById(notification.data.post_id, notification.id)}
                      >
                        <span className="text-sm text-gray-700">{notification.data.message}</span>
                        {notification.read_at === null && (
                          <div className="relative flex items-center">

                            <CircleIcon
                              fontSize="15px"
                              sx={{ color: "#b2c2ff" }}
                              className="absolute text-end transition-opacity duration-200 group-hover:opacity-0"
                            />

                            <Tooltip title="Mark as read">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <BeenhereOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>


                        )


                        }
                      </li>
                    ))}
                  </div>
                ))
              )}
            </ul>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default Navbar;
