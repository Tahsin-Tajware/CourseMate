import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import { Home, People, Notifications, Person, BookmarkBorder, Delete, Info,Report  } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { text: "Dashboard", icon: <Home />, path: "/" },
    // { text: "All Users", icon: <People />, path: "/all-users" },
    { text: "Reports", icon: <Report  />, path: "/reports" },
    // { text: "Profile", icon: <Person />, path: "/profile" },
    // { text: "All Posts", icon: <BookmarkBorder />, path: "/all-posts" },
    // { text: "All Tags", icon: <BookmarkBorder />, path: "/all-tags" },
    // { text: "Deleted Users", icon: <Delete />, path: "/deleted-users" },
    // { text: "Information", icon: <Info />, path: "/information" },
  ];

  const handleItemClick = () => {
    if (isOpen) onClose();
  };

  return (
    <>
      <Drawer anchor="left" open={isOpen} onClose={onClose} variant="temporary" sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Box
          component="nav"
          width={240}
          bgcolor="#1e1e1e" 
          position="fixed"
          top={72}
          left={0}
          bottom={0}
          zIndex={1000}
          overflow="auto"
          sx={{
            borderRight: "1px solid #333",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            borderRadius: "0 0 0 0",
          }}
        >
          <List>
            {navItems.map((item, index) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem
                  key={index}
                  button
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  onClick={handleItemClick}
                  sx={{
                    py: 1,
                    borderRadius: "8px",
                    mx: 1,
                    transition: "all 0.3s ease",
                    color: isSelected ? "#ff5722" : "#fff", 
                    backgroundColor: isSelected ? "#333" : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "#333" : "#444",
                    },
                    "& .MuiListItemIcon-root": {
                      color: isSelected ? "#ff5722" : "#fff",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontWeight: isSelected ? "bold" : "normal",
                      color: isSelected ? "#ff5722" : "#fff",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box
        component="nav"
        width={240}
        bgcolor="#171617" 
        position="fixed"
        top={72}
        left={0}
        bottom={0}
        zIndex={1000}
        overflow="auto"
        sx={{
          borderRight: "1px solid #333",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          borderRadius: "0 0 0 0",
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <List>
          {navItems.map((item, index) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem
                key={index}
                button
                component={Link}
                to={item.path}
                selected={isSelected}
                onClick={handleItemClick}
                sx={{
                  py: 1,
                  borderRadius: "8px",
                  mx: 1,
                  transition: "all 0.3s ease",
                  color: isSelected ? "#ff5722" : "#fff",
                  backgroundColor: isSelected ? "#333" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "#333" : "#444",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "#ff5722" : "#fff",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    fontWeight: isSelected ? "bold" : "normal",
                    color: isSelected ? "#ff5722" : "#fff",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
