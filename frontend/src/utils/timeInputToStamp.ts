export default function timeInputToStamp(time: string) {
	const fragments = time.split(':');
	return (new Date(1970, 0, 1, parseInt(fragments[0]), parseInt(fragments[1]))).getTime();
}
