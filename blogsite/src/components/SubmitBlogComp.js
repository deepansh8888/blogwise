import React, { useState } from "react";
import { convertFileToBase64 } from "../helpers/utils";

import { useDispatch } from "react-redux";
import { setDraftsRefresh } from "../features/toggle/toggleSlice";
import { createNewBlog, fetchAllBlogs } from "../features/blogs/blogsSlice";

const SubmitBlogComp = ({ setIsClicked }) => {
  const dispatch = useDispatch();
  const currUserOrDraftKey = localStorage.getItem("user");
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    image: "",
    imageUrl: "",
  });

  const submitBlog = async () => {
    try {
      await dispatch(createNewBlog(blogData)).unwrap();
      setBlogData({
        title: "",
        content: "",
        image: "",
        imageUrl: "",
      });
      dispatch(setDraftsRefresh());
      dispatch(fetchAllBlogs());
      setIsClicked(false);
      alert("Blog Submitted Successfully");
    } catch (err) {
      console.error("Failed to submit blog:", err);
      alert(err.message || "An error occurred while submitting the blog");
    }
  };

  const saveDraft = async () => {
    localStorage.setItem(currUserOrDraftKey, JSON.stringify(blogData));
    alert("Draft Saved!");
    setBlogData({
      title: "",
      content: "",
      image: "",
      imageUrl: "",
    });
    setIsClicked(false);
    dispatch(setDraftsRefresh());
  };

  const handleInputChange = (event) => {
    try {
      const { name, value } = event.target;
      setBlogData({ ...blogData, [name]: value });
    } catch (error) {
      console.log("HandleChange Event Handler error:", error);
    }
  };

  const handleImageChange = async (event) => {
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    let byte64Image = await convertFileToBase64(event.target.files[0]);
    setBlogData({ ...blogData, image: byte64Image, imageUrl: imageUrl });
  };

  return (
    <>
      <div id="blogform">
        <textarea id="textAreaTitle" name="title" placeholder="Enter blog title" onChange={handleInputChange} value={blogData.title}></textarea>
        <br />

        <textarea id="textAreaContent" name="content" placeholder="Enter blog content" onChange={handleInputChange} value={blogData.content}></textarea>
        <br />

        <input type="file" onChange={handleImageChange} />

        <div>
          <button onClick={saveDraft} id="draft-button">
            Save Draft
          </button>
          <button onClick={() => console.log(blogData)}>cliky</button>
          <button onClick={submitBlog}> Publish </button>
          <button onClick={() => setIsClicked(false)} id="draft-button">  Close </button>
        </div>
        {blogData.imageUrl && (
          <img src={blogData.imageUrl} alt="Blog preview" height="300" />
        )}
      </div>
    </>
  );
};

export default SubmitBlogComp;