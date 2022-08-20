import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'wouter';
import CourseCard from '../components/courseCard';
import { Course } from '../types';

function Courses() {
	const [data, setData] = useState<Course[]>([
		{
			id: 0,
			name: 'chicago',
			code: 'cogs 10',
			units: 4,
			sections: [
				{
					code: '1234523456432',
					instructor: 'Giles Downmandadfdafdadffa',
					seats: 10,
					times: [
						{
							days: [0,1,2],
							start: (new Date(2022, 11, 23, 12, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50)).getTime(),
							type: 'Lectureasdfasdafasddfa'
						},
						{
							days: [0],
							start: (new Date(2022, 11, 23, 9, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50).getTime()),
							type: 'Labaasdadfsdadfasdf'
						}
					]
				},
				{
					code: '12345',
					instructor: 'Giles Downman',
					seats: 10,
					times: [
						{
							days: [0,1,2],
							start: (new Date(2022, 11, 23, 12, 0)).getTime(),
							end: (new Date(2022, 11, 23, 23, 50)).getTime(),
							type: 'Lecture'
						},
						{
							days: [0],
							start: (new Date(2022, 11, 23, 12, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50).getTime()),
							type: 'Lab'
						}
					]
				}
			]
		},
		{
			id: 0,
			name: 'chicago',
			code: 'cogs 10',
			units: 4,
			sections: [
				{
					code: '1234523456432',
					instructor: 'Giles Downmandadfdafdadffa',
					seats: 10,
					times: [
						{
							days: [0,1,2],
							start: (new Date(2022, 11, 23, 24, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50)).getTime(),
							type: 'Lectureasdfasdafasddfa'
						},
						{
							days: [0],
							start: (new Date(2022, 11, 23, 9, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50).getTime()),
							type: 'Labaasdadfsdadfasdf'
						}
					]
				},
				{
					code: '12345',
					instructor: 'Giles Downman',
					seats: 10,
					times: [
						{
							days: [0,1,2],
							start: (new Date(2022, 11, 23, 12, 0)).getTime(),
							end: (new Date(2022, 11, 23, 23, 50)).getTime(),
							type: 'Lecture'
						},
						{
							days: [0],
							start: (new Date(2022, 11, 23, 12, 0)).getTime(),
							end: (new Date(2022, 11, 23, 12, 50).getTime()),
							type: 'Lab'
						}
					]
				}
			]
		}
	]);

	const cards = data.map((course, i) => <CourseCard course={course} key={i} />);

	return (
		<>
			<h1 className='text-2xl text-center font-bold mb-5'>Courses</h1>
			<Link to='/courses/add'>
				<button
					className='block ml-auto py-3 px-10 bg-slate-500 text-white hover:bg-slate-400 rounded-3xl mb-5'
				>
					<FontAwesomeIcon icon={faPlus} /> Add Course
				</button>
			</Link>
			<div className="flex flex-row flex-wrap justify-evenly">
				{cards}
			</div>
		</>
	);
}

export default Courses;
