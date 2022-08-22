import React from "react";
import { Course, IdCounter, Section, Time } from "../types";

function copyTime(data: Time, idCounter: React.MutableRefObject<IdCounter>): Time {
	const id = idCounter.current.time;
	idCounter.current = {
		...idCounter.current,
		time: id + 1
	};

	return {
		...data,
		days: [...data.days],
		id: `time-${id}`
	};
}

function copySection(data: Section, idCounter: React.MutableRefObject<IdCounter>) {
	const id = idCounter.current.section;
	idCounter.current = {
		...idCounter.current,
		section: id + 1
	};

	const newSection: Section = {
		...data,
		times: [],
		id: `section-${id}`
	};

	for (let i = 0; i < data.times.length; i++) {
		newSection.times.push(copyTime(data.times[i], idCounter));
	}

	return newSection
}

export default function copyCourse(data: Course, idCounter: React.MutableRefObject<IdCounter>) {
	const id = idCounter.current.course;
	idCounter.current = {
		...idCounter.current,
		course: id + 1
	};

	const newCourse: Course = {
		...data,
		sections: [],
		id: `course-${id}`
	};

	for (let i = 0; i < data.sections.length; i++) {
		newCourse.sections.push(copySection(data.sections[i], idCounter));
	}

	return newCourse;
}
