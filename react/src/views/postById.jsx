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
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Reply as ReplyIcon,
  ModeComment,
  Share as ShareIcon,
  MoreVert,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { format, parseISO } from "date-fns";
import axiosPrivate from "../api/axiosPrivate";
import { useAuth } from "../context/authContext";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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
  const [reportReason, setReportReason] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [auth] = useAuth();

  const fetchPost = useCallback(async () => {
    try {
      const res = await customAxios.get(`/post_by_id/${post_id}`);
      setPost(res.data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, [post_id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await customAxios.get(`/comment/${post_id}`);
      const fetched = res.data.comments.original || res.data.comments || [];
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

  const handleAddComment = async (parentId = null) => {
    const commentContent = parentId ? replyContent : newComment;
    const images = parentId ? replyImages : commentImages;
    const pdf = parentId ? replyPdf : commentPdf;
    if (commentContent.trim()) {
      try {
        const formData = new FormData();
        formData.append("content", commentContent);
        if (parentId) formData.append("parent_id", parentId);
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
        if (pdf) {
          formData.append("pdf", pdf);
        }
        const res = await axiosPrivate.post(`/comment/${post_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosPrivate.delete(`/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      handleMenuClose();
      fetchComments();
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

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

  const handleVotePost = async (value) => {
    try {
      const res = await axiosPrivate.post("/vote", {
        votable_type: "post",
        votable_id: post_id,
        value,
      });
      const { netVotes, userVote, voteId } = res.data;
      setPost((prev) =>
        prev
          ? { ...prev, votes_count: netVotes, user_vote: userVote, vote_id: voteId ?? prev.vote_id }
          : null
      );
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };

  const handleRemoveVotePost = async () => {
    if (!post?.vote_id) return;
    try {
      const res = await axiosPrivate.delete(`/vote/${post.vote_id}`);
      const { netVotes, userVote } = res.data;
      setPost((prev) =>
        prev ? { ...prev, votes_count: netVotes, user_vote: userVote, vote_id: null } : null
      );
    } catch (error) {
      console.error("Error removing vote from post:", error);
    }
  };

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
            return { ...c, votes_count: netVotes, user_vote: userVote, vote_id: voteId ?? c.vote_id };
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

  const handleRemoveCommentVote = async (commentId, voteId) => {
    if (!voteId) return;
    try {
      const res = await axiosPrivate.delete(`/vote/${voteId}`);
      const { netVotes, userVote } = res.data;
      const updateCommentVotes = (commentList) =>
        commentList.map((c) => {
          if (c.id === commentId) {
            return { ...c, votes_count: netVotes, user_vote: userVote, vote_id: null };
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
    if (type === "image") {
      const validImages = files.filter((file) => file.type.startsWith("image/"));
      if (validImages.length + (isReply ? replyImages.length : commentImages.length) > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }
      isReply
        ? setReplyImages([...replyImages, ...validImages])
        : setCommentImages([...commentImages, ...validImages]);
    } else if (type === "pdf" && files[0].type === "application/pdf") {
      isReply ? setReplyPdf(files[0]) : setCommentPdf(files[0]);
    } else {
      alert(`Invalid file type for ${type}. Please upload a valid file.`);
    }
    setHasAttachments(true);
  };

  const handleRemoveImage = (index, isReply = false) => {
    isReply
      ? setReplyImages(replyImages.filter((_, i) => i !== index))
      : setCommentImages(commentImages.filter((_, i) => i !== index));
  };

  const handleRemovePdf = (isReply = false) => {
    isReply ? setReplyPdf(null) : setCommentPdf(null);
  };

  const handleReportComment = async () => {
    if (reportReason.trim()) {
      try {
        await axiosPrivate.post(`/comment/report/${reportingCommentId}`, { reason: reportReason });
        setReportDialogOpen(false);
        setReportReason("");
        setReportingCommentId(null);
        alert("Comment reported successfully!");
      } catch (error) {
        console.error("Error reporting comment:", error);
      }
    }
  };

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
        <Collapse in={!comment.parent_id || expandedComments[comment.id]} timeout="auto" unmountOnExit>
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
              <Button variant="contained" size="small" color="primary" onClick={() => handleEditComment(comment.id)}>
                <SendIcon />
              </Button>
              <Button variant="text" size="small" color="secondary" onClick={() => setEditingCommentId(null)}>
                <RemoveCircleIcon fontSize="small" />
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="text.primary" sx={{ wordBreak: "break-word", textAlign: "left", ml: 7 }}>
              {comment.content}
            </Typography>
          )}
          <Box display="flex" alignItems="center" gap={1} mt={1} ml={6}>
            <IconButton
              size="small"
              color={comment.user_vote === 1 ? "primary" : "inherit"}
              onClick={() => handleCommentVote(comment.id, 1)}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight="bold">
              {comment.votes_count || 0}
            </Typography>
            <IconButton
              size="small"
              color={comment.user_vote === -1 ? "secondary" : "inherit"}
              onClick={() => handleCommentVote(comment.id, -1)}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
            {comment.user_vote !== 0 && comment.vote_id && (
              <Button
                variant="text"
                size="small"
                color="error"
                onClick={() => handleRemoveCommentVote(comment.id, comment.vote_id)}
              >
                <RemoveCircleIcon fontSize="small" />
              </Button>
            )}
            <IconButton
              size="small"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(event) => handleMenuOpen(event, comment.id)}>
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
                  <MenuItem onClick={() => handleEditClick(comment)}>
                    <EditIcon fontSize="small" />
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteComment(comment.id)}>
                    <DeleteIcon fontSize="small" />
                    Delete
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={() => {
                    setReportDialogOpen(true);
                    setReportingCommentId(comment.id);
                    handleMenuClose();
                  }}
                >
                  <MoreVert fontSize="small" />
                  Report
                </MenuItem>
              )}
            </Menu>
          </Box>
          {replyingTo === comment.id && (
            <Box mt={2} display="flex" flexDirection="column" gap={1} ml={7}>
              <TextField
                label="Reply"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddComment(comment.id)}
                      sx={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        minWidth: '40px',
                        minHeight: '40px',
                      }}
                    >
                      <SendIcon />
                    </Button>
                  ),
                }}
              />
            </Box>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <Box ml={2} mt={2}>
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
    <Container maxWidth="md" sx={{ mt: 4, px: { xs: 2, md: 6 } }}>
      <Card sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3, mb: 3, p: 3 }}>
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
          <Grid container alignItems="center" justifyContent="space-between" mt={2}>
            <Grid item display="flex" alignItems="center">
              <IconButton
                size="small"
                color={post.user_vote === 1 ? "primary" : "default"}
                onClick={() => handleVotePost(1)}
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
              <Typography variant="body2" fontWeight="bold">
                {post.votes_count || 0}
              </Typography>
              <IconButton
                size="small"
                color={post.user_vote === -1 ? "secondary" : "default"}
                onClick={() => handleVotePost(-1)}
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
              {post.user_vote !== 0 && post.vote_id && (
                <Button variant="outlined" size="small" color="error" onClick={handleRemoveVotePost} sx={{ ml: 1 }}>
                  <RemoveCircleIcon fontSize="small" />
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
      <Card sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3, p: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Add a comment
        </Typography>
        <Box display="flex" alignItems="center">
          <TextField
            label="Add a comment"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => { e.preventDefault(); handleAddComment(); }}
                  sx={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    minWidth: '40px',
                    minHeight: '40px'
                  }}
                >
                  <SendIcon />
                </Button>
              ),
            }}
          />
        </Box>
      </Card>
      <Card sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Comments
        </Typography>
        {renderComments(showAllComments ? comments : comments.slice(0, 10))}
        {comments.length > 10 && !showAllComments && (
          <Button onClick={() => setShowAllComments(true)} sx={{ mt: 2 }}>
            See All Comments
          </Button>
        )}
      </Card>
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Report Comment
          </Typography>
          <TextField
            label="Enter report reason"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleReportComment}>
            Submit Report
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PostById;