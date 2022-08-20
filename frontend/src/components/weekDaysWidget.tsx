import { useState } from 'react';
import s from './weekDaysWidget.module.css';

function WeekDaysWidget({ secId, id }: { secId: number, id?: string }) {
	const [days, setDays] = useState<{[key: number]: boolean}>({
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false
	});
	const dayArray = Object.keys(days).filter(day => days[parseInt(day)]).map(str => parseInt(str));

	return (
		<div className={s.weekContainer}>
			<input type="text" value={JSON.stringify(dayArray)} className='hidden' name={`${secId}-times-days`} id={id} />
			<span
				onClick={() => {
					setDays({
						...days,
						0: !days[0]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[0] ? s.selected : ''}`}>
				Mon
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						1: !days[1]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[1] ? s.selected : ''}`}>
				Tue
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						2: !days[2]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[2] ? s.selected : ''}`}>
				Wed
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						3: !days[3]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[3] ? s.selected : ''}`}>
				Thu
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						4: !days[4]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[4] ? s.selected : ''}`}>
				Fri
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						5: !days[5]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[5] ? s.selected : ''}`}>
				Sat
			</span>
			<span
				onClick={() => {
					setDays({
						...days,
						6: !days[6]
					})
				}} 
				className={`${s.day} cursor-pointer hover:bg-gray-200 ${days[6] ? s.selected : ''}`}>
				Sun
			</span>
		</div>
	);
}

export default WeekDaysWidget;
