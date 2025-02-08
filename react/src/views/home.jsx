import React from "react";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton, Stack, Grid, Chip, Container
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
  const [auth] = useAuth();
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
  }, []);
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
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5">Welcome to CourseMate!</Typography>
      <Typography variant="body1">
        This is the home page where you can explore questions, tags, discussions,
        and more.
      </Typography>

      {posts?.map((post) => (

        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" >
            <Card key={post.id} sx={{ bgcolor: "whitesmoke", borderRadius: 2, boxShadow: 3, width: "100%" }}>
              <CardContent>
                {/* Header: User Info with Date on Right */}
                <Box display="flex" alignItems="center" justifyContent="space-between" >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar>{post.username?.charAt(0)}</Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {post.username ? post.username : post.user.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {post.time ? post.time : format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                  </Typography>
                </Box>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.primary" fontSize={20} textAlign='start' mb={7}>
                  {post.content}
                </Typography>

                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {post.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`${tag.course_code} - ${tag.course_name}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                  }
                  <Chip
                    label={post.tags?.[0].varsity}
                    color="primary"
                    variant="outlined"
                  />
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
          </Box>
        </Container>
      ))}
    </Box>
  );
};

export default Home;

