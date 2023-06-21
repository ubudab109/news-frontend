import React from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import MultiSelect from './MultiSelect';

const PreferenceSelect = ({
	name,
	inputName,
	defaultData,
	selectData,
	onChangeSelect,
	disabled,
}) => (
	<Row className="mb-4">
		<Col xl="1">
			{name}:
		</Col>
		<Col xl="10">
			<MultiSelect 
				inputName={inputName}
				defaultData={defaultData}
				selectData={selectData}
				disabled={disabled}
				onChangeSelect={onChangeSelect}
			/>
		</Col>
	</Row>
);

PreferenceSelect.propTypes = {
	name: PropTypes.string.isRequired,
	defaultData: PropTypes.array.isRequired,
	selectData: PropTypes.array.isRequired,
	onChangeSelect: PropTypes.func,
	disabled: PropTypes.bool,
	inputName: PropTypes.string,
};

PreferenceSelect.defaultProps = {
	onChangeSelect: () => null,
	disabled: false,
	inputName: 'data',
};

export default PreferenceSelect;
