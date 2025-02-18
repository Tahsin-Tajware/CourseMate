import React, { useState, useEffect, useRef } from "react";
import { IconButton, CircularProgress, TextField, Tooltip, Box, Typography, Checkbox, FormControlLabel, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axiosPrivate from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import { Toaster, toast } from 'sonner';
import { useNavigate } from "react-router-dom";
const AskQuestion = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({
    title: "",
    content: "",
    tags: [{ course_name: "", course_code: "", varsity: auth.user.varsity }],
    is_anonymous: false,
  });

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
  }, [auth]);

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setQuestion({ ...question, is_anonymous: e.target.checked });
  };

  const handleTagChange = (index, field, value) => {
    const updatedTags = [...question.tags];
    updatedTags[index][field] = value;
    varsity: updatedTags[index].varsity || auth?.user?.varsity
    setQuestion({ ...question, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (question.tags.length >= 5) {
      toast.error('can\'t add more than 5 tags')
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
      toast.error('Title must be added')
      return true;
    }
    if (!question.content.length) {
      toast.error('Give proper description')
      return true;
    }
    if (question.tags.length < 1) {
      toast.error('Add at least one tag')
      return true;
    }
    const invalidTags = question.tags.filter(tag => !tag.course_name || !tag.course_code);

    if (invalidTags.length > 0) {
      toast.error("Please fill out all course name and course code fields in the tags.");
      return false;
    }
    return true;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkError()) {
      setLoading(true);
      const updatedTags = question.tags.map(tag => ({
        ...tag,
        varsity: tag.varsity || auth?.user?.varsity
      }));
      try {
        const response = await axiosPrivate.post('/create-post', { ...question, tags: updatedTags });

        toast.success("Question submitted successfully!");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        console.log("Submitted Question:", question);
        setQuestion({
          title: "",
          content: "",
          tags: [{ course_name: "", course_code: "", varsity: auth.user.varsity }],
          is_anonymous: false,
        });
      }
    }
  };

  return (
    <Box maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto', }}>

      <Toaster richColors />


      {loading ?
        <CircularProgress sx={{ color: 'orange' }} />
        :

        <>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Ask Question
          </Typography>

          <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
                    Tags
                  </Typography>
                  {question.tags.map((tag, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <TextField
                        label="Course Title"
                        variant="filled"
                        value={tag.course_name}
                        onChange={(e) => handleTagChange(index, "course_name", e.target.value)}
                        sx={{ mr: 1 }}
                        inputProps={{ maxLength: 30 }}
                      />
                      <TextField
                        label="Course Code"
                        variant="filled"
                        value={tag.course_code}
                        onChange={(e) => handleTagChange(index, "course_code", e.target.value)}
                        sx={{ mr: 1 }}
                        inputProps={{ maxLength: 10 }}
                      />
                      {index > 0 && (
                        <IconButton size="large" onClick={() => handleRemoveTag(index)}>
                          <RemoveCircleIcon sx={{ fontSize: "30px", color: "red" }} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Tooltip title='add tag'>
                    <div
                      className="border-none  bg-orange-400 flex items-start w-fit rounded-3xl"
                      onClick={handleAddTag}
                    >
                      <AddIcon sx={{ fontSize: "30px", color: 'white' }} />
                    </div>
                  </Tooltip>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "left" }}>
                  <FormControlLabel
                    control={<Checkbox checked={question.is_anonymous} onChange={handleCheckboxChange} />}
                    label="Post anonymously"
                    sx={{ textAlign: "left" }}
                  />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="flex-end">
                  <button type="submit" className="bg-orange-600 text-white rounded-md p-2" onClick={handleSubmit}>
                    Create Post
                  </button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </>
      }
    </Box>
  );
};

export default AskQuestion;
