import React from "react";
import { 
	Container, 
	Dropdown,
	Nav,
	Navbar,
	Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "services/protected-request";
import { clearStorage, notifAlert } from "utils/helper";
import { useAuth } from "hooks/useAuth";

const Navigation = () => {
	const userData = useSelector((state) => state.app.userData);
	const { logout, token } = useAuth();
	const navigate = useNavigate();

	/**
	 * Logout Request
	 */
	const logoutRequest = async () => {
		Swal.fire({
			title: 'Logout',
			text: 'Are You sure want to logout?',
			showCancelButton: true,
			icon: 'info',
		}).then(async (result) => {
			if (result.isConfirmed) {
				await http.post('api/logout')
					.then(() => {
						logout();
						clearStorage();
						navigate('/', { replace: true });
					}).catch(err => {
						const { response } = err;
						const data = response.data;
						if (response.status === 401) {
							notifAlert(data.errors, data.message, 'error').then(() => {
								clearStorage();
								window.location.reload()
							});
						} else {
							notifAlert('Failed', 'Internal Server Error', 'error').then(() => {
								navigate('/', { replace: true });
							});
						}
					})
			} else {
				return false;
			}
		})
	};

	return (
		<Navbar variant="dark" bg="dark" expand="lg">
			<Container>
				<NavLink to="/" className="navbar-brand">Articles News</NavLink>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
					>
						<NavLink to="/" className="nav-link">Home</NavLink>
					</Nav>
					<Row>
						{
							!token ? (
								<NavLink className="btn btn-outline-light" to="/login">Login</NavLink>
							) : (
								<Dropdown>
									<Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
										{userData.name}
									</Dropdown.Toggle>

									<Dropdown.Menu variant="dark">
										<Link to="/profile" className="dropdown-item">Setting</Link>
										<Dropdown.Divider />
										<Dropdown.Item onClick={() => logoutRequest()}>Logout</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							)
						}
					</Row>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
