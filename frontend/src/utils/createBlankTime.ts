import React from "react";
import { IdCounter, Time } from "../types";

export default function createBlankTime(id: React.MutableRefObject<IdCounter>): Time {
	const idCount = id.current.time;
	id.current = {
		...id.current,
		time: idCount + 1
	};
	return {
		id: `time-${idCount}`,
		type: '',
		days: [],
		start: (new Date(1970, 0, 1, 0, 0)).getTime(),
		end: (new Date(1970, 0, 1, 0, 0)).getTime(),
		place: ''
	};
};
