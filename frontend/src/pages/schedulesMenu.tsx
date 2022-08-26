import { faGears, faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import s from './schedulesMenu.module.css';

function SchedulesMenu() {
	return (
		<>
			<h1 className="text-2xl font-bold text-center mb-16">
				Choose a method
			</h1>
			<div className="max-w-5xl mx-auto flex flex-row flex-wrap justify-between">
				<Link 
					to="/schedules/generate" 
					className={`w-full sm:w-5/12 px-3 py-10 md:p-10 bg-white rounded-xl shadow-xl ${s.optionCard}`}
				>
					<div className="text-center block text-5xl mb-10">
						<FontAwesomeIcon icon={faGears} />
					</div>
					<p className="text-lg block text-center">Pick from a generated selection</p>
				</Link>
				<div className="flex flex-row justify-center content-center grow">
					<p className="my-5 text-2xl sm:mt-20">or</p>
				</div>
				<Link 
					to='/schedules/add' 
					className={`w-full sm:w-5/12 px-3 py-10 md:p-10 bg-white rounded-xl shadow-xl ${s.optionCard}`}
				>
					<div className="text-5xl block text-center mb-10">
						<FontAwesomeIcon icon={faHand} />
					</div>
					<p className="text-lg block text-center">Pick what you want manually</p>
				</Link>

			</div>
		</>
	);
}

export default SchedulesMenu;
