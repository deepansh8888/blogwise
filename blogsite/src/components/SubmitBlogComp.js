import React, { useEffect, useState, useContext } from 'react';
import {ToggleContext} from '../context/myContext';
import { convertFileToBase64 } from '../helpers/utils';

const SubmitBlogComp = ({setIsClicked}) =>{
    const currUserOrDraftKey = localStorage.getItem('user');
    const {isToggled, setIsToggled, draftRefresh, setDraftRefresh} = useContext(ToggleContext);
    // this state is differnt from the one defined in useToggle
    const [blogData, setBlogData] = useState({
        title: '',
        content: '',
        image: '',
        imageUrl: null,
    });     

    const [error, setError] = useState({
        titleMissing: false,
        contentMissing: false
    });

    const handleInputChange = (event)=> {
        try{
            const {name, value} = event.target;
            setBlogData({...blogData, [name]: value});
    }
    catch(error){
        console.log("HandleChange Event Handler error:", error);
    }
    };

    const handleImageChange = async  (event) => {
        const imageUrl = URL.createObjectURL(event.target.files[0]);
        let byte64Image = await convertFileToBase64(event.target.files[0]);
        setBlogData({...blogData, image: byte64Image, imageUrl: imageUrl});
    };

    const submitBlog = async () => {
        try {
            let blogToSubmit = { ...blogData, username: currUserOrDraftKey };
            const response = await fetch("http://localhost:8080/createblog", {
                method: 'POST',
                body: JSON.stringify(blogToSubmit),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            
            console.log(blogData);

            alert("Blog Submitted Successfully");
            setBlogData({
                title: '',
                content: '',
                image: null,
                imageUrl: null,
            });

            setIsToggled(!isToggled);
            setIsClicked(false);
            
        } catch (error) {
            console.error("Error submitting blog:", error);
            alert("Failed to submit blog: " + error.message);
        }
    };

    const saveDraft = async () => {

            let newDraft = { ...blogData, username: currUserOrDraftKey };
                    localStorage.setItem(currUserOrDraftKey, JSON.stringify(newDraft));
                    alert("Draft Saved!");
                    setBlogData({
                        title: "",
                        content: "",
                        image: null,
                    });
                setIsClicked(false);
                setDraftRefresh(!draftRefresh)
        };

    return (<>
        <div id="blogform">
          <textarea id="textAreaTitle" name="title" placeholder="Enter blog title" onChange={handleInputChange} value={blogData.title} ></textarea><br />
           {error.titleMissing && <div id="error">This field is required.</div>}
          
          <textarea id="textAreaContent" name="content" placeholder="Enter blog content" onChange={handleInputChange} value={blogData.content} ></textarea><br />
          {error.contentMissing && <div id="error">This field is required.</div>}
          
          <input type="file" onChange={handleImageChange} />

          <div>
          <button onClick={saveDraft} id="draft-button">Save Draft</button>
            <button onClick={submitBlog}> Publish </button>
            <button onClick={() => setIsClicked(false)} id="draft-button">Close</button>
          </div>
          {blogData.imageUrl && <img src={blogData.imageUrl} height="300" />}
        </div>
      </>
    )
}

export default SubmitBlogComp;