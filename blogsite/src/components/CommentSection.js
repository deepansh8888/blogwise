import React, { useState, useEffect, useContext } from "react";
import CreateComment from "./CreateComment";
import { ToggleContext } from "../context/myContext";
import '../Comments.css';

function ViewComments(props) {
  const [fetchedComments, setFetchedComments] = useState([]);
  const { url } = useContext(ToggleContext);
  const blogId = props.blogId;
  const [editClicked, setEditClicked] = useState(false);
  const [indexState, setIndexState] = useState();

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
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const editComment = async (index) => {
    try{
      setEditClicked(!editClicked);
      setIndexState(index);
    } catch(error){
      console.log("Failed to edit comment", error);
    }
  }

  return (
    <>
      <div>
        <CreateComment blogId={blogId} onCommentSubmit={fetchComments} />
      </div>

      <div>
        <h3 id="comment-section-heading">{fetchedComments.length} Comments</h3>
        {fetchedComments.map((comment, index) => (
          <div key={comment._id}  className="comment-container">
            <div className="comment-section">
            <p id="comment-username">@{comment.username.toLowerCase()}</p>
            <p id="comment"> {comment.comment}</p>
            <p id="comment-date">{new Date(comment.date).toLocaleDateString()}</p>

            {(localStorage.getItem("user") === comment.username ||
              localStorage.getItem("user") === props.blogUser) && (
              <button onClick={() => deleteComment(comment._id)} className="comment-buttons">Delete</button>
            )}

            {localStorage.getItem("user") === comment.username && (
              <button onClick={()=>editComment(index)} className="comment-buttons">Edit</button>
            )}

            {(editClicked &&  indexState === index ) &&
              localStorage.getItem("user") === comment.username && (
                <CreateComment
                  commentId={comment._id}
                  blogId={blogId}
                  onCommentSubmit={fetchComments}
                  clickEditComment={editComment}
                />
              )}
          </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewComments;
