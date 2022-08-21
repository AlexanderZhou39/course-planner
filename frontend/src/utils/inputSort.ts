function compareIds(a: HTMLElement, b: HTMLElement) {
	if (a.id < b.id) {
		return -1;
	}
	if (a.id > b.id) {
		return 1;
	}
	return 0;
}

export default function getSortedInputs(name: string) {
	const inputs = [...document.getElementsByName(name)] as HTMLInputElement[];
	inputs.sort(compareIds);
	return inputs;
}
