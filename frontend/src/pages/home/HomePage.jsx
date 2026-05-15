import { useState } from 'react';
import { Link } from 'react-router-dom';

import Posts from '../../components/common/Posts';
import CreatePost from './CreatePost';
import SuggestedUsers from '../../components/common/SuggestedUsers';

const HomePage = () => {
  const [feedType, setFeedType] = useState('allList');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const handleRefreshPosts = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const getTabClass = (type) => {
    const baseClass =
      'flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative';
    const activeClass = 'text-yellow-400 font-bold';
    const inactiveClass = 'text-slate-500 hover:bg-secondary';
    return `${baseClass} ${feedType === type ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {!authUser ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 px-4">
          <h1 className="text-6xl font-black text-white text-center leading-tight">
            PLEASE LOGIN <br />
            <span className="text-primary">TO SEE THE FEED</span>
          </h1>
          <p className="text-xl text-slate-500">Join our community today.</p>
          <Link to="/login">
            <button className="btn btn-primary btn-lg rounded-full px-12 text-primary-content font-bold text-2xl">
              LOGIN NOW
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Header Tab */}
          <div className="flex w-full border-b border-gray-700">
            <div
              className={getTabClass('allList')}
              onClick={() => setFeedType('allList')}
            >
              All Message
              {feedType === 'allList' && (
                <div className="absolute bottom-0 w-24 h-1 rounded-full bg-yellow-400"></div>
              )}
            </div>
            <div
              className={getTabClass('following')}
              onClick={() => setFeedType('following')}
            >
              Followers Message
              {feedType === 'following' && (
                <div className="absolute bottom-0 w-36 h-1 rounded-full bg-yellow-400"></div>
              )}
            </div>
            <div
              className={getTabClass('suggested')}
              onClick={() => setFeedType('suggested')}
            >
              Suggested Users
              {feedType === 'suggested' && (
                <div className="absolute bottom-0 w-32 h-1 rounded-full bg-yellow-400"></div>
              )}
            </div>
          </div>

          {/*  CREATE POST INPUT */}
          {<CreatePost onSuccess={handleRefreshPosts} />}

          {/* POSTS or SUGGESTED USERS */}
          {feedType === 'suggested' ? (
            <SuggestedUsers />
          ) : (
            <Posts
              feedType={feedType}
              refreshPosts={refreshCounter}
              userId={authUser?._id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
