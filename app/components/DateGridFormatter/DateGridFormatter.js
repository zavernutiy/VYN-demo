import React from 'react';

const DateFormatter = (props) => {
    if (!props.value) return null;
    let date = new Date(props.value);
    return (<p>{date.toLocaleDateString("en-GB")}</p>);
};

export default DateFormatter;