export default function timeInputToStamp(time: string) {
	const fragments = time.split(':');
	return (new Date(1970, 1, 1, parseInt(fragments[0]), parseInt(fragments[1]))).getTime();
}
