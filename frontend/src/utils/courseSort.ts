import { Course } from "../types";

export default function compareCourses(a: Course, b: Course) {
	const aTag = a.code + a.name;
	const bTag = b.code + b.name;
	if (aTag < bTag) {
		return -1;
	}
	if (aTag > bTag) {
		return 1;
	}
	return 0;
};
