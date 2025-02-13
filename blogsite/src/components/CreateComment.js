import React, { useState } from "react";
import "../Comments.css";
import { useDispatch } from "react-redux";
import { createComment, fetchComments } from "../features/comments/commentsSlice";

function CreateComment(props) {

    const dispatch = useDispatch();
    const [inputComment, setInputComment] = useState({
      blogId: props.blogId,
      content: props.commentContent,
      username: localStorage.getItem("user"),
      _id: props.commentId,
    });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!inputComment.content) return;
    try {
       await dispatch(createComment(inputComment)).unwrap();
       await dispatch(fetchComments(props.blogId)).unwrap();
      setInputComment({ ...inputComment, content: "" });

      props.onCommentSubmit && props.onCommentSubmit();
      props.clickEditComment && props.clickEditComment();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  }

  function handleChange(e) {
    setInputComment({
      ...inputComment,
      content: e.target.value,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea placeholder="Add a comment..." value={inputComment.content} onChange={handleChange} id="comment-input" />
      <button type="submit" className="comment-buttons"> Post </button>
    </form>
  );
}

export default CreateComment;
