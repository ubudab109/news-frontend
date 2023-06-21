import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

const DropdownAuth = () => {
	const userData = useSelector(state => state.app.userData);
	return (
		<Dropdown>
			<Dropdown.Toggle
				id="dropdown-button-dark-example1"
				variant="secondary"
			>
				{ userData.name }
			</Dropdown.Toggle>

			<Dropdown.Menu variant="dark">
				<Dropdown.Item href="#/action-2">Setting</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default DropdownAuth;
