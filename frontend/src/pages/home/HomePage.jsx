import { useState } from "react";
import { Link } from "react-router-dom";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const [refreshCounter, setRefreshCounter] = useState(0);
	const authUser = JSON.parse(localStorage.getItem("authUser"));

	const handleRefreshPosts = () => {
		setRefreshCounter((prev) => prev + 1);
	};

	return (
		<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
			{!authUser ? (
				<div className='flex flex-col items-center justify-center h-[60vh] gap-6 px-4'>
					<h1 className='text-6xl font-black text-white text-center leading-tight'>
						PLEASE LOGIN <br />
						<span className='text-primary'>TO SEE THE FEED</span>
					</h1>
					<p className='text-xl text-slate-500'>Join our community today.</p>
					<Link to='/login'>
						<button className='btn btn-primary btn-lg rounded-full px-12 text-primary-content font-bold text-2xl'>
							LOGIN NOW
						</button>
					</Link>
				</div>
			) : (
				<>
					{/* Header Tab */}
					<div className='flex w-full border-b border-gray-700'>
						<div
							className={
								"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
							}
							onClick={() => setFeedType("forYou")}
						>
							For you
							{feedType === "forYou" && (
								<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
							)}
						</div>
						<div
							className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
							onClick={() => setFeedType("following")}
						>
							Following
							{feedType === "following" && (
								<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
							)}
						</div>
						<div
							className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
							onClick={() => setFeedType("likes")}
						>
							Likes
							{feedType === "likes" && (
								<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
							)}
						</div>
					</div>

					{/*  CREATE POST INPUT */}
					<CreatePost onSuccess={handleRefreshPosts} />

					{/* POSTS */}
					<Posts feedType={feedType} refreshPosts={refreshCounter} userId={authUser?._id} />
				</>
			)}
		</div>
	);
};

export default HomePage;
