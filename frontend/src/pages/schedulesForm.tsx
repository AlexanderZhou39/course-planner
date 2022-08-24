import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faFileExport, faX, faShare } from "@fortawesome/free-solid-svg-icons";
import SectionBlock from "../components/sectionBlock";
import { CourseSection, Schedule, Section } from "../types";
import checkSectionConflict from "../utils/checkSectionConflict";
import { 
	getCourses, getSchedule, getScheduleIdCount, 
	saveSchedule, saveScheduleIdCount 
} from "../utils/storage";
import createBlankSchedule from "../utils/createBlankSchedule";
import { useLocation } from "wouter";
import compareCourses from "../utils/courseSort";

function SchedulesForm({ id }: { id?: number }) {
	const courses = getCourses().sort(compareCourses);
	const idCounter = useRef(0);
	const sId = useRef('');
	const nameRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState('');
	const [hideConflict, setHideConflict] = useState(true);
	const [selected, setSelected] = useState<CourseSection[]>([]);
	const totalUnits = selected.reduce((a, b) => a + b.course.units, 0);

	const setLocation = useLocation()[1];

	useEffect(() => {
		idCounter.current = getScheduleIdCount();

		let schedule;
		if (id !== undefined && getSchedule(id) !== -1) {
			schedule = getSchedule(id) as Schedule;
		} else {
			schedule = createBlankSchedule(idCounter);
		}
		sId.current = schedule.id;
		setName(schedule.name);
		setSelected(schedule.sections);
		setHideConflict(schedule.noConflict);
	}, []);

	const addSection = (section: CourseSection) => {
		const copy = [...selected];
		copy.push(section);
		setSelected(copy);
	};

	const removeSection = (id: string) => {
		const i = selected.findIndex(s => s.id === id);
		if (i > -1) {
			const copy = [...selected];
			copy.splice(i, 1);
			setSelected(copy);
		}
	};

	const checkSelected = (id: string) => {
		return selected.findIndex(s => s.id === id) > -1;
	};

	const checkConflict = (section: Section) => {
		if (selected.findIndex(s => s.id === section.id) > -1) {
			return false;
		}
		for (let i = 0; i < selected.length; i++) {
			const s = selected[i];
			if (checkSectionConflict(s, section)) {
				return true;
			}
		}
		return false;
	};

	const onSave = (asnew = false) => {
		if (asnew) {
			const id = idCounter.current
			sId.current = `schedule-${id}`;
			idCounter.current = id + 1;
		}
		const nameInput = nameRef.current as HTMLInputElement;
		const data: Schedule = {
			id: sId.current,
			name: nameInput.value || sId.current, 
			noConflict: hideConflict,
			sections: selected
		}
		saveSchedule(data);
		saveScheduleIdCount(idCounter.current);
		setLocation('/schedules');
	};

	if (!courses.length) {
		return (
			<>
				<h1 className="text-2xl font-bold text-center mb-8">
					{id !== undefined ? 'Edit' : 'Create'} Schedule
				</h1>
				<h4 className='text-center text-lg my-10'>
					You have no courses currently!<br />
					<Link 
						to='/courses/add'
						className='text-blue-600 hover:text-blue-400 hover:underline'
					>Add a course here.</Link>
				</h4>
			</>
		);
	}

	const coursesJSX = courses.map((course, x) => {
		const sections = course.sections.map((section, y) => (
			<div 
				className={
					`flex flex-row flex-wrap md:flex-nowrap text-sm ${
						hideConflict && checkConflict(section) ? 'hidden' : ''
					}`
				}
				key={y}
			>
				<div className="mr-3">
					<input 
						className="w-4 h-4" type="checkbox" name={section.id} 
						checked={checkSelected(section.id)}
						onChange={(e) => {
							if (e.target.checked) {
								addSection({
									...section,
									course: {
										name: course.name,
										units: course.units,
										code: course.code
									}
								});
							} else {
								removeSection(section.id)
							}
						}}
					/>
				</div>
				<SectionBlock section={section}/>
			</div>
		));
		return (
			<div className="mb-10" key={x}>
				<h4 className="bg-slate-500 text-white py-3 px-3 rounded-xl mb-3">
					{
						course.code
					} {
						course.code ? '-' : ''
					} {
						course.name
					} {
						`(${course.units} Units)`
					}
				</h4>
				<div className="pl-1">
					{sections}
				</div>
			</div>
		);
	});
	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-5">
				{id !== undefined ? 'Edit' : 'Create'} Schedule
			</h1>
			{
				id === undefined ?
					<div className='w-full text-center'>
						<Link to='/schedules/generate' className='bg-slate-500 hover:bg-slate-400 text-white py-3 px-10 rounded-xl'>
							Go To Generator <FontAwesomeIcon icon={faShare} />
						</Link>
					</div>
				: null
			}
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl py-5 px-5 mt-10 mb-10 boxshadow'>
				<h1 className='text-xl text-center font-bold mb-5'>Schedule</h1>

				<label htmlFor="schedule-name" className='block text-lg'>Name</label>
				<input 
					placeholder='Sched A, Plan B, ...'
					className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100 mb-10"
					type="text" name='schedule-name' defaultValue={name} ref={nameRef}
				/>

				<h1 className='text-xl text-center font-bold mb-5'>Select Sections</h1>
				<h4 className='mb-3 text-lg text-center'>Total Units: {totalUnits}</h4>
				<div className="mb-5">
					<input 
						className="w-4 h-4 align-middle mr-3" type="checkbox" name="hide-conflicting" 
						checked={hideConflict}
						onChange={() => setHideConflict(!hideConflict)}
					/>
					<label className="align-middle" htmlFor="hide-conflicting">Hide Conflicting Sections</label>
					<p className="block text-sm text-gray-600">
						Automatically hides sections with conflicting times. Finals can only conflict with other finals and are assumed to be on the same week. Meetings with identical start and end times are ignored. Uncheck if you experience performance issues.
					</p>
				</div>
				<button 
					onClick={() => setSelected([])}
					className='bg-gray-200 hover:bg-gray-300 text-black py-3 px-10 rounded-xl mb-5'
				>
					<FontAwesomeIcon icon={faX} /> De-select all
				</button>
				<div>
					{coursesJSX}
				</div>
				<div className='mt-10 mb-5 flex flex-row flex-wrap justify-center'>
					<button 
						className={`bg-gray-200 hover:bg-gray-300 text-black py-3 px-10 rounded-2xl mb-3 mr-3 ${
							id !== undefined ? '' : 'hidden'
						}`}
						onClick={() => onSave(true)}
					>
						<FontAwesomeIcon icon={faFileExport}/> Save As New
					</button>
					<button 
						className='bg-slate-500 hover:bg-slate-400 text-white py-3 px-10 rounded-2xl mb-3 mr-3'
						onClick={() => onSave()}
					>
						<FontAwesomeIcon icon={faFloppyDisk}/> Save Changes
					</button>
				</div>
			</div>
		</>
	);
}

export default SchedulesForm;
