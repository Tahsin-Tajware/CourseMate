import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Reply,
  ModeComment,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
const PostByTag = () => {
  const [posts, setPost] = useState([]);
  const { tag_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const theme = useTheme();
  const sortedPosts = posts.sort((a, b) =>
    new Date(b.created_at || b.time) - new Date(a.created_at || a.time)
  );
  useEffect(() => {
    const fetchPostByTag = async () => {
      const result = await customAxios.get(`/post_by_tag/${tag_id}`)
      setPost(result.data.posts);
    }
    fetchPostByTag();
  }, [tag_id]);
  const handleGetPostByTag = (tag_id, course_code, course_name) => {
    navigate(`/posts-by-tag/${tag_id}`, { state: { message: `${course_code} - ${course_name}` } });
  }
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" width="100%">
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: { xs: 2, md: 6 } }}>
        <Box display="flex" flexDirection="row" mb={3}>

          <div className="text-2xl mr-2">
            Showing results for
          </div>
          <div className="text-2xl font-semibold text-orange-600">
            {message}
          </div>

        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, mb: 3, width: '100%' }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>{post.username?.charAt(0) || post.user?.name?.charAt(0)}</Avatar>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {post.username || post.user?.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {post.time || format(parseISO(post.created_at), "MMMM d, yyyy h:mm a")}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.primary" fontSize={20} textAlign='start' mb={2}>
                    {post.content}
                  </Typography>

                  <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                    {post.tags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`${tag.course_code} - ${tag.course_name}`}
                        sx={{
                          bgcolor: 'transparent',
                          color: theme.palette.text.primary,
                          borderRadius: 1,
                          fontWeight: 'bold',
                          margin: '4px',
                          border: `1px solid ${theme.palette.grey[400]}`,
                        }}
                        onClick={() => handleGetPostByTag(tag.id, tag.course_code, tag.course_name)}
                      />
                    ))}
                    {post.tags?.[0] && (
                      <Chip
                        label={post.tags[0].varsity}
                        sx={{
                          bgcolor: 'transparent',
                          color: theme.palette.primary.main,
                          borderRadius: 1,
                          fontWeight: 'bold',
                          margin: '4px',
                          border: `1px solid ${theme.palette.primary.main}`,
                        }}
                      />
                    )}
                  </Stack>

                  {/* Post Actions */}
                  <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                    {/* Voting System */}
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

                    {/* Comments */}
                    <Grid item display="flex" alignItems="center">
                      <ModeComment fontSize="small" color="action" />
                      <Typography variant="body2" ml={0.5}>
                        {post.answers} Answers
                      </Typography>
                    </Grid>

                    <Grid item>
                      <IconButton size="small">
                        <Reply fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>



        </Grid>
      </Container>
    </Box>
  )
}
export default PostByTag;