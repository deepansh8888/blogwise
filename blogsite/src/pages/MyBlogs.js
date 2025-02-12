import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertFileToBase64 } from '../helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogsRefresh } from '../features/blogs/blogsSlice';
// import {ToggleContext} from '../context/myContext';

const MyBlogs = ()=> {
  const navigate = useNavigate();
  // const {isToggled, setIsToggled} = useContext(ToggleContext);
    const { blogsRefreshFlag } = useSelector((state) => state.toggle);
    // const location = useLocation();
    const [blogs, setBlogs] = useState([]);     //use to fetch and store all the blogs
    const [draft, setDraft] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const currUserOrDraft = localStorage.getItem('user');
    const dispatch = useDispatch();
    
    useEffect(() => {
      console.log("Before Api call")
        //useEffect doesn't accept async function directly
        const fetchBlogs = async () =>  {
            const username = currUserOrDraft;
            try{
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getmyblogs`, {
                    method: 'POST',
                    body: JSON.stringify({username: username}),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                      },
                      credentials: 'include',
                });
                console.log(response);
                if (!response.ok) {
                    throw new Error(`Error1: ${response.statusText}`);
                }                
                const data = await response.json();
                setBlogs(data);
            } catch(error) {console.log(error);}
            finally{console.log("After Api")}
        }
        fetchBlogs();

    },[isEdit, draft, blogsRefreshFlag]);

    const blogView = (_id)=> {
        navigate("/Viewblog", {state: {_id}});
    }

    const editBlog = (blog, e)=>{
      e.stopPropagation();
      setIsEdit(!isEdit);
      setDraft(blog);
    }

    const deleteblog = async (_id, e) => {
      e.stopPropagation();
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteblog`, {
        method: 'POST',
        body: JSON.stringify({_id :_id}),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currUserOrDraft}`,
        },
        credentials: 'include',
      })

      // setIsToggled(!isToggled);
      dispatch(setBlogsRefresh());
    }

  const handleInputChange = (event)=> {
    try{
        const {name, value} = event.target;
        setDraft({...draft, [name]: value});
    }
    catch(error){
    console.log("HandleChange Event Handler error:", error);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      let byte64Image = await convertFileToBase64(file);
      setDraft({ ...draft, image: byte64Image, imageUrl: imageUrl });
    }
 };
 
 const saveDraft = async () => {
  let newDraft = { ...draft, username: currUserOrDraft };
  localStorage.setItem(currUserOrDraft, JSON.stringify(newDraft));
  alert("Draft Saved!");
  console.log(localStorage.getItem(currUserOrDraft));

  setDraft({
    title: "",
    content: "",
    image: null,
    imageUrl: null,
  });
  setIsEdit(false);
};


     return (

       <div>
            {
              blogs && blogs.length > 0 ? (
                <div id="blogListContainer">
           {blogs.map((blog) => {
             return (
               <div id="blogCard" key={blog._id} onClick={() => {blogView(blog._id); }} >
                 <h3 id="blogCardTitle">{blog.title}</h3>
                 <button onClick={(e)=>editBlog(blog, e)} > Edit Blog </button>
                 <button onClick={(e)=>deleteblog(blog._id, e)} > Delete Blog </button>
                 <p id="blogCardContent">{blog.content}</p>
               </div>
             );
           })}
            </div>
              ) :
              (
                (
                  <div id="emptyBlogOrDraft">
                    <h1>No Blogs Found</h1>
                  </div>
                )
              )
            }

         {
          isEdit && <> 
              <div id="blogform">
            <textarea id="textAreaTitle" name="title" placeholder="Enter blog title" onChange={handleInputChange} value={draft.title} ></textarea><br />
            <textarea id="textAreaContent" name="content" placeholder="Enter blog content" onChange={handleInputChange} value={draft.content} ></textarea><br />
            <input type="file" onChange={handleImageChange} /> <br/><br/>
            <img height="150" src={draft.image} />
            <div>
              <button onClick={saveDraft}>Save as Draft</button>
              <button onClick={()=>{setIsEdit(false)}}> Close </button>
            </div>
          </div>
          </>
         }

       </div>
     );
};

export default MyBlogs;