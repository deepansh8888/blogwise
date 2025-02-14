import { useSelector } from "react-redux";

const UserProfile = () => {
const { userProfileInfo } = useSelector((state) => state.auth );

    return (
        <div className='profile-container'>
            <img src='/assets/images/bojack.jpg' alt='user-img' className='profile-image' />
            <h1>{userProfileInfo.username}</h1>
            <h1>{userProfileInfo.email}</h1>
        </div>
    );
}

export default UserProfile;