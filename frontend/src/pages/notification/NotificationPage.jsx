import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading, error } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notification");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Something went wrong");
				return data;
			} catch (error) {
				console.error("Error fetching notifications:", error);
				throw error;
			}
		},
	});

	if (error) {
		console.error("NotificationPage query error:", error);
		return <div className="text-center p-4">Error loading notifications.</div>;
	}

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notification", {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: deleteOneNotification } = useMutation({
		mutationFn: async (id) => {
			try {
				const res = await fetch(`/api/notification/${id}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notification deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
			<div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<p className='font-bold'>Notifications</p>
				<div className='dropdown '>
					<div tabIndex={0} role='button' className='m-1'>
						<IoSettingsOutline className='w-4' />
					</div>
					<ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
						<li>
							<a onClick={deleteNotifications}>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>
			{isLoading && (
				<div className='flex justify-center h-full items-center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
			{!isLoading && notifications?.map((notification) => {
				const formattedDate = new Date(notification.createdAt).toLocaleString('ko-KR', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				}).replace(/\. /g, '-').replace('.', '');
				return (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" ? <FaUser className='w-7 h-7 text-primary' /> : <FaHeart className='w-7 h-7 text-red-500' />}
							<div className='flex flex-col flex-1'>
								<Link to={`/profile/${notification.from?.username}`}>
									<div className='flex gap-1 items-center'>
										<div className='avatar'>
											<div className='w-8 rounded-full'>
												<img src={notification.from?.profileImg || "/avatar-placeholder.png"} />
											</div>
										</div>
										<span className='font-bold'>@{notification.from?.username}</span>{" "}
										{notification.type === "follow" ? "followed you" : "liked your post"}
									</div>
								</Link>
								<span className='text-xs text-slate-500 ml-10'>{formattedDate}</span>
							</div>
							<button className='ml-auto' onClick={() => deleteOneNotification(notification._id)}>
								<FaTrash className='w-4 h-4 hover:text-red-500' />
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};
export default NotificationPage;
