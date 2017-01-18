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
            value: "fr",
            text: "French"
        },
        {
            value: "en",
            text: "English"
        }
    ];

    return (
        <SelectComponent
            label="Language"
            variants={variants}
            selectedItem={props.language}
            selectChange={props.onLanguageChange}
        />
    );
};

export default GenderSelect;