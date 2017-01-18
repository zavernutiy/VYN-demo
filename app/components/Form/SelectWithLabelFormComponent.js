import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import styles from './Form.scss';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const SelectComponent = (props) => {
    const label = props.label ? props.label : "Select";
    const variants = props.variants;
    const menuItems = [<MenuItem key={-1} value="" primaryText="None" />];
    if (variants) {
        variants.forEach((variant, index) => {
            menuItems.push(<MenuItem key={index} value={variant.value} primaryText={variant.text} />);
        });
    }

    let selectedItem = (props.selectedItem || props.selectedItem == 0) ? props.selectedItem : "";

    let onSelectChange = (event, index, value) => {
        props.selectChange(value);
    };

    return (
        <div>
            <label className={styles.left}>{label}</label>
            <SelectField className={styles.right} value={selectedItem} onChange={onSelectChange}>
                {menuItems}
            </SelectField>
        </div>
    );
};

export default SelectComponent;