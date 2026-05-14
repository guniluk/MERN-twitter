import { FaRegComment } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  const [comment, setComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const postOwner = post.user;
  if (!postOwner) return null;
  const isLiked = authUser ? post.likes.includes(authUser._id) : false;
  const isMyPost = authUser ? authUser._id === post.user?._id : false;

  const handleDeletePost = async () => {
    if (!authUser) return alert('Please login to delete a post');
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      console.log('Post deleted');
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!authUser) return alert('Please login to comment');
    if (isCommenting) return;
    setIsCommenting(true);
    try {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setComment('');
      console.log('Comment added');
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLikePost = async () => {
    if (!authUser) return alert('Please login to like a post');
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      console.log('Like toggled');
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img src={postOwner.profileImg || '/avatar-placeholder.png'} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullname}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{post.createdAt}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              )}
              {isDeleting && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt=""
            />
          )}
        </div>
        <div className="flex justify-around mt-3 w-full max-w-100 mx-auto">
          {/* COMMENT */}
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() =>
              document.getElementById('comments_modal' + post._id).showModal()
            }
          >
            <FaRegComment className="w-5 h-5 text-slate-500 group-hover:text-sky-400" />
            <span className="text-md text-slate-500 group-hover:text-sky-400">
              {post.comments.length}
            </span>
          </div>
          {/* Modal from DaisyUI */}
          <dialog
            id={`comments_modal${post._id}`}
            className="modal border-none outline-none"
          >
            <div className="modal-box rounded border border-gray-600">
              <h3 className="font-bold text-lg mb-4 text-white">COMMENTS</h3>
              <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                {post.comments.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No comments yet 🤔 Be the first one 😉
                  </p>
                )}
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2 items-start">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            comment.user?.profileImg ||
                            '/avatar-placeholder.png'
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">
                          {comment.user?.fullname}
                        </span>
                        <span className="text-gray-700 text-sm">
                          @{comment.user?.username}
                        </span>
                      </div>
                      <div className="text-sm text-white">{comment.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                onSubmit={handlePostComment}
              >
                <textarea
                  className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800 bg-transparent"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn btn-primary rounded-full btn-sm text-primary-content px-4">
                  {isCommenting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    'Post'
                  )}
                </button>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button className="outline-none">close</button>
            </form>
          </dialog>

          {/* LIKE */}
          <div
            className="flex gap-2 items-center group cursor-pointer"
            onClick={handleLikePost}
          >
            {!isLiked && !isLiking && (
              <FaRegHeart className="w-5 h-5 cursor-pointer text-slate-500 group-hover:text-pink-500" />
            )}
            {isLiked && !isLiking && (
              <FaRegHeart className="w-5 h-5 cursor-pointer text-pink-500" />
            )}
            {isLiking && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            <span
              className={`text-md group-hover:text-pink-500 ${isLiked ? 'text-pink-500' : 'text-slate-500'}`}
            >
              {post.likes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
