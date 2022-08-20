import { useState, useReducer } from 'react';
import WeekDaysWidget from '../components/weekDaysWidget';
import s from './coursesForm.module.css';

type SAction = {
	type: 'delete' | 'remove-time' | 'add-time' | 'add'
	index: number
}

const SectionsReducer = (state: number[], action: SAction): number[] => {
	switch (action.type) {
		case 'delete':
			return [...state].splice(action.index, 1);
		case 'remove-time':
			const rCopy = [...state];
			rCopy[action.index] = Math.max(rCopy[action.index] - 1, 1);
			return rCopy;
		case 'add-time':
			const xCopy = [...state];
			xCopy[action.index] = xCopy[action.index] + 1;
			return xCopy;
		case 'add':
			const aCopy = [...state];
			aCopy.push(1);
			return aCopy;
	}
};

function CoursesForm({ id }: { id?: number }) {
	const [cName, setCName] = useState('');
	const [cCode, setCCode] = useState('');
	const [sections, sDispatch] = useReducer(SectionsReducer, [2, 1]);

	const sectionsJSX = sections.map((section, x) => {
		const times: JSX.Element[] = [];
		for (let i = 0; i < section; i++) {
			times.push(
				<div className='flex flex-row flex-wrap mb-3'>
					<div className='mr-5 w-44'>
						<label className='block' htmlFor={`${x}-time-type`}>Type</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							placeholder='Lec, Lab, Final, ...'
							type="text" name={`${x}-code`} id={`${x}:${i}`}
						/>
					</div>
					<div className='mr-5 w-44'>
						<label className='block' htmlFor={`${x}-time-start`}>Start Time</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							type='time' name={`${x}-time-start`} id={`${x}:${i}`}
						/>
					</div>
					<div className='mr-5 w-44'>
						<label className='block' htmlFor={`${x}-time-end`}>End Time</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							type='time' name={`${x}-time-end`} id={`${x}:${i}`}
						/>
					</div>
					<div className=''>
						<label className='block' htmlFor={`${x}-time-days`}>Select Days</label>
						<WeekDaysWidget secId={x} id={`${x}:${i}`} />
					</div>
				</div>
			);
		}

		return (
			<div key={x} className='mb-8'>
				<h4 className='text-lg font-bold mb-3'>Section {x+1}</h4>
				<div className="flex flex-row flex-wrap mb-5">
					<div className='mr-5 w-44'>
						<label className='block' htmlFor={`${x}-code`}>Code</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							placeholder='085734'
							type="text" name={`${x}-code`}
						/>
					</div>
					<div className='mr-5 w-44'>
						<label className='block' htmlFor={`${x}-instructor`}>Professor</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							placeholder='Jane Doe'
							type="text" name={`${x}-instructor`} 
						/>
					</div>
					<div className='w-44'>
						<label className='block' htmlFor={`${x}-seats`}>Seats</label>
						<input 
							className='w-full py-1 px-2 border-b border-solid border-black bg-gray-100'
							type="number" min={0} step={1} defaultValue={0} name={`${x}-seats`} 
						/>
					</div>
				</div>
				<h4 className='font-bold text-lg mb-3'>Meetings {x+1}</h4>
				<div className='flex flex-col'>
					{times}
				</div>
			</div>
		);
	});

	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-8">{id ? 'Edit' : 'Add'} Course</h1>
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl py-5 px-5 mb-10 boxshadow'>
				<h1 className='text-xl text-center mb-5'>Course</h1>
				<div className="flex flex-row flex-wrap justify-between mb-8">
					<div className="grow px-5">
						<label htmlFor="course-code" className='block text-lg'>Course Code</label>
						<input 
							placeholder='CSE 101, BIOL 129, LANG 309, ...'
							className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100"
							type="text" name='course-code' value={cCode} 
							onChange={(e) => setCCode(e.target.value)} 
						/>
					</div>
					<div className="grow px-5">
						<label htmlFor="course-name" className='block text-lg'>Course Name</label>
						<input 
							placeholder='Introduction to XXX'
							className="w-full py-1 px-2 border-b border-solid border-black bg-gray-100"
							type="text" name='course-name' value={cName} 
							onChange={(e) => setCName(e.target.value)} 
						/>
					</div>
				</div>
				<h1 className='text-xl text-center mb-5'>Sections</h1>
				<div className="pl-5">
					{sectionsJSX}
				</div>
			</div>
		</>
	);
}

export default CoursesForm;
