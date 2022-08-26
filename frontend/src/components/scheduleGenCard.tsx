import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCaretDown, faCaretUp, faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { PossibleSchedule } from "../types";
import s from './cardGrid.module.css';
import TimeBlock from "./timeBlock";

type P = {
	schedule: PossibleSchedule,
	onSave: () => void,
	onDiscard: () => void
};

function ScheduleGenCard({ schedule, onSave, onDiscard }: P) {
	const [hide, setHide] = useState(true);
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
					<p className={`${s.colXs} mr-3 font-bold mb-5`}>{section.code}</p>
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
		<div className='bg-white w-full rounded-2xl p-5 mb-5 text-sm boxshadow'>
			<h4 className="text-center text-xl mb-1 font-bold">{schedule.name}</h4>
			<h5 className="text-center text-sm mb-3">{schedule.totalUnits} Units</h5>
			<h5 className="text-center text-sm mb-3">{schedule.totalSeats} Seats</h5>
			<button 
				className='w-full text-center py-2 bg-gray-200 hover:bg-gray-300 rounded-xl mb-5'
				onClick={() => setHide(!hide)}
			>
				<FontAwesomeIcon icon={hide ? faCaretDown : faCaretUp} /> {hide ? 'Show' : 'Hide'} Sections
			</button>
			<div className="flex flex-col mb-5" style={{ display: hide ? 'none' : 'block' }}>
				{sections}
			</div>
			<div className='flex flex-row flex-wrap justify-between'>
				<button 
					className='py-2 mb-3 bg-gray-200 hover:bg-gray-300 rounded-xl w-full sm:w-5/12 text-center'
					onClick={() => {
						if (confirm) {
							clearTimeout(timeout.current);
							onDiscard();
						} else {
							setConfirm(true);
							timeout.current = setTimeout(() => {
								setConfirm(false);
							}, 3000);
						}
					}}
				>
					<FontAwesomeIcon icon={faTrash} /> { confirm ? 'Confirm?' : 'Discard' }
				</button>
				<button 
					className='text-center py-2 mb-3 bg-slate-500 hover:bg-slate-400 rounded-xl text-white w-full sm:w-5/12'
					onClick={() => onSave()}
				>
					<FontAwesomeIcon icon={faFloppyDisk} /> Save
				</button>
			</div>
		</div>
	);
}

export default ScheduleGenCard;
