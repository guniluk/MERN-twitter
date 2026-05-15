import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const SuggestedUsers = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Something went wrong!");
				setUsers(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchSuggestedUsers();
	}, []);

	const handleFollow = async (userId) => {
		try {
			const res = await fetch(`/api/users/follow/${userId}`, {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Something went wrong!");
			setUsers(users.filter((user) => user._id !== userId));
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='bg-gray-900 p-4 rounded-lg m-4'>
			<h2 className='text-xl font-bold mb-4 text-white'>Suggested Users</h2>
			{users.length === 0 ? (
				<p className='text-gray-500'>No suggestions found.</p>
			) : (
				<div className='flex flex-col gap-4'>
					{users.map((user) => (
						<div key={user._id} className='flex items-center justify-between'>
							<div className='flex gap-2 items-center'>
								<Link to={`/profile/${user.username}`}>
									<img src={user.profileImg || "/avatar-placeholder.png"} className='w-10 h-10 rounded-full' />
								</Link>
								<div className='flex flex-col'>
									<Link to={`/profile/${user.username}`} className='font-bold text-white hover:underline'>
										{user.fullname}
									</Link>
									<span className='text-sm text-gray-500'>@{user.username}</span>
								</div>
							</div>
							<button
								className='bg-white text-black px-4 py-1 rounded-full font-bold hover:bg-gray-200 transition'
								onClick={() => handleFollow(user._id)}
							>
								Follow
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SuggestedUsers;
