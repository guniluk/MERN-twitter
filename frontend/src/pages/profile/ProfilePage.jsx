import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Posts from '../../components/common/Posts';
import EditProfileModal from './EditProfileModal';

import { FaArrowLeft } from 'react-icons/fa6';
import { IoCalendarOutline } from 'react-icons/io5';
import { FaLink } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [feedType, setFeedType] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();

  const coverImgRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const isMyProfile = authUser?.username === username;
  const amIFollowing = authUser?.following.includes(user?._id);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = () => {
      fetchUserProfile();
    };
    fetchUser();
  }, [username]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === 'coverImg' && setCoverImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImg = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverImg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      localStorage.setItem('authUser', JSON.stringify(data));
      setCoverImg(null);
      setUser(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFollowUnfollow = async () => {
    if (!authUser) return alert('Please login to follow');
    setIsFollowing(true);
    try {
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      // Update localStorage authUser
      const updatedAuthUser = { ...authUser };
      if (amIFollowing) {
        updatedAuthUser.following = updatedAuthUser.following.filter(
          (id) => id !== user?._id,
        );
      } else {
        updatedAuthUser.following.push(user?._id);
      }
      localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));

      // Update local user state to reflect follower count change
      const updatedUser = { ...user };
      if (amIFollowing) {
        updatedUser.followers = updatedUser.followers.filter(
          (id) => id !== authUser._id,
        );
      } else {
        updatedUser.followers.push(authUser._id);
      }
      setUser(updatedUser);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsFollowing(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeletingUser(true);
    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      localStorage.removeItem('authUser');
      navigate('/signup');
      window.location.reload();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  return (
    <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
      {/* HEADER */}
      {isLoading && (
        <div className="flex flex-col justify-center">
          <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>
        </div>
      )}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <div className="flex flex-col">
        {!isLoading && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center">
              <Link to="/">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg">{user?.fullname}</p>
                <span className="text-sm text-slate-500">0 posts</span>
              </div>
            </div>
            {/* COVER IMG */}
            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || '/cover.jpg'}
                className="h-52 w-full object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}

              <input
                type="file"
                hidden
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, 'coverImg')}
              />
              {/* USER AVATAR */}
              <div className="absolute -bottom-16 left-4">
                <div className="avatar">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img src={user?.profileImg || '/avatar-placeholder.png'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end px-4 mt-5 gap-2">
              <div className="flex gap-2">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={handleFollowUnfollow}
                  >
                    {isFollowing ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : amIFollowing ? (
                      'Unfollow'
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
                {coverImg && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4"
                    onClick={handleUpdateImg}
                  >
                    {isUpdating ? 'Updating...' : 'Save'}
                  </button>
                )}
              </div>

              {isMyProfile && (
                <button
                  className="btn btn-error btn-sm rounded-full text-white"
                  onClick={() =>
                    document.getElementById('delete_user_modal').showModal()
                  }
                >
                  Delete user
                </button>
              )}

              {/* DELETE USER MODAL */}
              <dialog id="delete_user_modal" className="modal">
                <div className="modal-box border border-gray-700 rounded-lg">
                  <h3 className="font-bold text-xl text-red-500 mb-4">
                    Warning: Account Deletion
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Are you sure you want to delete your account? This action is
                    permanent and cannot be undone. All your data and images
                    will be permanently removed.
                  </p>
                  <div className="flex justify-end gap-3">
                    <form method="dialog">
                      <button className="btn btn-outline rounded-full px-6">
                        Cancel
                      </button>
                    </form>
                    <button
                      className="btn btn-error text-white rounded-full px-6"
                      onClick={handleDeleteUser}
                    >
                      {isDeletingUser ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        'Delete Forever'
                      )}
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{user?.fullname}</span>
                <span className="text-sm text-slate-500">
                  @{user?.username}
                </span>
                <span className="text-sm my-1">{user?.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center ">
                    <FaLink className="w-3 h-3 text-slate-500" />
                    <a
                      href={user?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {user?.link}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">
                    Joined July 2021
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.following?.length}
                  </span>
                  <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.followers?.length}
                  </span>
                  <span className="text-slate-500 text-xs">Followers</span>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b border-gray-700 mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                onClick={() => setFeedType('posts')}
              >
                Posts
                {feedType === 'posts' && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 cursor-pointer relative"
                onClick={() => setFeedType('likes')}
              >
                Likes
                {feedType === 'likes' && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 cursor-pointer relative"
                onClick={() => setFeedType('following')}
              >
                Following
                {feedType === 'following' && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
                )}
              </div>
            </div>
          </>
        )}

        {feedType === 'following' && (
          <div className="flex flex-col">
            {user?.following?.length === 0 && (
              <p className="text-center my-4">No following yet</p>
            )}
            {user?.following?.map((followedUser) => (
              <Link
                to={`/profile/${followedUser.username}`}
                key={followedUser._id}
                className="flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-gray-900 transition duration-300"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={followedUser.profileImg || '/avatar-placeholder.png'}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">
                    @{followedUser.username}
                  </span>
                  <span className="text-sm text-slate-500">
                    {followedUser.email}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {(feedType === 'posts' || feedType === 'likes') && (
          <Posts feedType={feedType} username={username} userId={user?._id} />
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
