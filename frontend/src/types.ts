export type TimeTypes = '' | 'Lec' | 'Lab' | 'Disc' | 'Final' | 'Other';

export type Time = {
	id: string,
	days: number[],
	start: number,
	end: number,
	type: TimeTypes
};

export type Section = {
	id: string,
	code: string,
	instructor: string,
	seats: number,
	times: Time[]
};

export type Course = {
	id: string,
	name: string,
	code: string,
	units: number,
	sections: Section[]
};

export type CourseSection = Section & {
	course: {
		name: string,
		code: string,
		units: number
	}
};

export type Schedule = {
	id: string,
	name: string,
	noConflict: boolean,
	sections: CourseSection[]
};

export type IdCounter = {
	course: number,
	section: number,
	time: number
};	
