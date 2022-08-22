import React from "react";
import { Schedule } from "../types";

export default function createBlankSchedule(id: React.MutableRefObject<number>): Schedule {
	const idCount = id.current;
	id.current = id.current + 1;
	return {
		id: `schedule-${idCount}`,
		name: '',
		noConflict: true,
		sections: []
	};
}
