import React from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PreferenceData = ({ name, data }) => (
	<Row className="mb-4">
		<Col xl="1">
			{name}:
		</Col>
		<Col xl="10">
			{
				data.map((val, key) => (
					<Badge bg="secondary" style={{ marginRight: '3px' }} key={key}>{val}</Badge>
				))
			}
		</Col>
	</Row>
);

PreferenceData.propTypes = {
	name: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
};

export default PreferenceData;
