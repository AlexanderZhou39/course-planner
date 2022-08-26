import { faCaretLeft, faCaretRight, faDoorOpen, faGear, faMinus, faPlus, faShuffle, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useMemo } from "react";
import ScheduleGenCard from "../components/scheduleGenCard";
import { PossibleSchedule } from "../types";
import compareCourses from "../utils/courseSort";
import { getCourses, getScheduleIdCount, saveSchedule, saveScheduleIdCount } from "../utils/storage";
import timeInputFormat from '../utils/timeInputFormat';
import timeInputToStamp from "../utils/timeInputToStamp";
import Calendar from "../components/calendar/calendar";
import SortInput from "../components/sortInput";
import { getRandomColors } from "../utils/eventColors";
import { Link } from "wouter";

const createWorker = () => {
	return new Worker(new URL('../workers/generatorWorker.ts', import.meta.url));
};

const createStamp = (hours: number, minutes: number) => {
	return (new Date(1970, 0, 1, hours, minutes)).getTime();
};

const sortMap: { [key: string]: (s: PossibleSchedule[]) => PossibleSchedule[] } = {
	'units-dsc': (s: PossibleSchedule[]) => s.sort((a, b) => b.totalUnits - a.totalUnits),
	'units-asc': (s: PossibleSchedule[]) => s.sort((a, b) => a.totalUnits - b.totalUnits),
	'ast-dsc': (s: PossibleSchedule[]) => s.sort((a, b) => b.avgStartTime - a.avgStartTime),
	'ast-asc': (s: PossibleSchedule[]) => s.sort((a, b) => a.avgStartTime - b.avgStartTime),
	'seats-dsc': (s: PossibleSchedule[]) => s.sort((a, b) => a.weightedSeats - b.weightedSeats),
	'seats-asc': (s: PossibleSchedule[]) => s.sort((a, b) => b.weightedSeats - a.weightedSeats),
	'tseats-dsc': (s: PossibleSchedule[]) => s.sort((a, b) => b.totalSeats - a.totalSeats),
	'tseats-asc': (s: PossibleSchedule[]) => s.sort((a, b) => a.totalSeats - b.totalSeats)
};

