import React, { useState, useEffect, useRef } from "react";
import { IconButton, CircularProgress, TextField, Tooltip, Box, Typography, Checkbox, FormControlLabel, Grid, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axiosPrivate from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { Toaster, toast } from 'sonner';
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const { postId } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({
    title: "",
    content: "",
    tags: [{ course_name: "", course_code: "", varsity: auth.user.varsity }],
    is_anonymous: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosPrivate.get(`/post_by_id/${postId}`);
        const postData = response.data.post;
        setQuestion({
          title: postData.title,
          content: postData.content,
          tags: postData.tags.map(tag => ({
            course_name: tag.course_name,
            course_code: tag.course_code,
            varsity: tag.varsity
          })),
          is_anonymous: postData.is_anonymous,
        });
      } catch (err) {
        toast.error("Failed to fetch post data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, auth]);

  const hasShownToast = useRef(false);
  useEffect(() => {
    if (!auth?.user?.varsity && !hasShownToast.current) {
      toast.warning("Please update your varsity info in profile before asking a question", {
        action: {
          label: "Update Now",
          onClick: () => navigate("/profile"),
        },
        duration: 5000,
      });

      hasShownToast.current = true;
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setQuestion({ ...question, is_anonymous: e.target.checked });
  };

  const handleTagChange = (index, field, value) => {
    const updatedTags = [...question.tags];
    updatedTags[index][field] = value;
    setQuestion({ ...question, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (question.tags.length >= 5) {
      toast.error('Can\'t add more than 5 tags');
      return;
    }
    setQuestion({ ...question, tags: [...question.tags, { course_name: "", course_code: "", varsity: auth?.user?.varsity }] });
  };

  const handleRemoveTag = (index) => {
    const updatedTags = question.tags.filter((_, i) => i !== index);
    setQuestion({ ...question, tags: updatedTags });
  };

  const checkError = () => {
    if (!question.title.length) {
      toast.error('Title must be added');
      return false;
    }
    if (!question.content.length) {
      toast.error('Give proper description');
      return false;
    }
    if (question.tags.length < 1) {
      toast.error('Add at least one tag');
      return false;
    }
    const invalidTags = question.tags.filter(tag => !tag.course_name || !tag.course_code);

    if (invalidTags.length > 0) {
      toast.error("Please fill out all course name and course code fields in the tags.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkError()) {
      setLoading(true);
      const updatedTags = question.tags.map(tag => ({
        ...tag,
        varsity: tag.varsity || auth?.user?.varsity
      }));
      try {
        const response = await axiosPrivate.put(`/update_post/${postId}`, { ...question, tags: updatedTags });
        toast.success("Post updated successfully!");
        navigate("/myposts");
      } catch (error) {
        toast.error("Error updating post.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto', p: 3, backgroundColor: '#f9f9f9', borderRadius: 4, boxShadow: 2 }}>
      <Toaster richColors position="top-right" />
      {loading ?
        <CircularProgress sx={{ color: 'orange' }} />
        :
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: '#333' }}>
            Update Post
          </Typography>
          <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 3, boxShadow: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left", mb: 1, color: '#555' }}>
                    Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Be specific, and imagine you're asking a question to another person."
                    name="title"
                    value={question.title}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      style: { borderRadius: 10, backgroundColor: '#f0f0f0' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left", mb: 1, color: '#555' }}>
                    What are the details of your problem?
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
                    name="content"
                    value={question.content}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                    InputProps={{
                      style: { borderRadius: 10, backgroundColor: '#f0f0f0' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left", mb: 1, color: '#555' }}>
                    Tags
                  </Typography>
                  {question.tags.map((tag, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <TextField
                        label="Course Title"
                        variant="filled"
                        value={tag.course_name}
                        onChange={(e) => handleTagChange(index, "course_name", e.target.value)}
                        sx={{ mr: 1, backgroundColor: '#f0f0f0', borderRadius: 2 }}
                        inputProps={{ maxLength: 30 }}
                      />
                      <TextField
                        label="Course Code"
                        variant="filled"
                        value={tag.course_code}
                        onChange={(e) => handleTagChange(index, "course_code", e.target.value)}
                        sx={{ mr: 1, backgroundColor: '#f0f0f0', borderRadius: 2 }}
                        inputProps={{ maxLength: 10 }}
                      />
                      {index > 0 && (
                        <IconButton size="large" onClick={() => handleRemoveTag(index)}>
                          <RemoveCircleIcon sx={{ fontSize: "30px", color: "red" }} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Tooltip title='Add Tag'>
                    <IconButton size="large" onClick={handleAddTag} sx={{ backgroundColor: '#ff9800', color: 'white', '&:hover': { backgroundColor: '#e68800' } }}>
                      <AddIcon sx={{ fontSize: "30px" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" sx={{ backgroundColor: '#117a0b', color: 'white', '&:hover': { backgroundColor: '#25b81d' }, borderRadius: 2, px: 4 }}>
                    Update Post
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </>
      }
    </Box>
  );
};

export default UpdatePost;
