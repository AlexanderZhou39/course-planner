import { useEffect, useState, useRef } from 'react';
import { CourseSection } from '../../types';
import { getRandomColors } from '../../utils/eventColors';
import s from './calendar.module.css';
import Day from './day';
import TimeColumn from './time';

type P = {
	data: CourseSection[] | undefined,
	showSeats?: boolean,
	customColors?: string[]
}

const getWindowWidth = () => {
	return window.innerWidth;
};


function Calendar({ data, showSeats, customColors }: P) {
	const days = [0, 1, 2, 3, 4];
	const [windowWidth, setWindowWidth] = useState(getWindowWidth());
	const dColors = useRef(getRandomColors()).current;
	
	const colors = customColors || dColors;

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(getWindowWidth());
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [])

	let minTime = 8;
	let maxTime = 21;
	let hasWeekends = false;
	let key = null;
	if (data) {
		minTime = 23;
		maxTime = 1;
		const keyLabels = [];

		for (let i = 0; i < data.length; i++) {
			const section = data[i];
			keyLabels.push({
				color: colors[i],
				course: section.course.name,
				code: section.course.code,
				seats: section.seats
			});

			for (let x = 0; x < section.times.length; x++) {
				const time = section.times[x];
				if (time.type === 'Final') {
					continue;
				}
				const start = new Date(time.start);
				const end = new Date(time.end);
				if (!(start.getTime() < end.getTime())) {
					continue;
				}
				if (start.getHours() < minTime) {
					minTime = start.getHours();
				}
				if (end.getHours() > maxTime) {
					maxTime = end.getHours();
				}
				if (section.times[x].days.includes(5) || section.times[x].days.includes(6)) {
					if (!hasWeekends) {
						days.push(5);
						days.push(6);
						hasWeekends = true;
					}
				}
			}
		}

		const keyLabelsJSX = keyLabels.map((k, i) => (
			<div className='flex flex-row flex-nowrap xl:w-1/2' key={i}>
				<div 
					style={{
						backgroundColor: k.color
					}}
					className='w-5 h-5 inline-block mr-5 shrink-0' 
				/>
				<p className='inline-block'>{showSeats ? `${k.seats} Seats - ` : ''} {k.code ? `${k.code.toUpperCase()} (${k.course})` : k.course}</p>
			</div>
		));

		key = (
			<div className='w-full bg-white boxshadow rounded-xl mb-5 p-10'>
				<h1 className='text-center text-xl mb-5'>Key</h1>
				<div className="flex flex-col xl:flex-row xl:flex-wrap justify-between">
					{keyLabelsJSX}
				</div>
			</div>
		);
	}

	let blockSize = 4;
	if (windowWidth < 768) {
		blockSize = 3;
	}
	
	const columns = days.map(day => (
		<Day 
			data={data} 
			day={day} 
			minTime={minTime} 
			maxTime={maxTime} 
			showLabel={windowWidth < 768 ? true : false}
			size={blockSize}
			colors={colors}
			key={day + 1} 
		/>
	));

	if (windowWidth >= 768) {
		columns.unshift(
			<TimeColumn maxTime={maxTime} minTime={minTime} size={blockSize} key={0} />
		);
	}
		
	return (
		<div>
			{key}
			<div className={`w-full bg-white boxshadow rounded-xl flex flex-col md:flex-row overflow-hidden ${s.calendarContainer}`}>
				{columns}
			</div>
		</div>
	);
}

export default Calendar;
