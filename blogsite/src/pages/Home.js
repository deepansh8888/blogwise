import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {ToggleContext} from '../context/myContext';

const Home = ()=> {
    // const location = useLocation();     
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);     //use to fetch and store all the blogs
    const {isToggled, setIsToggled, url} = useContext(ToggleContext);
    
    useEffect(() => {
        //useEffect doesn't accept async function directly
        const fetchBlogs = async () =>  {
            console.log(isToggled);
            try{
                console.log("Home.js",localStorage.getItem('token'));
                const response = await fetch(`${url}/getallblogs`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                      },
                      credentials: 'include',
                });

                console.log("Home.js",response);
                if (!response.ok) {
                    throw new Error(`Error1: ${response.statusText}`);
                }                
                const data = await response.json();
                console.log("Home.js", data);
                setBlogs(data);
            } catch(error) {console.log(error);}
        }
        fetchBlogs();
    },[isToggled, setIsToggled]);

    const blogView = (_id)=> {
      console.log(_id)
        navigate("/Viewblog", {state: {_id}});
    }

    const username = localStorage.getItem('user');
    // FILTERING BASED ON USER
    // const filteredBlogs = (location.state && location.state.whose==="me") ? blogs.filter((blog)=> blog.username===username) : blogs;
    //After uncomenting this, just change blogs in blogs.map to filteredBlogs

     return (
       <div>
            <div id="blogListContainer">
           {blogs.map((blog) => {
             return (
               <div id="blogCard" key={blog._id} onClick={() => {blogView(blog._id); }} >
                 <p id="blogCardTitle">{blog.title}</p>
                 <p id="blogCardAuthor">AUTHOR: {blog.username.toUpperCase()}</p>
                 <p id="blogCardContent">{blog.content}</p>
               </div>
             );
           })}
         </div>
       </div>
     );
};

export default Home;