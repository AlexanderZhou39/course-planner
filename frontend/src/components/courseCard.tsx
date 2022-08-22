import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Course } from "../types";
import { useRef, useState } from "react";
import SectionBlock from "./sectionBlock";

function CourseCard({ course, onDelete }: { course: Course, onDelete: () => void }) {
	const [confirm, setConfirm] = useState(false);
	const timeout = useRef<number>();

	const sections = course.sections.map((section, i) => (
		<SectionBlock section={section} key={i} />
	));

	return (
		<div className='bg-white rounded-2xl p-5 mb-10 text-sm boxshadow relative'>
			<Link 
				to={`/courses/${course.id.split('-')[1]}/edit`} 
				className='absolute top-5 left-5 text-gray-600 hover:text-gray-400'>
				<FontAwesomeIcon icon={faPencil} /> Edit
			</Link>
			<button 
				onClick={() => {
					if (confirm) {
						clearTimeout(timeout.current);
						onDelete();
					} else {
						setConfirm(true);
						timeout.current = setTimeout(() => {
							setConfirm(false);
						}, 3000);
					}
				}}
				className='absolute top-5 right-5 text-gray-600 hover:text-gray-400'>
				<FontAwesomeIcon icon={faTrash} /> {confirm ? 'Confirm?' : 'Delete'}
			</button>
			<h3 className="text-center text-xl mb-0 font-bold">{course.code.toUpperCase()}</h3>
			<h4 className="text-center text-xl mb-1 font-bold">{course.name}</h4>
			<h5 className="text-center text-sm mb-5">{course.units} Units</h5>
			<div className="flex flex-col">
				{sections}
			</div>
		</div>
	);
}

export default CourseCard;
