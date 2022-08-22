import { useEffect, useState } from 'react';
import { CourseSection } from '../../types';
import s from './calendar.module.css';
import Day from './day';
import TimeColumn from './time';

type P = {
	data: CourseSection[] | undefined
}

const getWindowWidth = () => {
	return window.innerWidth;
};

function Calendar({ data }: P) {
	const days = [0, 1, 2, 3, 4];
	const [windowWidth, setWindowWidth] = useState(getWindowWidth());

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(getWindowWidth());
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [])

	let minTime = 6;
	let maxTime = 21;
	let hasWeekends = false;
	if (data) {
		for (let i = 0; i < data.length; i++) {
			const section = data[i];
			for (let x = 0; x < section.times.length; x++) {
				const start = (new Date(section.times[x].start)).getHours();
				const end = (new Date(section.times[x].end)).getHours();
				if (!(start < end)) {
					continue;
				}
				if (start < minTime) {
					minTime = start;
				}
				if (end > maxTime) {
					maxTime = end;
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
	}

	let blockSize = 3;
	if (windowWidth < 768) {
		blockSize = 2;
	}
	
	const columns = days.map(day => (
		<Day 
			data={data} 
			day={day} 
			minTime={minTime} 
			maxTime={maxTime} 
			showLabel={windowWidth < 768 ? true : false}
			size={blockSize}
			key={day} 
		/>
	));

	if (windowWidth >= 768) {
		columns.unshift(
			<TimeColumn maxTime={maxTime} minTime={minTime} size={blockSize} />
		);
	}
		
	return (
		<div className={`w-full bg-white boxshadow rounded-xl flex flex-col md:flex-row overflow-hidden ${s.calendarContainer}`}>
			{columns}
		</div>
	);
}

export default Calendar;
