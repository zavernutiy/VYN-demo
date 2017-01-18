import React from 'react';
import SelectComponent from './SelectWithLabelFormComponent';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const GenderSelect = (props) => {
    const variants = [
        {
            value: "male",
            text: "Male"
        },
        {
            value: "female",
            text: "Female"
        }
    ];

    return (
        <SelectComponent
            label="Gender"
            variants={variants}
            selectedItem={props.gender}
            selectChange={props.onGenderChange}
        />
    );
};

export default GenderSelect;