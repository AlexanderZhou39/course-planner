import WeekDays from "./weekDays";
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
				<WeekDays days={time.days} />
			</div>
		));

		return (
			<div className="section flex flex-col mb-5" key={x}>
				<div className="flex flex-row">
					<p className={`${s.colSm} mr-3 font-bold mb-5`}>{section.code}</p>
					<p className={`${s.colMd} mr-7 font-bold`}>{section.instructor}</p>
				</div>
				<div className="flex flex-col pl-5">
					{times}
				</div>
			</div>
		);
	});

	return (
		<div className='bg-white rounded-2xl p-5 max-w-3xl mb-10 text-sm boxshadow'>
			<h3 className="text-center text-xl mb-0 font-bold">{course.code.toUpperCase()}</h3>
			<h4 className="text-center text-xl mb-5 font-bold">{course.name}</h4>
			<div className="flex flex-col">
				{sections}
			</div>
		</div>
	);
}

export default CourseCard;
