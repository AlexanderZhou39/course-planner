import { Course, Schedule } from "../types";
import checkSectionConflict from "./checkSectionConflict";

type PossibleSchedule = Schedule & {
	courses: string[],
	finished: boolean
}

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

export default function generateSchedules(selectedCourses: string[], courses: Course[], scheduleId: number) {
	// setup
	let currId = scheduleId;
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
			sections: []
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
							units: course.units
						}
					};
					newResults.push({
						...possibility,
						sections: [...possibility.sections, courseSection]
					})
				}
			}

			if (branches === 0) {
				possibility.finished = true;
				newResults.push(possibility);
			}
		}
		results = newResults;
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

	// assign unique Ids to results
	for (let i = 0; i < results.length; i++) {
		const generated = results[i];
		generated.id = `schedule-${currId}`;
		generated.name = `generated-${currId}`;
		currId++;
	}

	return {
		results: results,
		newId: currId
	};
}
