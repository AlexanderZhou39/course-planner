import shuffleArray from "./shuffleArray";

export const eventColors = [ 
	'#02c39a', '#fde74c', '#d9c5b2', '#ffa987', '#329F5B',
	'#50d8d7', '#dcd6f7', '#BBDB9B', '#9DBF9E', '#E1F0C4',
	'#C2D3CD', '#ECE2D0', '#758E4F', '#62C370', '#BBBE64',
	'#F7B2AD', '#72A276'
];

export function getRandomColors() {
	return shuffleArray([...eventColors]);
}
