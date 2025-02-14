import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllBlogs } from "../features/blogs/blogsSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.allBlogs);
  const status = useSelector((state) => state.blog.status);
  const error = useSelector((state) => state.blog.error);

  useEffect( () => {
    (async()=>{
      if (status === 'idle') 
        await dispatch(fetchAllBlogs()).unwrap();
    })();

  }, [dispatch, status]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const blogView = (_id) => {
    console.log(_id);
    navigate("/Viewblog", { state: { _id } });
  };

  return (
    <div>
      <div id="blogListContainer">
        {blogs?.map((blog, index) => {
          return (
            <div id="blogCard" key={blog._id} onClick={() => blogView(blog._id)}>
              <p id="blogCardTitle">{blog.title}</p>
              <p id="blogCardAuthor">AUTHOR: {blog.username ? blog.username.toUpperCase() : "Unknown"}</p>
              <p id="blogCardContent">{blog.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;



// errors using redux
// viewBlog
// api calls interface or something? nitesh sir