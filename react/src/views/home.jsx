import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
  Grid,
  Chip,
  Container,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Drawer,
  Collapse,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, ModeComment, MoreVert, ExpandMore, Close } from "@mui/icons-material";
import axiosPrivate, { customAxios } from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { format, parseISO } from "date-fns";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [auth] = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = auth?.user
          ? await axiosPrivate.get("/get-all-post")
          : await customAxios.get("/get-all-post");

        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [auth]);

  const handleVote = async (postId, value, e) => {
    e.stopPropagation();
    try {
      const res = await axiosPrivate.post("/vote", {
        votable_type: "post",
        votable_id: postId,
        value,
      });
      const { netVotes, userVote, voteId } = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, votes_count: netVotes, user_vote: userVote, vote_id: voteId }
            : p
        )
      );
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleRemoveVote = async (postId, voteId, e) => {
    e.stopPropagation();
    if (!voteId) return;
    try {
      const res = await axiosPrivate.delete(`/vote/${voteId}`);
      const { netVotes, userVote } = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, votes_count: netVotes, user_vote: userVote, vote_id: null }
            : p
        )
      );
    } catch (error) {
      console.error("Remove vote error:", error);
    }
  };

  const handleNavigatePostById = (post_id) => {
    navigate(`/post/${post_id}`);
  };

  const handleGetPostByTag = (tag_id, course_code, course_name) => {
    navigate(`/posts-by-tag/${tag_id}`, {
      state: { message: `${course_code} - ${course_name}` },
    });
  };

  const handleMenuClick = (event, postId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleSavePost = async () => {
    if (!selectedPostId) return;
    try {
      await axiosPrivate.post(`/save-post/${selectedPostId}`);
      handleMenuClose();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await customAxios.get(`/comment/${postId}`);
      const fetched = res.data.comments.original || [];
      setSelectedPostComments(fetched);

      const initialExpanded = {};
      fetched.forEach((c) => {
        if (!c.parent_id) {
          initialExpanded[c.id] = true;
        }
      });
      setExpandedComments(initialExpanded);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleShowComments = (postId) => {
    fetchComments(postId);
    setDrawerOpen(true);
  };

  const toggleExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (commentList) =>
    commentList.length > 0 ? (
      commentList.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            borderLeft: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "8px 0 0 8px",
            pl: 2,
            mb: 2,
            width: "100%",
            fontSize: isMobile ? "14px" : "16px", // Adjust font size
          }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              {comment.parent_id && (
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(comment.id)}
                  sx={{
                    transition: "transform 0.2s",
                    transform: expandedComments[comment.id] ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ExpandMore fontSize="small" />
                </IconButton>
              )}
              <Avatar sx={{ bgcolor: theme.palette.grey[500] }}>
                {comment.user?.name?.charAt(0) || comment.username?.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {comment.user?.name || comment.username}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" ml={2}>
              {format(parseISO(comment.created_at), "MMMM d, yyyy h:mm a")}
            </Typography>
          </Box>

          <Collapse
            in={!comment.parent_id || expandedComments[comment.id]}
            timeout="auto"
            unmountOnExit
          >
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ wordBreak: "break-word", textAlign: "left", ml: 7 }}
            >
              {comment.content}
            </Typography>

            {comment.replies && comment.replies.length > 0 && (
              <Box pl={4} mt={2}>
                {renderComments(comment.replies)}
              </Box>
            )}
          </Collapse>
        </Box>
      ))
    ) : (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        No Comments
      </Typography>
    );

  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.created_at || b.time) - new Date(a.created_at || a.time)
  );

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" width="100%">
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: { xs: 2, md: 6 } }}>
        <Box display="flex" flexDirection="column" gap={3} mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Welcome to CourseMate!
          </Typography>
          <Typography variant="body1">
            This is the home page where you can explore questions, tags, discussions, and more.
          </Typography>
        </Box>

        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" flexDirection="column" alignItems="center" width="100%">
              {sortedPosts.map((post) => (
                <Card
                  key={post.id}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    mb: 3,
                    width: { xs: "100%", md: "80%" },
                    cursor: "pointer",
                    "&:hover .post-actions": {
                      visibility: "visible",
                    },
                  }}
                  onClick={() => handleNavigatePostById(post.id)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {post.username?.charAt(0) || post.user?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {post.username || post.user?.name}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                        </Typography>
                        <IconButton
                          className="post-actions"
                          size="small"
                          sx={{ visibility: "hidden", ml: 1 }}
                          onClick={(e) => handleMenuClick(e, post.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: "center" }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontSize={20} textAlign="start" mb={2}>
                      {post.content}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {post.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`${tag.course_code} - ${tag.course_name}`}
                          sx={{
                            bgcolor: "transparent",
                            color: theme.palette.text.primary,
                            borderRadius: 1,
                            fontWeight: "bold",
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
                            border: `1px solid ${theme.palette.primary.main}`,
                          }}
                        />
                      )}
                    </Stack>
                    <Divider sx={{ mb: 2, mt: 2 }} />
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
                        <Typography
                          variant="body2"
                          ml={0.5}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowComments(post.id);
                          }}
                          sx={{ cursor: "pointer", textDecoration: "underline" }}
                        >
                          {post.comment_count || 0} Answers
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSavePost}>Save Post</MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: "400px" }} // Fixed width for the drawer
      >
        <Box sx={{ width: "100%", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Answers
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%", p: 2 }}>
          {renderComments(selectedPostComments)}
          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleNavigatePostById(selectedPostId)}
            sx={{ mt: 2 }}
          >
            Go to Post
          </Button> */}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Home;
