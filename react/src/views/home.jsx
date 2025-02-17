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
import {
  ArrowUpward,
  ArrowDownward,
  Reply,
  ModeComment,
} from "@mui/icons-material";
import axiosPrivate from "../api/axiosPrivate";
import { customAxios } from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { format, parseISO } from "date-fns";

const Home = () => {
  const [realPosts, setRealPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [auth] = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchPost() {
      try {
        if (!auth?.user) {
          const response = await customAxios.get('/get-all-post');
          setRealPosts(response.data.posts);
        } else {
          const response = await axiosPrivate.get('/get-all-post');
          setRealPosts(response.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchPost();
  }, [auth]);

  const dummyPosts = [
    {
      id: 1,
      username: "Sonod",
      time: "30 mins",
      votes: 50,
      answers: 2,
      content: "This is an example post content for the first post.",
    },
    {
      id: 2,
      username: "Tamim",
      time: "25 mins",
      votes: 48,
      answers: 5,
      content: "Here's another example of a post with similar styling.",
    },
    {
      id: 3,
      username: "Rahim",
      time: "20 mins",
      votes: 35,
      answers: 3,
      content: "This is a third example post with some interesting content.",
    },
    {
      id: 4,
      username: "Karim",
      time: "15 mins",
      votes: 60,
      answers: 7,
      content: "Check out this post for more details on the topic.",
    },
    {
      id: 5,
      username: "Jamal",
      time: "10 mins",
      votes: 25,
      answers: 1,
      content: "I have a question about the recent updates. Can anyone help?",
    },
    {
      id: 6,
      username: "Farid",
      time: "5 mins",
      votes: 40,
      answers: 4,
      content: "Here's a post about the latest trends in technology.",
    },
    {
      id: 7,
      username: "Nasim",
      time: "2 mins",
      votes: 30,
      answers: 6,
      content: "Let's discuss the best practices for coding in React.",
    },
  ];

  const posts = [...realPosts, ...dummyPosts];

  const handleGetPostByTag = (tag_id, course_code, course_name) => {
    navigate(`/posts-by-tag/${tag_id}`, { state: { message: `${course_code} - ${course_name}` } });
  }
  // Sort posts by date
  const sortedPosts = posts.sort((a, b) =>
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
            This is the home page where you can explore questions, tags, discussions,
            and more.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Section (70%) */}
          <Grid item xs={12} md={8}>
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, mb: 3, width: '100%' }}
              >
                <CardContent>
                  {/* Header: User Info with Date on Right */}
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

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.primary" fontSize={20} textAlign='start' mb={2}>
                    {post.content}
                  </Typography>

                  <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                    {post.tags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`${tag.course_code} - ${tag.course_name}`}
                        sx={{
                          bgcolor: 'transparent',
                          color: theme.palette.text.primary,
                          borderRadius: 1,
                          fontWeight: 'bold',
                          margin: '4px',
                          border: `1px solid ${theme.palette.grey[400]}`,
                        }}
                        onClick={() => handleGetPostByTag(tag.id, tag.course_code, tag.course_name)}
                      />
                    ))}
                    {post.tags?.[0] && (
                      <Chip
                        label={post.tags[0].varsity}
                        sx={{
                          bgcolor: 'transparent',
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          fontWeight: 'bold',
                          margin: '4px',
                          border: `1px solid ${theme.palette.primary.main}`,
                        }}
                      />
                    )}
                  </Stack>

                  {/* Post Actions */}
                  <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                    {/* Voting System */}
                    <Grid item display="flex" alignItems="center">
                      <IconButton size="small" color="primary">
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" fontWeight="bold">
                        {post.votes}
                      </Typography>
                      <IconButton size="small" color="secondary">
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                    </Grid>

                    {/* Comments */}
                    <Grid item display="flex" alignItems="center">
                      <ModeComment fontSize="small" color="action" />
                      <Typography variant="body2" ml={0.5}>
                        {post.answers} Answers
                      </Typography>
                    </Grid>

                    {/* Reply Button */}
                    <Grid item>
                      <IconButton size="small">
                        <Reply fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Sidebar Section (30%) */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.default, borderRadius: 2, boxShadow: 3, p: 2, mb: 3, width: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Recent Post Tags
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {sortedPosts.flatMap((post) => post.tags || []).slice(0, 10).map((tag, index) => (
                  <Chip
                    key={index}
                    label={`${tag.course_code} - ${tag.course_name}`}
                    sx={{
                      bgcolor: 'transparent',
                      color: theme.palette.text.primary,
                      borderRadius: 1,
                      fontWeight: 'bold',
                      margin: '8px 4px', // Increased bottom margin for vertical spacing
                      border: `1px solid ${theme.palette.grey[400]}`,
                    }}
                  />
                ))}
              </Stack>
            </Card>

            <Card sx={{ bgcolor: theme.palette.background.default, borderRadius: 2, boxShadow: 3, p: 2, width: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Recent Posts
              </Typography>
              <Divider />
              {sortedPosts.slice(0, showAllPosts ? sortedPosts.length : 10).map((post, index) => (
                <Box key={post.id} display="flex" justifyContent="space-between" alignItems="center" my={1}>
                  <Typography variant="body2" sx={{ textAlign: 'left', flex: 1, color: 'blue' }}>
                    {index + 1}. {post.title || post.content.slice(0, 50) + '...'}
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