import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Chip, Card, CardContent, Avatar, Stack,
  List,

  Grid,

  Container,
  Divider,

  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ArrowUpward, ArrowDownward, Reply, ModeComment, MoreVert } from "@mui/icons-material";
const SearchResults = () => {
  //const query = new URLSearchParams(location.search).get("query");
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [highlightPostId, setHighlightPostId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const navigate = useNavigate();
  const { query } = useParams();
  const theme = useTheme();
  const fetchUserPosts = async () => {
    try {
      const response = await customAxios.get(`/posts/search?query=${query}`)
      console.log("Fetched posts:", response.data);
      if (response.data.data && response.data.data) {
        setUserPosts(response.data.data);
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
  useEffect(() => {
    fetchUserPosts();
  }, [query]);

  useEffect(() => {
    if (highlightPostId) {
      const timer = setTimeout(() => {
        setHighlightPostId(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightPostId]);






  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Toaster richColors />
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Search results for {query}
      </Typography>
      {userPosts.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper', maxWidth: '650px', }}>
          {/* {userPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: highlightPostId === post.id ? '#ffeb3b' : '#fff',
                  borderRadius: 2,
                  boxShadow: 1,
                  mb: 2,
                  cursor: 'pointer',
                  maxWidth: '650px',
                  transition: 'transform 0.3s, background-color 0.3s',

                }}
                onClick={() => navigate(`/post/${post.id}`)}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts-by-tag/${tag.id}`)
                              }}
                            />
                          ))}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 1, color: '#999', display: 'block' }}>
                        {new Date(post.created_at).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))} */}
          {userPosts.map((post) => (
            <Card
              key={post.id}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                mb: 3,
                width: "100%",
                cursor: "pointer",
                "&:hover .post-actions": {
                  visibility: "visible",
                },
              }}
              onClick={(e) => {
                // e.stopPropagation();
                navigate(`/post/${post.id}`)
              }}
            >
              <CardContent>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar>{post.username?.charAt(0) || post.user?.name?.charAt(0)}</Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {post.username || post.user?.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                    </Typography>

                  </Box>
                </Box>


                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.primary" fontSize={20} textAlign="start" mb={2}>
                  {post.content}
                </Typography>

                {/* Tags */}
                <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                  {post.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`${tag.course_code} - ${tag.course_name}`}
                      sx={{
                        bgcolor: "transparent",
                        color: theme.palette.text.primary,
                        borderRadius: 1,
                        fontWeight: "bold",
                        margin: "4px",
                        border: `1px solid ${theme.palette.grey[400]}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetPostByTag(tag.id, tag.course_code, tag.course_name);
                      }}
                    />
                  ))}
                  {post.tags?.[0] && (
                    <Chip
                      label={post.tags[0].varsity}
                      sx={{
                        bgcolor: "transparent",
                        color: theme.palette.primary.main,
                        borderRadius: 1,
                        fontWeight: "bold",
                        margin: "4px",
                        border: `1px solid ${theme.palette.primary.main}`,
                      }}
                    />
                  )}
                </Stack>

                {/* Voting + Comments */}
                <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                  <Grid item display="flex" alignItems="center">
                    <IconButton
                      size="small"
                      color={post.user_vote === 1 ? "primary" : "default"}
                      onClick={(e) => handleVote(post.id, 1, e)}
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" fontWeight="bold">
                      {post.votes_count || 0}
                    </Typography>
                    <IconButton
                      size="small"
                      color={post.user_vote === -1 ? "secondary" : "default"}
                      onClick={(e) => handleVote(post.id, -1, e)}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                    {post.user_vote !== 0 && post.vote_id && (
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => handleRemoveVote(post.id, post.vote_id, e)}
                        sx={{ ml: 1 }}
                      >
                        Remove Vote
                      </Button>
                    )}
                  </Grid>
                  <Grid item display="flex" alignItems="center">
                    <ModeComment fontSize="small" color="action" />
                    <Typography variant="body2" ml={0.5}>
                      {post.comment_count || 0} Answers
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
          No posts available.
        </Typography>
      )}

    </Box>
  );

}

export default SearchResults;