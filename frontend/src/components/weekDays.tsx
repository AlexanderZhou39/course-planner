import s from './weekDays.module.css';

function WeekDays({ days }: { days: number[] }) {
	return (
		<div className={s.weekContainer}>
			<span className={`${s.day} ${days.includes(0) ? s.selected : ''}`}>
				Mon
			</span>
			<span className={`${s.day} ${days.includes(1) ? s.selected : ''}`}>
				Tue
			</span>
			<span className={`${s.day} ${days.includes(2) ? s.selected : ''}`}>
				Wed
			</span>
			<span className={`${s.day} ${days.includes(3) ? s.selected : ''}`}>
				Thu
			</span>
			<span className={`${s.day} ${days.includes(4) ? s.selected : ''}`}>
				Fri
			</span>
			<span className={`${s.day} ${days.includes(5) ? s.selected : ''}`}>
				Sat
			</span>
			<span className={`${s.day} ${days.includes(6) ? s.selected : ''}`}>
				Sun
			</span>
			
		</div>
	);
}

export default WeekDays;
