export type Time = {
	id: string,
	days: number[],
	start: number,
	end: number,
	type: string
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

export type IdCounter = {
	course: number,
	section: number,
	time: number
};	
