import { useState } from 'react';
import s from './daysWidget.module.css';

function DaysWidget({ secId, value, id }: { secId: string, value: number[], id: string }) {
	const [days, setDays] = useState<{[key: number]: boolean}>({
		0: value.includes(0),
		1: value.includes(1),
		2: value.includes(2),
		3: value.includes(3),
		4: value.includes(4),
		5: value.includes(5),
		6: value.includes(6)
	});
	const dayArray = Object.keys(days).filter(day => days[parseInt(day)]).map(str => parseInt(str));

	return (
		<div className={s.weekContainer}>
			<input type="text" value={JSON.stringify(dayArray)} className='hidden' name={`${secId}-time-days`} readOnly id={id} />
			<span
				onClick={() => {
					setDays({
						...days,
						0: !days[0]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[0] ? s.selected : ''}`}>
				Mon
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						1: !days[1]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[1] ? s.selected : ''}`}>
				Tue
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						2: !days[2]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[2] ? s.selected : ''}`}>
				Wed
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						3: !days[3]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[3] ? s.selected : ''}`}>
				Thu
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						4: !days[4]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[4] ? s.selected : ''}`}>
				Fri
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						5: !days[5]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[5] ? s.selected : ''}`}>
				Sat
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						6: !days[6]
					})
				}} 
				className={`${s.day} cursor-pointer ${days[6] ? s.selected : ''}`}>
				Sun
			</span>
		</div>
	);
}

export default DaysWidget;
