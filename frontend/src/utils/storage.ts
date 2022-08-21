import { Course, IdCounter } from "../types";

export function getCourses() {
	const json = localStorage.getItem('courses');
	if (!json) {
		return [];
	}
	return JSON.parse(json) as Course[];
}

export function getCourse(id: number) {
	const courses = getCourses();
	const i = courses.findIndex(c => c.id === `course-${id}`);
	if (i !== -1) {
		return courses[i];
	}
	return -1;
}

export function saveCourse(course: Course) {
	const courses = getCourses();
	const existingIndex = courses.findIndex(c => c.id === course.id);
	if (existingIndex !== -1) {
		courses[existingIndex] = course;
	} else {
		courses.push(course);
	}
	localStorage.setItem('courses', JSON.stringify(courses));
}

export function getIdCounts() {
	const json = localStorage.getItem('ids');
	if (!json) {
		return {
			course: 0,
			section: 0,
			time: 0
		};
	}
	return JSON.parse(json) as IdCounter;
}

export function saveIdCounts(counter: IdCounter) {
	localStorage.setItem('ids', JSON.stringify(counter));
}
