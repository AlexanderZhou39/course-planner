import { Schedule } from "../types";

export default function compareSchedules(a: Schedule, b: Schedule) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
};
