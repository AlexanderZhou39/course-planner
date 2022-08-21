import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'wouter';
import CourseCard from '../components/courseCard';
import { getCourses } from '../utils/storage';

function Courses() {
	const data = getCourses();

	const cards = data.map(course => <CourseCard course={course} key={course.id} />);

	return (
		<>
			<div className="relative mb-5 pt-2">
				<h1 className='text-2xl text-center font-bold mb-5'>Courses</h1>
				<div className='sm:absolute sm:right-0 sm:top-0'>
					<Link 
						to='/courses/add'
						className='text-center block sm:inline-block py-3 px-10 bg-slate-500 text-white hover:bg-slate-400 rounded-3xl'
					>
							<FontAwesomeIcon icon={faPlus} /> Add Course
					</Link>
				</div>
			</div>
			<div className="flex flex-row flex-wrap justify-evenly">
				{cards}
			</div>
		</>
	);
}

export default Courses;
