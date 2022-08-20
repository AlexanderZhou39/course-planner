export type Time = {
	days: number[],
	start: number,
	end: number,
	type: string
};

export type Section = {
	code: string,
	instructor: string,
	seats: number,
	times: Time[]
};

export type Course = {
	id: number,
	name: string,
	code: string,
	units: number,
	sections: Section[]
};
