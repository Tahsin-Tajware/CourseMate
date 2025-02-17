import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { Toaster, toast } from "sonner";

const PostPage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [highlightPostId, setHighlightPostId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axiosPrivate.get('/my_post');
        console.log("Fetched posts:", response.data.post);
        if (response.data && response.data.post) {
          setUserPosts(response.data.post);
        } else {
          toast.error("No posts found.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        toast.error("Failed to fetch posts. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  useEffect(() => {
    if (highlightPostId) {
      const timer = setTimeout(() => {
        setHighlightPostId(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightPostId]);

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
    handleCloseMenu();
  };

  const handleDeleteConfirmation = (postId) => {
    setPostToDelete(postId);
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (postToDelete) {
      try {
        const response = await axiosPrivate.delete(`/delete_post/${postToDelete}`);
        console.log(response);
        setUserPosts(userPosts.filter(post => post.id !== postToDelete));
        toast.success("Post deleted successfully!");
        setOpenDialog(false);
      } catch (err) {
        setError("Failed to delete post.");
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostToDelete(null);
  };

  const handleClick = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setCurrentPostId(postId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentPostId(null);
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>{error}</Typography>;

  return (
    <Box p={3} sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Toaster richColors />
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        My Posts
      </Typography>
      {userPosts.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {userPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: highlightPostId === post.id ? '#ffeb3b' : '#fff',
                  borderRadius: 2,
                  boxShadow: 1,
                  mb: 2,
                  transition: 'transform 0.3s, background-color 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444' }}>
                      {`${index + 1}. ${post.title}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body1" sx={{ mt: 1, color: '#666' }}>
                        {post.content}
                      </Typography>
                      <Box mt={2}>
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={`${tag.course_name} (${tag.course_code})`}
                              sx={{ mr: 1, bgcolor: '#e0f7fa', color: '#00796b' }}
                            />
                          ))}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 1, color: '#999', display: 'block' }}>
                        {new Date(post.created_at).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction sx={{ display: 'flex', flexDirection: 'column' }}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, post.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl) && currentPostId === post.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      style: {
                        width: '220px',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#e0dede', 
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleEdit(post.id)}
                      sx={{
                        backgroundColor: '#109423', 
                        color: '#fff',
                        '&:hover': { backgroundColor: '#0d6b1a' },
                        borderRadius: '4px',
                        mx: 1,
                        my: 0.5,
                      }}
                    >
                      <EditIcon sx={{ mr: 2 }} />
                      Edit post
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteConfirmation(post.id)}
                      sx={{
                        backgroundColor: '#dc3545', 
                        color: '#fff',
                        '&:hover': { backgroundColor: '#c82333' },
                        borderRadius: '4px',
                        mx: 1,
                        my: 0.5,
                      }}
                    >
                      <DeleteIcon sx={{ mr: 2 }} />
                      Delete this post
                    </MenuItem>
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
          No posts available.
        </Typography>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostPage;
