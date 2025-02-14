import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { fetchsingleblog } from "../features/blogs/blogsSlice";
import { useDispatch, useSelector } from "react-redux";

const ViewBlog = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const fetchedBlog = useSelector((state) => state.blog.singleBlog);
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    if (location.state?._id) {
      setBlogId(location.state._id);
    }
  }, [location.state]);

  useEffect( () => {
        const fetchBlogFunc = async () => {
          if (!blogId) return;
    
          try {
           await dispatch(fetchsingleblog(blogId)).unwrap();
          } catch (error) {
            console.error("Error fetching blog:", error);
          }
        };
        fetchBlogFunc();
;
    
  }, [blogId, dispatch]);

  if (!fetchedBlog) {
    return <div>Loading...</div>;
  }

  return (
    <div id="viewBlogContainer">
      <h1 id="blogTitle">{fetchedBlog.title}</h1>
      <h3 id="blogAuthor">AUTHOR: {fetchedBlog.username?.toUpperCase()}</h3>
      <p id="blogContent">{fetchedBlog.content}</p>

      {fetchedBlog.image && (
        <div id="blogImageContainer">
          <img src={fetchedBlog.image} id="blogImage" alt={fetchedBlog.title || "Blog image"} />
        </div>
      )}
      <CommentSection blogId={blogId} blogUser={fetchedBlog.username} />
    </div>
  );
};

export default ViewBlog;
