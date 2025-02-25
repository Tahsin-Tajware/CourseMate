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
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Reply, ModeComment } from "@mui/icons-material";
import axiosPrivate, { customAxios } from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { format, parseISO } from "date-fns";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [auth] = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = auth?.user
          ? await axiosPrivate.get("/get-all-post")
          : await customAxios.get("/get-all-post");

        // Each post is expected to have:
        //   post.votes_count, post.user_vote, and post.vote_id (if already voted)
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [auth]);

  // Upvote or downvote a post
  const handleVote = async (postId, value, e) => {
    e.stopPropagation();
    try {
      const res = await axiosPrivate.post("/vote", {
        votable_type: "post",
        votable_id: postId,
        value, // 1 for upvote, -1 for downvote
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

  // Remove a vote on a post
  const handleRemoveVote = async (postId, voteId, e) => {
    e.stopPropagation();
    if (!voteId) return; // no vote exists
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

        <Grid container spacing={3}>
          {/* Main Section */}
          <Grid item xs={12} md={8}>
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 3,
                  mb: 3,
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleNavigatePostById(post.id)}
              >
                <CardContent>
                  {/* Header */}
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>{post.username?.charAt(0) || post.user?.name?.charAt(0)}</Avatar>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {post.username || post.user?.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                    </Typography>
                  </Box>

                  {/* Title & Content */}
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
                        {post.comments?.length || 0} Answers
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                boxShadow: 3,
                p: 2,
                mb: 3,
                width: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Recent Posts
              </Typography>
              <Divider />
              {sortedPosts.slice(0, showAllPosts ? sortedPosts.length : 10).map((post, index) => (
                <Box key={post.id} display="flex" justifyContent="space-between" alignItems="center" my={1}>
                  <Typography variant="body2" sx={{ textAlign: "left", flex: 1, color: "blue" }}>
                    {index + 1}. {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                  </Typography>
                </Box>
              ))}
              {!showAllPosts && (
                <Button onClick={() => setShowAllPosts(true)} sx={{ mt: 2 }}>
                  See All
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
