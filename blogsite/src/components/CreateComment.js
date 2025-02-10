import React, { useContext, useEffect, useState } from 'react';
import { ToggleContext } from '../context/myContext';

function CreateComment(props) {
    const { url } = useContext(ToggleContext);
    const [inputComment, setInputComment] = useState({
        blogId: props.blogId,
        content: '',
        username: localStorage.getItem('user')
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

              props.onCommentSubmit();

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
        <form onSubmit={handleSubmit}>
            <textarea placeholder='Add a comment...' value={inputComment.content} onChange={handleChange} />
            <button type="submit">Post</button>
        </form>
    );
}

export default CreateComment;