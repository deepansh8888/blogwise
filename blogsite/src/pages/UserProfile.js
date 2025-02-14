import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { convertFileToBase64 } from "../helpers/utils";
import { updateProfile, getProfile } from "../features/user/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const userProfileInfo = JSON.parse(localStorage.getItem('userProfileInfo'));
  const [profileImg, setProfileImg] = useState(userProfileInfo.profileimage || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertFileToBase64(file);
    setProfileImg(base64);
    // Update userProfileInfo with new image
    const updatedProfile = { ...userProfileInfo, profileimage: base64 };
    localStorage.setItem('url', base64);
    localStorage.setItem('userProfileInfo', JSON.stringify(updatedProfile));
  };

  const handleProfileChanges = async () => {
    try {
      const updatedProfile = { ...userProfileInfo, profileimage: profileImg };
      await dispatch(updateProfile(updatedProfile)).unwrap();
    } catch (err) {
      console.log(err);
    } 
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <input type="file" id="profile-img-file" onChange={handleFileChange} />
        <div className="profile-image-container" onClick={() => document.getElementById("profile-img-file").click()}>
          <img src={userProfileInfo.profileimage} alt="user-img" className="profile-image"/>
          <span className="profile-tooltip">
            Click to update profile picture!
          </span>
        </div>
        <h1>{userProfileInfo.username}</h1>
        <h1>{userProfileInfo.email}</h1>
        
        <button onClick={handleProfileChanges}>Save changes</button>
        <button onClick={()=>{console.log(userProfileInfo.profileimage)}}>clicky</button>
      </div>
    </div>
  );
};

export default UserProfile;

