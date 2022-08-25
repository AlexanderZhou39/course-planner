import TimeBlock from './timeBlock';
import s from './cardGrid.module.css';
import { Section } from "../types";

type P = {
	section: Section
};

function SectionBlock({ section }: P) {
	const times = section.times.map((time, i) => (
		<TimeBlock time={time} key={i}/>
	));

	return (
		<div className="section flex flex-col mb-5">
			<div className="flex flex-row">
				<p className={`${s.colXs} mr-3 font-bold mb-5`}>{section.code}</p>
				<p className={`${s.colMd} mr-5 font-bold mb-5`}>{section.instructor}</p>
				<p className='mb-5'>{section.seats} seats</p>
			</div>
			<div className="flex flex-col">
				{times}
			</div>
		</div>
	);
}

export default SectionBlock;
