import { Section } from "../types";

function dateRangeOverlaps(a_start: number, a_end: number, b_start: number, b_end: number) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}

export default function checkSectionConflict(a: Section, b: Section) {
	for (let x = 0; x < a.times.length; x++) {
		const aT = a.times[x];
		const aFinal = aT.type === 'Final';

		for (let y = 0; y < b.times.length; y++) {
			const bT = b.times[y];
			const intersection = aT.days.filter(d => bT.days.includes(d)).length !== 0;
			if (!intersection) {
				continue;
			}
			if (aFinal && bT.type !== 'Final') {
				continue;
			}
			if (aT.end - aT.start === 0 || bT.end - bT.start === 0) {
				continue;
			}
			if (dateRangeOverlaps(aT.start, aT.end, bT.start, bT.end)) {
				return true;
			}
		}
	}
	return false;
}
