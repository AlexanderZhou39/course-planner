export default function timeInputFormat(stamp: number) {
	const date = new Date(stamp);
	let hours: string | number = date.getHours();
	let min: string | number = date.getMinutes();
	hours = hours < 10 ? '0' + hours : hours;
	min = min < 10 ? '0' + min : min;
	return `${hours}:${min}`;
}
