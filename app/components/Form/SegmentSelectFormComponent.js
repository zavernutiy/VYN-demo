import React from 'react';
import SelectComponent from './SelectWithLabelFormComponent';

/**
 * Stateless react component
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * @param props
 * @returns {XML}
 * @constructor
 */
const SegmentSelect = (props) => {
    const variants = [
        {
            value: 0,
            text: "0"
        },
        {
            value: 1,
            text: "1"
        },
        {
            value: 2,
            text: "2"
        },
        {
            value: 3,
            text: "3"
        },
        {
            value: 4,
            text: "4"
        },
        {
            value: 5,
            text: "5"
        },
    ];

    return (
        <SelectComponent
            label="Segment"
            variants={variants}
            selectedItem={props.userSegment}
            selectChange={props.onSegmentChange}
        />
    );
};

export default SegmentSelect;