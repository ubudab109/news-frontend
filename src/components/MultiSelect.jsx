import React from 'react';
import PropTypes from 'prop-types';
import Select, { createFilter } from 'react-select';
import MenuList from './MenuList';
import Option from './Option';

const MultiSelect = ({
    inputName,
    selectData,
    defaultData,
    disabled,
    onChangeSelect,
}) => (
    <Select 
        isMulti
        name={inputName}
        options={selectData}
        value={defaultData}
        filterOption={createFilter({ignoreAccents: false})}
        components={{
            MenuList,
            Option: Option
        }}
        isDisabled={disabled}
        closeMenuOnSelect={false}
        hideSelectedOptions={true}
        onChange={onChangeSelect}
    />
);

MultiSelect.propTypes = {
    inputName: PropTypes.string.isRequired,
    selectData: PropTypes.array.isRequired,
    defaultData: PropTypes.any,
    disabled: PropTypes.bool,
    onChangeSelect: PropTypes.func,
};

MultiSelect.defaultProps = {
    defaultData: null,
    disabled: false,
    onChangeSelect: () => null,
};

export default MultiSelect;
