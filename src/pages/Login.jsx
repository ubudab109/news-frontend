import axios from 'axios';
import React, {
	Fragment,
	useState,
	useRef
} from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useAuth } from 'hooks/useAuth';
import { notifAlert } from 'utils/helper';
import { loginProcess } from 'store/reducer';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
	const email = useRef();
	const password = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [validation, setValidation] = useState([]);
	const [isError, setIsError] = useState(false);
	const dispatch = useDispatch();
	const { loginOrRegister, token } = useAuth();
	if (token) {
		return <Navigate to="/" replace />
	}

	/**
	 * Login Request
	 * @param {Event} event 
	 */
	const loginRequest = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		let formData = new FormData();
		formData.append('email', email.current.value);
		formData.append('password', password.current.value);
		await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/login`, formData)
			.then(res => {
				const { data } = res;
				dispatch(loginProcess(data.data.user));
				loginOrRegister(data.data.token);
				setIsLoading(false);
			}).catch(err => {
				const { response } = err;
				const data = response.data;
				if (response.status === 401) {
					notifAlert(data.errors, data.message, 'error');
				} else if (response.status === 400) {
					let result = data.errors;
					setIsError(true);
					setValidation(Object.values(result));
				} else {
					notifAlert('Failed', 'Internal Server Error', 'error');
				}
				setIsLoading(false);
			});
	};

	return (
		<Fragment>
			<Container>
				<Row className="vh-100 d-flex justify-content-center align-items-center">
					<Col md={8} lg={6} xs={12}>
						<div className="border border-3 border-primary"></div>
						<Card className="shadow">
							<Card.Body>
								<div className="mb-3 mt-md-4">
									<h2 className="fw-bold mb-2 text-uppercase ">Login</h2>
									<p className=" mb-5">Please enter your login and password!</p>
									<div className="mb-3">
										<Form onSubmit={e => loginRequest(e)}>
											{
												isError ? (
													<ul>
														{
															validation.map((value, key) => (
																<li key={key} style={{ color: 'red' }}>{value}</li>
															))
														}
													</ul>
												) : null
											}
											<Form.Group className="mb-3" controlId="formBasicEmail">
												<Form.Label className="text-center">
													Email address
												</Form.Label>
												<Form.Control ref={email} type="email" placeholder="Enter email" />
											</Form.Group>

											<Form.Group
												className="mb-3"
												controlId="formBasicPassword"
											>
												<Form.Label>Password</Form.Label>
												<Form.Control ref={password} type="password" placeholder="Password" />
											</Form.Group>
											<div className="d-grid">
												<Button disabled={isLoading} variant="primary" type="submit">
													{isLoading ? 'Loading...' : 'Login'}
												</Button>
											</div>
										</Form>
										<div className="mt-3">
											<p className="mb-0 text-center">
												Don't have an account?{" "}
												<Link to="/register" className="text-primary fw-bold">
													SignUp
												</Link>
											</p>
										</div>
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Login;
