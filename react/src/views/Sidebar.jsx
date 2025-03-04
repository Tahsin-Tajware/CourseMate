import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import { Home, QuestionAnswer, BookmarkBorder, Help, Settings, People, StarBorder, Info,Person } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { text: "Home", icon: <Home />, path: "/" },
    // { text: "All Questions", icon: <QuestionAnswer />, path: "/all-questions" },
    // { text: "Course Tags", icon: <BookmarkBorder />, path: "/course-tags" },
    { text: "Ask Question", icon: <Help />, path: "/ask-question" },
    { text: "My Posts", icon: <People />, path: "/myposts" },
    // { text: "Discussions", icon: <People />, path: "/discussions" },
    // { text: "Community", icon: <People />, path: "/community" },
    { text: "Saved Questions", icon: <StarBorder />, path: "/saved-post" },
    // { text: "Following", icon: <People />, path: "/following" },
    { text: "My Profile", icon: < Person />, path: "/profile" },
    { text: "About", icon: <Info />, path: "/about" },
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
          bgcolor="#e5e5e5"
          position="fixed"
          top={72}
          left={0}
          bottom={0}
          zIndex={1000}
          overflow="auto"
          sx={{
            borderRight: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
                    color: isSelected ? "#111" : "#333",
                    backgroundColor: isSelected ? "#d9d9d9" : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "#d9d9d9" : "#f0f0f0",
                    },
                    "& .MuiListItemIcon-root": {
                      color: isSelected ? "#111" : "#666",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontWeight: isSelected ? "bold" : "normal",
                      color: isSelected ? "#111" : "#333",
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
        bgcolor="#fcfcfc"
        position="fixed"
        top={72}
        left={0}
        bottom={0}
        zIndex={1000}
        overflow="auto"
        sx={{
          borderRight: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
                  color: isSelected ? "#111" : "#333",
                  backgroundColor: isSelected ? "#d9d9d9" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "#d9d9d9" : "#f0f0f0",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "#111" : "#666",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    fontWeight: isSelected ? "bold" : "normal",
                    color: isSelected ? "#111" : "#333",
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
