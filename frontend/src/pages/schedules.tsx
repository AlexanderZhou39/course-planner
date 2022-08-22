import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { deleteSchedule, getSchedules } from "../utils/storage";
import ScheduleCard from "../components/scheduleCard";
import { Schedule } from "../types";

function Schedules() {
	const [data, setData] = useState<Schedule[]>(getSchedules());

	const onDelete = (id: string) => {
		setData(deleteSchedule(id));
	};

	const cards = data.map(schedule => (
		<div className='w-full lg:w-1/2 2xl:w-1/3 lg:px-5' key={schedule.id}>
			<ScheduleCard schedule={schedule} onDelete={() => onDelete(schedule.id)} />
		</div>
	));
	
	return (
		<>
			<div className="relative mb-5 pt-2">
				<h1 className='text-2xl text-center font-bold mb-5'>Schedules</h1>
				<div className='sm:absolute sm:right-0 sm:top-0 lg:right-5'>
					<Link 
						to='/schedules/add'
						className='text-center block sm:inline-block py-3 px-10 bg-slate-500 text-white hover:bg-slate-400 rounded-3xl'
					>
							<FontAwesomeIcon icon={faPlus} /> Create Schedule
					</Link>
				</div>
			</div>
			<h4 className={`text-center text-lg my-10 ${
				data.length ? 'hidden' : ''
			}`}>Create and manage schedules here!</h4>
			<div className="flex flex-row flex-wrap">
				{cards}
			</div>
		</>
	);
}

export default Schedules;
