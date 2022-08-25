import { Course, Schedule, PossibleSchedule, CourseSection } from "../types";
import checkSectionConflict from "../utils/checkSectionConflict";



function permute<T>(permutation: T[]) {
	let length = permutation.length,
		result = [permutation.slice()],
		c = new Array(length).fill(0),
		i = 1, k, p;
  
	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			++c[i];
			i = 1;
			result.push(permutation.slice());
		} else {
			c[i] = 0;
			++i;
		}
	}
	return result;
}

function equivalentSchedules(a: Schedule, b: Schedule) {
	if (a.sections.length !== b.sections.length) {
		return false;
	}
	for (let i = 0; i < a.sections.length; i++) {
		const id = a.sections[i].id;
		if (!(b.sections.findIndex(s => s.id === id) > -1)) {
			return false
		}
	}
	return true;
}

function getStartTimeSumAndCount(s: CourseSection[]) {
	let sum = 0;
	let records = 0;
	for (let sI = 0; sI < s.length; sI++) {
		const section = s[sI];
		for (let t = 0; t < section.times.length; t++) {
			const time = section.times[t];
			if (time.days.length) {
				sum += time.start * time.days.length;
				records += time.days.length;
			}
		}
	}
	return {
		sum,
		records
	};
}

function generateSchedules(selectedCourses: string[], courses: Course[]) {
	// setup
	const courseCombos = permute<string>(selectedCourses);
	const courseMap: { [key: string]: Course } = {};
	for (let i = 0; i < courses.length; i++) {
		courseMap[courses[i].id] = courses[i];
	}

	// seed possibilities
	let results: PossibleSchedule[] = [];
	for (let i = 0; i < courseCombos.length; i++) {
		results.push({
			finished: false,
			courses: courseCombos[i],
			id: '',
			name: '',
			noConflict: true,
			totalUnits: 0,
			minSeats: 99999,
			sections: [],
			startTimeSum: 0,
			timesCount: 0,
			avgStartTime: 0
		});
	}

	// generate
	for (let c = 0; c < selectedCourses.length; c++) {
		const newResults: PossibleSchedule[] = [];

		for (let p = 0; p < results.length; p++) {
			const possibility = results[p];
			// skip finished paths
			if (possibility.finished) {
				newResults.push(possibility);
				continue;
			}

			// check each section in course
			let branches = 0;
			const course = courseMap[possibility.courses[c]];

			for (let s = 0; s < course.sections.length; s++) {
				const section = course.sections[s];

				// check if section conflicts with existing plan
				let noConflict = true;
				for (let ps = 0; ps < possibility.sections.length; ps++) {
					if(checkSectionConflict(possibility.sections[ps], section)) {
						noConflict = false;
						break;
					}
				}
				// if no conflict, add to plan
				if (noConflict) {
					branches++;
					const courseSection = {
						...section,
						course: {
							name: course.name,
							code: course.code,
							units: course.units,
							id: course.id
						}
					};
					const newSections = [...possibility.sections, courseSection]
					const sumAndCount = getStartTimeSumAndCount(newSections);
					const newSTSum = possibility.startTimeSum + sumAndCount.sum;
					const newTimesCount = possibility.timesCount + sumAndCount.records;
					newResults.push({
						...possibility,
						startTimeSum: newSTSum,
						timesCount: newTimesCount,
						totalUnits: possibility.totalUnits + course.units,
						minSeats: Math.min(section.seats, possibility.minSeats),
						sections: newSections,
						avgStartTime: newSTSum / Math.min(newTimesCount, 1)
					})
				}
			}

			if (branches === 0) {
				possibility.finished = true;
				newResults.push(possibility);
			}
		}
		results = newResults;
		postMessage({
			type: 'progress',
			data: (c + 1) / selectedCourses.length
		});
	}

	// merge equivalent schedules
	let xI = 0;
	while (xI < results.length) {
		let yI = xI + 1;
		while (yI < results.length) {
			if (equivalentSchedules(results[xI], results[yI])) {
				results.splice(yI, 1);
			} else {
				yI++;
			}
		}
		xI++;
	}

	// assign unique names to results
	for (let i = 0; i < results.length; i++) {
		const generated = results[i];
		generated.name = `generated-${i}`;
	}

	return results;
}

onmessage = (e) => {
	switch (e.data.type) {
		case 'exec':
			const data = e.data;
			const selectedCourses = data.selectedCourses;
			const courses = data.courses;
			const res = generateSchedules(selectedCourses, courses);
			postMessage({
				type: 'result',
				data: res
			});
		default:
			break;

	}
};
