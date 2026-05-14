import Post from './Post';
import { useEffect, useState } from 'react';

const Posts = ({ feedType, username, userId, refreshPosts }) => {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

  const POST_ENDPOINT = getPostEndpoint();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const postfetch = async () => {
      fetchPosts();
    };
    postfetch();
  }, [feedType, refreshPosts]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>
        </div>
      )}
			{!isLoading && posts?.length === 0 && (
				<p className='text-center my-4'>
					{feedType === "following"
						? "No following yet"
						: feedType === "likes"
						? "No likes yet"
						: "No posts in this tab. Switch 👻"}
				</p>
			)}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
