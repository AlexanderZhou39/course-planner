import s from './day.module.css';

type P = {
	minTime: number,
	maxTime: number,
	size: number
};

function TimeColumn({ maxTime, minTime, size }: P) {
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
				className='absolute w-full'
				key={`label-${i}`}
			>
				<span className='w-full block text-center'>
					{hour}:00{meridiem}
				</span>
			</div>
		);
	}

	return (
		<div className={`w-28 flex flex-col`}>
			<div className='py-5 px-3 border-b border-solid border-gray-500 bg-slate-500 text-white'>
				<h4 className='text-center'>Time</h4>
			</div>
			<div className={`grow relative bg-slate-200`}>
				{labels}
				{blocks}
			</div>
		</div>
	);
}

export default TimeColumn;
