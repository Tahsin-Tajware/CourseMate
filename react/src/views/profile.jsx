import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Modal,
  TextField,
  Stack,
} from "@mui/material";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({ name: "", varsity: "", department: "", current_password: "", password: "", confirm_password: "" });
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.post("/me", {});
        setUserData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized! Please log in again.");
        } else {
          setError("Failed to fetch profile data.");
        }
      }
    };
    fetchProfile();
  }, [auth, setAuth]);

  const handleLogout = async () => {

    const response = await axiosPrivate.post("/logout", {});
    localStorage.removeItem('access_token')
    localStorage.removeItem('user');
    setAuth({
      ...auth,
      user: null,
      token: null,
    });
    navigate('/');
  };


  const handleEditOpen = () => {
    setEditData({ name: userData.name, varsity: userData.varsity, department: userData.department });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };


  const handleEditSave = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.put(`/update-profile/${userData.id}`, editData);
      setUserData(response.data);
      setEditOpen(false);
      localStorage.setItem('user', JSON.stringify(response.data));
      setAuth({
        ...auth,
        user: response.data,
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setLoading(false);

    }
  };



  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} p={3}>
      {userData ? (
        <Box display="flex" flexDirection="column" gap={3} width="100%" maxWidth="800px">

          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" gap={2} flex="1">
              <Avatar
                alt={userData.name}
                src={userData.profilePicture || ""}
                sx={{ width: 80, height: 80 }}
              />
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                {/* Name and Edit button */}
                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {userData.name}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={handleEditOpen}
                  >
                    Edit
                  </Button>
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {userData.email}
                </Typography>

                <Box display="flex" flexDirection="row" gap={1}>

                  <Typography variant="body1">{auth.user.department},</Typography>
                  <Typography variant="body1">{auth.user.varsity}</Typography>
                </Box>
              </Box>
            </Box>


            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                backgroundColor: "red",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              Logout
            </Button>
          </Box>


          <Tabs value={0} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: "1px solid #e0e0e0" }}>
            <Tab label="Overview" />
            <Tab label="Posts" />
            <Tab label="Comments" />
            <Tab label="Saved" />
            <Tab label="Hidden" />
            <Tab label="Upvoted" />
            <Tab label="Downvoted" />
          </Tabs>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
                border="1px solid #ddd"
                borderRadius={1}
              >
                <Typography variant="h6" fontWeight="bold">
                  1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Post
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
                border="1px solid #ddd"
                borderRadius={1}
              >
                <Typography variant="h6" fontWeight="bold">
                  12
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Followers
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={3} p={2} border="1px solid #ddd" borderRadius={1}>
            <Typography variant="body2" fontWeight="bold" mb={1}>
              LINKS
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                textTransform: "none",
                borderStyle: "dashed",
              }}
            >
              + Add Social Link
            </Button>
          </Box>

          <Modal open={editOpen} onClose={handleEditClose}>
            <Box
              p={3}
              bgcolor="background.paper"
              borderRadius={1}
              boxShadow={24}
              width="400px"
              mx="auto"
              mt="20vh"
            >
              <Typography variant="h6" mb={2}>
                Edit Profile
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Varsity"
                  value={editData.varsity}
                  onChange={(e) => setEditData({ ...editData, varsity: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Department"
                  value={editData.department}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  fullWidth
                />
                <TextField
                  type="password"
                  label="Current Password"
                  value={editData.current_password}
                  onChange={(e) => setEditData({ ...editData, current_password: e.target.value })}
                  fullWidth
                />
                <TextField
                  type="password"
                  label="New Password"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  fullWidth
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  value={editData.confirm_password}
                  onChange={(e) => setEditData({ ...editData, confirm_password: e.target.value })}
                  fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleEditSave}>
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save"}
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default Profile;
