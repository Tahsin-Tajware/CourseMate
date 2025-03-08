import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Chip, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";

const TagsList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await customAxios.get("/tags");
        setTags(res.data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tagId, courseCode, courseName) => {
    navigate(`/posts-by-tag/${tagId}`, {
      state: { message: `${courseCode} - ${courseName}` },
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        All Tags
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" gap={2}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={`${tag.course_code} - ${tag.course_name}`}
            sx={{
              m: 1,
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '10px 15px',
              borderRadius: '16px',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
            onClick={() => handleTagClick(tag.id, tag.course_code, tag.course_name)}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default TagsList;
