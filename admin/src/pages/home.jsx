import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  People,
  Comment,
  PostAdd,
  Report,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Reply,
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
import axiosPrivate from "../api/axiosPrivate";

const API_BASE_URL = "http://127.0.0.1:8000/api/admin";
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
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    // Fetch data from the dailyOverview API
    axiosPrivate.get('/admin/daily-overview')
      .then(response => {
        setOverview(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the overview data!", error);
      });
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: overview ? overview.total_users : "Loading...",
      icon: <People />,
      color: "#4CAF50", // Professional green
    },
    {
      title: "Total Comments",
      value: overview ? overview.total_comments : "Loading...",
      icon: <Comment />,
      color: "#2196F3", // Professional blue
    },
    {
      title: "Total Posts",
      value: overview ? overview.total_posts : "Loading...",
      icon: <PostAdd />,
      color: "#FF9800", // Professional orange
    },
    {
      title: "Total Tags",
      value: overview ? overview.total_tags : "Loading...",
      icon: <LocalOffer />,
      color: "#9E9E9E", // Professional grey
    },
    {
      title: "New Users",
      value: overview ? overview.new_users : "Loading...",
      icon: <People />,
      color: "#FF5722", // Professional deep orange
    },
    {
      title: "New Comments",
      value: overview ? overview.new_comments : "Loading...",
      icon: <Comment />,
      color: "#673AB7", // Professional deep purple
    },
    {
      title: "New Posts",
      value: overview ? overview.new_posts : "Loading...",
      icon: <PostAdd />,
      color: "#E91E63", // Professional pink
    },
    {
      title: "New Tags",
      value: overview ? overview.new_tags : "Loading...",
      icon: <LocalOffer />,
      color: "#9C27B0", // Professional purple
    },
    {
      title: "Reported Comments",
      value: overview ? overview.reported_comments_today : "Loading...",
      icon: <Report />,
      color: "#F44336", // Professional red
    },
  ];

  const charts = [
    {
      title: "New Users",
      data: overview ? [overview.new_users] : [0],
      trend: "up",
    },
    {
      title: "New Comments",
      data: overview ? [overview.new_comments] : [0],
      trend: "down",
    },
    {
      title: "Post Engagement",
      data: overview ? [overview.new_posts] : [0],
      trend: "up",
    },
  ];

  // Function to generate dynamic colors
  const getDynamicColor = (index) => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff6361"];
    return colors[index % colors.length];
  };

  return (
    <Box p={3} sx={{ animation: `${fadeIn} 1s ease-in-out` }}>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: stat.color, // Professional background color
                borderRadius: 2,
                boxShadow: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                sx={{
                  fontSize: 30,
                  color: "white", // White icon color for contrast
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h6" sx={{ mt: 1, color: "white" }}>
                {stat.title}
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold", color: "white" }}>
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
                  borderRadius: 2,
                  boxShadow: 2,
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
    </Box>
  );
};

export default Home;
