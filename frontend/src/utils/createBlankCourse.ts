import React from "react";
import { Course, IdCounter } from "../types";
import createBlankSection from "./createBlankSection";

export default function createBlankCourse(id: React.MutableRefObject<IdCounter>): Course {
	const idCount = id.current.course;
	id.current = {
		...id.current,
		course: idCount + 1
	};
	return {
		id: `course-${idCount}`,
		name: '',
		code: '',
		units: 0,
		sections: [createBlankSection(id)]
	};
}
