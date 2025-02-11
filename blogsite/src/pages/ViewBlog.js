import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ToggleContext } from '../context/myContext';
import CommentSection from '../components/CommentSection';

const ViewBlog = () => {
  const location = useLocation();
  const { url } = useContext(ToggleContext);
  const [fetchedBlog, setFetchedBlog] = useState(null);
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    if (location.state?._id) {
      setBlogId(location.state._id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBlogFunc = async () => {
      if (!blogId) return;

      try {
        const response = await fetch(`${url}/getSingleBlog`, {
          method: 'POST',
          body: JSON.stringify({ blogId }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }

        const data = await response.json();
        setFetchedBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlogFunc();
  }, [blogId, url]);



  if (!fetchedBlog) {
    return <div>Loading...</div>;
  }

  return (
    <div id="viewBlogContainer">
      <h1 id="blogTitle">{fetchedBlog.title}</h1>
      <h3 id="blogAuthor">
        AUTHOR: {fetchedBlog.username?.toUpperCase()}
      </h3>
      <p id="blogContent">{fetchedBlog.content}</p>
      
      {fetchedBlog.image && (
        <div id="blogImageContainer">
          <img 
            src={fetchedBlog.image} 
            id="blogImage" 
            alt={fetchedBlog.title || 'Blog image'}
          />
        </div>
      )}
      <CommentSection blogId={blogId} blogUser={fetchedBlog.username} />

    </div>
  );
};

export default ViewBlog;