import React, { useState, useEffect, useContext } from "react";
import CreateComment from "./CreateComment";
import { ToggleContext } from "../context/myContext";

function ViewComments(props) {
  const [fetchedComments, setFetchedComments] = useState([]);
  const { url } = useContext(ToggleContext);
  const blogId = props.blogId;

  useEffect(() => {
    fetchComments();
  }, [blogId, url, ]);

  const fetchComments = async () => {
    if (!blogId) return;

    try {
      const response = await fetch(`${url}/getCommentsOfBlog`, {
        method: "POST",
        body: JSON.stringify({ blogId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const data = await response.json();
      setFetchedComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const deleteComment = async (commentId)=>{
    try{
      console.log(commentId);
      const response = await fetch(`${url}/deleteComment`, {
        method: 'POST',
        body: JSON.stringify({commentId: commentId}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      fetchComments();
    }
    catch(error){
      console.log("Failed to delete comment:", error);
    }

  };

  return (
    <>
      <div>
        <CreateComment blogId={blogId} onCommentSubmit={fetchComments} />
      </div>

      <div>
        {Array.isArray(fetchedComments) &&
          fetchedComments.map((comment) => (
            <div key={comment._id}>
              <h3>{comment.username}</h3>
              <p>{comment.comment}</p>
              <button onClick={()=>{deleteComment(comment._id)}} >
                X
              </button>
            </div>
          ))}
      </div>
    </>
  );
}

export default ViewComments;
