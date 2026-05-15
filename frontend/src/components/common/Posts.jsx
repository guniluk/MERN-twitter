import Post from './Post';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const Posts = ({ feedType, userId, refreshPosts, username }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'allList':
        return '/api/posts/all';
      case 'following':
        return '/api/posts/following';
      case 'likes':
        return `/api/posts/likes/${userId}`;
      case 'posts':
        return `/api/posts/user/${username}`;
      default:
        return '/api/posts/all';
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts', feedType, userId, refreshPosts, username],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refreshPosts, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">
          {feedType === 'following'
            ? 'No following yet'
            : feedType === 'likes'
              ? 'No likes yet'
              : 'No posts in this tab. Switch 👻'}
        </p>
      )}
      {!isLoading && !isRefetching && posts && (
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
