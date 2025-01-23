import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>

      <Box sx={{ display: 'flex', flex: 1, mt: 8 }}>
        <Box sx={{ position: 'fixed', top: '64px', left: 0, width: '220px', height: 'calc(100vh - 64px)', bgcolor: '#f4f4f4' }}>
          <Sidebar />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: '220px', 
            mt: '64px',
            bgcolor: '#f9f9f9',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
