import React, { useState, useEffect } from "react";
import CreateComment from "./CreateComment";
import '../Comments.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment } from "../features/comments/commentsSlice";

function ViewComments(props) {
  const fetchedComments = useSelector((state) => state.comment.comments);
  const dispatch = useDispatch();
  const blogId = props.blogId;
  const [editClicked, setEditClicked] = useState(false);
  const [indexState, setIndexState] = useState();

  useEffect(() => {
    fetchCommentsFunc();
  }, [blogId]);

  const fetchCommentsFunc = async () => {
    if (!blogId) return;
    try {
      await dispatch(fetchComments(blogId)).unwrap();
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const deleteCommentFunc = async (commentId)=>{
    try{
      await dispatch(deleteComment(commentId)).unwrap();
      await dispatch(fetchComments(blogId)).unwrap();
    }
    catch(error){
      console.log("Failed to delete comment:", error);
    }
  };

  const editComment = async (index) => {
    try{
      setEditClicked(!editClicked);
      setIndexState(index);
      await dispatch(fetchComments(blogId)).unwrap();
    } catch(error){
      console.log("Failed to edit comment", error);
    }
  }

  return (
    <>
      <div>
        <CreateComment blogId={blogId} onCommentSubmit={fetchCommentsFunc} />
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
              <button onClick={() => deleteCommentFunc(comment._id)} className="comment-buttons">Delete</button>
            )}

            {localStorage.getItem("user") === comment.username && (
              <button onClick={()=>editComment(index)} className="comment-buttons">Edit</button>
            )}

            {(editClicked &&  indexState === index ) &&
              localStorage.getItem("user") === comment.username && (
                <CreateComment commentId={comment._id} commentContent={comment.comment} blogId={blogId} onCommentSubmit={fetchCommentsFunc} clickEditComment={editComment} />
              )}
          </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewComments;
