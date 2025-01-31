import { useNavigate } from "react-router-dom";
import SubmitBlogComp from "./SubmitBlogComp";
import { useState } from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
  
    const logout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };
  
    return (
      <div id="nav-bar">
        <div id="blogwise" onClick={() => navigate('/home')}> Blog Wise </div>
        <div id="nav-bar-container">
          <div id="nav-bar-btn" onClick={() => setIsClicked(!isClicked)}> Create Blog </div>
          <div id="nav-bar-btn" onClick={() => navigate('/drafts')}> Drafts </div>
          <div id="nav-bar-btn" onClick={()=> navigate('/myblogs')} > My Blogs</div>
          <div id="nav-bar-btn-name" > {localStorage.getItem('user').split(" ")[0].toUpperCase()} </div>
          <div id="nav-bar-btn" onClick={logout}> → </div>
        </div>
        {isClicked && < SubmitBlogComp setIsClicked={setIsClicked}/>}
      </div>
    );
  };
  
  export default NavBar;
  