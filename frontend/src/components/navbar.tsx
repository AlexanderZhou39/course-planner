import { Link } from 'wouter';

function Navbar() {
	return (
		<div className="bg-slate-500 text-white px-5">
			<div className="container mx-auto py-8 flex flex-col md:flex-row">
				<h1 className="text-xl inline-block mr-16 font-semibold mb-5 md:mb-0">General Course Planner</h1>
				<nav className='flex flex-col md:flex-row'>
					<Link to='/' className='hover:text-gray-300'>Manage Courses</Link>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;
