import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import GA4React from 'ga-4-react';

const ga4react = new GA4React(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);

const usePageTracking = () => {
	const location = useLocation()[0];
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		ga4react.initialize().then(() => {
			setInitialized(true);
		}).catch(err => {
			// do nothing
		});
	}, []);

	useEffect(() => {
		if (initialized && import.meta.env.PROD) {
			ga4react.pageview(location);
		}
	}, [initialized, location]);
};

export default usePageTracking;
