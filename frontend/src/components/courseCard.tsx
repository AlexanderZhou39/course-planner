import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import DaysDisplay from "./daysDisplay";
import formatAMPM from "../utils/dateformat";
import { Course } from "../types";
import s from './courseCard.module.css';

function CourseCard({ course }: { course: Course }) {
	const sections = course.sections.map((section, x) => {
		const times = section.times.map((time, y) => (
			<div className="mb-3 flex flex-row flex-wrap" key={y}>
				<p className={`${s.colSm} mr-3`}>{time.type}</p>
				<p className='mr-3'>
					{formatAMPM(new Date(time.start))} - {formatAMPM(new Date(time.end))}
				</p>
				<DaysDisplay days={time.days} />
			</div>
		));

		return (
			<div className="section flex flex-col mb-5" key={x}>
				<div className="flex flex-row">
					<p className={`${s.colSm} mr-3 font-bold mb-5`}>{section.code}</p>
					<p className={`${s.colMd} mr-5 font-bold mb-5`}>{section.instructor}</p>
					<p className='mb-5'>{section.seats} seats</p>
				</div>
				<div className="flex flex-col">
					{times}
				</div>
			</div>
		);
	});

	return (
		<div className='bg-white rounded-2xl p-5 max-w-3xl mb-10 text-sm boxshadow relative'>
			<Link 
				to={`/courses/${course.id.split('-')[1]}/edit`} 
				className='absolute top-5 right-5 text-gray-600 hover:text-gray-400'>
				<FontAwesomeIcon icon={faPencil} /> Edit
			</Link>
			<h3 className="text-center text-xl mb-0 font-bold">{course.code.toUpperCase()}</h3>
			<h4 className="text-center text-xl mb-1 font-bold">{course.name}</h4>
			<h5 className="text-center text-sm mb-5">{course.units} Units</h5>
			<div className="flex flex-col">
				{sections}
			</div>
		</div>
	);
}

export default CourseCard;
