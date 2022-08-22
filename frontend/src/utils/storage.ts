import { Course, IdCounter, Schedule } from "../types";

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

export function deleteCourse(id: string) {
	const courses = getCourses();
	const i = courses.findIndex(c => c.id === id);
	if (i !== -1) {
		courses.splice(i, 1);
	}
	localStorage.setItem('courses', JSON.stringify(courses));
	return courses;
}

const getIdCount = (key: string) => {
	const count = localStorage.getItem(key);
	if (!count) {
		return 0;
	}
	return parseInt(count);
}

export function getIdCounts() {
	const course = getIdCount('courseIdCount');
	const section = getIdCount('sectionIdCount');
	const time = getIdCount('timeIdCount');
	return {
		course,
		section,
		time
	} as IdCounter;
}

export function saveIdCounts(counter: IdCounter) {
	localStorage.setItem('courseIdCount', String(counter.course));
	localStorage.setItem('sectionIdCount', String(counter.section));
	localStorage.setItem('timeIdCount', String(counter.time));
}

export function getSchedules() {
	const json = localStorage.getItem('schedules');
	if (!json) {
		return [];
	}
	return JSON.parse(json) as Schedule[];
}

export function getSchedule(id: number) {
	const schedules = getSchedules();
	const i = schedules.findIndex(c => c.id === `schedule-${id}`);
	if (i !== -1) {
		return schedules[i];
	}
	return -1;
}

export function saveSchedule(schedule: Schedule) {
	const schedules = getSchedules();
	const existingIndex = schedules.findIndex(s => s.id === schedule.id);
	if (existingIndex !== -1) {
		schedules[existingIndex] = schedule;
	} else {
		schedules.push(schedule);
	}
	localStorage.setItem('schedules', JSON.stringify(schedules));
}

export function deleteSchedule(id: string) {
	const schedules = getSchedules();
	const i = schedules.findIndex(s => s.id === id);
	if (i !== -1) {
		schedules.splice(i, 1);
	}
	localStorage.setItem('schedules', JSON.stringify(schedules));
	return schedules;
}

export function getScheduleIdCount() {
	return getIdCount('scheduleIdCount');
}

export function saveScheduleIdCount(count: number) {
	localStorage.setItem('scheduleIdCount', String(count));
}
