import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'wouter';
import CourseCard from '../components/courseCard';
import { deleteCourse, getCourses } from '../utils/storage';

function Courses() {
	const [data, setData] = useState(getCourses());

	const onDelete = (id: string) => {
		setData(deleteCourse(id));
	};

	const cards = data.map((course, i) => (
		<div className='w-full lg:w-1/2 2xl:w-1/3 lg:px-5'>
			<CourseCard course={course} key={course.id} onDelete={() => onDelete(course.id)} />
		</div>
	));

	return (
		<>
			<div className="relative mb-5 pt-2">
				<h1 className='text-2xl text-center font-bold mb-5'>Courses</h1>
				<div className='sm:absolute sm:right-0 sm:top-0 lg:right-5'>
					<Link 
						to='/courses/add'
						className='text-center block sm:inline-block py-3 px-10 bg-slate-500 text-white hover:bg-slate-400 rounded-3xl'
					>
							<FontAwesomeIcon icon={faPlus} /> Add Course
					</Link>
				</div>
			</div>
			<div className="flex flex-row flex-wrap">
				{cards}
			</div>
		</>
	);
}

export default Courses;
