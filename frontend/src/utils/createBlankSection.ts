import React from "react";
import { IdCounter, Section } from "../types";
import createBlankTime from "./createBlankTime";

export default function createBlankSection(id: React.MutableRefObject<IdCounter>): Section {
	const idCount = id.current.section;
	id.current = {
		...id.current,
		section: idCount + 1
	};
	return {
		id: `section-${idCount}`,
		code: '',
		instructor: '',
		seats: 0,
		times: [createBlankTime(id)]
	};
}
