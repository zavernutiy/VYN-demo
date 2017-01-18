import React from 'react';
import SelectComponent from './SelectWithLabelFormComponent';
import countries from '../../../lib/countries';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const CountrySelectComponent = (props) => {
    return (
        <SelectComponent
            label="Country"
            variants={countries.map(country => { return { value: country.code, text: country.name }; })}
            selectedItem={props.country}
            selectChange={props.onCountryChange}
        />
    );
};

export default CountrySelectComponent;