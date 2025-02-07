import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Checkbox, FormControlLabel, Grid } from "@mui/material";

const AskQuestion = () => {
  const [question, setQuestion] = useState({
    title: "",
    description: "",
    tags: "",
    anonymous: false,
  });

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setQuestion({ ...question, anonymous: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Question:", question);
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: "#f2f9f2", minHeight: "100vh", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Ask Question
      </Typography>
      <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>Title</Typography>
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
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>What are the details of your problem?</Typography>
              <TextField
                fullWidth
                placeholder="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
                name="description"
                value={question.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>Tags</Typography>
              <TextField
                fullWidth
                placeholder="Add up to 5 tags to describe what your question is about. Start typing to see suggestions."
                name="tags"
                value={question.tags}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={question.anonymous} onChange={handleCheckboxChange} />}
                label="Post anonymously"
                sx={{ textAlign: "left" }}
              />
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="success" sx={{ fontWeight: "bold" }}>
                Create Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default AskQuestion;
