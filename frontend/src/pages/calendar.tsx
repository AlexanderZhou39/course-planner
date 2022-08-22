import { useState } from "react";
import { Link } from "wouter";
import Calendar from "../components/calendar/calendar";
import { Schedule } from "../types";
import { getSchedules } from "../utils/storage";

function CalendarView() {
	const schedules = getSchedules();
	const [selected, setSelected] = useState<Schedule | undefined>(schedules?.[0]);

	if (!schedules.length) {
		return (
			<>
				<h1 className='text-2xl text-center font-bold mb-5'>Calendar</h1>
				<h4 className='text-center text-lg my-10'>
					You have no schedules currently!<br />
					<Link 
						to='/schedules/add'
						className='text-blue-600 hover:text-blue-400 hover:underline'
					>Create a schedule here.</Link>
				</h4>
			</>
		);
	}

	const options = schedules.map(schedule => (
		<div className='block' key={schedule.id}>
			<input 
				onChange={(e) => {
					if (e.target.checked) {
						setSelected(schedule);
					} else if (schedule.id === selected?.id) {
						setSelected(undefined);
					}
				}}
				checked={schedule.id === selected?.id}
				className='w-4 h-4 align-middle mr-3' type="checkbox" name={schedule.id} 
			/>
			<label className='align-middle' htmlFor={schedule.id}>{schedule.name}</label>
		</div>
	));

	return (
		<>
			<h1 className='text-2xl text-center font-bold mb-5'>Calendar</h1>
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-10 mb-10 boxshadow'>
				<h4 className='text-xl'>Select a schedule</h4>
				<div>
					{options}
				</div>
			</div>
			<div className="w-full mx-auto mb-10">
				<Calendar data={selected?.sections} />
			</div>
		</>
	);
}

export default CalendarView;
