import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = ({ onSuccess }) => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	// 임시 유저 데이터 (실제로는 AuthContext 등에서 가져와야 함)
	const authUser = JSON.parse(localStorage.getItem("authUser"));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!authUser) {
			alert("Please login to create a post");
			return;
		}
		setIsLoading(true);
		setIsError(false);
		setErrorMsg("");

		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text, img }),
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			console.log("Post created successfully:", data);
			setText("");
			setImg(null);
			if (onSuccess) onSuccess();
		} catch (error) {
			setIsError(true);
			setErrorMsg(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border border-gray-700 rounded-xl m-2 bg-gray-900'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none bg-transparent'
					placeholder={authUser ? "What is happening?!" : "Please login to post..."}
					value={text}
					onChange={(e) => setText(e.target.value)}
					readOnly={!authUser}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-primary-content px-4'>
						{isLoading ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{errorMsg}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
