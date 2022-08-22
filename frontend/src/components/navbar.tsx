import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'wouter';

function Navbar() {
	return (
		<div className="bg-slate-500 text-white px-5">
			<div className="container mx-auto py-8 flex flex-col md:flex-row">
				<h1 className="text-xl inline-block mr-16 font-semibold mb-5 md:mb-0">
				<FontAwesomeIcon icon={faCalendar} /> General Course Planner
				</h1>
				<nav className='flex flex-col md:flex-row text-white'>
					<Link to='/' className='hover:text-gray-300 mr-10 mb-5 md:mb-0'>Courses</Link>
					<Link to='/schedules' className='hover:text-gray-300 mr-10 mb-5 md:mb-0'>Schedules</Link>
					<Link to='/calendar' className='hover:text-gray-300'>Calendar</Link>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;
