import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  People,
  Comment,
  PostAdd,
  Report,
  TrendingUp,
  TrendingDown,
  Reply,
  ModeComment,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Home = () => {
  const theme = useTheme();

  const stats = [
    {
      title: "Total Users",
      value: "150",
      icon: <People />,
      color: "primary",
    },
    {
      title: "Comments",
      value: "345",
      icon: <Comment />,
      color: "secondary",
    },
    {
      title: "Posts",
      value: "275",
      icon: <PostAdd />,
      color: "success",
    },
    {
      title: "Reports",
      value: "45",
      icon: <Report />,
      color: "warning",
    },
  ];

  const charts = [
    {
      title: "New Users",
      data: [10, 12, 14, 16, 18, 20, 22],
      trend: "up",
    },
    {
      title: "New Comments",
      data: [5, 10, 15, 10, 15, 20, 25],
      trend: "down",
    },
    {
      title: "Post Engagement",
      data: [20, 25, 30, 35, 40, 45, 50],
      trend: "up",
    },
  ];

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

  // Function to generate dynamic colors
  const getDynamicColor = (index) => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff6361"];
    return colors[index % colors.length];
  };

  return (
    <Box p={3} sx={{ animation: `${fadeIn} 1s ease-in-out` }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "black", // Change text color to black
          textAlign: "center",
          mb: 3,
        }}
      >
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: (theme) => theme.palette[stat.color].light,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                sx={{
                  fontSize: 40,
                  color: (theme) => theme.palette[stat.color].main,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
                {stat.title}
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Grid container spacing={3}>
          {charts.map((chart, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {chart.title}
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chart.data.map((value, index) => ({ name: `Day ${index + 1}`, value }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={getDynamicColor(index)}
                        strokeWidth={4} 
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: chart.trend === "up" ? "success.main" : "error.main",
                      }}
                    >
                      {chart.trend === "up" ? (
                        <TrendingUp fontSize="small" />
                      ) : (
                        <TrendingDown fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {chart.trend === "up" ? "Increasing" : "Decreasing"}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="inherit">
                      <Reply fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Recent Posts
        </Typography>
        {posts.map((post) => (
          <Card
            key={post.id}
            sx={{
              bgcolor: "background.paper",
              mb: 2,
              borderRadius: 3,
              boxShadow: 2,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
                  {post.username[0]}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {post.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.time} ago
                </Typography>
              </Box>

              <Typography variant="body1" color="text.primary">
                {post.content}
              </Typography>

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
                  <Typography variant="body2">
                    {post.answers} Answers
                  </Typography>
                </Box>
                <IconButton size="small" color="inherit">
                  <Reply fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
