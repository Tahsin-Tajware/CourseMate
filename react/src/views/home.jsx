import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Reply,
  ModeComment,
} from "@mui/icons-material";

const Home = () => {
  const posts = [
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
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5">Welcome to CourseMate!</Typography>
      <Typography variant="body1">
        This is the home page where you can explore questions, tags, discussions,
        and more.
      </Typography>

      {posts.map((post) => (
        <Card key={post.id} sx={{ bgcolor: "mintcream", mb: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar>{post.username[0]}</Avatar>
              <Typography variant="subtitle2">{post.username}</Typography>
              <Typography variant="caption" color="text.secondary">
                {post.time}
              </Typography>
            </Box>

            <Typography variant="body2">{post.content}</Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
              px={1}
              color="text.secondary"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton size="small" color="primary">
                  <ArrowUpward fontSize="small" />
                </IconButton>
                <Typography variant="body2">{post.votes}</Typography>
                <IconButton size="small" color="secondary">
                  <ArrowDownward fontSize="small" />
                </IconButton>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ModeComment fontSize="small" />
                <Typography variant="body2">{post.answers} Answers</Typography>
              </Box>
              <IconButton size="small" color="inherit">
                <Reply fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Home;
