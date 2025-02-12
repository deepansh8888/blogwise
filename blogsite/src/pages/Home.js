import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
// import {ToggleContext} from '../context/myContext';
import { fetchAllBlogs } from '../features/blogs/blogsSlice';

const Home = ()=> {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    // const location = useLocation();     
    // const [blogs, setBlogs] = useState([]);     //use to fetch and store all the blogs
    // const {isToggled, setIsToggled} = useContext(ToggleContext);
    // const { blogsRefreshFlag } = useSelector((state)=> state.toggle);

   dispatch(fetchAllBlogs());

   const blogs = useSelector((state)=> state.blog.allBlogs);
    // useEffect(() => {
    //     //useEffect doesn't accept async function directly
    //     const fetchBlogs = async () =>  {
    //         try{
    //             console.log("Home.js",localStorage.getItem('token'));
    //             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getallblogs`, {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${localStorage.getItem('token')}`,
    //                   },
    //                   credentials: 'include',
    //             });

    //             console.log("Home.js",response);
    //             if (!response.ok) {
    //                 throw new Error(`Error1: ${response.statusText}`);
    //             }                
    //             const data = await response.json();
    //             console.log("Home.js", data);
    //             setBlogs(data);
    //         } catch(error) {console.log(error);}
    //     }
    //     fetchBlogs();
    // },[blogsRefreshFlag]);

    const blogView = (_id)=> {
      console.log(_id)
        navigate("/Viewblog", {state: {_id}});
    }

    // const username = localStorage.getItem('user');

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