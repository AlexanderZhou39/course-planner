import formatAMPM from "../utils/dateformat";
import DaysDisplay from "./daysDisplay";
import s from './cardGrid.module.css';
import { Time } from "../types"

type P = {
	time: Time
};

function TimeBlock({ time }: P) {
	return (
		<div className="mb-1 flex flex-row flex-wrap">
			<p className={`${s.colXs} mr-3 mb-2`}>{time.type}</p>
			<p className={`${s.colSmd} mr-3 mb-2`}>{time.place}</p>
			<p className='mr-3 mb-2'>
				{formatAMPM(new Date(time.start))} - {formatAMPM(new Date(time.end))}
			</p>
			<DaysDisplay days={time.days} className='mb-2' />
		</div>
	);
}

export default TimeBlock;
