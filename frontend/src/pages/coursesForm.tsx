import { useEffect, useReducer, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faCaretDown, faCaretUp, faPlus, 
	faMinus, faFloppyDisk, faFileExport,
	faClone, faTrash 
} from '@fortawesome/free-solid-svg-icons';
import DaysWidget from '../components/daysWidget';
import createBlankCourse from '../utils/createBlankCourse';
import createBlankSection from '../utils/createBlankSection';
import createBlankTime from '../utils/createBlankTime';
import timeInputFormat from '../utils/timeInputFormat';
import { Course, IdCounter, Section, TimeTypes } from '../types';
import getSortedInputs from '../utils/inputSort';
import timeInputToStamp from '../utils/timeInputToStamp';
import { getCourse, getIdCounts, saveCourse, saveIdCounts } from '../utils/storage';
import { useLocation } from 'wouter';
import copyCourse, { copySection } from '../utils/copyCourse';

type SAction = {
	type: 'delete' | 'remove-time' | 'add-time' | 'add' | 'moveup' | 'movedown' | 'set'
	index: number,
	idCount: React.MutableRefObject<IdCounter>,
	state?: Section[]
};

const SectionsReducer = (state: Section[], action: SAction): Section[] => {
	switch (action.type) {
		case 'delete':
			const copy = [...state];
			copy.splice(action.index, 1);
			return copy;
		case 'remove-time':
			const rCopy = [...state];
			const tCopy = rCopy[action.index];
			tCopy.times.pop();
			rCopy[action.index] = tCopy;
			return rCopy;
		case 'add-time':
			const xCopy = [...state];
			const cCopy = xCopy[action.index];
			cCopy.times.push(createBlankTime(action.idCount));
			xCopy[action.index] = cCopy;
			return xCopy;
		case 'add':
			const aCopy = [...state];
			aCopy.push(createBlankSection(action.idCount));
			return aCopy;
		case 'moveup':
			if (action.index === 0) {
				return state;
			}
			const mCopy = [...state];
			const a = mCopy[action.index - 1];
			mCopy[action.index - 1] = mCopy[action.index];
			mCopy[action.index] = a;
			return mCopy;
		case 'movedown':
			if (action.index === state.length - 1) {
				return state;
			}
			const dCopy = [...state];
			const b = dCopy[action.index + 1];
			dCopy[action.index + 1] = dCopy[action.index];
			dCopy[action.index] = b;
			return dCopy;
		case 'set':
			if (!action.state) {
				throw new Error();
			}
			return action.state;
	}
};

