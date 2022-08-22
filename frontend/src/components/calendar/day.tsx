import { CourseSection } from "../../types";
import s from './day.module.css';

type P = {
	data: CourseSection[] | undefined,
	day: number,
	minTime: number,
	maxTime: number,
	showLabel: boolean,
	size: number
};

const msPerHour = 1000 * 60 * 60;

const dayMap: { [key: number]: string } = {
	0: 'Mon',
	1: 'Tue',
	2: 'Wed',
	3: 'Thu',
	4: 'Fri',
	5: 'Sat',
	6: 'Sun'
};

function Day({ data, day, minTime, maxTime, showLabel, size }: P) {
	const numBlocks = maxTime - minTime + 3;
	const blocks = [];
	for (let i = 0; i < numBlocks; i++) {
		blocks.push(
			<div 
				style={{ height: `${size}rem` }}
				className={`${s.block} ${(i + 1) % 2 === 0 ? s.bold : ''}`} 
				key={`block-${i}`} 
			/>
		);
	}
	const labels = [];
	if (showLabel) {
		for (let i = 0; i < numBlocks; i += 2) {
			if (i === 0) {
				continue;
			}
			let hour;
			if ((minTime - 1 + i) === 12) {
				hour = 12;
			} else {
				hour = (minTime - 1 + i) % 12;
				if (hour < 10) {
					hour = '0' + hour;
				}
			}
			let meridiem = 'pm';
			if ((minTime - 1 + i) < 12) {
				meridiem = 'am';
			}
			labels.push(
				<div 
					style={{ top: `${i * size - 0.8}rem`, left: 0, zIndex: 10 }} 
					className={`absolute w-20 h-5 pl-3 ${s.labelBg}`}
					key={`label-${i}`}
				>
					<span>
						{hour}:00{meridiem}
					</span>
				</div>
			);
		}
	}

	const events = [];
	if (data) {
		for (let i = 0; i < data.length; i++) {
			const section = data[i];
			for (let x = 0; x < section.times.length; x++) {
				const time = section.times[x];
				if (!time.days.includes(day) || time.type === 'Final') {
					continue;
				}
				const startDate = new Date(time.start);
				const startHour = startDate.getHours() + Math.round(startDate.getMinutes() / 60 * 100) / 100;
				console.log(startHour);
				const height = Math.max(Math.round((time.end - time.start) / msPerHour * 100) / 100, 0);

				events.push(
					<div 
						style={{ 
							top: `${(startHour - minTime + 1) * size}rem`,
							height: `${height * size}rem`
						}}
						className='absolute flex w-full px-3'
					>
						<div className='grow bg-gray-300'>
							<h1>hello world</h1>
						</div>
					</div>
				);
			}
		}
	}

	return (
		<div className={`grow flex flex-col ${s.dayContainer}`}>
			<div className='py-5 px-3 border-b border-solid border-gray-500 bg-slate-500 text-white'>
				<h4 className='text-center'>{dayMap[day]}</h4>
			</div>
			<div className={`${s.day} grow relative`}>
				{events}
				{labels}
				{blocks}
			</div>
		</div>
	);
}

export default Day;
