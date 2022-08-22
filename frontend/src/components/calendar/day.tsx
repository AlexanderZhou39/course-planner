import { CourseSection } from "../../types";
import formatAMPM from '../../utils/dateformat';
import s from './day.module.css';

type P = {
	data: CourseSection[] | undefined,
	day: number,
	minTime: number,
	maxTime: number,
	showLabel: boolean,
	size: number,
	colors: string[]
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

const hexToRGB = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
};

const textContrast = (hex: string) => {
	const rgb = hexToRGB(hex);
	if (rgb && (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 150) {
		return '#000000';
	}
	return '#ffffff';
};

function Day({ data, day, minTime, maxTime, showLabel, size, colors }: P) {
	const numBlocks = maxTime - minTime + 3;
	const blocks = [];
	for (let i = 0; i < numBlocks; i++) {
		blocks.push(
			<div 
				style={{ height: `${size}rem` }}
				className={`${s.block} ${(i + 1) % 2 === 0 ? s.bold : ''}`} 
				key={`block-${day}-${i}`} 
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
					style={{ top: `${i * size - 0.8}rem` }} 
					className={`absolute w-20 h-8 pl-3 left-0 z-30 rounded-xl ${s.labelBg}`}
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
			const eventColor = colors[i % colors.length];
			const textColor = textContrast(eventColor);

			for (let x = 0; x < section.times.length; x++) {
				const time = section.times[x];
				if (!time.days.includes(day) || time.type === 'Final') {
					continue;
				}
				const startDate = new Date(time.start);
				const startHour = startDate.getHours() + Math.round(startDate.getMinutes() / 60 * 100) / 100;
				const height = Math.round(Math.max(time.end - time.start, 0) / msPerHour * 100) / 100;

				events.push(
					<div 
						style={{ 
							top: `${(startHour - minTime + 1) * size}rem`,
							height: `${height * size}rem`
						}}
						className={`absolute flex w-full pr-10 md:pr-1 xl:pr-3 z-20 ${
							showLabel ? 'pl-28' : 'pl-10 md:pl-1 xl:pl-3'
						}`}
						key={`event-${i}:${x}`}
					>
						<div 
							style={{ 
								backgroundColor: eventColor,
								color: textColor
							}}
							className='grow rounded-xl overflow-y-scroll py-2'
						>
							<h4 className='text-center'>{time.type.toUpperCase()}</h4>
							<h4 className='text-center'>
								{formatAMPM(startDate)} - {formatAMPM(new Date(time.end))}
							</h4>
							{
								height > 0.9 ?
									<h4 className='text-center'>{section.course.code}</h4>
								: null
							}
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
