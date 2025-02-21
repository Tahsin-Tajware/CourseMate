import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";
const PostById = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      const res = await customAxios.get(`/post_by_id/${post_id}`);
      setPost(res.data.post);
    }
    fetchPost();
  }, [post_id]);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )

}
export default PostById;