import React, { useState, useEffect, useRef } from "react";
import { IconButton, CircularProgress, TextField, Tooltip, Box, Typography, Checkbox, FormControlLabel, Grid, Menu, MenuItem, Dialog, DialogContent, InputAdornment } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
    images: [],
    pdf: null,
  });

  const hasShownToast = useRef(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [hasAttachments, setHasAttachments] = useState(false);


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
    updatedTags[index].varsity = updatedTags[index].varsity || auth?.user?.varsity;
    setQuestion({ ...question, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (question.tags.length >= 5) {
      toast.error('can\'t add more than 5 tags');
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
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (checkError()) {
  //     setLoading(true);
  //     const updatedTags = question.tags.map(tag => ({
  //       ...tag,
  //       varsity: tag.varsity || auth?.user?.varsity
  //     }));
  //     try {
  //       const formData = new FormData();
  //       formData.append('title', question.title);
  //       formData.append('content', question.content);
  //       formData.append('is_anonymous', question.is_anonymous);
  //       updatedTags.forEach((tag, index) => {
  //         formData.append(`tags[${index}][course_name]`, tag.course_name);
  //         formData.append(`tags[${index}][course_code]`, tag.course_code);
  //         formData.append(`tags[${index}][varsity]`, tag.varsity);
  //       });
  //       question.images.forEach((image, index) => {
  //         formData.append(`images[${index}]`, image);
  //       });
  //       if (question.pdf) {
  //         formData.append('pdf', question.pdf);
  //       }

  //       const response = await axiosPrivate.post('/create-post', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       toast.success("Question submitted successfully!");
  //     } catch (error) {
  //       console.error("Error:", error);
  //     } finally {
  //       setLoading(false);
  //       console.log("Submitted Question:", question);
  //       setQuestion({
  //         title: "",
  //         content: "",
  //         tags: [{ course_name: "", course_code: "", varsity: auth.user.varsity }],
  //         is_anonymous: false,
  //         images: [],
  //         pdf: null,
  //       });
  //     }
  //   }
  // };

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
        navigate('/');
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

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'image') {
      const validImages = files.filter(file => file.type.startsWith('image/'));
      if (validImages.length + question.images.length > 5) {
        toast.error('You can upload a maximum of 5 images.');
        return;
      }
      setQuestion({ ...question, images: [...question.images, ...validImages] });
    } else if (type === 'pdf' && files[0].type === 'application/pdf') {
      setQuestion({ ...question, pdf: files[0] });
    } else {
      toast.error(`Invalid file type for ${type}. Please upload a valid file.`);
    }
    setHasAttachments(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpenImageModal(true);
  };

  const handleImageModalClose = () => {
    setOpenImageModal(false);
    setSelectedImageIndex(null);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = question.images.filter((_, i) => i !== index);
    setQuestion({ ...question, images: updatedImages });
    if (updatedImages.length === 0) {
      setHasAttachments(false);
    }
  };

  const handleRemovePdf = () => {
    setQuestion({ ...question, pdf: null });
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
                  <Box sx={{ position: 'relative' }}>
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title='Add Attachment'>
                              <IconButton onClick={handleMenuOpen}>
                                <AttachFileIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {hasAttachments && (
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
                        Attachments
                      </Typography>
                    )}
                    {question.images.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {question.images.map((image, index) => (
                          <Box key={index} sx={{ position: 'relative' }}>
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Selected ${index}`}
                              style={{ maxHeight: '50px', cursor: 'pointer' }}
                              onClick={() => handleImageClick(index)}
                            />
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white' }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <RemoveCircleIcon sx={{ fontSize: "20px", color: "red" }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {question.pdf && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PictureAsPdfIcon color="secondary" />
                        <Typography variant="body2">
                          {question.pdf.name}
                        </Typography>
                        <IconButton size="small" onClick={handleRemovePdf}>
                          <RemoveCircleIcon sx={{ fontSize: "20px", color: "red" }} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
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
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      style={{ display: 'none' }}
                      id="image-upload"
                      multiple
                    />
                    <label htmlFor="image-upload">
                      Upload Image
                    </label>
                  </MenuItem>
                  <MenuItem>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      style={{ display: 'none' }}
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload">
                      Upload PDF
                    </label>
                  </MenuItem>
                </Menu>
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
          <Dialog open={openImageModal} onClose={handleImageModalClose}>
            <DialogContent>
              {selectedImageIndex !== null && (
                <img
                  src={URL.createObjectURL(question.images[selectedImageIndex])}
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      }
    </Box>
  );
};

export default AskQuestion;
