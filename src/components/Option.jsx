import React from "react";
import cx from "classnames";
import PropTypes from 'prop-types';

const Option = ({
  children,
  isSelected,
  innerProps
}) => (
  <div
    className={cx("react-select__option", {
      "react-select__option_selected": isSelected
    })}
    id={innerProps.id}
    tabIndex={innerProps.tabIndex}
    onClick={innerProps.onClick}
  >
    {children}
  </div>
);

Option.propTypes = {
    children: PropTypes.node.isRequired,
    isSelected: PropTypes.bool.isRequired,
    innerProps: PropTypes.object.isRequired,
};

export default Option;