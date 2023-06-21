/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
	Route,
	BrowserRouter as Router,
	Routes
} from "react-router-dom";
import {
	Col,
	Container,
	Row,
} from "react-bootstrap";
import { AuthProvider } from "hooks/useAuth";
import routes from "routes";
import Navigation from "components/Navigation";
import {
	authors,
	categories,
	sources
} from "store/reducer";
import { notifAlert } from "utils/helper";

const App = () => {
	// STATE FOR FETCHING THE FIRST DATA (SOURCES AND PREFERENCES)
	const [isLoading, setIsLoading] = useState(false);

	// DISPATCH FUNCTION
	const dispatch = useDispatch();

	/**
	 * Request get preferences data then store to global state redux using dispatch
	 * @param {String} type - Type of preferences (authors or categories)
	 */
	const requestPreferencesData = async (type) => {
		await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/dataset/preference`, {
			params: {
				type: type,
				sources: [1000, 1001, 1002]
			}
		}).then(res => {
			const data = res.data.data;
			if (type === 'authors') {
				dispatch(authors(data));
			} else if (type === 'categories') {
				dispatch(categories(data));
			}
		}).catch(() => {
			notifAlert('Failed', 'There is something wrong when fetching preferences data. Please try again', 'error');
		})
	};

	/**
	 * Request get sources data then store to global state redux using dispatch
	 */
	const requestSourcesData = async () => {
		await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/dataset/source`)
			.then(async res => {
				const data = res.data.data;
				let sourcesData = [];
				data.forEach(res => {
					sourcesData.push({
						label: res.label,
						value: res.value.toString(),
					})
				});
				dispatch(sources(sourcesData));
				await requestPreferencesData('authors');
				await requestPreferencesData('categories');
			}).catch(err => {
				console.log(err);
				notifAlert('Failed', 'There is something wrong when fetching source data. Please try again', 'error');
			})
	};

	/**
	 * Component did mount
	 */
	useEffect(() => {
		setIsLoading(true);
		requestSourcesData().then(() => {
			setIsLoading(false);
		})
	}, [])

	return (
		<div className="App">
			{
				isLoading ? (
					<div className="loader-container">
						<div className="spinner"></div>
					</div>
				) : (
					<Router>
						<AuthProvider>
							<Navigation />
							<Container>
								<Row>
									<Col xl="12">
										<Routes>
											{routes.map((route) => (
												<Route
													path={route.path}
													element={route.element}
													key={route.path}
												/>
											))}
										</Routes>
									</Col>
								</Row>
							</Container>
						</AuthProvider>
					</Router>
				)
			}
		</div>
	);
};

export default App;
