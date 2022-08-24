import { Course, Schedule } from "../types";

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
			id: `schedule-${currId}`,
			name: `generated-${currId}`,
			noConflict: true,
			sections: []
		});
		currId++;
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
			}

		}

	}

}
