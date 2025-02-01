import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ToggleContext } from '../context/myContext';

const ViewBlog = () => {
    const {url} = useContext(ToggleContext);
    const location = useLocation();
    const [fetchedBlog, setFetchedBlog] = useState();
    const [_id, setId] = useState({
        _id : ''
    });

    useEffect(() => {
        if (location.state && location.state._id) {
            setId({ _id: location.state._id });
        }
    }, []);

    useEffect(()=>{
       const fetchBlogFunc =  async () => {
        try {
            const response = await fetch(`${url}/getSingleBlog`, {
                method: 'POST',
                body: JSON.stringify(_id),
                headers: {
                    'Content-Type': 'application/json',
                     "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
            });
            const data = await response.json();
            console.log(response);
            setFetchedBlog(data);
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };
    
    fetchBlogFunc();
    }, [_id, setId]);

    if (!fetchedBlog) {
        return <div>Loading...</div>;
    }

    return (
        
        <div id="viewBlogContainer">
        <h1 id="blogTitle">{fetchedBlog.title}</h1>
        {/* <hr /> */}
        <h3 id="blogAuthor">AUTHOR: {fetchedBlog.username && fetchedBlog.username.toUpperCase()}</h3>
        <p id="blogContent">{fetchedBlog.content}</p>
        <div id="blogImageContainer">
          <img src={fetchedBlog.image}  id="blogImage"/>
        </div>
      </div>
      
      );
}

export default ViewBlog;



