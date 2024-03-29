export default function formatAMPM(date: Date) {
	let hours: string | number = date.getHours();
	let minutes: string | number = date.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	hours = hours < 10 ? '0' + hours : hours;
	const strTime = hours + ':' + minutes + ampm;
	return strTime;
}
