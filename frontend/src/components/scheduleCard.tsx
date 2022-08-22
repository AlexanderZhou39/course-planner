import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "wouter";
import { useState, useRef } from "react";
import { Schedule } from "../types";
import s from './cardGrid.module.css';
import TimeBlock from "./timeBlock";

type P = {
	schedule: Schedule,
	onDelete: () => void
};

function ScheduleCard({ schedule, onDelete }: P) {
	const [confirm, setConfirm] = useState(false);
	const timeout = useRef<number>();

	const sections = schedule.sections.map((section, x) => {
		const times = section.times.map((time, y) => (
			<TimeBlock time={time} key={y} />
		));

		return (
			<div className="section flex flex-col mb-5" key={x}>
				<div className="py-3 px-3 mb-2 bg-slate-500 text-white rounded-xl font-bold">
					<h4>
						{
							section.course.code
						} {
							section.course.code ? '-' : ''
						} {
							section.course.name
						} {
							`(${section.course.units} Units)`
						}
					</h4>
				</div>
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
		<div className='bg-white rounded-2xl p-5 mb-10 text-sm boxshadow relative'>
			<Link 
				to={`/schedules/${schedule.id.split('-')[1]}/edit`} 
				className='absolute top-5 left-5 text-gray-600 hover:text-gray-400'>
				<FontAwesomeIcon icon={faPencil} /> Edit
			</Link>
			<button
				onClick={() => {
					if (confirm) {
						clearTimeout(timeout.current);
						onDelete();
					} else {
						setConfirm(true);
						timeout.current = setTimeout(() => {
							setConfirm(false);
						}, 3000);
					}
				}}
				className='absolute top-5 right-5 text-gray-600 hover:text-gray-400'>
				<FontAwesomeIcon icon={faTrash} /> {confirm ? 'Confirm?' : 'Delete'}
			</button>
			<h4 className="text-center text-xl mb-5 font-bold">{schedule.name}</h4>
			<div className="flex flex-col">
				{sections}
			</div>
		</div>
	);
}

export default ScheduleCard;