function SchedulesGenerator() {
	const courses = getCourses().sort(compareCourses);
	const schedIdsRef = useRef(getScheduleIdCount());
	const [selected, setSelected] = useState<string[]>([]);
	const [filterBy, setFilterBy] = useState<string[]>([]);
	const [sorts, setSorts] = useState<string[]>([]);
	const [earliest, setEarliest] = useState(createStamp(0, 0));
	const [latest, setLatest] = useState(createStamp(23, 59));
	const [minSeats, setMinSeats] = useState('0');
	const [minUnits, setMinUnits] = useState('0');
	const [maxUnits, setMaxUnits] = useState('999');
	const [results, setResults] = useState<PossibleSchedule[]>([]);
	const [generated, setGenerated] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [page, setPage] = useState(0);
	const [colors, setColors] = useState(getRandomColors());

	const options = courses.map(course => (
		<div className='block' key={course.id}>
			<input 
				onChange={(e) => {
					if (e.target.checked) {
						setSelected([...selected, course.id]);
						setResults([]);
						setFilterBy([]);
						setGenerated(false);
					} else {
						const copy = [...selected];
						const i = selected.indexOf(course.id);
						copy.splice(i, 1);
						setSelected(copy);
						setResults([]);
						setFilterBy([]);
						setGenerated(false);
					}
				}}
				checked={selected.includes(course.id)}
				className='w-4 h-4 align-middle mr-3 hover:cursor-pointer' type="checkbox" name={course.id} 
				id={`course-${course.id}`}
			/>
			<label className='align-middle hover:cursor-pointer' htmlFor={`course-${course.id}`}>{course.code}{
				course.name ? ` - ${course.name}` : ''
			}</label>
		</div>
	));

	const filterOptions = selected.map(id => {
		const course = courses[courses.findIndex(c => c.id === id)];
		return <div className='block' key={`filter-${course.id}`}>
			<input 
				onChange={(e) => {
					if (e.target.checked) {
						setFilterBy([...filterBy, course.id]);
					} else {
						const copy = [...filterBy];
						const i = filterBy.indexOf(course.id);
						copy.splice(i, 1);
						setFilterBy(copy);
					}
				}}
				checked={filterBy.includes(course.id)}
				className='w-4 h-4 align-middle mr-3 hover:cursor-pointer' type="checkbox" 
				name={`filter-${course.id}`} 
				id={`filter-${course.id}`}
			/>
			<label className='align-middle hover:cursor-pointer' htmlFor={`filter-${course.id}`}>{course.code}{
				course.name ? ` - ${course.name}` : ''
			}</label>
		</div>;
	});

	const sortInputs = sorts.map((sort, i) => (
		<SortInput 
			onChange={newSort => {
				const copy = [...sorts];
				copy[i] = newSort;
				setSorts(copy);
			}} 
			sort={sort}
		/>
	));

	
	let resultsJSX = null;
	let filteredResult: PossibleSchedule | null = null;
	let filteredResults = useMemo(() => results.filter(sched => {
		const sections = sched.sections;
		// matches courses selected
		for (let c = 0; c < filterBy.length; c++) {
			const filterC = filterBy[c];
			const i = sections.findIndex(s => s.course.id === filterC);
			if (i === -1) {
				return false;
			}
		}
		// matches minimum # of seats
		if (sched.minSeats < (parseInt(minSeats) || 0)) {
			return false;
		}
		// matches unit limits
		if (
			sched.totalUnits < (parseInt(minUnits) || 0) || 
			sched.totalUnits > (parseInt(maxUnits) || 0)
		) {
			return false;
		}
		// matches earliest and latest
		for (let s = 0; s < sections.length; s++) {
			if (
				sections.findIndex(t => 
					t.times.findIndex(m => m.start < earliest) > -1 ||
					t.times.findIndex(m => m.end > latest) > -1
				) > -1
			) {
				return false;
			}
		}
		return true;
	}), [JSON.stringify(filterBy), minSeats, minUnits, maxUnits, earliest, latest, JSON.stringify(results)]);
	// apply sorts
	for (let s = sorts.length - 1; s > -1; s--) {
		filteredResults = sortMap[sorts[s]](filteredResults);
	}

	const onSave = (i: number) => {
		const sched = results[i];
		sched.id = `schedule-${schedIdsRef.current}`;
		sched.name = `generated-${schedIdsRef.current}`;
		saveSchedule(results[i]);
		schedIdsRef.current = schedIdsRef.current + 1;
		saveScheduleIdCount(schedIdsRef.current);
	};

	if (page < filteredResults.length) {
		filteredResult = filteredResults[page];
		const index = results.findIndex(s => (
			s.name === (filteredResult as PossibleSchedule).name
		));
		resultsJSX = (
			<ScheduleGenCard 
				schedule={filteredResult} 
				onSave={() => {
					if (index > -1) {
						onSave(index);
						const copy = [...results];
						copy.splice(index, 1);
						setResults(copy);
					}
				}} 
				onDiscard={() => {
					if (index > -1) {
						const copy = [...results];
						copy.splice(index, 1);
						setResults(copy);
					}
				}}
				key={filteredResult.name}
			/>
		);
	} else if (filteredResults.length) {
		setPage(filteredResults.length - 1);
	}

	const onGenerate = () => {
		setProcessing(true);
		setProgress(0);
		setFilterBy([]);
		setSorts(['seats-dsc']);
		setGenerated(true);
		const worker = createWorker();
		worker.onmessage = (event) => {
			const e = event.data;
			switch (e.type) {
				case 'progress':
					setProgress(e.data);
					break;
				case 'result':
					setResults(e.data);
					setProcessing(false);
					worker.terminate();
					break;
				default:
					break;
			}
		};
		worker.postMessage({
			type: 'exec',
			selectedCourses: selected,
			courses: courses
		});
	};

	let content;

	if (processing) {
		let progressMsg = 'Calculating Possible Schedules...';
		if (progress >= 0.95) {
			progressMsg = 'Wrapping up...';
		} else if (progress >= 0.8) {
			progressMsg = 'Merging Identical Results...';
		}
		content = (
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-10 mb-10 boxshadow'>
				<h4 className='text-center text-2xl mb-5'>
					Loading
				</h4>
				<div className="w-full h-7 rounded-lg overflow-hidden relative border border-solid border-slate-500 bg-white mb-3">
					<div 
						style={{ width: `${Math.round(progress * 10000) / 100}%` }}
						className="absolute top-0 bottom-0 left-0 text-center bg-slate-500 text-white"
					>
						{Math.round(progress * 100) > 20 ? `${Math.round(progress * 100)}%` : ''}
					</div>
				</div>
				<p className="block text-center">
					{progressMsg}
				</p>
			</div>
		);
	} else {
		content = (
			<>
				<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-10 mb-10 boxshadow'>
					<h2 className='text-lg font-bold'>Select Courses</h2>
					<div className='mb-8'>
						{options}
					</div>
					<button
						onClick={() => onGenerate()}
						className='bg-slate-500 hover:bg-slate-400 text-white py-3 px-10 rounded-2xl block mx-auto'
						disabled={processing}
					>
						<FontAwesomeIcon icon={faGear} /> {generated ? 'Re-' : ''}Generate
					</button>
				</div>
				{
					generated ?
						<>
						<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-3 sm:p-5 md:p-10 mb-10 boxshadow'>
							<h2 className='text-center font-bold text-2xl mb-5'>
								{filteredResults.length} Results
							</h2>
							<h2 className="text-2xl font-bold mb-1">
								Filter Results
							</h2>
							<h4 className='text-lg font-bold'>
								Must Include
							</h4>
							<div className='mb-5'>
								{filterOptions}
							</div>
							<div className="flex flex-row flex-wrap mb-3">
								<h4 className='text-lg font-bold mr-3'>
									Additional Sorting
								</h4>
								<button 
									className='py-1 px-3 bg-slate-500 hover:bg-slate-400 text-white text-sm rounded-xl mr-1'
									onClick={() => {
										const copy = [...sorts];
										copy.push('seats-dsc');
										setSorts(copy);
									}}
								>
									<FontAwesomeIcon icon={faPlus} />
								</button>
								<button 
									className='py-1 px-3 bg-gray-200 hover:bg-gray-300 text-black text-sm rounded-xl'
									onClick={() => {
										const copy = [...sorts];
										copy.pop();
										setSorts(copy);
									}}
								>
									<FontAwesomeIcon icon={faMinus} />
								</button>
							</div>
							<div className="flex flex-col mb-3">
								{sortInputs}
							</div>
							<div className="flex flex-row flex-wrap mb-2">
								<div className="w-52 mr-5 mb-3">
									<label className="text-lg font-bold" htmlFor="min-time">
										Set Earliest Time
									</label>
									<input 
										className="px-5 py-2 w-full bg-gray-200 hover:bg-gray-300 rounded-lg hover:cursor-pointer"
										type="time" 
										name="min-time" 
										value={timeInputFormat(earliest)} 
										onChange={(e) => {
											setEarliest(timeInputToStamp(e.target.value));
										}}
									/>
								</div>
								<div className="w-52 mb-3">
									<label className="text-lg font-bold" htmlFor="max-time">
										Set Latest Time
									</label>
									<input 
										className="px-5 py-2 w-full bg-gray-200 hover:bg-gray-300 rounded-lg hover:cursor-pointer"
										type="time" 
										name="max-time" 
										value={timeInputFormat(latest)} 
										onChange={(e) => {
											setLatest(timeInputToStamp(e.target.value));
										}}
									/>
								</div>
							</div>
							<div className="w-52 mb-5">
									<label className="text-lg font-bold" htmlFor="min-seats">
										Min. Number Of Seats
									</label>
									<input 
										className="px-5 py-2 w-full bg-gray-200 hover:bg-gray-300 rounded-lg hover:cursor-pointer"
										type="number"
										step={1}
										min={0}
										name="min-seats" 
										value={minSeats} 
										onChange={(e) => {
											setMinSeats(e.target.value);
										}}
									/>
							</div>
							<div className="flex flex-row flex-wrap mb-2">
								<div className="w-52 mr-5 mb-3">
									<label className="text-lg font-bold" htmlFor="min-units">
										Min. Number Of Units
									</label>
									<input 
										className="px-5 py-2 w-full bg-gray-200 hover:bg-gray-300 rounded-lg hover:cursor-pointer"
										type="number"
										step={1}
										min={0}
										name="min-units" 
										value={minUnits} 
										onChange={(e) => {
											setMinUnits(e.target.value);
										}}
									/>
								</div>
								<div className="w-52 mb-3">
									<label className="text-lg font-bold" htmlFor="max-units">
										Max. Number Of Units
									</label>
									<input 
										className="px-5 py-2 w-full bg-gray-200 hover:bg-gray-300 rounded-lg hover:cursor-pointer"
										type="number"
										step={1}
										min={0}
										name="max-units" 
										value={maxUnits} 
										onChange={(e) => {
											setMaxUnits(e.target.value);
										}}
									/>
								</div>
							</div>
							<button 
								className='bg-gray-200 hover:bg-gray-300 text-black py-1 px-5 mb-5 rounded-xl'
								onClick={() => {
									setColors(getRandomColors());
								}}
							>
								<FontAwesomeIcon icon={faShuffle} /> Shuffle Colors
							</button>
							<Link
								className="block bg-slate-500 hover:bg-slate-400 text-white py-3 mb-5 rounded-xl text-center px-10"
								to="/schedules"
							>
								<FontAwesomeIcon icon={faDoorOpen} /> Exit Generator
							</Link>
						</div>
						<div className="w-full max-w-md mx-auto p-5 mb-5 bg-white rounded-xl sticky top-5 shadow-lg z-50">
						<h3 className='text-center font-bold text-2xl mb-3'>
							{filteredResults.length} Results
						</h3>
						<div className='flex flex-row justify-center'>
							<button
								disabled={page < 5}
								onClick={() => setPage(prev => prev - 5)}
								className='py-2 px-3 bg-gray-200 hover:bg-gray-300 rounded-l-xl'
							>
								<FontAwesomeIcon icon={faCaretLeft} />
								<FontAwesomeIcon icon={faCaretLeft} />
							</button>
							<button
								disabled={page === 0}
								onClick={() => setPage(prev => prev - 1)}
								className='py-2 px-3 bg-gray-200 hover:bg-gray-300'
							>
								<FontAwesomeIcon icon={faCaretLeft} />
							</button>
							<span className='py-2 px-3 inline-block bg-gray-200 text-black'>
								Result {page + 1}
							</span>
							<button
								disabled={(page + 2) > filteredResults.length}
								onClick={() => setPage(prev => prev + 1)}
								className='py-2 px-3 bg-gray-200 hover:bg-gray-300'
							>
								<FontAwesomeIcon icon={faCaretRight} />
							</button>
							<button
								disabled={(page + 6) > filteredResults.length}
								onClick={() => setPage(prev => prev + 5)}
								className='py-2 px-3 bg-gray-200 hover:bg-gray-300 rounded-r-xl'
							>
								<FontAwesomeIcon icon={faCaretRight} />
								<FontAwesomeIcon icon={faCaretRight} />
							</button>
						</div>
					</div>
					</>
					: null
				}
				<div className="w-full max-w-5xl mx-auto">
					{resultsJSX}
				</div>
				{
					filteredResult ?
						<div className="w-full mb-10">
							<Calendar data={filteredResult.sections} customColors={colors} showSeats />
						</div>
					: null
				}
			</>
		);
	}

	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-8">
				Generate Schedules
			</h1>
			{content}
		</>
	);
}

export default SchedulesGenerator;
