import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Course } from "../types";
import compareCourses from "../utils/courseSort";
import { getCourses } from "../utils/storage";

function SchedulesGenerator() {
	const courses = getCourses().sort(compareCourses);
	const [selected, setSelected] = useState<string[]>([]);

	const options = courses.map(course => (
		<div className='block' key={course.id}>
			<input 
				onChange={(e) => {
					if (e.target.checked) {
						setSelected([...selected, course.id]);
					} else {
						const copy = [...selected];
						const i = selected.indexOf(course.id);
						copy.splice(i, 1);
						setSelected(copy);
					}
				}}
				checked={selected.includes(course.id)}
				className='w-4 h-4 align-middle mr-3' type="checkbox" name={course.id} 
			/>
			<label className='align-middle' htmlFor={course.id}>{course.code}{
				course.name ? ` - ${course.name}` : ''
			}</label>
		</div>
	));

	const onGenerate = () => {

	};

	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-8">
				Generate Schedules
			</h1>
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-10 mb-10 boxshadow'>
				<h2 className='text-lg font-bold'>Select Courses</h2>
				<div className='mb-8'>
					{options}
				</div>
				<button
					onClick={() => onGenerate()}
					className='bg-slate-500 hover:bg-slate-400 text-white py-3 px-10 rounded-2xl block mx-auto'
				>
					<FontAwesomeIcon icon={faGear} /> Generate
				</button>
			</div>
		</>
	);
}

export default SchedulesGenerator;
