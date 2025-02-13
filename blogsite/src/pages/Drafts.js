import React, { useEffect, useState } from "react";
import { convertFileToBase64 } from "../helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import { setDraftsRefresh } from "../features/toggle/toggleSlice";
import { createNewBlog } from "../features/blogs/blogsSlice";

const Drafts = () => {
  const { draftsRefreshFlag } = useSelector((state) => state.toggle);
  const [blogData, setBlogData] = useState("");
  const [isDraftPresent, setIsDraftPresent] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const currUserOrDraftKey = localStorage.getItem("user");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isDraftPresent === true) {
      const draft = JSON.parse(localStorage.getItem(currUserOrDraftKey));
      if (!draft) {
        setIsDraftPresent(false);
        return;
      }
      setBlogData(draft);
    }
  }, [isDraftPresent, isEdit, draftsRefreshFlag, currUserOrDraftKey]);

  const publishBlog = async () => {
    try {
      dispatch(createNewBlog(blogData));

      alert("Blog Submitted Successfully");
      localStorage.removeItem(currUserOrDraftKey);
      setIsDraftPresent(false);

      dispatch(setDraftsRefresh());

      setBlogData({
        title: "",
        content: "",
        username: "",
        image: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to submit blog: " + error.message);
    }
  };

  const deleteDraft = () => {
    localStorage.removeItem(currUserOrDraftKey);
    setIsDraftPresent(false);
    setIsEdit(false);
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
    if (!event.target.files[0]) return; // Add file check
    let byte64Image = await convertFileToBase64(event.target.files[0]);
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    setBlogData({ ...blogData, image: byte64Image, imageUrl: imageUrl });
  };

  const saveDraft = async () => {
    let newDraft = { ...blogData, username: currUserOrDraftKey };
    localStorage.setItem(currUserOrDraftKey, JSON.stringify(newDraft));
    alert("Draft Saved!");
    console.log(localStorage.getItem(currUserOrDraftKey));
    setBlogData({
      title: "",
      content: "",
      image: "",
      imageUrl: "",
      username: "",
    });
    // Start reading the image as a Data URL (Base64)
    setIsEdit(false);
    setIsDraftPresent(true);
    dispatch(setDraftsRefresh());
  };

  return (
    <>
      {localStorage.getItem(currUserOrDraftKey) ? (
        <>
          <div id="viewBlogContainer">
            <h1 id="blogTitle">{blogData.title}</h1>
            <h3 id="blogAuthor">AUTHOR: {currUserOrDraftKey?.toUpperCase()}</h3>
            <div id="blogImageContainer">
              <p id="blogContent">{blogData.content}</p>
              {blogData.image && (
                <img src={blogData.image} alt="draft" id="blogImage" />
              )}
              
            </div>
            <div>
              <button onClick={publishBlog}>Publish</button>
              <button onClick={deleteDraft}>Delete Draft</button>
              <button onClick={() => { setIsEdit(true); }} > Edit </button>
            </div>
          </div>
        </>
      ) : (
        <div id="emptyBlogOrDraft">  <h1>No Drafts Found</h1> </div>
      )}

      {isEdit && (
        <>
          <div id="blogform"><textarea id="textAreaTitle" name="title" placeholder="Enter blog title" onChange={handleInputChange} value={blogData.title}></textarea>
            <br />
            <textarea id="textAreaContent" name="content" placeholder="Enter blog content" onChange={handleInputChange} value={blogData.content}></textarea>
            <br />
            <input type="file" onChange={handleImageChange} />

            <div>
              <button onClick={saveDraft}>Save</button>
              <button onClick={deleteDraft}>Delete Draft</button>
              <button onClick={() => { setIsEdit(false); }}> Close </button>
              {blogData.image && <img src={blogData.image} height="150" alt="blogImg" />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Drafts;