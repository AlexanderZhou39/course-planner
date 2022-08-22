import { useEffect, useState, useRef } from 'react';
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

const eventColors = [ 
	'#02c39a', '#fde74c', '#001011', '#d9c5b2', '#ffa987', 
	'#50d8d7', '#dcd6f7', '#BBDB9B', '#9DBF9E', '#E1F0C4',
	'#A63446', '#EF8354', '#C2D3CD', '#ECE2D0',
	'#F7B2AD'
];

const shuffleArray = (array: string[]) => {
	let currentIndex = array.length, randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
	
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]
		];
	}
	return array;
};

function Calendar({ data }: P) {
	const days = [0, 1, 2, 3, 4];
	const [windowWidth, setWindowWidth] = useState(getWindowWidth());
	const colors = useRef(shuffleArray([...eventColors])).current;

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
	if (data) {
		minTime = 23;
		maxTime = 1;
		for (let i = 0; i < data.length; i++) {
			const section = data[i];
			for (let x = 0; x < section.times.length; x++) {
				const start = new Date(section.times[x].start);
				const end = new Date(section.times[x].end);
				if (!(start.getMinutes() < end.getMinutes())) {
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
	}

	let blockSize = 5;
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
		<div className={`w-full bg-white boxshadow rounded-xl flex flex-col md:flex-row overflow-hidden ${s.calendarContainer}`}>
			{columns}
		</div>
	);
}

export default Calendar;
