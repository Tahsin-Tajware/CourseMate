import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
  TextField,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
  Dialog,
  DialogContent,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Reply as ReplyIcon,
  ModeComment,
  Share as ShareIcon,
  MoreVert,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import axiosPrivate from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PostById = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [commentImages, setCommentImages] = useState([]);
  const [commentPdf, setCommentPdf] = useState(null);
  const [replyImages, setReplyImages] = useState([]);
  const [replyPdf, setReplyPdf] = useState(null);
  const [hasAttachments, setHasAttachments] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [auth] = useAuth();

  // 1) Fetch the post (with votes_count, user_vote, and vote_id if returned)
  const fetchPost = useCallback(async () => {
    try {
      const res = await customAxios.get(`/post_by_id/${post_id}`);
      setPost(res.data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, [post_id]);

  // 2) Fetch comments (with votes_count, user_vote, and vote_id if returned)
  const fetchComments = useCallback(async () => {
    try {
      const res = await customAxios.get(`/comment/${post_id}`);
      const fetched = res.data.comments.original || [];
      setComments(fetched);

      const initialExpanded = {};
      fetched.forEach((c) => {
        if (!c.parent_id) {
          initialExpanded[c.id] = true;
        }
      });
      setExpandedComments(initialExpanded);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post_id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  /**
   * Add a top-level or reply comment
   */
  const handleAddComment = async (parentId = null) => {
    const commentContent = parentId ? replyContent : newComment;
    const images = parentId ? replyImages : commentImages;
    const pdf = parentId ? replyPdf : commentPdf;

    if (commentContent.trim()) {
      try {
        const formData = new FormData();
        formData.append('content', commentContent);
        if (parentId) formData.append('parent_id', parentId);
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
        if (pdf) {
          formData.append('pdf', pdf);
        }

        const res = await axiosPrivate.post(`/comment/${post_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setComments((prev) => [...prev, res.data.comment]);
        setNewComment("");
        setReplyContent("");
        setReplyingTo(null);
        setCommentImages([]);
        setCommentPdf(null);
        setReplyImages([]);
        setReplyPdf(null);
        fetchComments();
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  /**
   * Delete a comment
   */
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosPrivate.delete(`/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      handleMenuClose();
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  /**
   * Edit a comment
   */
  const handleEditComment = async (commentId) => {
    try {
      await axiosPrivate.put(`/update-comment/${commentId}`, { content: editContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editContent } : c))
      );
      setEditingCommentId(null);
      handleMenuClose();
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Menu handling for comment options
  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setCurrentCommentId(commentId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentCommentId(null);
  };

  const toggleExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // =============== Voting Logic for Post ===============
  const handleVotePost = async (value) => {
    try {
      const res = await axiosPrivate.post("/vote", {
        votable_type: "post",
        votable_id: post_id,
        value,
      });
      // netVotes & userVote returned from backend (optionally voteId)
      const { netVotes, userVote, voteId } = res.data;
      setPost((prev) =>
        prev
          ? {
            ...prev,
            votes_count: netVotes,
            user_vote: userVote,
            vote_id: voteId ?? prev.vote_id, // store voteId if returned
          }
          : null
      );
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };

  /**
   * Remove vote on the main post
   */
  const handleRemoveVotePost = async () => {
    if (!post?.vote_id) return; // no vote to remove
    try {
      const res = await axiosPrivate.delete(`/vote/${post.vote_id}`);
      const { netVotes, userVote } = res.data;
      // userVote should be 0, voteId => null
      setPost((prev) =>
        prev
          ? {
            ...prev,
            votes_count: netVotes,
            user_vote: userVote,
            vote_id: null,
          }
          : null
      );
    } catch (error) {
      console.error("Error removing vote from post:", error);
    }
  };

  // =============== Voting Logic for Comments ===============
  const handleCommentVote = async (commentId, value) => {
    try {
      const res = await axiosPrivate.post("/vote", {
        votable_type: "comment",
        votable_id: commentId,
        value,
      });
      const { netVotes, userVote, voteId } = res.data;

      const updateCommentVotes = (commentList) =>
        commentList.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              votes_count: netVotes,
              user_vote: userVote,
              vote_id: voteId ?? c.vote_id,
            };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateCommentVotes(c.replies) };
          }
          return c;
        });

      setComments((prev) => updateCommentVotes(prev));
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  /**
   * Remove vote on a comment
   */
  const handleRemoveCommentVote = async (commentId, voteId) => {
    if (!voteId) return;
    try {
      const res = await axiosPrivate.delete(`/vote/${voteId}`);
      const { netVotes, userVote } = res.data;

      const updateCommentVotes = (commentList) =>
        commentList.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              votes_count: netVotes,
              user_vote: userVote,
              vote_id: null,
            };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateCommentVotes(c.replies) };
          }
          return c;
        });

      setComments((prev) => updateCommentVotes(prev));
    } catch (error) {
      console.error("Error removing comment vote:", error);
    }
  };

  const handleFileUpload = (e, type, isReply = false) => {
    const files = Array.from(e.target.files);
    if (type === 'image') {
      const validImages = files.filter(file => file.type.startsWith('image/'));
      if (validImages.length + (isReply ? replyImages.length : commentImages.length) > 5) {
        alert('You can upload a maximum of 5 images.');
        return;
      }
      if (isReply) {
        setReplyImages([...replyImages, ...validImages]);
      } else {
        setCommentImages([...commentImages, ...validImages]);
      }
    } else if (type === 'pdf' && files[0].type === 'application/pdf') {
      if (isReply) {
        setReplyPdf(files[0]);
      } else {
        setCommentPdf(files[0]);
      }
    } else {
      alert(`Invalid file type for ${type}. Please upload a valid file.`);
    }
    setHasAttachments(true);
  };

  const handleRemoveImage = (index, isReply = false) => {
    if (isReply) {
      const updatedImages = replyImages.filter((_, i) => i !== index);
      setReplyImages(updatedImages);
    } else {
      const updatedImages = commentImages.filter((_, i) => i !== index);
      setCommentImages(updatedImages);
    }
  };

  const handleRemovePdf = (isReply = false) => {
    if (isReply) {
      setReplyPdf(null);
    } else {
      setCommentPdf(null);
    }
  };

  // Recursively render comments and nested replies
  const renderComments = (commentList) =>
    commentList.map((comment) => (
      <Box
        key={comment.id}
        sx={{
          borderLeft: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: "8px 0 0 8px",
          pl: 2,
          mb: 2,
          width: "100%",
        }}
      >
        {/* Comment header */}
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {comment.parent_id && (
              <IconButton
                size="small"
                onClick={() => toggleExpand(comment.id)}
                sx={{
                  transition: "transform 0.2s",
                  transform: expandedComments[comment.id] ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ExpandMore fontSize="small" />
              </IconButton>
            )}
            <Avatar sx={{ bgcolor: theme.palette.grey[500] }}>
              {comment.user?.name?.charAt(0) || comment.username?.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
              {comment.user?.name || comment.username}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" ml={2}>
            {format(parseISO(comment.created_at), "MMMM d, yyyy h:mm a")}
          </Typography>
        </Box>

        <Collapse
          in={!comment.parent_id || expandedComments[comment.id]}
          timeout="auto"
          unmountOnExit
        >
          {/* Edit mode or display mode */}
          {editingCommentId === comment.id ? (
            <Box mt={2} display="flex" alignItems="center" gap={1}>
              <TextField
                label="Edit Comment"
                variant="outlined"
                fullWidth
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" color="primary" onClick={() => handleEditComment(comment.id)}>
                Save
              </Button>
              <Button variant="text" color="secondary" onClick={() => setEditingCommentId(null)}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ wordBreak: "break-word", textAlign: "left", ml: 7 }}
            >
              {comment.content}
            </Typography>
          )}

          {/* Voting + Reply + Share */}
          <Box display="flex" alignItems="center" gap={1} mt={1} ml={6}>
            {/* Upvote arrow */}
            <IconButton
              size="small"
              color={comment.user_vote === 1 ? "primary" : "default"}
              onClick={() => handleCommentVote(comment.id, 1)}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
            {/* Net votes */}
            <Typography variant="body2" fontWeight="bold">
              {comment.votes_count || 0}
            </Typography>
            {/* Downvote arrow */}
            <IconButton
              size="small"
              color={comment.user_vote === -1 ? "secondary" : "default"}
              onClick={() => handleCommentVote(comment.id, -1)}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>

            {/* Remove Vote if user has a vote */}
            {comment.user_vote !== 0 && comment.vote_id && (
              <Button
                size="small"
                color="error"
                onClick={() => handleRemoveCommentVote(comment.id, comment.vote_id)}
              >
                Remove Vote
              </Button>
            )}

            <Button
              size="small"
              color="primary"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              startIcon={<ReplyIcon fontSize="small" />}
            >
              Reply
            </Button>
            <Button size="small" color="secondary" startIcon={<ShareIcon fontSize="small" />}>
              Share
            </Button>
            <IconButton
              size="small"
              aria-controls="comment-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuOpen(event, comment.id)}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              id="comment-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl) && currentCommentId === comment.id}
              onClose={handleMenuClose}
            >
              {comment.user_id === auth?.user?.id ? (
                <>
                  <MenuItem onClick={() => handleEditClick(comment)}>Edit</MenuItem>
                  <MenuItem onClick={() => handleDeleteComment(comment.id)}>Delete</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleMenuClose}>Report</MenuItem>
              )}
            </Menu>
          </Box>

          {/* Reply input */}
          {replyingTo === comment.id && (
            <Box mt={2} display="flex" flexDirection="column" gap={1} ml={7}>
              <TextField
                label="Reply"
                variant="outlined"
                fullWidth
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                sx={{ flexGrow: 1 }}
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
              {(replyImages.length > 0 || replyPdf) && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
                    Attachments
                  </Typography>
                  {replyImages.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {replyImages.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Selected ${index}`}
                            style={{ maxHeight: '50px', cursor: 'pointer' }}
                          />
                          <IconButton
                            size="small"
                            sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white' }}
                            onClick={() => handleRemoveImage(index, true)}
                          >
                            <RemoveCircleIcon sx={{ fontSize: "20px", color: "red" }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {replyPdf && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PictureAsPdfIcon color="secondary" />
                      <Typography variant="body2">
                        {replyPdf.name}
                      </Typography>
                      <IconButton size="small" onClick={() => handleRemovePdf(true)}>
                        <RemoveCircleIcon sx={{ fontSize: "20px", color: "red" }} />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
              <Button variant="contained" color="primary" onClick={() => handleAddComment(comment.id)}>
                Reply
              </Button>
            </Box>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <Box pl={4} mt={2}>
              {renderComments(comment.replies)}
            </Box>
          )}
        </Collapse>
      </Box>
    ));

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: { xs: 2, md: 6 } }}>
      {/* Main Post Card */}
      <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, mb: 3, p: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: theme.palette.grey[500] }}>
                {post.username?.charAt(0) || post.user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {post.username || post.user?.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom mt={2}>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.primary" fontSize={18} textAlign="start" mb={2}>
            {post.content}
          </Typography>

          {/* Tags */}
          <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
            {post.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={`${tag.course_code} - ${tag.course_name}`}
                sx={{
                  bgcolor: "transparent",
                  color: theme.palette.text.primary,
                  borderRadius: 1,
                  fontWeight: "bold",
                  margin: "4px",
                  border: `1px solid ${theme.palette.grey[400]}`,
                }}
              />
            ))}
          </Stack>

          {/* Post Voting + Comment Count */}
          <Grid container alignItems="center" justifyContent="space-between" mt={2}>
            <Grid item display="flex" alignItems="center">
              {/* Upvote arrow */}
              <IconButton
                size="small"
                color={post.user_vote === 1 ? "primary" : "default"}
                onClick={() => handleVotePost(1)}
              >
                <ArrowUpward fontSize="small" />
              </IconButton>

              {/* Net votes */}
              <Typography variant="body2" fontWeight="bold">
                {post.votes_count || 0}
              </Typography>

              {/* Downvote arrow */}
              <IconButton
                size="small"
                color={post.user_vote === -1 ? "secondary" : "default"}
                onClick={() => handleVotePost(-1)}
              >
                <ArrowDownward fontSize="small" />
              </IconButton>

              {/* Remove Vote if user has a vote */}
              {post.user_vote !== 0 && post.vote_id && (
                <Button
                  size="small"
                  color="error"
                  onClick={handleRemoveVotePost}
                  sx={{ ml: 1 }}
                >
                  Remove Vote
                </Button>
              )}
            </Grid>

            <Grid item display="flex" alignItems="center">
              <ModeComment fontSize="small" color="action" />
              <Typography variant="body2" ml={0.5}>
                {comments.length} Answers
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size="small">
                <ReplyIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Add new comment */}
<Box width="100%" mb={4}>
  <TextField
    label="Add a comment"
    variant="outlined"
    fullWidth
    multiline
    rows={isMobile ? 3 : 5}
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    sx={{ mb: 2 }}
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
  {(commentImages.length > 0 || commentPdf) && (
    <>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
        Attachments
      </Typography>
      {commentImages.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {commentImages.map((image, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Selected ${index}`}
                style={{ maxHeight: '50px', cursor: 'pointer' }}
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
      {commentPdf && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PictureAsPdfIcon color="secondary" />
          <Typography variant="body2">
            {commentPdf.name}
          </Typography>
          <IconButton size="small" onClick={handleRemovePdf}>
            <RemoveCircleIcon sx={{ fontSize: "20px", color: "red" }} />
          </IconButton>
        </Box>
      )}
    </>
  )}
  <Button
    variant="contained"
    color="primary"
    onClick={(e) => {
      e.preventDefault();
      handleAddComment();
    }}
  >
    Add Comment
  </Button>
</Box>


      {/* Comments Section */}
      <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Comments
        </Typography>
        {renderComments(
          showAllComments ? comments : comments?.slice(0, 10) // optional slice
        )}
        {comments.length > 10 && !showAllComments && (
          <Button onClick={() => setShowAllComments(true)} sx={{ mt: 2 }}>
            See All Comments
          </Button>
        )}
      </Card>

      <Menu
        id="comment-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'image', replyingTo !== null)}
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
            onChange={(e) => handleFileUpload(e, 'pdf', replyingTo !== null)}
            style={{ display: 'none' }}
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            Upload PDF
          </label>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default PostById;
