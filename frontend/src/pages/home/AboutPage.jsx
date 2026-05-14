import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope, FaCode, FaRocket } from "react-icons/fa";

const AboutPage = () => {
	return (
		<div className='max-w-4xl mx-auto p-8 min-h-screen text-white'>
			<div className='flex flex-col gap-8'>
				{/* Header Section */}
				<section className='text-center space-y-4'>
					<h1 className='text-5xl font-black text-primary'>About MERN Twitter</h1>
					<p className='text-xl text-slate-400 italic'>
						"A full-featured social media platform clone built with modern web technologies."
					</p>
				</section>

				<div className='divider before:bg-gray-700 after:bg-gray-700'></div>

				{/* Features Section */}
				<section className='grid md:grid-cols-2 gap-6'>
					<div className='bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl'>
						<div className='flex items-center gap-3 mb-4'>
							<FaRocket className='text-primary text-2xl' />
							<h2 className='text-2xl font-bold'>Core Features</h2>
						</div>
						<ul className='list-disc list-inside space-y-2 text-slate-300'>
							<li>Real-time posting with text and images</li>
							<li>Seamless image storage via Cloudinary</li>
							<li>User authentication & secure JWT management</li>
							<li>Dynamic user profiles with cover images</li>
							<li>Interactive Like & Comment systems</li>
							<li>Follow/Unfollow system for community building</li>
						</ul>
					</div>

					<div className='bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl'>
						<div className='flex items-center gap-3 mb-4'>
							<FaCode className='text-primary text-2xl' />
							<h2 className='text-2xl font-bold'>Tech Stack</h2>
						</div>
						<div className='flex flex-wrap gap-2'>
							<span className='badge badge-outline badge-lg'>MongoDB</span>
							<span className='badge badge-outline badge-lg'>Express.js</span>
							<span className='badge badge-outline badge-lg'>React 19</span>
							<span className='badge badge-outline badge-lg'>Node.js</span>
							<span className='badge badge-outline badge-lg'>Tailwind CSS</span>
							<span className='badge badge-outline badge-lg'>DaisyUI</span>
						</div>
						<p className='mt-4 text-slate-400 text-sm'>
							Optimized for performance and scalability using the latest web standards.
						</p>
					</div>
				</section>

				{/* Contact Section */}
				<section className='bg-blue-900/20 p-8 rounded-2xl border border-blue-500/30 text-center'>
					<h2 className='text-3xl font-bold mb-6'>Get in Touch</h2>
					<div className='flex flex-col md:flex-row justify-center gap-8 items-center'>
						<div className='flex items-center gap-2 hover:text-primary transition-colors cursor-pointer'>
							<FaEnvelope className='text-xl' />
							<span className='text-lg'>support@merntwitter.com</span>
						</div>
						<div className='flex items-center gap-2 hover:text-primary transition-colors cursor-pointer'>
							<FaGithub className='text-xl' />
							<span className='text-lg'>github.com/mern-twitter-clone</span>
						</div>
					</div>
				</section>

				{/* Footer Navigation */}
				<div className='text-center pt-4'>
					<Link to='/'>
						<button className='btn btn-primary rounded-full px-8 text-primary-content font-bold'>
							Back to Feed
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
