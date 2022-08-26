import { useRef } from "react";

type P = {
	onChange: (s: string) => void,
	sort: string
};

function SortInput({ onChange, sort }: P) {
	const fieldRef = useRef<HTMLSelectElement>(null);
	const directionRef = useRef<HTMLSelectElement>(null);
	const defaultField = sort.split('-')[0];
	const defaultDirection = sort.split('-')[1];
	const handleChange = () => {
		onChange(`${
			(fieldRef.current as HTMLSelectElement).value
		}-${
			(directionRef.current as HTMLSelectElement).value
		}`);
	};
	return (
		<div className="flex flex-row flex-wrap mb-3">
			<p className="mr-3 pt-2">
				Sort By
			</p>
			<select 
				className="mb-2 px-5 py-2 w-40 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer mr-3" 
				name="sort-field" 
				ref={fieldRef}
				onChange={handleChange}
				defaultValue={defaultField}
			>
				<option value="seats">Weighted Seats (20 &amp; 20 versus 10 &amp; 30)</option>
				<option value="ast">Avg. Start Time (average of all meeting times)</option>
				<option value="tseats">Total Seats</option>
				<option value="units">Total Units</option>
			</select>
			<select 
				className="mb-2 px-5 py-2 w-40 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer" 
				name="sort-direction" 
				ref={directionRef}
				onChange={handleChange}
				defaultValue={defaultDirection}
			>
				<option value="dsc">Descending</option>
				<option value="asc">Ascending</option>
			</select>
		</div>
	);
}

export default SortInput;
