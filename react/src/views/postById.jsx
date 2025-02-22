import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";
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
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Reply as ReplyIcon,
  ModeComment,
  Share as ShareIcon,
  MoreVert,
  Add,
  Remove,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import axiosPrivate from "../api/axiosPrivate";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await customAxios.get(`/post_by_id/${post_id}`);
        setPost(res.data.post);
        fetchComments();
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await customAxios.get(`/comment/${post_id}`);
        setComments(res.data.comments || []);
        const initialExpanded = {};
        res.data.comments.forEach((comment) => {
          if (!comment.parent_id) {
            initialExpanded[comment.id] = true;
          }
        });
        setExpandedComments(initialExpanded);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
  }, [post_id]);

  const handleAddComment = async (parentId = null) => {
    const commentContent = parentId ? replyContent : newComment;
    if (commentContent.trim()) {
      try {
        const res = await axiosPrivate.post(`/comment/${post_id}`, {
          content: commentContent,
          parent_id: parentId,
        });
        setComments((prevComments) => [...prevComments, res.data.comment]);
        setNewComment("");
        setReplyContent("");
        setReplyingTo(null);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosPrivate.delete(`/comment/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId).map((comment) => ({
          ...comment,
          replies: comment.replies?.filter((reply) => reply.id !== commentId),
        }))
      );
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
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

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <Box
        key={comment.id}
        sx={{
          borderLeft: `4px solid ${theme.palette.grey[300]}`,
          borderRadius: '8px 0 0 8px',
          pl: 2,
          mb: 2,
          width: '100%',
          position: 'relative',
        }}
      >
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => toggleExpand(comment.id)}
              sx={{
                backgroundColor: theme.palette.grey[300],
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {expandedComments[comment.id] ? <Remove fontSize="small" /> : <Add fontSize="small" />}
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
              {comment.user?.name || comment.username}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" ml={2}>
            {format(parseISO(comment.created_at), "MMMM d, yyyy h:mm a")}
          </Typography>
        </Box>
        <Collapse in={expandedComments[comment.id]} timeout="auto" unmountOnExit>
          <Typography variant="body1" color="text.primary" sx={{ wordBreak: 'break-word', textAlign: 'left', marginLeft: 7 }}>
            {comment.content}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <IconButton size="small" color="primary">
              <ArrowUpward fontSize="small" />
            </IconButton>
            <IconButton size="small" color="secondary">
              <ArrowDownward fontSize="small" />
            </IconButton>
            <Button
              size="small"
              color="primary"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              startIcon={<ReplyIcon fontSize="small" />}
            >
              Reply
            </Button>
            <Button
              size="small"
              color="secondary"
              startIcon={<ShareIcon fontSize="small" />}
            >
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
              <MenuItem onClick={() => handleDeleteComment(comment.id)}>Delete</MenuItem>
              <MenuItem onClick={handleMenuClose}>Report</MenuItem>
            </Menu>
          </Box>
          {replyingTo === comment.id && (
            <Box mt={2} display="flex" alignItems="center" gap={1}>
              <TextField
                label="Reply"
                variant="outlined"
                fullWidth
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" color="primary" onClick={() => handleAddComment(comment.id)}>
                Reply
              </Button>
            </Box>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <Box pl={4} mt={2}>
              {renderComments(comment.replies)}
            </Box>
          )}
        </Collapse>
      </Box>
    ));
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: { xs: 2, md: 6 } }}>
      <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, mb: 3, p: 3, width: '100%' }}>
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
            {post.tags?.[0] && (
              <Chip
                label={post.tags[0].varsity}
                sx={{
                  bgcolor: "transparent",
                  color: theme.palette.primary.main,
                  borderRadius: 1,
                  fontWeight: "bold",
                  margin: "4px",
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              />
            )}
          </Stack>

          <Grid container alignItems="center" justifyContent="space-between" mt={2}>
            <Grid item display="flex" alignItems="center">
              <IconButton size="small" color="primary">
                <ArrowUpward fontSize="small" />
              </IconButton>
              <Typography variant="body2" fontWeight="bold">
                {post.votes}
              </Typography>
              <IconButton size="small" color="secondary">
                <ArrowDownward fontSize="small" />
              </IconButton>
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
        />
        <Button variant="contained" color="primary" onClick={(e) => {
          e.preventDefault();
          handleAddComment();
        }}>
          Add Comment
        </Button>
      </Box>

      <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, p: 3, width: '100%' }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Comments
        </Typography>
        {renderComments(comments.slice(0, showAllComments ? comments.length : 10))}
        {comments.length > 10 && !showAllComments && (
          <Button onClick={() => setShowAllComments(true)} sx={{ mt: 2 }}>
            See All Comments
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default PostById;
