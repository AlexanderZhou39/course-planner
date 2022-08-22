import { Route, Switch } from 'wouter';

import Navbar from './components/navbar';
import Courses from './pages/courses';
import CoursesForm from './pages/coursesForm';
import Schedules from './pages/schedules';
import SchedulesForm from './pages/schedulesForm';
import CalendarView from './pages/calendar';
import './App.css';

function App() {
	return (
		<div className="App">
			<Navbar />
			<div className="px-5">
				<div className="container mx-auto mt-16">
					<Switch>
						<Route path='/'>
							<Courses />
						</Route>
						<Route path='/courses/add'>
							<CoursesForm />
						</Route>
						<Route path='/courses/:id/edit'>
							{(params) => (
								<CoursesForm id={parseInt(params.id)} />
							)}
						</Route>
						<Route path='/schedules'>
							<Schedules />
						</Route>
						<Route path='/schedules/add'>
							<SchedulesForm />
						</Route>
						<Route path='/schedules/:id/edit'>
							{(params) => (
								<SchedulesForm id={parseInt(params.id)} />
							)}
						</Route>
						<Route path='/calendar'>
							<CalendarView />
						</Route>
						<Route path='/:rest*'>
							<h1 className='text-2xl font-bold text-center'>404 Page Not Found</h1>
						</Route>
					</Switch>
				</div>
			</div>
		</div>
	)
}

export default App;