function CoursesForm({ id }: { id?: number }) {
	const idCounter = useRef({
		course: 0,
		section: 0,
		time: 0
	});
	const cId = useRef('');
	const [cCode, setCCode] = useState('');
	const [cUnits, setCUnits] = useState(0);
	const [cName, setCName] = useState('');
	const [sections, dispatch] = useReducer(SectionsReducer, []);

	const setLocation = useLocation()[1];

	useEffect(() => {
		idCounter.current = getIdCounts();

		let course;
		if (id !== undefined && getCourse(id) !== -1) {
			course = getCourse(id) as Course;
		} else {
			course = createBlankCourse(idCounter);
		}
		setCCode(course.code);
		setCName(course.name);
		setCUnits(course.units);
		cId.current = course.id;
		dispatch({ 
			type: 'set', 
			state: course.sections
		} as SAction);
	}, []);

	const duplicateSection = (i: number) => {
		const section = sections[i];

		section.code = (
			document.getElementById(`${section.id}-code`) as HTMLInputElement
		).value;
		section.instructor = (
			document.getElementById(`${section.id}-instructor`) as HTMLInputElement
		).value;
		section.seats = parseInt((
			document.getElementById(`${section.id}-seats`) as HTMLInputElement
		).value);

		const times = section.times;
		section.times = [];

		const timeTypes = getSortedInputs(`${section.id}-time-type`);
		const timeStarts = getSortedInputs(`${section.id}-time-start`);
		const timeEnds = getSortedInputs(`${section.id}-time-end`);
		const timeDays = getSortedInputs(`${section.id}-time-days`);

		for (let i = 0; i < times.length; i++) {
			const time = times[i];
			time.type = timeTypes[i].value as TimeTypes;
			time.start = timeInputToStamp(timeStarts[i].value);
			time.end = timeInputToStamp(timeEnds[i].value);
			time.days = JSON.parse(timeDays[i].value) as number[];

			section.times.push(time);
		}

		const newSection = copySection(section, idCounter);
		const newSections = [...sections];
		if (i === sections.length - 1) {
			newSections.push(newSection);
		} else {
			newSections.splice(i + 1, 0, newSection);
		}

		dispatch({
			type: 'set',
			state: newSections
		} as SAction);
	};

	console.log(sections)

	const onSave = (asnew = false) => {
		const code = (
			document.getElementById('course-code') as HTMLInputElement
		).value;
		const name = (
			document.getElementById('course-name') as HTMLInputElement
		).value;
		const units = parseInt((
			document.getElementById('course-units') as HTMLInputElement
		).value);

		const data: Course = {
			id: cId.current,
			code: code,
			units: units,
			name: name,
			sections: []
		};

		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];
			section.code = (
				document.getElementById(`${section.id}-code`) as HTMLInputElement
			).value;
			section.instructor = (
				document.getElementById(`${section.id}-instructor`) as HTMLInputElement
			).value;
			section.seats = parseInt((
				document.getElementById(`${section.id}-seats`) as HTMLInputElement
			).value);

			const times = section.times;
			section.times = [];

			const timeTypes = getSortedInputs(`${section.id}-time-type`);
			const timeStarts = getSortedInputs(`${section.id}-time-start`);
			const timeEnds = getSortedInputs(`${section.id}-time-end`);
			const timeDays = getSortedInputs(`${section.id}-time-days`);

			for (let i = 0; i < times.length; i++) {
				const time = times[i];
				time.type = timeTypes[i].value as TimeTypes;
				time.start = timeInputToStamp(timeStarts[i].value);
				time.end = timeInputToStamp(timeEnds[i].value);
				time.days = JSON.parse(timeDays[i].value) as number[];

				section.times.push(time);
			}
			data.sections.push(section);
		}
		if (asnew) {
			saveCourse(copyCourse(data, idCounter));
		} else {
			saveCourse(data);
		}
		saveIdCounts(idCounter.current);
		setLocation('/');
	};

	const sectionsJSX = sections.map((section, i) => {
		const timesJSX = section.times.map((time, x) => (
			<div className='flex flex-row flex-wrap mb-3' key={time.id}>
				<div className='mr-5 w-44'>
					<label className='block' htmlFor={`${section.id}-time-type`}>Type</label>
					<select 
						className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
						name={`${section.id}-time-type`} id={`${i}:${x}`}
						defaultValue={time.type}
					>
						<option value="">---</option>
						<option value="Lec">Lecture</option>
						<option value="Lab">Lab</option>
						<option value="Disc">Discussion</option>
						<option value="Final">Final</option>
						<option value="Other">Other</option>
					</select>
				</div>
				<div className='mr-5 w-44'>
					<label className='block' htmlFor={`${section.id}-time-start`}>Start Time</label>
					<input 
						className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
						type='time' name={`${section.id}-time-start`} defaultValue={timeInputFormat(time.start)} id={`${i}:${x}`}
					/>
				</div>
				<div className='mr-5 w-44'>
					<label className='block' htmlFor={`${section.id}-time-end`}>End Time</label>
					<input 
						className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
						type='time' name={`${section.id}-time-end`} defaultValue={timeInputFormat(time.end)}
						id={`${i}:${x}`}
					/>
				</div>
				<div className=''>
					<label className='block' htmlFor={`${section.id}-time-days`}>Select Days</label>
					<DaysWidget secId={section.id} value={time.days} id={`${i}:${x}`} />
				</div>
			</div>
		));
		return (
			<div key={section.id} className='mb-10'>
				<div className="flex flex-row justify-between mb-3">
					<div>
						<div className='text-lg font-bold mb-3'>
							<h4 className='inline-block w-20'>Section</h4>
							<span className='inline-block '>{i+1}</span>
							<button 
								onClick={() => duplicateSection(i)}
								className='py-1 px-3 rounded-xl ml-3 text-base font-normal bg-gray-200  hover:bg-gray-300 text-gray-600'
							>
								<FontAwesomeIcon icon={faClone} /> Duplicate
							</button>
							<button 
								onClick={() => dispatch({ type: 'delete', index: i } as SAction)}
								className='py-1 px-3 rounded-xl ml-3 text-base font-normal bg-gray-200  hover:bg-gray-300 text-gray-600'
							>
								<FontAwesomeIcon icon={faTrash} /> Remove
							</button>
						</div>
						<div className="flex flex-row flex-wrap mb-5">
							<div className='mr-5 w-44'>
								<label className='block' htmlFor={`${section.id}-code`}>Code</label>
								<input 
									className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
									placeholder='085734'
									defaultValue={section.code}
									type="text"
									name={`${section.id}-code`}
									id={`${section.id}-code`}
								/>
							</div>
							<div className='mr-5 w-44'>
								<label className='block' htmlFor={`${section.id}-instructor`}>Professor</label>
								<input 
									className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
									placeholder='Jane Doe'
									defaultValue={section.instructor}
									type="text" name={`${section.id}-instructor`} 
									id={`${section.id}-instructor`} 
								/>
							</div>
							<div className='w-44'>
								<label className='block' htmlFor={`${section.id}-seats`}>Seats</label>
								<input 
									className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
									type="number" min={0} step={1} defaultValue={section.seats} name={`${section.id}-seats`} 
									id={`${section.id}-seats`} 
								/>
							</div>
						</div>
					</div>
					<div>
						<button className='block text-3xl w-10 h-5 text-gray-600 hover:text-gray-400' onClick={() => dispatch({
							type: 'moveup',
							index: i,
							idCount: idCounter
						})}>
							<FontAwesomeIcon icon={faCaretUp} />
						</button>
						<button className='block text-3xl w-10 h-5 text-gray-600 hover:text-gray-400' onClick={() => dispatch({
							type: 'movedown',
							index: i,
							idCount: idCounter
						})}>
							<FontAwesomeIcon icon={faCaretDown} />
						</button>
					</div>
				</div>
				<div className='text-lg font-bold mb-3'>
					<h4 className='inline-block w-20'>Meetings</h4>
					<span className='inline-block mr-3'>{i+1}</span>
					<div className="inline-block">
						<button 
							className='py-1 px-3 bg-slate-500 hover:bg-slate-400 text-white text-sm rounded-xl mr-1'
							onClick={() => dispatch({ type: 'add-time', index: i, idCount: idCounter})}
						>
							<FontAwesomeIcon icon={faPlus} />
						</button>
						<button 
							className='py-1 px-3 bg-gray-200 hover:bg-gray-300 text-black text-sm rounded-xl mr-3'
							onClick={() => dispatch({ type: 'remove-time', index: i, idCount: idCounter})}
						>
							<FontAwesomeIcon icon={faMinus} />
						</button>
					</div>
				</div>
				<div className='flex flex-col'>
					{timesJSX}
				</div>
			</div>
		);
	});

	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-8">
				{id !== undefined ? 'Edit' : 'Add'} Course
			</h1>
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl py-5 px-5 mb-10 boxshadow'>
				<h1 className='text-xl text-center font-bold mb-5'>Course</h1>
				<div className="flex flex-row flex-wrap justify-between mb-8">
					<div className="grow px-3">
						<label htmlFor="course-code" className='block text-lg'>Course Code</label>
						<input 
							placeholder='CSE 101, BIOL 129, LANG 309, ...'
							className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100"
							type="text" name='course-code' defaultValue={cCode}
							id='course-code'
						/>
					</div>
					<div className="grow px-3">
						<label htmlFor="course-name" className='block text-lg'>Course Units</label>
						<input 
							className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100"
							type="number" min={0} step={1} name='course-units' defaultValue={cUnits}
							id='course-units'
						/>
					</div>
					<div className="grow px-3">
						<label htmlFor="course-name" className='block text-lg'>Course Name</label>
						<input 
							placeholder='Introduction to XXX'
							className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100"
							type="text" name='course-name' defaultValue={cName}
							id='course-name'
						/>
					</div>
				</div>
				<div className='relative mb-5'>
					<h1 className='text-xl text-center font-bold'>Sections</h1>
					<div className='flex flex-row justify-end sm:absolute sm:right-0 sm:top-0'>
						<button 
							onClick={() => dispatch({ type: 'add', idCount: idCounter } as SAction)}
							className='py-1 px-5 bg-slate-500 hover:bg-slate-400 text-white rounded-xl mr-3'
						>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					</div>
				</div>
				<div className="pl-5">
					{sectionsJSX}
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

export default CoursesForm;
