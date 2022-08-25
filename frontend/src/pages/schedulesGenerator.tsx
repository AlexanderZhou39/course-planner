import { faCaretLeft, faCaretRight, faGear, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";
import ScheduleGenCard from "../components/scheduleGenCard";
import { PossibleSchedule } from "../types";
import compareCourses from "../utils/courseSort";
import { getCourses, getScheduleIdCount } from "../utils/storage";
import timeInputFormat from '../utils/timeInputFormat';
import timeInputToStamp from "../utils/timeInputToStamp";
import Calendar from "../components/calendar/calendar";

const createWorker = () => {
	return new Worker(new URL('../workers/generatorWorker.ts', import.meta.url));
};

const createStamp = (hours: number, minutes: number) => {
	return (new Date(1970, 0, 1, hours, minutes)).getTime();
};

const PageSize = 6;

function SchedulesGenerator() {
	const courses = getCourses().sort(compareCourses);
	const schedIdsRef = useRef(getScheduleIdCount());
	const [selected, setSelected] = useState<string[]>([]);
	const [filterBy, setFilterBy] = useState<string[]>([]);
	const [sortUnitsAsc, setSortUnitsAsc] = useState(false);
	const [earliest, setEarliest] = useState(createStamp(0, 0));
	const [latest, setLatest] = useState(createStamp(23, 59));
	const [minSeats, setMinSeats] = useState('0');
	const [sortASTAsc, setSortASTAsc] = useState(true);
	const [results, setResults] = useState<PossibleSchedule[] | undefined>(undefined);
	const [preview, setPreview] = useState<PossibleSchedule | undefined>(undefined);
	const [processing, setProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [page, setPage] = useState(0);

	const options = courses.map(course => (
		<div className='block' key={course.id}>
			<input 
				onChange={(e) => {
					if (e.target.checked) {
						setSelected([...selected, course.id]);
					} else {
						const copy = [...selected];
						const i = selected.indexOf(course.id);
						copy.splice(i, 1);
						setSelected(copy);
					}
				}}
				checked={selected.includes(course.id)}
				className='w-4 h-4 align-middle mr-3' type="checkbox" name={course.id} 
			/>
			<label className='align-middle' htmlFor={course.id}>{course.code}{
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
				className='w-4 h-4 align-middle mr-3' type="checkbox" name={`filter-${course.id}`} 
			/>
			<label className='align-middle' htmlFor={`filter-${course.id}`}>{course.code}{
				course.name ? ` - ${course.name}` : ''
			}</label>
		</div>;
	});

	
	let resultsJSX = null;
	let filteredResults = null;
	if (results !== undefined) {
		const unitsAsc = sortUnitsAsc ? 1 : -1;
		const ASTAsc = sortASTAsc ? 1 : -1;
		filteredResults = results.filter(sched => {
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
		}).sort(
			(a, b) => (a.avgStartTime - b.avgStartTime) * ASTAsc
		).sort(
			(a, b) => (a.totalUnits - b.totalUnits) * unitsAsc
		);

		resultsJSX = [];
		for (let i = PageSize * page; i < (PageSize * page + PageSize) && i < filteredResults.length; i++) {
			const schedule = filteredResults[i];
			resultsJSX.push(
				<div className='w-full lg:w-1/2 2xl:w-1/3 lg:px-5' key={schedule.name}>
					<ScheduleGenCard 
						schedule={schedule} 
						onSave={() => {}} 
						onDiscard={() => {
							const index = results.findIndex(s => s.name === schedule.name);
							if (index > -1) {
								const copy = [...results];
								copy.splice(index, 1);
								setResults(copy);
							}
						}}
						onPreview={() => setPreview(schedule)}
					/>
				</div>
			);
		}
	}

	const onGenerate = () => {
		setProcessing(true);
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
		content = (
			<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-10 mb-10 boxshadow'>
				<h4 className='text-center'>Loading...</h4>
				<h5 className='text-center'>{Math.round(progress * 100)}%</h5>
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
						<FontAwesomeIcon icon={faGear} /> {results !== undefined ? 'Re-' : ''}Generate
					</button>
				</div>
				{
					filteredResults ?
						<div className='w-full max-w-5xl mx-auto block bg-white rounded-2xl p-3 sm:p-5 md:p-10 mb-10 boxshadow'>
							<h3 className='text-center font-bold text-2xl mb-5'>
								{filteredResults.length} Results
							</h3>
							<div className='flex flex-row justify-center'>
								<button
									disabled={page < 3}
									onClick={() => setPage(prev => prev - 3)}
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
									Page {page + 1}
								</span>
								<button
									disabled={(page + 1) * PageSize + 1 > filteredResults.length}
									onClick={() => setPage(prev => prev + 1)}
									className='py-2 px-3 bg-gray-200 hover:bg-gray-300'
								>
									<FontAwesomeIcon icon={faCaretRight} />
								</button>
								<button
									disabled={(page + 3) * PageSize + 1 > filteredResults.length}
									onClick={() => setPage(prev => prev + 3)}
									className='py-2 px-3 bg-gray-200 hover:bg-gray-300 rounded-r-xl'
								>
									<FontAwesomeIcon icon={faCaretRight} />
									<FontAwesomeIcon icon={faCaretRight} />
								</button>
							</div>
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
								<div className="w-52 mr-5">
									<label className='text-lg font-bold' htmlFor="units-asc">
										Sort By Units
									</label>
									<select 
										className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded-lg w-full hover:cursor-pointer"
										name="units-asc" 
										value={sortUnitsAsc ? 'asc' : 'dsc'}
										onChange={(e) => {
											if (e.target.value === 'asc') {
												setSortUnitsAsc(true);
											} else {
												setSortUnitsAsc(false);
											}
										}}
									>
										<option value="asc">Ascending</option>
										<option value="dsc">Descending</option>
									</select>
								</div>
								<div className="w-52 mr-5">
									<label className="text-lg font-bold" htmlFor="avgst">
										Sort By Avg. Start Time
									</label>
									<select 
										className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded-lg w-full hover:cursor-pointer"
										name="avgst" 
										value={sortASTAsc ? 'asc' : 'dsc'}
										onChange={(e) => {
											if (e.target.value === 'asc') {
												setSortASTAsc(true);
											} else {
												setSortASTAsc(false);
											}
										}}
									>
										<option value="asc">Ascending</option>
										<option value="dsc">Descending</option>
									</select>
								</div>
								<div className="w-52">
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
							</div>
							<div className="flex flex-row flex-wrap">
								<div className="w-52 mr-5">
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
								<div className="w-52">
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
						</div>
					: null
				}
				<div className="flex flex-row flex-wrap mb-10">
					{resultsJSX}
				</div>
				{
					preview ?
						<div 
							style={{ backgroundColor: 'rgb(0, 0, 0, 0.8)' }} 
							className="fixed top-0 bottom-0 left-0 right-0 overflow-y-scroll"
						>
							<div className="px-5 sm:px-10 app-container no-shadow mx-auto mb-10 mt-10">
								<button 
									className="block w-full text-left py-10 text-white hover:text-gray-400 text-3xl"
									onClick={() => setPreview(undefined)}
								>
									<FontAwesomeIcon icon={faX} /> Close
								</button>
								<Calendar data={preview.sections} showSeats />
							</div>
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
