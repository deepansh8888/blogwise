import React, { useContext, useEffect, useState } from 'react';
import { ToggleContext } from '../context/myContext';
import '../Comments.css';

function CreateComment(props) {
    const { url } = useContext(ToggleContext);
    const [inputComment, setInputComment] = useState({
        blogId: props.blogId,
        content: props.commentContent,
        username: localStorage.getItem('user'),
        _id: props.commentId,
    });

    async function handleSubmit(e) {
        e.preventDefault();
        if (!inputComment.content) return;
        try {
            const response = await fetch(`${url}/createComment`, {
                method: 'POST',
                body: JSON.stringify(inputComment),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to create comment');
            }

            setInputComment({
                ...inputComment,
                content: ''
              });

              props.onCommentSubmit && props.onCommentSubmit();
              props.clickEditComment();

        } catch (error) {
            console.error('Error creating comment:', error);
        }
    }

    function handleChange(e) {
        setInputComment({
            ...inputComment,
            content: e.target.value
        });
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea placeholder='Add a comment...' value={inputComment.content} onChange={handleChange} id="comment-input"/>
            <button type="submit" className='comment-buttons'>Post</button>
        </form>
    );
}

export default CreateComment;